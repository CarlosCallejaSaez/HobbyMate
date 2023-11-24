const express = require("express");
const UserRouter = express.Router();
const { upload } = require("../middlewares/cloudinary.middleware");
const { isAuth } = require("../middlewares/user.middleware");

const {
  getAllUsers,
  loginUser,
  registerUser,
  getUserByID,
  updateUser,
  deleteUser,
} = require("../controllers/user.controller.js");

UserRouter.get("/:id", getUserByID);
UserRouter.get("/", [isAuth], getAllUsers);
UserRouter.post("/", upload.single("avatar"), registerUser);
UserRouter.post("/login", loginUser);
UserRouter.patch("/:id", [isAuth], upload.single("avatar"), updateUser);
UserRouter.delete("/:id", deleteUser);

module.exports = UserRouter;