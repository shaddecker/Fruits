const express = require("express");
const router = express.Router();

//require the data file for fruits
const Fruit = require("../models").Fruit;
const User = require('../models').User;

//index route
router.get("/", (req, res) => {
  Fruit.findAll().then((fruits) => {
    res.render("fruits/index.ejs", {
      fruits: fruits,
    });
  });
});

//new fruit route
router.get("/new", (req, res) => {
  res.render("fruits/new.ejs");
});

// SHOW ROUTE - GET ONE FRUIT
router.get("/:id", (req, res) => {
  Fruit.findByPk(req.params.id, {
      // include : [User]  <= this method returns all columns
      include : [{
        model: User,
        attributes: ['name']
    }],
    attributes: ['name', 'color', 'readyToEat']
  })
  .then(fruitFromDB => {
      res.render('fruits/show.ejs', {
          fruit: fruitFromDB
      });
  })
})

//post route
router.post("/", (req, res) => {
  if (req.body.readyToEat === "on") {
    req.body.readyToEat = true;
  } else {
    req.body.readyToEat = false; 
  }
  Fruit.create(req.body).then((newFruit)=> {
    res.redirect("/fruits");
  });
});

router.get("/:id/edit",  (req, res) => {
  Fruit.findByPk(req.params.id).then((fruit) => {
    res.render("fruits/edit.ejs", {
      fruit: fruit, //send the fruit object
    });
  });
});

//put route
router.put("/:id", (req, res) => {
  if (req.body.readyToEat === "on") {
    req.body.readyToEat = true;
  } else {
    req.body.readyToEat = false;
  }
  Fruit.update(req.body, {
    where: { id: req.params.id },
    returning: true,
  }).then((fruit) => {
    res.redirect("/fruits");
  });
});


router.delete("/:id", (req, res) => {
  Fruit.destroy({where: { id: req.params.id } }).then(() => {
    res.redirect("/fruits");
  }); 
});

module.exports = router;
