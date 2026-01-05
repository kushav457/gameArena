const mongoose = require("mongoose");
const followerSchema = new mongoose.Schema(
  {
    follower: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    },

    following: {
      type: mongoose.Types.ObjectId,
      ref: "users",
      required: true,
    },
  },
  { timestamps: true }
);
const followerModel =
  mongoose.models.followers || mongoose.model("followers", followerSchema);
module.exports = followerModel;
