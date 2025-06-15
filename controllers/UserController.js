const Allergy = require("../models/Allergy");
const Certificate = require("../models/Certificate");
const Client = require("../models/Client");
const HealthCondition = require("../models/HealthCondition");
const Trainer = require("../models/Trainer");
const User = require("../models/User");
const Rating = require("../models/Rating");
const Program = require("../models/Program");
const { filterObj } = require("../utils/helper");

exports.uploadImage = async (req, res, next) => {
  try {
  } catch (error) {}
};
exports.updateProfile = async (req, res, next) => {
  try {
    const userDoc = await User.findById(req.user.id);
    if (!userDoc) {
      return res.status(404).json({ message: "User not found" });
    }

    const updateObj = filterObj(
      req.body,
      "avgRating",
      "role",
      "email",
      "password",
      "allergy",
      "healthCondition",
      "yearsOfExperience"
    );

    // Update fields common to all users
    Object.assign(userDoc, updateObj);
    console.log(userDoc.role);

    // Handle Client-specific updates
    if (userDoc.role.toLowerCase() === "client") {
      let healthConditionIds;
      if (req.body.healthCondition) {
        const healthConditions = Array.isArray(req.body.healthCondition)
          ? req.body.healthCondition
          : [req.body.healthCondition];

        let foundConditions = await HealthCondition.find({
          name: { $in: healthConditions },
        });

        const conditionsToCreate = healthConditions.filter(
          (hc) => !foundConditions.some((c) => c.name === hc)
        );

        const createdConditions = await HealthCondition.create(
          conditionsToCreate.map((hc) => ({ name: hc }))
        );

        foundConditions = foundConditions.concat(createdConditions);
        healthConditionIds = foundConditions.map((c) => c._id);
        userDoc.healthCondition = healthConditionIds;
      }

      let allergyIds;
      if (req.body.allergy) {
        const allergies = await Allergy.find({
          name: { $in: req.body.allergy },
        });

        const allergiesToCreate = req.body.allergy.filter(
          (a) => !allergies.some((al) => al.name === a)
        );

        const createdAllergies = await Allergy.create(
          allergiesToCreate.map((a) => ({ name: a }))
        );

        const allAllergies = allergies.concat(createdAllergies);
        allergyIds = allAllergies.map((a) => a._id);
        userDoc.allergy = allergyIds;
      }
    }

    // Handle Trainer-specific updates
    if (userDoc.role.toLowerCase() === "trainer") {
      if (req.body.availableDays) {
        console.log("object");
        // validate availableDays format if needed
        userDoc.availableDays = req.body.availableDays;
      }

      if (req.body.bio) {
        userDoc.bio = req.body.bio;
      }

      if (req.body.yearsOfExperience) {
        userDoc.yearsOfExperience = req.body.yearsOfExperience;
      }

      if (req.body.pricePerSession) {
        userDoc.pricePerSession = req.body.pricePerSession;
      }

      if (req.body.avgRating) {
        userDoc.avgRating = req.body.avgRating;
      }
    }

    await userDoc.save();
    console.log(userDoc);

    // Re-fetch user with populated refs if client
    let populatedUser = userDoc;
    if (userDoc.role.toLowerCase() === "client") {
      populatedUser = await User.findById(req.user.id).populate([
        { path: "healthCondition", select: "name" },
        { path: "allergy", select: "name" },
      ]);
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: populatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error updating profile",
      error: error.message,
    });
  }
};

exports.getMyProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    console.log(user);
    res.status(200).json({ message: "profile retrieved successful", user });
  } catch (error) {
    res.status(404).json({ message: "error in getting profile" });
  }
};
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json({ message: "profile retrieved successful", user });
  } catch (error) {
    res.status(404).json({ message: "error in getting profile" });
  }
};

exports.getAllTrainers = async (req, res, next) => {
  try {
    const trainers = await Trainer.find()
      .populate('areaOfExpertise', 'name')
      .select('-password');
    
    // Get certificates and ratings for each trainer
    const trainersWithDetails = await Promise.all(trainers.map(async (trainer) => {
      const certificates = await Certificate.find({ credintialId: trainer._id });
      const [ratings, programs] = await Promise.all([
        Rating.find({ trainer: trainer._id })
          .populate('user', 'firstName lastName profilePhoto')
          .sort('-createdAt'),
        Program.find({ 'trainers.trainer': trainer._id })
          .select('title icon description')
      ]);
      
      return {
        ...trainer.toObject(),
        certificates,
        ratings,
        programs,
        ratingStats: {
          count: ratings.length,
          averageRating: trainer.avgRating || 0
        }
      };
    }));

    res.status(200).json({ 
      message: "Trainers retrieved successfully", 
      count: trainers.length,
      trainers: trainersWithDetails
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error retrieving trainers",
      error: error.message 
    });
  }
};

exports.getTrainerById_R = async (req, res, next) => {
  try {
    const trainer = await Trainer.findById(req.params.id)
      .populate('areaOfExpertise', 'name')
      .select('-password');

    if (!trainer) {
      return res.status(404).json({ message: "Trainer not found" });
    }

    // Get certificates and ratings for the trainer
    const certificates = await Certificate.find({ credintialId: trainer._id });
    const [ratings, programs] = await Promise.all([
      Rating.find({ trainer: trainer._id })
        .populate('user', 'firstName lastName profilePhoto')
        .sort('-createdAt'),
      Program.find({ 'trainers.trainer': trainer._id })
        .select('title icon description')
    ]);

    res.status(200).json({
      message: "Trainer retrieved successfully",
      trainer: {
        ...trainer.toObject(),
        certificates,
        ratings,
        programs,
        ratingStats: {
          count: ratings.length,
          averageRating: trainer.avgRating || 0
        }
      }
    });
  } catch (error) {
    res.status(500).json({ 
      message: "Error retrieving trainer",
      error: error.message 
    });
  }
};
exports.getTrainerById=(req,res,next)=>{
  try{
  const trainers = await Trainer.find().select("-password -isVerified -role");
  res
    .status(200)
    .json({ message: "trainers retrieved successful", trainers });
} catch (error) {
  res.status(404).json({ message: "error in getting trainers" });
}
}