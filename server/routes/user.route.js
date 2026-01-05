const express = require("express");
const {
  updateUser,
  getUser,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getUserStats,
} = require("../controller/user.controller");
const { protectRoute, authorizeRoles } = require("../middleware/auth");

const userRouter = express.Router();
//user update route
userRouter.use(protectRoute);
userRouter.route("/:id").patch(updateUser);
userRouter.route("/").get(getUser);
userRouter.route("/follow").post(followUser);
userRouter.route("/unfollow").post(unfollowUser);
userRouter.route("/followers").get(getFollowers);
userRouter.route("/following").get(getFollowing);
userRouter.route("/stats").get(getUserStats);

module.exports = userRouter;
