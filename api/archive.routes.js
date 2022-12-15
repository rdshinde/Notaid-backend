const express = require("express");
const archiveV1 = express.Router();
const { User } = require("../models/user.model");
const { v4: uuid } = require("uuid");
const { authVerify } = require("../middlewares/auth.middleware");

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
archiveV1.route("/:id").get(authVerify, async (req, res) => {
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
      const note = user.archive.notes.find((note) => note._id === id);
      const updatedNotes = user.archive.notes.filter((note) => note._id !== id);
      const updatedAllNotes = user.allNotes.notes.filter(
        (note) => note._id !== id
      );
      user.allNotes.notes = updatedAllNotes;
      user.archive.notes = updatedNotes;
      user.trash.notes.push({
        ...note,
        isInTrash: true,
      });
      user.trash.qty = user.trash.notes.length;
      user.archive.qty = user.archive.notes.length;
      const updatedUser = await user.save();
      res.status(201).json({
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

      const updatedAllNotes = user.allNotes.notes.filter(
        (note) => note._id !== id
      );
      note.isArchived = true;
      user.archive.notes.push(note);
      user.allNotes.notes = updatedAllNotes;
      user.allNotes.qty = user.allNotes.notes.length;
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
      const note = user.archive.notes.find((note) => note._id === id);
      const updatedArchiveNotes = user.archive.notes.filter(
        (note) => note._id !== id
      );
      user.allNotes.notes.push(note);
      user.archive.notes = updatedArchiveNotes;
      user.allNotes.qty = user.allNotes.notes.length;
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
