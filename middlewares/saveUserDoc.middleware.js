const saveUserDoc = function (next) {
  this.updatedAt = Date.now();
  next();
};
module.exports = { saveUserDoc };
