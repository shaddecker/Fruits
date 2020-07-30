require('dotenv').config()
//require the express library
const express = require("express");
//include the method-override package
const methodOverride = require("method-override");
//create an instance of the express module
const app = express();
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const verifyToken = (req, res, next) => {
  let token = req.cookies.jwt; // COOKIE PARSER GIVES YOU A .cookies PROP, WE NAMED OUR TOKEN jwt
  console.log("Cookies: ", req.cookies.jwt);
  jwt.verify(token, process.env.JWT_SECRET, (err, decodedUser) => {
    if (err || !decodedUser) {
      return res.status(401).json({ error: "Unauthorized Request" });
    }
    req.user = decodedUser; // ADDS A .user PROP TO REQ FOR TOKEN USER
    console.log(decodedUser);
    next();
  });
};

app.use(cookieParser());
app.use(express.static("public"));

app.use((req, res, next) => {
  console.log("running app.use to process your request... ");
  next();
});
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("users/index.ejs");
});

app.use("/auth", require("./controllers/authController.js"));
app.use("/fruits", require("./controllers/fruitsController.js"));
app.use("/users", verifyToken,require("./controllers/usersController.js"));

//listen for express requests on port 3000
app.listen(process.env.PORT, () => {
  console.log("Skynet is aware...");
});
