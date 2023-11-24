const express = require("express");
const FeedRouter = express.Router();
const { isAuth } = require("../middlewares/user.middleware");

const {
  getAllFeeds,
  getFeedByID,
  createFeeds,
  updateFeeds,
  deleteFeeds,
} = require("../controllers/feed.controller.js");

FeedRouter.get("/", getAllFeeds);
FeedRouter.get("/:id", getFeedByID);
FeedRouter.post("/", [isAuth], createFeeds);
FeedRouter.patch("/:id", [isAuth], updateFeeds);
FeedRouter.delete("/:id", [isAuth], deleteFeeds);

module.exports = FeedRouter;