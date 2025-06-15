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
    const updateObj = filterObj(
      req.body,
      "avgRating",
      "role",
      "allergy",
      "healthCondition",
      "weight",
      "weightGoal",
      "height",
      "job",
      "fitnessLevel",
      "fitnessGoal",
      "workoutsPerWeek",
      "includeIngredients",
      "excludeIngredients",
      "dateOfBirth",
      "gender"
    );
    let user;
    if (req.user.role.toLowerCase() === "trainer") {
      user = await Trainer.findByIdAndUpdate(
        req.user.id,
        {
          ...updateObj,
        },
        { new: true }
      );
      console.log(user);
    } else if (req.user.role.toLowerCase() === "client") {
      let healthConditionIds;

      if (req.body.healthCondition) {
        // Ensure healthCondition is an array
        const healthConditions = Array.isArray(req.body.healthCondition)
          ? req.body.healthCondition
          : [req.body.healthCondition];

        // Find existing health conditions in the database
        let foundConditions = await HealthCondition.find({
          name: { $in: healthConditions },
        });

        // Create health conditions that were not found
        let conditionsToCreate = healthConditions.filter(
          (hc) =>
            !foundConditions.some(
              (existingCondition) => existingCondition.name === hc
            )
        );

        let createdConditions = [];
        if (conditionsToCreate.length > 0) {
          createdConditions = await HealthCondition.create(
            conditionsToCreate.map((hc) => ({ name: hc }))
          );
        }

        // Combine found and newly created conditions
        foundConditions = foundConditions.concat(createdConditions);

        // Collecting the IDs of all health conditions
        healthConditionIds = foundConditions.map((condition) => condition._id);
      }
      let allergyIds;
      if (req.body.allergy) {
        // Find existing allergies in the database
        let allergies = await Allergy.find({
          name: { $in: [...req.body.allergy] },
        });

        // Create any allergies that were not found
        let allergiesToCreate = req.body.allergy.filter(
          (a) =>
            !allergies.some((existingAllergy) => existingAllergy.name === a)
        );

        if (allergiesToCreate.length > 0) {
          let createdAllergies = await Allergy.create(
            allergiesToCreate.map((a) => ({ name: a }))
          );
          allergies = allergies.concat(createdAllergies); // Combine existing and newly created allergies
        }

        // Collecting the IDs of all allergies
        allergyIds = allergies.map((allergy) => allergy._id);
      }

      user = await Client.findByIdAndUpdate(
        req.user.id,
        {
          ...updateObj,
          healthCondition: healthConditionIds,
          allergy: allergyIds,
        },
        { new: true }
      ).populate([
        { path: "healthCondition", select: "name" },
        { path: "allergy", select: "name" },
      ]);
    }

    res.status(200).json({ message: "profile updated successful", user });
  } catch (error) {
    console.log(error);
    res
      .status(404)
      .json({ message: "error in updating profile", error: error.message });
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

exports.getTrainerById = async (req, res, next) => {
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
