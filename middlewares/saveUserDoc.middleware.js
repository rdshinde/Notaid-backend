const saveUserDoc = function (next) {
  this.updatedAt = Date.now();
  // this.allNotes.qty = this.allNotes.notes.length;
  // this.trash.qty = this.trash.notes.length;
  // this.archive.qty = this.archive.notes.length;
  next();
};
module.exports = { saveUserDoc };
