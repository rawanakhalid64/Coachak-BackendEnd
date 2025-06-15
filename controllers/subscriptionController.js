const Plan = require("../models/Plan");
const Subscription = require("../models/Subscription");

exports.addSubscription = async (req, res, next) => {
  try {
    const { plan } = req.body;
    const trainer = (await Plan.findById(plan)).trainer;
    console.log(trainer);
    const subscription = await Subscription.create({
      client: req.user.id,
      plan,
      trainer,
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

exports.getMySubscriptions = async (req, res, next) => {
  try {
    console.log(req.user.id);
    const subscriptions = await Subscription.find({
      trainer: req.user.id,
    })
      .populate({ path: "plan", select: "title" })
      .populate({ path: "client", select: "firstName lastName" })
      .populate({ path: "trainer", select: "firstName lastName" });

    if (!subscriptions) {
      return res.status(404).json({ message: "No subscriptions found" });
    }

    const formattedSubscriptions = subscriptions.map((subscription) => {
      const { plan, client, trainer, ...subscriptionObj } =
        subscription.toObject();
      return {
        ...subscriptionObj,
        clientName: `${subscription.client.firstName} ${subscription.client.lastName}`,
        trainerName: `${subscription.trainer.firstName} ${subscription.trainer.lastName}`,
        planTitle: subscription.plan.title,
      };
    });

    res.status(200).json({ subscriptions: formattedSubscriptions });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching subscriptions" });
  }
};
