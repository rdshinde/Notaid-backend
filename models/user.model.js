const mongoose = require("mongoose");

const { UserSchema } = require("../schemas/user-schemas");

const User = mongoose.model("User", UserSchema);

module.exports = { User };
