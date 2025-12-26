const gameModel = require("../model/game.model");
const userModel = require("../model/user.model");

const createGame = async (req, res) => {
  try {
    console.log("value", req.user);
    const { title, genre, desc } = req.body;
    if (!title || !genre || !desc) {
      return res.status(400).json({
        success: false,
        message: "Fields are missing",
        error: "Bad Request",
      });
    }
    const exsitingGame = await gameModel.findOne({
      title,
    });
    if (exsitingGame) {
      return res.status(400).json({
        success: false,
        message: "Game already Existed",
        error: "Bad Request",
      });
    }
    //to do :avatar upload pending
    const user = await userModel.findById(req.user).select("role");
    console.log("role", user);
    if (user.role != "developer") {
      return res.status(400).json({
        success: false,
        message: "you are not a developer",
        error: "Bad Request",
      });
    }
    const game = await gameModel.create({
      title,
      genre,
      desc,
      createdBy: req.user,
      status: "pending",
    });
    return res.status(200).json({
      sucess: true,
      message: "Game Created",
      data: game,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      error: "Internal Server Error",
    });
  }
};
//List all game
const listAllGame = async (req, res) => {
  try {
    const { limit = 25, page = 1, genre, status, keyword } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    // TODO: imlement date filter
    //filter object
    const where = {
      // genre,
      // status,
      title: { $regex: keyword || "", $options: "i" },
      desc: { $regex: keyword || "", $options: "i" },
    };
    if (genre) {
      where.genre = genre;
    }
    if (status) {
      where.status = status;
    }
    console.log("where", where);
    const games = await gameModel.find(where).limit(parseInt(limit)).skip(skip);
    const totalDataCount = await gameModel.countDocuments(where);
    console.log("total", totalDataCount);
    const totalPages = Math.ceil(totalDataCount / parseInt(limit));
    console.log("totalPages", totalPages);

    res.status(200).json({
      success: true,
      totalPages,
      currentPage: parseInt(page),
      totalDataCount,
      count: games.length,
      data: games,
    });
  } catch (err) {
    console.log("controller@listAllGame", err);
    return res.status(500).json({
      success: false,
      message: err.message,
      error: "Internal Server Error",
    });
  }
};
module.exports = {
  createGame,
  listAllGame,
};
