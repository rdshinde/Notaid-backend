const mongoose = require("mongoose");
const { saveUserDoc } = require("../middlewares/saveUserDoc.middleware");

const { Schema } = mongoose;
const { NoteSchema } = require("./note-schemas");
const UserSchema = new Schema({
  _id: { type: String, required: true },
  firstName: String,
  lastName: String,
  profilePic: String,
  email: { type: String, required: true },
  password: { type: String, required: true },

  labels: {
    type: [String],
    default: ["Home", "Work", "Daily", "Weekly", "Monthly", "Other"],
  },

  allNotes: {
    notes: [NoteSchema],
    qty: {
      type: Number,
      default: 0,
    },
  },

  trash: {
    notes: [NoteSchema],
    qty: {
      type: Number,
      default: 0,
    },
  },

  archive: {
    notes: [NoteSchema],
    qty: {
      type: Number,
      default: 0,
    },
  },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});

NoteSchema.pre("save", saveUserDoc);

module.exports = { UserSchema };
