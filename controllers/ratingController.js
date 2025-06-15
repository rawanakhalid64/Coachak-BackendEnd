const Rating = require("../models/Rating");

exports.createRating = async (req, res) => {
  try {
    // Add user from protected route
    req.body.user = req.user.id;
    
    const rating = await Rating.create(req.body);

    res.status(201).json({
      message: "Rating created successfully",
      rating
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "You have already rated this trainer",
        error: error.message
      });
    }
    res.status(400).json({
      message: "Error creating rating",
      error: error.message
    });
  }
};

exports.getTrainerRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ trainer: req.params.trainerId })
      .populate('user', 'firstName lastName profilePhoto')
      .sort('-createdAt');

    res.status(200).json({
      message: "Ratings retrieved successfully",
      count: ratings.length,
      ratings
    });
  } catch (error) {
    res.status(400).json({
      message: "Error retrieving ratings",
      error: error.message
    });
  }
};