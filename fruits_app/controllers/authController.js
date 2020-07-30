const express = require("express");
const router = express.Router();

const User = require("../models").User;
const bcrypt = require('bcryptjs');

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
    User.findOne({
      where: {
        username: req.body.username,
      },
    }).then((foundUser) => {
      if (foundUser) {
        bcrypt.compare(req.body.password, foundUser.password, (err, match) => {
          if (match) {
            res.redirect(`/users/profile/${foundUser.id}`);
          } else {
            return res.sendStatus(400);
          }
        });
      }
    });
  });

  

module.exports = router;