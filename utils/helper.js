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
    const userRole = req.user.role.toLowerCase();

    const hasAccess = roles.some((role) => role.toLowerCase() === userRole);

    if (hasAccess) {
      return next();
    }

    return res
      .status(403)
      .json({ message: "You don't have the privileges for this action" });
  };
