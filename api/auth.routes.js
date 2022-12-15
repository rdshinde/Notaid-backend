const express = require("express");
const sign = require("jwt-encode");
const unsign = require("jwt-decode");

const { v4: uuid } = require("uuid");
const authV1 = express.Router();

const { User } = require("../models/user.model");

authV1.route("/login").post(async (req, res) => {
  try {
    const userData = req.body;
    const foundUser = await User.find({ email: userData.email });
    if (!foundUser) {
      res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    const foundUserAuthToken = foundUser.find(
      (user) => user.email === userData.email
    ).password;

    const { password } = unsign(
      foundUserAuthToken,
      process.env.USER_PWD_SECRET
    );
    if (userData.password === password) {
      const encodedToken = sign({ ...foundUser }, process.env.USER_PWD_SECRET, {
        expiresIn: "24h",
      });
      res.json({ success: true, encodedToken });
    } else {
      res.status(401).json({
        success: false,
        message: "Password does not matched.",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to get user",
      errorMessage: err.message,
    });
  }
});

authV1.route(`/signup`).post(async (req, res) => {
  try {
    const user = req.body;
    const userEmail = user.email;
    const isDuplicateUser = await User.find({ email: userEmail }).count();
    if (isDuplicateUser) {
      res.status(422).json({
        success: false,
        message: "User already exists.",
      });
    } else {
      const NewUser = new User({
        ...user,
        _id: uuid(),
        password: sign(
          { password: user.password },
          process.env.USER_PWD_SECRET
        ),
      });
      const savedUser = await NewUser.save();
      const encodedToken = sign(
        { _id: savedUser._id, email: savedUser.email },
        process.env.USER_PWD_SECRET,
        { expiresIn: "24h" }
      );
      res.status(201).json({ success: true, savedUser, encodedToken });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to add new user.",
      errorMessage: err.message,
    });
  }
});

module.exports = { authV1 };
