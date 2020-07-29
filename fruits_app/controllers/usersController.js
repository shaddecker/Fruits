const express = require("express");
const router = express.Router();

const User = require('../models').User;
const Fruit = require('../models').Fruit;

router.get("/", (req, res) => {
  res.render("users/index.ejs");
});

router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

//create new user post route
router.post("/", (req, res) => {
  // console.log(req.body);aw3s$EE5
  User.create(req.body).then((newUser) => {
    res.redirect(`/users/profile/${newUser.id}`);
  });  
});

router.get("/login", (req, res) => {
  let userIdNotFound = false;
  if (req.query === -1) {
    userIdNotFound = true;
  }
  res.render("users/login.ejs",{
    userIdNotFound});
});

router.post("/login", (req, res) => {
  User.findOne({ where: { username: req.body.username,password: req.body.password}}).then ((newUser) => {
    // if (newUser.id === -1) {
    //   res.redirect(`users/login/${newUser.id}`);
    // } else {
      res.redirect(`/users/profile/${newUser.id}`);
    // }
  });
  
});

//user profile path
router.get("/profile/:id", (req, res) => {
  User.findByPk(req.params.id, {
    include: [
      {
        model: Fruit,
        attributes: ["id", "name"],
      },
    ],
  }).then((userProfile) => {
    res.render("users/profile.ejs", {
      user: userProfile,
    });
  });
});

//PUT an update route
router.put("/profile/:id", (req, res) => {
  User.update(req.body, {
    where: { id: req.params.id },
    returning: true, 
  }).then((user) => {
    res.redirect(`/users/profile/${user.id}`);
  });
 
});

router.delete("/:id", (req, res) => {
  User.destroy({where: { id: req.params.id } }).then(() => {
  res.redirect("/users");
  });
});

module.exports = router;
