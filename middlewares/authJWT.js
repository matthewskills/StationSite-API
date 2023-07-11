const jwt = require("jsonwebtoken")
    , User = require("../models/user")
    ;

const verifyToken = (req, res, next) => {
    jwt.verify(req.headers.authorization, process.env.API_SECRET, function (err, decode) {
      if (err) {
        next();
      } else {
        User.findOne({_id: decode.id}).exec().then((user) => {
          req.user = user;
          next();
        }).catch((err) => {
          next();
        });
      }
    });
};

module.exports = verifyToken;