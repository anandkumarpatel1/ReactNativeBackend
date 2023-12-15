const mongoose = require("mongoose");

const UserSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please Enter Name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please Enter Email"],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      min: 6,
      max: 64,
      required: [true, "Please Enter Password"],
    },
    role: {
      type: String,
      default: "user",
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Users", UserSchema)