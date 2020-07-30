require('dotenv').config();
const express = require("express");
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("../models").User;

router.get("/signup", (req, res) => {
    res.render("auth/signup.ejs");
  });
  
  //create new user post route
  router.post("/",  (req, res) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) return res.status(500).json(err);
  
      bcrypt.hash(req.body.password, salt, (err, hashedPwd) => {
        if (err) return res.status(500).json(err);
        req.body.password = hashedPwd;

    User.create(req.body)
        .then((newUser) => {
          const token = jwt.sign(
            {
            username: newUser.username,
                  id: newUser.id
              },
              process.env.JWT_SECRET,
            {
                expiresIn: "30 days"
              },
          );
          res.cookie("jwt", token);
          res.redirect(`/users/profile/${newUser.id}`);
        })
        .catch((err) => {
          console.log(err);
          res.send(`err ${err}`);
        });
    });
  });
});
  
  router.get("/login", async (req, res) => {
    let userIdNotFound = false;
    if (req.query === -1) {
      userIdNotFound = true;
    }
    res.render("auth/login.ejs",{
      userIdNotFound});
  });
  
  router.post("/login", (req, res) => {
    User.findOne({ where: { username: req.body.username, },
    }).then((foundUser) => {      
      if (foundUser) {
        bcrypt.compare(req.body.password, foundUser.password, (err, match) => {
          if (match) {
            const token = jwt.sign(
              {
              username: foundUser.username,
                    id: foundUser.id
                },
                process.env.JWT_SECRET,
              {
                  expiresIn: "30 days"
                },
            );
            console.log(`the token: ${token}`);
            res.cookie("jwt", token);
            res.redirect(`/users/profile/${foundUser.id}`);
          } else {
            return res.sendStatus(400);
          }
        });
      }
    });
  });

  

module.exports = router;