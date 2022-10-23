const mongoose = require("mongoose");
const { Schema } = mongoose;

const NoteSchema = new Schema({
  _id: { type: Number, required: true },
  title: String,
  priority: String,
  labels: {
    type: [String],
  },
  description: String,
  backgroundColor: String,

  isInTrash: { type: Boolean, default: false },
  isArchieved: { type: Boolean, default: false },
  isPinned: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now() },
  updatedAt: { type: Date, default: Date.now() },
});

module.exports = { NoteSchema };
