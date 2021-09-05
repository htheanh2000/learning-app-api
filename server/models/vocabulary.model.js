const mongoose = require("mongoose");
const Vocabulary = mongoose.model(
  "Vocabulary",
  new mongoose.Schema({
    name: String,
    meaning: String,
    type: String,
    is_deleted: {
      type: Boolean,
      default: false
    }
  })
);
module.exports = Vocabulary;