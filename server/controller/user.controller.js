const followerModel = require("../model/follower.model");
const gameModel = require("../model/game.model");
const userModel = require("../model/user.model");
const getUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        error: "Not Found",
      });
    }
    console.log("controller@getUser", user);

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    console.log("controller@getUser", err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
      error: "Internal Server Error",
    });
  }
};
const updateUser = async (req, res) => {
  try {
    const { name, email, age, password } = req.body;
    // if (!id) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "User id is missing",
    //     error: "Bad Request",
    //   });
    // }

    const user = await userModel.findById(req.user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        error: "Not Found",
      });
    }

    await userModel.findByIdAndUpdate(req.user, { name, email, age, password });
    return res.status(200).json({
      success: true,
      message: "User Updated",
    });
  } catch (err) {
    console.log("controller@UpdateUser", err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
      error: "Internal Server Error",
    });
  }
};

// const forgotUserPassword{

// }
const followUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        error: "Not Found",
      });
    }
    const exsitingFollower = await followerModel.findOne({
      follower: req.user,
      following: userId,
    });

    if (exsitingFollower) {
      return res.status(400).json({
        success: false,
        message: "Already following",
        error: "Bad Request",
      });
    }
    await followerModel.create({
      follower: req.user,
      following: userId,
    });
    const totalFollowers = await followerModel.countDocuments({
      following: userId,
    });
    const totalFollowing = await followerModel.countDocuments({
      follower: req.user,
    });
    await userModel.findByIdAndUpdate(userId, { totalFollowers });
    await userModel.findByIdAndUpdate(req.user, { totalFollowing });

    return res.status(200).json({
      success: true,
      message: "User followed",
    });
  } catch (err) {
    console.log("controller@followUser", err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
      error: "Internal Server Error",
    });
  }
};

const unfollowUser = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        error: "Not Found",
      });
    }
    const exsitingFollower = await followerModel.findOne({
      follower: req.user,
      following: userId,
    });
    if (!exsitingFollower) {
      return res.status(400).json({
        success: false,
        message: "You are not following this user",
        error: "Bad Request",
      });
    }
    await followerModel.findByIdAndDelete(exsitingFollower._id);
    const totalFollowers = await followerModel.countDocuments({
      following: userId,
    });
    const totalFollowing = await followerModel.countDocuments({
      follower: req.user,
    });
    await userModel.findByIdAndUpdate(userId, { totalFollowers });
    await userModel.findByIdAndUpdate(req.user, { totalFollowing });
    return res.status(200).json({
      success: true,
      message: "User unfollowed ",
    });
  } catch (err) {
    console.log("controller@unfollowUser", err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
      error: "Internal Server Error",
    });
  }
};
const getFollowers = async (req, res) => {
  try {
    const followers = await followerModel
      .find({ following: req.user })
      .populate("follower", "name email role totalFollowers totalFollowing")
      .select("-following");
    return res.status(200).json({
      success: true,
      data: followers,
    });
  } catch (err) {
    console.log("controller@getFollowers", err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
      error: "Internal Server Error",
    });
  }
};
const getFollowing = async (req, res) => {
  try {
    const following = await followerModel
      .find({ follower: req.user })
      .populate("following", "name email role totalFollowers totalFollowing")
      .select("-follower");
    return res.status(200).json({
      success: true,
      data: following,
    });
  } catch (err) {
    console.log("controller@getFollowing", err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
      error: "Internal Server Error",
    });
  }
};
const getUserStats = async (req, res) => {
  try {
    const userId = req.query.id || req.user; //in case user wants to see other user stats and their own stats
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        error: "Not Found",
      });
    }

    const totalFollowers = user.totalFollowers;
    const totalFollowing = user.totalFollowing;
    // const totalUploadedGames = await gameModel.countDocuments({
    //   createdBy: userId,
    //   status: "approved",

    // });
    //ran both countDocuments in parallel using Promise.all to optimize
    const [totalUploadedGames, totalPlayedByCount] = await Promise.all([
      gameModel.countDocuments({
        createdBy: userId,
        status: "approved",
      }),
      gameModel.countDocuments({
        playedBy: userId,
        
      }),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        totalFollowers,
        totalFollowing,
        totalUploadedGames,
        totalPlayedByCount,
      },
    });
  } catch (err) {
    console.log("controller@getUserStats", err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
      error: "Internal Server Error",
    });
  }
};

module.exports = {
  updateUser,
  getUser,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  getUserStats,
};
