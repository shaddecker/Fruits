const express = require("express");
const router = express.Router();

const User = require("../models").User;


router.get("/signup", (req, res) => {
    res.render("auth/signup.ejs");
  });
  
  //create new user post route
  router.post("/", async (req, res) => {
    // console.log(req.body);aw3s$EE5
    const newUser = await User.create(req.body);
    res.redirect(`/users/profile/${newUser.id}`);
  });
  
  router.get("/login", async (req, res) => {
    let userIdNotFound = false;
    if (req.query === -1) {
      userIdNotFound = true;
    }
    res.render("auth/login.ejs",{
      userIdNotFound});
  });
  
  router.post("/login", async (req, res) => {
    const newUser = await User.findOne({ 
      where: { username: req.body.username,password: req.body.password}});
    res.redirect(`/users/profile/${newUser.id}`);   
  });

  

module.exports = router;