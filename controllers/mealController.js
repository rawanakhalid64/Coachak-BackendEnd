const Meal = require("../models/Meal");

exports.createMeal = async (req, res, next) => {
  try {
    const { name, description, ingredients, notes, type, videoUrl } = req.body;
    const meal = await Meal.create({
      name,
      description,
      ingredients,
      notes,
      type,
      videoUrl,
    });
    res.status(200).json({ message: "meal added successfull", meal });
  } catch (error) {
    res.status(404).json({ message: "cannot add meal" });
  }
};

exports.editMeal = async (req, res, next) => {
  try {
    const { ingredients, creator: _, ...rest } = req.body;
    const meal = await Meal.findOneAndUpdate(
      {
        creator: req.user.id,
        _id: req.params.id,
      },
      { rest, $push: ingredients },
      { new: true }
    );

    if (!meal) {
      return res.status(404).json({
        message: "Meal is not found or you are not authorized to edit it.",
      });
    }
    res.status(200).json({ message: "meal edited successfull", meal });
  } catch (error) {
    res.status(404).json({ message: "cannot edit meal" });
  }
};
