const mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
  fullName: {
    firstName: String,
    lastName: String
  },
  email: String,
  password: String,
  date_created: {
    type: Date, default: Date.now()
  },

  role: {
    type: String, default: "user"
  }
})

exports.UserModel = mongoose.model("users", userSchema);