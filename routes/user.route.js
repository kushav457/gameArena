const express = require("express");
const { updateUser}  = require("../controller/user.controller");
const { protectRoute, authorizeRoles } = require("../middleware/auth");

const userRouter = express.Router();
//user update route
userRouter.use(protectRoute);
userRouter.route("/:id").patch(updateUser);

module.exports = userRouter;
