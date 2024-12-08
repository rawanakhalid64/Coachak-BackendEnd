exports.filterObj = (obj, ...filterItems) => {
  let newObj = {};
  Object.keys(obj).forEach((el) => {
    if (!filterItems.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};
exports.restrictTo =
  (req, res, next) =>
  (...roles) => {
    roles.map((role) => {
      if (role !== req.user.role) {
        return res
          .status(404)
          .json({ message: "you dont have the prevellages for this action" });
      }
      next();
    });
  };
