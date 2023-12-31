const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const { generateToken } = require("../config/token");
const { deleteImgCloudinary } = require("../middlewares/cloudinary.middleware")
const Hobby = require("../models/hobby.model");
const Comment = require("../models/comment.model");
const Feed = require("../models/feed.model");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate(
      "comments favorites createdHobbies feeds"
    );
    res.status(200).json(users);
  } catch (error) {
    return next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const user = await User.findOne({
      userName: req.body.userName,
    }).populate("comments favorites createdHobbies feeds");
    if (!user) {
      return next("User not found");
    }
    if (bcrypt.compareSync(req.body.password, user.password)) {
      const token = generateToken(user._id, user.userName);
      return res.status(200).json({
        user,
        token,
      });
    }
  } catch (error) {
    return next(error);
  }
};

const registerUser = async (req, res, next) => {
  try {
    const newUser = new User({
      ...req.body,
      avatar: req.file
        ? req.file.path
        : "",
    });

    const userExist = await User.findOne({ email: newUser.email });
    if (userExist) {
      return next("User already exist");
    }
    const createdUser = await newUser.save();
    createdUser.password = null;
    return res.status(201).json(createdUser);
  } catch (error) {
    return next(error);
  }
};
const getUserByID = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate(
      "comments feeds createdHobbies favorites"
    );
    return res.status(200).json(user);
  } catch (error) {
    return next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const originalUser = await User.findById(id);
    const newUser = new User(req.body);

    if (newUser.avatar !== originalUser.avatar) {
      newUser.password = originalUser.password;
    }

    newUser._id = id;

    if (newUser.password !== originalUser.password) {
      newUser.password = await bcrypt.hash(req.body.password, 10);
    } else {
      newUser.password = originalUser.password;
    }

    if (req.file) {
      deleteImgCloudinary(originalUser.avatar);
      newUser.avatar = req.file.path;
    }
    await User.findByIdAndUpdate(id, newUser);
    return res.status(200).json(newUser);
  } catch (error) {
    return next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    let userEliminated;

    if (
      !user.createdHobbies.length ||
      !user.feeds.length ||
      !user.comments.length
    ) {
      userEliminated = await User.findByIdAndDelete(id);

      if (user.avatar) {
        deleteImgCloudinary(user.avatar);
        return res.status(200).json(userEliminated);
      }
    } else {
      const hobbiesCreated = await Hobby.deleteMany({
        createdBy: id,
      });
      const feeds = await Feed.deleteMany({
        idUser: id,
      });
      const comments = await Comment.deleteMany({
        idUser: id,
      });
      userEliminated = await User.findByIdAndDelete(id);

      if (user.avatar) {
        deleteImgCloudinary(user.avatar);
        return res.status(200).json(userEliminated);
      }
    }
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllUsers,
  loginUser,
  registerUser,
  getUserByID,
  updateUser,
  deleteUser,
};