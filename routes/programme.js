const express = require('express')
    , programmeRouter = express.Router()
    , verifyToken = require('../middlewares/authJWT')
    , bcrypt = require("bcrypt")
    , Programme = require("../models/programme")
    , Station = require("../models/station")
    , jwt = require("jsonwebtoken")
    ;


programmeRouter.param('programmeId', (req,res,next,programmeId) => {
    Programme.findOne({_id: programmeId}).exec().then((programme) => {
        req.programme = programme;
        next();
      }).catch((err) => {
        next(err);
      });
});

programmeRouter.get('/:programmeId', async (req, res) => {
    if (!req.programme) {
        res.status(404).json({ error: "Programme not found" });
    } else {
        res.status(200).json({ programme: req.programme});
    }
});

programmeRouter.put('/:programmeId', verifyToken, async (req, res) => {
    if (!req.user) {
        res.status(403).json({ error: 'Authentication Failed' });
    } else {
        Station.findOne({ _id: req.body.owner, owner: req.user._id.toString() }).exec().then(async (station) => {
            if (!station) {
                res.status(403).json({ error: 'Authentication Failed' });
            } else {
                await Programme.findByIdAndUpdate(req.programme._id.toString(), req.body, { new: true }).exec().then((programme) => {
                    res.status(201).json({ programme: programme, success: 'Programme modified successfully' });
                }).catch((err) => {
                    res.status(400).json({ error: `Could not save programme with information provided (${err.code})` });
                });
            }
        }).catch((err) => {
            res.status(403).json({ error: 'Authentication Failed' });
        });
    }
});

programmeRouter.post('/register', verifyToken, async (req, res) => {
    if (!req.user) {
        res.status(403).json({ error: 'Authentication Failed' });
    }

    Station.findOne({ _id: req.body.owner, owner: req.user._id.toString() }).exec().then(async (station) => {
        if (!station) {
            res.status(403).json({ error: 'Authentication Failed' });
        } else {
            const programme = new Programme({
                owner: req.body.owner,
                name: req.body.name,
                description: req.body.description,
                artwork1: req.body.artwork1,
                artwork2: req.body.artwork2
            });

            programme.save().then(() => {
                res.status(201).json({ programme: programme, success: 'Programme registered successfully' });
            }).catch((err) => {
                res.status(400).json({ error: `Could not save programme with information provided (${err.code})` });
            });
        }
    }).catch((err) => {
        res.status(403).json({ error: 'Authentication Failed 3' });
    });
});

module.exports = programmeRouter;