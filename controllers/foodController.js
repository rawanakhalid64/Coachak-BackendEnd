const Food = require("../models/Food");

exports.createFood = async (req, res, next) => {
  try {
    const { calories, carbohydrates, fats, name, protien } = req.body;
    const food = await Food.create({
      creator: req.user.id,
      calories,
      carbohydrates,
      fats,
      name,
      protein,
    });
    if (!food) {
      return res
        .status(404)
        .json({
          message: "Food item not found or you are not authorized to edit it.",
        });
    }
    res.status(200).json({ message: "Food added successfull", food });
  } catch (error) {
    res.status(404).json({ message: "cannot add food" });
  }
};

exports.editFood = async (req, res, next) => {
  try {
    const { calories, carbohydrates, fats, name, protien } = req.body;
    const food = await Food.findOneAndUpdate(
      {
        creator: req.user.id,
        _id: req.params.id,
      },
      {
        calories,
        carbohydrates,
        fats,
        name,
        protein,
      }
    );

    res.status(200).json({ message: "Food edited successfull", food });
  } catch (error) {
    res.status(404).json({ message: "cannot edit food" });
  }
};
