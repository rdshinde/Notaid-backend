const express = require("express");
const trashV1 = express.Router();
const { User } = require("../models/user.model");
const { v4: uuid } = require("uuid");
const { authVerify } = require("../middlewares/auth.middleware");

trashV1.route("/").get(authVerify, async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);
    if (user) {
      const trash = user.trash;
      res.status(200).json({
        success: true,
        data: {
          trash: trash,
        },
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to get notes from trash",
      errorMessage: err.message,
    });
  }
});
trashV1.route("/:id").get(authVerify, async (req, res) => {
  try {
    const { id } = req?.params;
    const { userId } = req.user;
    const user = await User.findById(userId);
    if (user) {
      const trashedNote = user.trash.notes.find((note) => note._id === id);
      res.status(200).json({
        success: true,
        data: {
          note: trashedNote,
        },
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to get notes from trash",
      errorMessage: err.message,
    });
  }
});
trashV1.route("/:id").delete(authVerify, async (req, res) => {
  try {
    const { id } = req?.params;
    const { userId } = req.user;
    const user = await User.findById(userId);
    if (user) {
      const updatedNotes = user.trash.notes.filter((note) => note._id !== id);
      user.trash.notes = updatedNotes;
      const updatedUser = await user.save();
      res.status(200).json({
        success: true,
        data: {
          trash: updatedUser.trash,
        },
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to move note to archive",
      errorMessage: err.message,
    });
  }
});

trashV1.route("/restore/:id").post(authVerify, async (req, res) => {
  try {
    const { id } = req?.params;
    const { userId } = req.user;
    const user = await User.findById(userId);
    if (user) {
      const note = user.trash.notes.find((note) => note._id === id);
      const updatedNotes = user.trash.notes.filter((note) => note._id !== id);
      user.trash.notes = updatedNotes;
      if (note.isArchived) {
        user.archive.notes.push(note);
      } else {
        user.allNotes.notes.push(note);
      }
      user.trash.qty = user.trash.notes.length;
      const updatedUser = await user.save();
      res.status(200).json({
        success: true,
        data: {
          notes: updatedUser.allNotes,
          archive: updatedUser.archive,
          trash: updatedUser.trash,
        },
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to move note to archive",
      errorMessage: err.message,
    });
  }
});

module.exports = { trashV1 };
