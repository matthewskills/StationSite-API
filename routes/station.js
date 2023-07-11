const express = require('express')
    , stationRouter = express.Router()
    , verifyToken = require('../middlewares/authJWT')
    , bcrypt = require("bcrypt")
    , Station = require("../models/station")
    , Programme = require("../models/programme")
    , jwt = require("jsonwebtoken")
    ;



stationRouter.get('/', async (req, res) => {
    Station.find().select('_id name description tagline websiteUrl streamUrl artwork1 artwork2').exec().then((stations) => {
        res.status(201).json({ stations: stations });
    }).catch((err) => {
        res.status(400).json({ error: err });
    });
});

stationRouter.param('stationId', (req, res, next, stationId) => {
    Station.findOne({ _id: stationId }).exec().then((station) => {
        req.station = station;
        next();
    }).catch((err) => {
        next(err);
    });
});

stationRouter.get('/:stationId', async (req, res) => {
    if (!req.station) {
        res.status(404).json({ error: "Station not found" });
    } else {
        res.status(200).json({
            station: {
                _id: req.station._id.toString(),
                name: req.station.name,
                description: req.station.description,
                tagline: req.station.tagline,
                webisteUrl: req.station.websiteUrl,
                streamUrl: req.station.streamUrl,
                artwork1: req.station.artwork1,
                artwork2: req.station.artwork2
            }
        });
    }
});

stationRouter.put('/:stationId', verifyToken, async (req, res) => {
    if (!req.user || req.station.owner !== req.user._id.toString()) {
        res.status(403).json({ error: "Authentication Failed" });
    } else {
        await Station.findByIdAndUpdate(req.station._id.toString(), req.body, { new: true }).exec().then((station) => {
            res.status(201).json({ station: station, success: 'Station modified successfully' });
        }).catch((err) => {
            res.status(400).json({ error: `Could not save station with information provided (${err.code})` });
        });
    }
});

stationRouter.get('/:stationId/programmes', async (req, res) => {
    if (!req.station) {
        res.status(404).json({ error: "Station not found" });
    } else {
        Programme.find({ owner: req.station._id.toString() }).select('_id name description artwork1 artwork2').exec().then((programmes) => {
            res.status(200).json({ programmes: programmes });
        }).catch((err) => {
            res.status(404).json({ error: "Programmes not found" });
        });
    }
});

stationRouter.post('/register', verifyToken, async (req, res) => {
    if (!req.user) {
        res.status(403).json({ error: 'Authentication Failed' });
    }

    const station = new Station({
        owner: req.user._id.toString(),
        name: req.body.name,
        description: req.body.description,
        tagline: req.body.tagline,
        websiteUrl: req.body.website_url,
        streamUrl: req.body.stream_url,
        artwork1: req.body.artwork1,
        artwork2: req.body.artwork2
    });

    await station.save().then(() => {
        res.status(201).json({ station: station, success: 'Station registered successfully' });
    }).catch((err) => {
        res.status(400).json({ error: `Could not save station with information provided (${err.code})` });
    });
});

module.exports = stationRouter;