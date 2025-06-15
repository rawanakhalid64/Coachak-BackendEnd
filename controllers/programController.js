const Program = require("../models/Program");

// Create a new program
exports.createProgram = async (req, res) => {
  try {
    const program = await Program.create(req.body);
    res.status(201).json({
      message: "Program created successfully",
      program
    });
  } catch (error) {
    res.status(400).json({
      message: "Error creating program",
      error: error.message
    });
  }
};

// Get all programs with trainer count
exports.getAllPrograms = async (req, res) => {
  try {
    const programs = await Program.find()
      .populate({
        path: 'trainers.trainer',
        select: 'firstName lastName profilePhoto'
      });

    // Add trainer count to each program
    const programsWithCount = programs.map(program => ({
      ...program.toObject(),
      trainerCount: program.trainers.length
    }));

    res.status(200).json({
      message: "Programs retrieved successfully",
      count: programs.length,
      programs: programsWithCount
    });
  } catch (error) {
    res.status(400).json({
      message: "Error retrieving programs",
      error: error.message
    });
  }
};

// Get single program with trainers
exports.getProgram = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id)
      .populate({
        path: 'trainers.trainer',
        select: 'firstName lastName profilePhoto avgRating'
      });

    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    res.status(200).json({
      message: "Program retrieved successfully",
      program
    });
  } catch (error) {
    res.status(400).json({
      message: "Error retrieving program",
      error: error.message
    });
  }
};

// Join program (for trainers)
exports.joinProgram = async (req, res) => {
  try {
    const program = await Program.findById(req.params.programId);
    
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    // Check if trainer already joined
    const alreadyJoined = program.trainers.some(
      t => t.trainer.toString() === req.user.id
    );

    if (alreadyJoined) {
      return res.status(400).json({ 
        message: "You have already joined this program" 
      });
    }

    // Add trainer to program
    program.trainers.push({
      trainer: req.user.id,
      isApproved: true
    });

    await program.save();

    res.status(200).json({
      message: "Successfully joined program",
      program
    });
  } catch (error) {
    res.status(400).json({
      message: "Error joining program",
      error: error.message
    });
  }
};

exports.leaveProgram = async (req, res) => {
  try {
    const program = await Program.findById(req.params.programId);
    
    if (!program) {
      return res.status(404).json({ message: "Program not found" });
    }

    program.trainers = program.trainers.filter(
      t => t.trainer.toString() !== req.user.id
    );

    await program.save();

    res.status(200).json({
      message: "Successfully left program",
      program
    });
  } catch (error) {
    res.status(400).json({
      message: "Error leaving program",
      error: error.message
    });
  }
};