const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please Add Post Title"],
    },
    description: {
      type: String,
      required: [true, "Please Add Post Description"],
    },
    postedBy:{
        type: mongoose.Schema.ObjectId,
        ref: 'Users',
        required: true
    }
  },
  { timestamps: true }
);


module.exports = mongoose.model("Posts", PostSchema)