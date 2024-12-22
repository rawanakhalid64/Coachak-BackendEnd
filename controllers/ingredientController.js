const Ingredient = require("../models/Ingredient");

exports.createIngredient = async (req, res, next) => {
  try {
    const { foodItems } = req.body;
    if (!foodItems || !Array.isArray(foodItems)) {
      return res
        .status(400)
        .send("Invalid input: foodItems is required and should be an array.");
    }
    console.log(req.user.id);
    const ingredient = await Ingredient.create({
      foodItems,
      creator: req.user.id,
    });

    res
      .status(200)
      .json({ message: "Ingredient created successfull", ingredient });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "cannot create ingredient" });
  }
};

exports.editIngredient = async (req, res, next) => {
  try {
    const { foodItems } = req.body;

    console.log(req.params.id, req.user.id, foodItems);
    const ingredient = await Ingredient.findOneAndUpdate(
      {
        creator: req.user.id,
        _id: req.params.id,
      },
      { foodItems },
      { new: true }
    );
    if (!ingredient) {
      return res.status(404).json({
        message: "Ingredient not found or you are not authorized to edit it.",
      });
    }
    res
      .status(200)
      .json({ message: "Ingredient edited successfull", ingredient });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "cannot edit Ingredient" });
  }
};
