const express = require("express");
const router = express.Router();

const User = require('../models').User;
const Fruit = require('../models').Fruit;


//user profile path
router.get("/profile/:id", async (req, res) => {
  console.log(req.params.id);
  const userProfile = await User.findByPk(req.params.id, {
    include: [
      {
        model: Fruit,
        attributes: ["id", "name"],
      },
    ],
  });
    res.render("users/profile.ejs", { user: userProfile,});
});

//PUT an update route
router.put("/profile/:id", async (req, res) => {
  const updatedUser = await User.update(req.body, 
    {where: { id: req.params.id }, returning: true, });
    // console.log()
    res.redirect(`/users/profile/${req.params.id}`); 
});

router.delete("/:id", async (req, res) => {
  await User.destroy({where: { id: req.params.id } });
  res.redirect("/");
});

module.exports = router;
