const mongoose = require("mongoose");
const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
      }
    ],
    category: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vocabulary",
        default: []
      }
    ],
    is_deleted: {
      type: String,
      default: false
    }
  })
);
module.exports = User;