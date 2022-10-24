const express = require("express");
const profileV1 = express.Router();
const { User } = require("../models/user.model");
const { v4: uuid } = require("uuid");
const sign = require("jwt-encode");
const { authVerify } = require("../middlewares/auth.middleware");

profileV1
  .route("/")
  .get(authVerify, async (req, res) => {
    try {
      const { userId } = req.user;
      const user = await User.findById(userId);
      if (user) {
        const userProfile = {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profilePic: user.profilePic,
          password: user.password,
        };
        res.status(200).json({
          success: true,
          data: {
            userProfile,
          },
        });
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Unable to get profile",
        errorMessage: err.message,
      });
    }
  })
  .post(authVerify, async (req, res) => {
    try {
      const { userId } = req.user;
      const { firstName, lastName, email, profilePic, password } = req.body;
      const user = await User.findById(userId);
      if (user) {
        const userPassword = sign({ password }, process.env.USER_PWD_SECRET);
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;
        user.profilePic = profilePic;
        user.password = userPassword;
        const updatedUser = await user.save();
        res.status(201).json({
          success: true,
          data: {
            updatedUser,
          },
        });
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Unable to update profile",
        errorMessage: err.message,
      });
    }
  });

profileV1.route("/:id").delete(authVerify, async (req, res) => {
  try {
    const { id } = req?.params;
    const { userId } = req.user;
    const user = await User.findById(userId);
    if (user) {
      await User.findByIdAndDelete(id);
      res.status(200).json({
        success: true,
        message: "User Deleted Successfully!",
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to delete profile",
      errorMessage: err.message,
    });
  }
});

module.exports = { profileV1 };
