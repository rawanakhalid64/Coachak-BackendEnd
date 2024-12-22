const Ingredient = require("../models/Ingredient");
const Meal = require("../models/Meal");
const createIngredients = async (ingredients, creator) => {
  if (Array.isArray(ingredients)) {
    return await Ingredient.create({
      foodItems: ingredients,
      creator,
    });
  } else return ingredients;
};
exports.createMeal = async (req, res, next) => {
  try {
    const { name, description, ingredients, notes, type, videoUrl } = req.body;
    let newIngredient = await createIngredients(ingredients, req.user.id);

    const meal = await Meal.create({
      creator: req.user.id,
      name,
      description,
      ingredients: newIngredient,
      notes,
      type,
      videoUrl,
    });
    res.status(201).json({ message: "meal added successfull", meal });
  } catch (error) {
    res.status(404).json({ message: "cannot add meal", error: error.message });
  }
};

exports.editMeal = async (req, res, next) => {
  try {
    const {
      name,
      description,
      notes,
      ingredients,
      videoUrl,
      type,
      quantity,
      unit,
    } = req.body;
    let newIngredient;
    if (ingredients) {
      newIngredient = await createIngredients(ingredients, req.user.id);
    }
    const meal = await Meal.findOneAndUpdate(
      {
        creator: req.user.id,
        _id: req.params.id,
      },
      {
        name,
        description,
        notes,
        ingredients: newIngredient,
        videoUrl,
        type,
        quantity,
        unit,
      },
      { new: true }
    );

    if (!meal) {
      return res.status(404).json({
        message: "Meal is not found or you are not authorized to edit it.",
      });
    }
    res.status(200).json({ message: "meal edited successfull", meal });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "cannot edit meal" });
  }
};
