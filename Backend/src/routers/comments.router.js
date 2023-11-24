const express = require("express");
const CommentRouter = express.Router();
const { isAuth } = require("../middlewares/user.middleware");
const {
  getAllComments,
  getCommentByID,
  createComments,
  updateComments,
  deleteComments,
} = require("../controllers/comment.controller.js");
CommentRouter.get("/", getAllComments);
CommentRouter.get("/:id", getCommentByID);
CommentRouter.post("/", [isAuth], createComments);
CommentRouter.patch("/:id", [isAuth], updateComments);
CommentRouter.delete("/:id", [isAuth], deleteComments);

module.exports = CommentRouter;