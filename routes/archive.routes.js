const express = require("express");
const archiveV1 = express.Router();
const { User } = require("../models/user.model");
const { v4: uuid } = require("uuid");
const { authVerify } = require("../middlewares/auth.middleware");
const { notesV1 } = require("./notes.routes");

archiveV1.route("/").get(authVerify, async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.findById(userId);
    if (user) {
      const archives = user.archive;
      res.status(200).json({
        success: true,
        data: {
          archive: archives,
        },
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "unable to get products",
      errorMessage: err.message,
    });
  }
});
notesV1.route("/:id").get(authVerify, async (req, res) => {
  try {
    const { id } = req?.params;
    const { userId } = req.user;
    const user = await User.findById(userId);
    if (user) {
      const archivedNote = user.archive.notes.find((note) => note._id === id);
      res.status(200).json({
        success: true,
        data: {
          note: archivedNote,
        },
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "unable to get products",
      errorMessage: err.message,
    });
  }
});
archiveV1.route("/:id").delete(authVerify, async (req, res) => {
  try {
    const { id } = req?.params;
    const { userId } = req.user;
    const user = await User.findById(userId);
    if (user) {
      const updatedNotes = user.archive.notes.filter((note) => note._id !== id);
      user.archive.notes = updatedNotes;
      user.archive.qty = user.archive.notes.length;
      const updatedUser = await user.save();
      res.status(201).json({
        success: true,
        data: {
          archive: updatedUser.archive,
        },
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "unable to delete products",
      errorMessage: err.message,
    });
  }
});

archiveV1.route("/:id").post(authVerify, async (req, res) => {
  try {
    const { id } = req?.params;
    const { userId } = req.user;
    const user = await User.findById(userId);
    if (user) {
      const note = user.allNotes.notes.find((note) => note._id === id);

      const updatedAllNotes = user.allNotes.notes.map((note) => {
        if (note._id === id) {
          return {
            ...note,
            isArchived: true,
          };
        } else {
          return note;
        }
      });
      console.log(note);
      note.isArchived = true;
      user.archive.notes.push(note);
      console.log("archive", user.archive);
      user.allNotes.notes = updatedAllNotes;
      user.archive.qty = user.archive.notes.length;
      const updatedUser = await user.save();
      res.status(201).json({
        success: true,
        data: {
          archive: { ...updatedUser.archive },
          allNotes: { ...updatedUser.allNotes },
        },
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "unable to add products",
      errorMessage: err.message,
    });
  }
});

archiveV1.route("/restore/:id").post(authVerify, async (req, res) => {
  try {
    const { id } = req?.params;
    const { userId } = req.user;
    const user = await User.findById(userId);
    if (user) {
      const updatedArchiveNotes = user.archive.notes.filter(
        (note) => note._id !== id
      );
      const updatedAllNotes = user.allNotes.notes.map((note) => {
        if (note._id === id) {
          return {
            ...note,
            isArchived: false,
          };
        } else {
          return note;
        }
      });
      user.archive.notes = updatedArchiveNotes;
      user.allNotes.notes = updatedAllNotes;
      user.archive.qty = user.archive.notes.length;
      const updatedUser = await user.save();
      res.status(201).json({
        success: true,
        data: {
          archive: { ...updatedUser.archive },
          allNotes: { ...updatedUser.allNotes },
        },
      });
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Unable to restore note",
      errorMessage: err.message,
    });
  }
});

module.exports = { archiveV1 };
