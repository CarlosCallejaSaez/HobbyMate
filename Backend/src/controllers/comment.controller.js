const Comment = require("../models/comment.model");
const User = require("../models/user.model");
const Hobby = require("../models/hobby.model");
const getAllComments = async (req, res, next) => {
  try {
    const comments = await Comment.find().populate("idUser idHobby");
    res.status(200).json(comments);
  } catch (error) {
    return next(error);
  }
};

const getCommentByID = async (req, res, next) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id).populate("idUser idHobby");
    return res.status(200).json(comment);
  } catch (error) {
    return next(error);
  }
};

const createComments = async (req, res, next) => {
  try {
    const newComment = new Comment(req.body);
    const findUser = await User.findById(req.body.idUser).populate("comments");
    const findHobby = await Hobby.findById(req.body.idHobby).populate(
      "comments"
    );
    findUser.comments.push(newComment._id);
    findHobby.comments.push(newComment._id);
    const updateUser = await User.findByIdAndUpdate(req.body.idUser, findUser);
    const updateHobby = await Hobby.findByIdAndUpdate(
      req.body.idHobby,
      findHobby
    );
    const createdComment = await newComment.save();
    return res.status(201).json({ createdComment, updateUser, updateHobby });
  } catch (error) {
    return next(error);
  }
};

const updateComments = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedComment = await Comment.findByIdAndUpdate(id, req.body, {
      new: true,
    }).populate("idUser idHobby");
    return res.status(200).json(updatedComment);
  } catch (error) {
    return next(error);
  }
};

const deleteComments = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteComments = await Comment.findByIdAndDelete(id).populate(
      "idUser idHobby"
    );
    res.status(200).json(deleteComments);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllComments,
  getCommentByID,
  createComments,
  updateComments,
  deleteComments,
};