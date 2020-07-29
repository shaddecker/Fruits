//require the express library
const express = require("express");
//include the method-override package
const methodOverride = require("method-override");
//create an instance of the express module
const app = express();

app.use(express.static("public"));

app.use((req, res, next) => {
  console.log("running app.use to process your request... ");
  next();
});
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use("/fruits", require("./controllers/fruitsController.js"));
app.use("/users", require("./controllers/usersController.js"));

//listen for express requests on port 3000
app.listen(3005, () => {
  console.log("Skynet is aware...");
});
