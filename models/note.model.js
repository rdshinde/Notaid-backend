const mongoose = require("mongoose");

const { NoteSchema } = require("../schemas/note-schemas");

const Note = mongoose.model("Note", NoteSchema);

module.exports = { Note };
