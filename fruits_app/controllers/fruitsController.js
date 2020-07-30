const express = require("express");
const router = express.Router();

//require the data file for fruits
const Fruit = require("../models").Fruit;
const User = require('../models').User;
const Season = require('../models').Season;

// //index route
router.get("/", (req, res) => {
  Fruit.findAll().then((fruits) => {
    res.render("fruits/index.ejs", {
      fruits: fruits,
    });
  });
});

//index route using async
// router.get("/", async (req, res) => {
//    await Fruit.findAll((fruits) => {
//     res.render("fruits/index.ejs", {
//       fruits: fruits,
//     });
//   });
// });

//new fruit route
router.get("/new", (req, res) => {
  res.render("fruits/new.ejs");
});

// SHOW ROUTE - GET ONE FRUIT
router.get("/:id", (req, res) => {
  Fruit.findByPk(req.params.id, {
      // include : [User]  <= this method returns all columns
      include : [
      {
        model: User,
        attributes: ['name'],
      },
      {
        model: Season,
      },
      ],
    attributes: ['name', 'color', 'readyToEat']
  })
  .then(fruitFromDB => {
      res.render('fruits/show.ejs', {
          fruit: fruitFromDB
      });
  })
})

//post route
router.post("/", async (req, res) => {
  if (req.body.readyToEat === "on") {
    req.body.readyToEat = true;
  } else {
    req.body.readyToEat = false; 
  }
  const newFruit = await Fruit.create(req.body);
  res.redirect("/fruits");
});

router.get("/:id/edit", async (req, res) => {
  const foundFruit = await Fruit.findByPk(req.params.id);
  const allSeasons = await Season.findAll();
  res.render("fruits/edit.ejs", {
    fruit: foundFruit, 
    seasons: allSeasons,
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
  }).then((updatedFruit) => {
    Season.findByPk(req.body.season).then((foundSeason) => {
      Fruit.findByPk(req.params.id).then((foundFruit) => {
        foundFruit.addSeason(foundSeason);
        res.redirect("/fruits");
      });
    });  
  });
});


router.delete("/:id", async (req, res) => {
  await Fruit.destroy({where: { id: req.params.id } });
    res.redirect("/fruits");
});

module.exports = router;
