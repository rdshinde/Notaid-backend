const express = require("express");
const notesV1 = express.Router();
const { User } = require("../models/user.model");
const { v4: uuid } = require("uuid");
const { authVerify } = require("../middlewares/auth.middleware");

notesV1
  .route("/")
  .get(authVerify, async (req, res) => {
    try {
      const { userId } = req.user;
      const user = await User.findById(userId);
      if (user) {
        const userNotes = user.allNotes;
        res.status(200).json({ success: true, data: { ...userNotes } });
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "unable to get products",
        errorMessage: err.message,
      });
    }
  })
  .post(authVerify, async (req, res) => {
    try {
      const { userId } = req.user;
      const note = req.body;
      const user = await User.findById(userId);
      if (user) {
        user.allNotes.notes.push({
          ...note,
          _id: uuid(),
        });
        user.allNotes.qty = user.allNotes.notes.length;
        const updatedUser = await user.save();
        res
          .status(201)
          .json({ success: true, data: { ...updatedUser.allNotes } });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "unable to add products",
        errorMessage: err.message,
      });
    }
  });

notesV1
  .route("/:id")
  .get(authVerify, async (req, res) => {
    try {
      const { id } = req?.params;
      const { userId } = req.user;
      const user = await User.findById(userId);
      if (user) {
        const userNote = user.allNotes.notes.find((note) => note._id === id);

        if (userNote) {
          return res
            .status(200)
            .json({ data: { note: userNote }, success: true });
        } else {
          res.status(404).json({ success: false, message: "Note not found!" });
        }
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Something went wrong.",
      });
    }
  })
  .post(authVerify, async (req, res) => {
    try {
      const { id } = req?.params;
      const { userId } = req.user;
      const note = req.body;
      const user = await User.findById(userId);
      let noteToUpdate = user.allNotes.notes.find((note) => note._id === id);
      if (user) {
        if (noteToUpdate) {
          noteToUpdate = { ...note, ...noteToUpdate };
          const updatedNotes = user.allNotes.notes.map((note) => {
            if (note._id === id) {
              return noteToUpdate;
            } else {
              return note;
            }
          });
          user.allNotes.notes = updatedNotes;
          const updatedUser = await user.save();
          res
            .status(201)
            .json({ success: true, data: { ...updatedUser.allNotes } });
        } else {
          res.status(404).json({ success: false, message: "Note not found!" });
        }
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        success: false,
        message: "Something went wrong.",
      });
    }
  })
  .delete(authVerify, async (req, res) => {
    try {
      const { id } = req?.params;
      const { userId } = req.user;
      const user = await User.findById(userId);
      if (user) {
        const userNote = user.allNotes.notes.find((note) => note._id === id);
        if (userNote) {
          const updatedNotes = user.allNotes.notes.filter(
            (note) => note._id !== id
          );
          const updatedArchiveNotes = user.archive.notes.filter(
            (note) => note._id !== id
          );
          user.archive.notes = updatedArchiveNotes;
          user.trash.notes.push({
            ...userNote,
            isInTrash: true,
          });
          user.trash.qty = user.trash.notes.length;
          user.allNotes.notes = updatedNotes;
          user.allNotes.qty = updatedNotes.length;
          user.trash.qty = user.trash.notes.length;
          user.archive.qty = user.archive.notes.length;
          const updatedUser = await user.save();
          res.status(200).json({
            success: true,
            data: {
              notes: updatedUser.allNotes,
              trash: updatedUser.trash,
            },
          });
        } else {
          res.status(404).json({ success: false, message: "Note not found!" });
        }
      }
    } catch (err) {
      res.status(500).json({
        success: false,
        message: "Something went wrong.",
      });
    }
  });

module.exports = { notesV1 };
