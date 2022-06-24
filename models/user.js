var mongoose = require("mongoose");
const { Schema } = mongoose;
var validator = require("validator");

const users = new Schema(
  {
    username: {
      type: String,
      require: true,
      min: 3,
      max: 20,
      unique: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: "Email address is required",
      validate: (value) => {
        return validator.isEmail(value);
      },
    },
    password: {
      type: String,
      min:8,
      max:14
    },
  },
 
  {
    versionKey: false,
  }
);

module.exports = mongoose.model("user", users);
