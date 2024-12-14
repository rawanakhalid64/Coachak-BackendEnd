const Ingredient = require("../models/Ingredient");

exports.createIngredient = async (req, res, next) => {
  try {
    const { food, quantity, unit } = req.body;
    const ingredient = await Ingredient.create({
      creator: req.user.id,
      food,
      quantity,
      unit,
    });
    res
      .status(200)
      .json({ message: "Ingredient added successfull", ingredient });
  } catch (error) {
    res.status(404).json({ message: "cannot add ingredient" });
  }
};

exports.editIngredient = async (req, res, next) => {
  try {
    const { food, quantity, unit } = req.body;
    const ingredient = await Ingredient.findOneAndUpdate(
      {
        creator: req.user.id,
        _id: req.params.id,
      },
      { quantity, unit, $push: food }
    );
    if (!ingredient) {
      return res
        .status(404)
        .json({
          message: "Ingredient not found or you are not authorized to edit it.",
        });
    }
    res
      .status(200)
      .json({ message: "Ingredient edited successfull", ingredient });
  } catch (error) {
    res.status(404).json({ message: "cannot edit Ingredient" });
  }
};
