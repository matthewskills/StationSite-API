const express = require('express')
  , userRouter = express.Router()
  , verifyToken = require('../middlewares/authJWT')
  , bcrypt = require("bcrypt")
  , User = require("../models/user")
  , Station = require("../models/station")
  , jwt = require("jsonwebtoken")
  ;

userRouter.post('/register', async (req,res) => {

  if(!req.body.password || !req.body.fullName || !req.body.role || !req.body.email) {
    res.status(400).json({error: 'Please complete all registration fields'});
  }

  const user = new User({
    fullName: req.body.fullName,
    email: req.body.email,
    role: req.body.role,
    password: bcrypt.hashSync(req.body.password, 8)
  });

  await user.save().then(() => {
    res.status(201).json({success: 'User registered successfully'});
  }).catch((err) => {
    console.log(err)
    res.status(400).json({error: (err.name === 'MongoServerError' && err.code === 11000 ? 'Email already in use.' : 'Could not save user with information provided.')});
  });
});

userRouter.post("/login", async (req, res) => {
  await User.findOne({email: req.body.email}).exec().then((user) => {
    if (!user) {
      res.status(404).send({error: "User Not found."});
    } else {
      const passwordIsValid = bcrypt.compareSync( req.body.password,user.password);
      if (!passwordIsValid) {
        res.status(401).send({error: "Invalid Password!"});
      } else {
        const token = jwt.sign({id: user.id}, process.env.API_SECRET, {expiresIn: 86400});
        res.status(200).send({user: {id: user._id, email: user.email,fullName: user.fullName,}, message: "Login successfull", accessToken: token,});
      }
    }
  }).catch((err) => {
    res.status(400).json({error: err});
  });
});

userRouter.param('userId', (req,res,next,userId) => {
  Station.find({owner: userId}).select('_id name description tagline websiteUrl streamUrl').exec().then((stations) => {
      req.stations = stations;
      next();
    }).catch((err) => {
      next(err);
    });
});

userRouter.get("/:userId/stations", function (req, res) {
  if (!req.stations) {
    res.status(404).json({ error: "No Stations Found"});
  } else  {
    res.status(200).json({ stations: req.stations});
  } 
});

userRouter.get("/hiddencontent", verifyToken, function (req, res) {
  if (!req.user) {
    res.status(403).json({ error: "Authentication Failed"});
  } else if (req.user.role == "admin") {
    res.status(200).json({ message: "Congratulations! but there is no hidden content"});
  } else {
    res.status(403).send({ message: "Unauthorised access"});
  }
});

module.exports = userRouter;