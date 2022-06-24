var mongoose = require("mongoose");
const { Schema } = mongoose;

const pin = new Schema(
  {
    username: {
      type: String,
      require: true,
    },
    tittle: {
      type: String,
      require: true,
      min: 3,
      max:20
    },
    discription: {
      type: String,
      require: true,
      min: 3,
      max:50
    },
    rating: {
      type: Number,
      require: true,
      min: 0,
      max: 5,
    },
    lat: {
      type: Number,
      require: true,
    },
    long: {
      type: Number,
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("pin", pin);
