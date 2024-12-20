const Subscription = require("../models/Subscription");

exports.addSubscription = async (req, res, next) => {
  try {
    const { plan } = req.body;
    const subscription = await Subscription.create({
      client: req.user.id,
      plan,
    });
    if (!subscription) {
      res.status(404).json({ message: "cannot complete the subsciption" });
    }
    res.status(200).json({ message: "subscribed successful", subscription });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "error in subscribing" });
  }
};
exports.updateSubsciption = async (req, res, next) => {
  try {
    const { nutritionPlan, trainingPlan } = req.body;
    const subscription = await Subscription.findById(req.params.id);
    if (nutritionPlan) {
      subscription.nutritionPlan.push(nutritionPlan);
    }
    if (trainingPlan) {
      subscription.trainingPlan.push(trainingPlan);
    }
    await subscription.save();
    res
      .status(200)
      .json({ message: "subscription updated successful", subscription });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "error in updating subscription" });
  }
};
