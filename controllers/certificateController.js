const Certificate = require("../models/Certificate");

exports.getCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findById(req.params.id);
    res
      .status(200)
      .json({ messsage: "certificate retireved successful", certificate });
  } catch (error) {
    res.status(404).json({ messsage: "error in getting certificate" });
  }
};
exports.getTrainersCertificates = async (req, res, next) => {
  try {
    console.log(req.body);
    const certificate = await Certificate.find({
      credintialId: req.body.credintialId,
    });
    res
      .status(200)
      .json({ messsage: "certificate retireved successful", certificate });
  } catch (error) {
    console.log(error);
    res.status(404).json({ messsage: "error in getting certificate" });
  }
};
exports.getMyCertificates = async (req, res, next) => {
  try {
    const certificate = await Certificate.find({ credintialId: req.user.id });
    res
      .status(200)
      .json({ messsage: "my certificates retireved successful", certificate });
  } catch (error) {
    res.status(404).json({ messsage: "error in adding certificate" });
  }
};
exports.addCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.create({
      ...req.body,
      credintialId: req.user.id,
    });
    res
      .status(200)
      .json({ messsage: "certificate added successful", certificate });
  } catch (error) {
    res.status(404).json({ messsage: "error in adding certificate" });
  }
};
exports.editCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findByIdAndUpdate(req.params.id, {
      ...req.body,
    });
    res
      .status(200)
      .json({ messsage: "certificate edited successful", certificate });
  } catch (error) {
    console.log(error);
    res.status(404).json({ messsage: "error in editing certificate" });
  }
};
