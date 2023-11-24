const Feed = require("../models/feed.model");
const Hobby = require("../models/hobby.model");
const User = require("../models/user.model");

const getAllFeeds = async (req, res, next) => {
  try {
    const feeds = await Feed.find().populate("idUser idHobby").populate({
      path: "idHobby",
      populate: "feeds",
    });
    res.status(200).json(feeds);
  } catch (error) {
    return next(error);
  }
};

const getFeedByID = async (req, res, next) => {
  try {
    const { id } = req.params;
    const feed = await Feed.findById(id).populate("idUser idHobby");
    return res.status(200).json(feed);
  } catch (error) {
    return next(error);
  }
};

const createFeeds = async (req, res, next) => {
  try {
    const newFeed = new Feed(req.body);
    const findUser = await User.findById(req.body.idUser).populate("feeds");
    const findHobby = await Hobby.findById(req.body.idHobby).populate(
      "feeds"
    );

    findUser.feeds.push(newFeed._id);
    findHobby.feeds.push(newFeed._id);

    const updateUser = await User.findByIdAndUpdate(req.body.idUser, findUser);
    const updateHobby = await Hobby.findByIdAndUpdate(
      req.body.idHobby,
      findHobby
    ).populate("feeds");

    const createdFeed = await newFeed.save();

    return res.status(201).json({
      createdFeed,
      updateUser,
      updateHobby,
    });
  } catch (error) {
    return next(error);
  }
};

const updateFeeds = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedFeed = await Feed.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.status(200).json(updatedFeed);
  } catch (error) {
    return next(error);
  }
};

const deleteFeeds = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteFeeds = await Feed.findByIdAndDelete(id);

    res.status(200).json(deleteFeeds);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllFeeds,
  getFeedByID,
  createFeeds,
  updateFeeds,
  deleteFeeds,
};