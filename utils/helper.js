exports.filterObj = (obj, ...filterItems) => {
  let newObj = {};
  Object.keys(obj).forEach((el) => {
    if (!filterItems.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};
