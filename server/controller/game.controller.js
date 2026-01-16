const gameModel = require("../model/game.model");
const userFavouriteModel = require("../model/user.favourite");
const userModel = require("../model/user.model");
const { sendEmail } = require("../utils/utility");
//Create a new game

const createGame = async (req, res) => {
  try {
    console.log("value", req.user);
    const { title, genre, desc, isFree = false } = req.body;
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
    // const user = await userModel.findById(req.user).select("role");
    // console.log("role", user);
    // if (user.role != "developer") {
    //   return res.status(400).json({
    //     success: false,
    //     message: "you are not a developer",
    //     error: "Bad Request",
    //   });
    // }
    const game = await gameModel.create({
      title,
      genre,
      desc,
      createdBy: req.user,
      status: "pending",
      isFree: isFree,
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
    // const { limit = 25, page = 1, genre, status, keyword } = req.query;
    // const skip = (parseInt(page) - 1) * parseInt(limit);
    const { genre, keyword } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const status = "approved";
    // TODO: imlement date filter
    //filter object
    const where = {
      $or: [
        { title: { $regex: keyword || "", $options: "i" } },
        { desc: { $regex: keyword || "", $options: "i" } },
      ],
    };
    if (genre) {
      where.genre = genre;
    }
    // if (status) {
    //   where.status = status;
    // }
    where.status = status;
    console.log("where", where);
    const games = await gameModel
      .find(where)
      .limit(limit)
      .skip(skip)
      .populate("createdBy", "name email");
    const totalDataCount = await gameModel.countDocuments(where);
    console.log("total", totalDataCount);
    const totalPages = Math.ceil(totalDataCount / parseInt(limit));
    console.log("totalPages", totalPages);

    return res.status(200).json({
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
const approveGame = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Game id is missing",
        error: "Bad Request",
      });
    }
    // const user = await userModel.findById(req.user).select("role");
    // if (user.role != "admin") {
    //   return res.status(403).json({
    //     success: false,
    //     message: "You are not authorized to approve the game",
    //     error: "Forbidden",
    //   });
    // }

    const game = await gameModel
      .findByIdAndUpdate(id, { status: "approved" })
      .populate("createdBy", "name email");
    console.log("game", game);

    // Don't fail approval if email sending fails (common in local dev without SMTP config)
    try {
      if (game?.createdBy?.email) {
        await sendEmail({
          to: game.createdBy.email,
          subject: "Game Approved Successfully",
          text: `Congratulations ${game.createdBy.name}, Your game "${game.title}" has been approved.`,
        });
      }
    } catch (emailErr) {
      console.log("controller@approveGame email failed:", emailErr.message);
      // continue; approval already applied in DB
    }

    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
        error: "Not Found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Game approved successfully",
      data: game,
    });
  } catch (err) {
    console.log("controller@approveGame", err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
      error: "Internal Server Error",
    });
  } //to do
};
const listOfPendingGamesAdmin = async (req, res) => {
  try {
    const { genre, keyword } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const status = "pending";
    // TODO: imlement date filter
    //filter object
    const where = {
      title: { $regex: keyword || "", $options: "i" },
      desc: { $regex: keyword || "", $options: "i" },
    };
    if (genre) {
      where.genre = genre;
    }
    where.status = status;
    console.log("where", where);
    const games = await gameModel
      .find(where)
      .limit(limit)
      .skip(skip)
      .populate("createdBy", "name email");
    const totalDataCount = await gameModel.countDocuments(where);
    console.log("total", totalDataCount);
    const totalPages = Math.ceil(totalDataCount / limit);
    console.log("totalPages", totalPages);

    return res.status(200).json({
      success: true,
      totalPages,
      currentPage: page,
      totalDataCount,
      count: games.length,
      data: games,
    });
  } catch (err) {
    console.log("controller@listOfPendingGamesAdmin", err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
      error: "Internal Server Error",
    });
  }
};
const listOfGameForDevelopers = async (req, res) => {
  try {
    const { genre, keyword, status } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // TODO: imlement date filter
    //filter object
    const where = {
      title: { $regex: keyword || "", $options: "i" },
      desc: { $regex: keyword || "", $options: "i" },
    };
    if (genre) {
      where.genre = genre;
    }
    if (status) {
      where.status = status;
    }
    where.createdBy = req.user;
    console.log("where", where);
    const games = await gameModel
      .find(where)
      .limit(limit)
      .skip(skip)
      .populate("createdBy", "name email");
    const totalDataCount = await gameModel.countDocuments(where);
    console.log("total", totalDataCount);
    const totalPages = Math.ceil(totalDataCount / limit);
    console.log("totalPages", totalPages);

    return res.status(200).json({
      success: true,
      totalPages,
      currentPage: page,
      totalDataCount,
      count: games.length,
      data: games,
    });
  } catch (err) {
    console.log("controller@listOfPendingGamesAdmin", err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
      error: "Internal Server Error",
    });
  }
};

const deleteGame = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Game id is missing",
        error: "Bad Request",
      });
    }

    const game = await gameModel.findById(id);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
        error: "Not Found",
      });
    }
    if (game.createdBy.toString() !== req.user) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this game",
        error: "Forbidden",
      });
    }
    await gameModel.findByIdAndDelete(id);
    return res.status(200).json({
      success: true,
      message: "Game Deleted",
    });
  } catch (err) {
    console.log("controller@DeleteGame", err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
      error: "Internal Server Error",
    });
  } //to do
};
const updateGame = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, genre, desc } = req.body;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Game id is missing",
        error: "Bad Request",
      });
    }

    const game = await gameModel.findById(id);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
        error: "Not Found",
      });
    }
    if (game.createdBy.toString() !== req.user) {
      return res.status(403).json({
        success: false,
        message: "You are not authorized to delete this game",
        error: "Forbidden",
      });
    }
    await gameModel.findByIdAndUpdate(id, { title, genre, desc });
    return res.status(200).json({
      success: true,
      message: "Game Updated",
    });
  } catch (err) {
    console.log("controller@UpdateGame", err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
      error: "Internal Server Error",
    });
  } //to do
};
const playGame = async (req, res) => {
  try {
    const { gameId } = req.body;

    if (!gameId) {
      return res.status(400).json({
        success: false,
        message: "Game ID  is required",
      });
    }
    const game = await gameModel.findById(gameId).lean();
    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
      });
    }
    if (game.isFree === false && user.suscription === "free") {
      return res.status(403).json({
        success: false,
        message: "You need premium subscription to play this game",
        error: "Forbidden",
      });
    }
    const userId = req.user;
    const temp = game.playedBy.map((id) => id.toString()); // normalize existing to string
    temp.push(userId);
    const uniquePlayedBy = [...new Set(temp)];

    await gameModel.findByIdAndUpdate(gameId, {
      playedBy: uniquePlayedBy,
      totalPlayedBy: uniquePlayedBy.length,
    });

    return res.status(200).json({
      success: true,
      message: "Play count updated",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      error: "Internal Server Error",
    });
  }
};
const trendingGames = async (req, res) => {
  try {
    //to do
    const games = await gameModel
      .find({ status: "approved" })
      .populate("createdBy", "name email")
      .sort({ totalPlayedBy: -1 })
      .limit(10);
    return res.status(200).json({
      success: true,
      data: games,
    });
  } catch (err) {
    console.log("controller@trendingGames", err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
      error: "Internal Server Error",
    });
  }
};
const popularGames = async (req, res) => {
  try {
    const games = await gameModel
      .find({ status: "approved" })
      .populate("createdBy", "name email")
      .sort({ averageRating: -1 })
      .limit(10);
    return res.status(200).json({
      success: true,
      data: games,
    });
  } catch (err) {
    console.log("controller@popularGames", err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
      error: "Internal Server Error",
    });
  }
};
const latestGames = async (req, res) => {
  try {
    const games = await gameModel
      .find({ status: "approved" })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .limit(2);
    return res.status(200).json({
      success: true,
      data: games,
    });
  } catch (err) {
    console.log("controller@latestGames", err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
      error: "Internal Server Error",
    });
  }
};
const addToFavourite = async (req, res) => {
  try {
    const { gameId } = req.body;
    if (!gameId) {
      return res.status(400).json({
        success: false,
        message: "Game ID is required",
      });
    }
    const game = await gameModel.findById(gameId);
    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
      });
    }
    const existingfavourite = await userFavouriteModel.findOne({
      user: req.user,
      game: gameId,
    });
    if (existingfavourite) {
      return res.status(400).json({
        success: false,
        message: "Game already in favourites",
      });
    }
    const favourite = await userFavouriteModel.create({
      user: req.user,
      game: gameId,
    });

    return res.status(200).json({
      success: true,
      message: "Game added to favourites",
      data: favourite,
    });
  } catch (err) {
    console.log("controller@addToFavourite", err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
      error: "Internal Server Error",
    });
  }
};
const removeFromFavourite = async (req, res) => {
  try {
    const { gameId } = req.params;
    if (!gameId) {
      return res.status(400).json({
        success: false,
        message: "Game ID is required",
        error: "Bad Request",
      });
    }
    const favourite = await userFavouriteModel.findOneAndDelete({
      user: req.user,
      game: gameId,
    });
    if (!favourite) {
      return res.status(404).json({
        success: false,
        message: "Favourite not found",
        error: "Not Found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Game removed from favourites",
    });
  } catch (err) {
    console.log("controller@removeFromFavourite", err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
      error: "Internal Server Error",
    });
  }
};
const listFavouriteGames = async (req, res) => {
  try {
    const favourites = await userFavouriteModel
      .find({ user: req.user })
      .populate("game")
      .sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      data: favourites,
    });
  } catch (err) {
    console.log("controller@listFavouriteGames", err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
      error: "Internal Server Error",
    });
  }
};
const getGameStats = async (req, res) => {
  try {
    //to do
    const [totalGames, totalApprovedGames, totalPendingGames] =
      await Promise.all([
        gameModel.countDocuments(),
        gameModel.countDocuments({ status: "approved" }),
        gameModel.countDocuments({ status: "pending" }),
      ]);
    return res.status(200).json({
      success: true,
      data: {
        total: totalGames,
        approved: totalApprovedGames,
        pending: totalPendingGames,
      },
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
      error: "Internal Server Error",
    });
  }
};
const rejectGame = async (req, res) => {
  //to do
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Game id is missing",

        error: "Bad Request",
      });
    }
    const game = await gameModel.findByIdAndDelete(id);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
        error: "Not Found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Game rejected successfully",
      data: game,
    });
  } catch (err) {
    console.log("controller@rejectGame", err.message);
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
  approveGame,
  listOfPendingGamesAdmin,
  listOfGameForDevelopers,
  deleteGame,
  updateGame,
  playGame,
  trendingGames,
  popularGames,
  latestGames,
  addToFavourite,
  removeFromFavourite,
  listFavouriteGames,
  getGameStats,
  rejectGame,
};