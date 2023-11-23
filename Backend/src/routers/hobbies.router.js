const express = require("express");
const HobbyRouter = express.Router();
const { upload } = require("../middlewares/cloudinary.middleware");
const { isAuth } = require("../middlewares/user.middleware");

const {
  getAllHobbies,
  getHobbyByID,
  createHobbies,
  updateHobbies,
  deleteHobbies,
  chooseFavorite,
  getTop5,
} = require("../controllers/hobby.controller.js");

HobbyRouter.get("/:city", getAllHobbies);
HobbyRouter.get("/:city/top5", getTop5);
HobbyRouter.get("/:city/:id", getHobbyByID);
HobbyRouter.post("/", [isAuth], upload.single("image"), createHobbies);
HobbyRouter.patch(
  "/:id",
  [isAuth],
  upload.single("image"),
  updateHobbies
);
HobbyRouter.delete("/:id", [isAuth], deleteHobbies);
HobbyRouter.put("/favorites/:id", [isAuth], chooseFavorite);

module.exports = HobbyRouter;