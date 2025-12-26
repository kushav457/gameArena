const express = require("express");
const { createGame, listAllGame } = require("../controller/game.controller");
const protectRoute = require("../middleware/auth");
const gameRouter = express.Router();
//create game
gameRouter.use(protectRoute)
gameRouter.route("/").post(createGame).get(listAllGame);
// gameRouter.route("/").get(listAllGame);

module.exports = gameRouter;
