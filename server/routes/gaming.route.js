const express = require("express");
const {
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
  listFavouriteGames,
  addToFavourite,
  removeFromFavourite,
  getGameStats,
  rejectGame,
} = require("../controller/game.controller");
const { protectRoute, authorizeRoles } = require("../middleware/auth");
const {
  deleteReviewAndRating,
  updateReviewAndRating,
  createReviewAndRating,
} = require("../controller/review.controller");
const gameRouter = express.Router();
//create game
gameRouter.use(protectRoute);
gameRouter.route("/").post(authorizeRoles(["developer"]), createGame);
gameRouter.route("/").get(listAllGame);
gameRouter.route("/approve/:id").patch(authorizeRoles(["admin"]), approveGame);
gameRouter
  .route("/pending")
  .get(authorizeRoles(["admin"]), listOfPendingGamesAdmin);
gameRouter
  .route("/developerlist")
  .get(authorizeRoles(["developer"]), listOfGameForDevelopers);
gameRouter.route("/:id").patch(authorizeRoles(["developer"]), updateGame);
gameRouter.route("/:id").delete(authorizeRoles(["developer"]), deleteGame);

//review routes
gameRouter.route("/review").post(createReviewAndRating);
//played by routes
gameRouter.route("/playgame").post(playGame);

gameRouter
  .route("/review/:id")
  .patch(updateReviewAndRating)
  .delete(deleteReviewAndRating);
// gameRouter.route("/").get(listAllGame);
gameRouter.route("/trending").get(trendingGames);
gameRouter.route("/popular").get(popularGames);
gameRouter.route("/latest").get(latestGames);
gameRouter.route("/favourite").get(listFavouriteGames).post(addToFavourite);
gameRouter.route("/favourite/:gameId").delete(removeFromFavourite);
gameRouter.route("/stats").get(authorizeRoles(["admin"]), getGameStats);
gameRouter.route("/reject/:id").delete(authorizeRoles(["admin"]), rejectGame);

module.exports = gameRouter;
