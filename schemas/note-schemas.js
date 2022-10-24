const mongoose = require("mongoose");
const { Schema } = mongoose;

const NoteSchema = new Schema({
  _id: { type: String, required: true },
  title: { type: String, required: true },
  priority: {
    type: String,
    default: "Low",
    enum: ["Low", "Medium", "High"],
    required: true,
  },
  labels: {
    type: [String],
  },
  description: { type: String, required: true },
  backgroundColor: { type: String, default: "#fff" },

  isInTrash: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
  isPinned: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});

module.exports = { NoteSchema };
