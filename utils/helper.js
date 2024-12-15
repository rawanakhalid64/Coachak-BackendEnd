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
  (...roles) =>
  (req, res, next) => {
    roles.map((role) => {
      console.log(role, req.user.role.toLowerCase());
      if (role.toLowerCase() !== req.user.role.toLowerCase()) {
        return res
          .status(404)
          .json({ message: "you dont have the prevellages for this action" });
      }
      next();
    });
  };
