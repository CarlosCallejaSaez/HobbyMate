const Hobby= require("../models/hobby.model");
const { deleteImgCloudinary } = require("../middlewares/cloudinary.middleware");
const User = require("../models/user.model");
const Section = require("../models/section.model");
const Comment = require("../models/comment.model");
const Feed = require("../models/feed.model");

const getAllHobbies = async (req, res, next) => {
  try {
    const Hobbies = await Hobby.find({ city: req.params.city }).populate(
      "createdBy comments feeds favorites"
    );
    let media;

    for (const hobby of hobbies) {
        hobby.mediaStars = 0;
      if (!hobby.feeds.length) {
        media = 0;
      } else {
        for (const feed of hobby.feeds) {
            hobby.mediaStars += feed.stars;
          media = hobby.mediaStars / hobby.feeds.length;
        }
      }
      hobby.mediaStars = media;
    }

    res.status(200).json(Hobbies);
  } catch (error) {
    return next(error);
  }
};

const getHobbyByID = async (req, res, next) => {
  try {
    const { id } = req.params;
    const hobby = await Hobby.findById(id)
      .populate("comments feeds createdBy favorites")
      .populate({
        path: "feeds",
        populate: "idUser idActivity",
      })
      .populate({
        path: "comments",
        populate: "idUser idActivity",
      });

    hobby.mediaStars = 0;
    let media;
    for (const feed of hobby.feeds) {
        hobby.mediaStars += hobby.stars;
      media = hobby.mediaStars / hobby.feeds.length;
    }
    hobby.mediaStars = media;

    return res.status(200).json(hobby);
  } catch (error) {
    return next(error);
  }
};

const createHobbies = async (req, res, next) => {
  try {
    const newHobby = new Hobby({
      ...req.body,
      image: req.file
        ? req.file.path
        : "https://upload.wikimedia.org/wikipedia/commons/d/d1/Image_not_available.png",
    });
    const findUser = await User.findById(req.body.createdBy).populate(
      "comments feeds favorites"
    );
    const findSection = await Section.findOne({
      name: newHobby.type,
    }).populate("hobbies");
    findUser.createdHobbies.push(newHobby._id);

    findSection.hobbies.push(newHobby._id);
    const updateUser = await User.findByIdAndUpdate(
      req.body.createdBy,
      findUser
    ).populate("createdHobbies");
    const updateSection = await Section.findByIdAndUpdate(
      findSection._id,
      findSection
    ).populate("hobbies");
    const createdHobby = await newHobby.save();
    return res.status(201).json({ createdHobby, updateUser, updateSection });
  } catch (error) {
    return next(error);
  }
};

const chooseFavorite = async (req, res, next) => {
  try {
    const hobby = await Hobby.findById(req.params.id);

    const user = await User.findById(req.body.id);

    if (!hobby.favorites.includes(user._id)) {
      await hobby.updateOne({ $push: { favorites: user._id } });
      await user.updateOne({ $push: { favorites: hobby._id } });
      res.status(200).json("The activity has been liked");
    } else {
      await hobby.updateOne({ $pull: { favorites: user._id } });
      await user.updateOne({ $pull: { favorites: hobby._id } });
      res.status(200).json("The hobby has been disliked");
    }
  } catch (error) {
    return next(error);
  }
};

const updateHobbies = async (req, res, next) => {
  try {
    const { id } = req.params;
    const newHobby = new Hobby(req.body);
    newHobby._id = id;
    const originalHobby = await Hobby.findById(id).populate(
      "comments feeds createdBy favorites"
    );
    if (req.file) {
      deleteImgCloudinary(originalHobby.image);
      newHobby.image = req.file.path;
    }
    await Hobby.findByIdAndUpdate(id, newHobby).populate(
      "comments feeds createdBy favorites"
    );
    return res.status(200).json(newHobby);
  } catch (error) {
    return next(error);
  }
};

const deleteHobbies = async (req, res, next) => {
  try {
    const { id } = req.params;
    const hobby = await Hobby.findById(id);
    let hobbyEliminated;
    if (!hobby.feeds.length || !hobby.comments.length) {
      hobbyEliminated = await Hobby.findByIdAndDelete(id).populate(
        "comments feeds createdBy favorites"
      );
      if (hobby.image) {
        deleteImgCloudinary(hobby.image);
        return res.status(200).json(hobbyEliminated);
      }
    } else {
      const feeds = await Feed.deleteMany({
        idHobby: id,
      });
      const comments = await Comment.deleteMany({
        idHobby: id,
      });

      hobbyEliminated = await Hobby.findByIdAndDelete(id).populate(
        "comments feeds createdBy favorites"
      );
      if (hobby.image) {
        deleteImgCloudinary(hobby.image);
        return res.status(200).json(hobbyEliminated);
      }
    }
  } catch (error) {
    return next(error);
  }
};

const getTop5 = async (req, res, next) => {
  try {
    const Hobbies = await Hobby.find({ city: req.params.city }).populate(
      "comments feeds createdBy favorites"
    );
    let media;

    for (const hobby of Hobbies) {
      hobby.mediaStars = 0;
      if (!hobby.feeds.length) {
        media = 0;
      } else {
        for (const feed of hobby.feeds) {
            hobby.mediaStars += feed.stars;
          media = hobby.mediaStars / hobby.feeds.length;
        }
      }
      hobby.mediaStars = media;
    }

    Hobbies.sort(function (x, y) {
      if (y.mediaStars < x.mediaStars) {
        return -1;
      }

      if (y.mediaStars > x.mediaStars) {
        return 1;
      }

      return y.mediaStars - x.mediaStars;
    });

    const ranked = Hobbies;
    const finalRanked = ranked.slice(0, 5);

    res.status(200).json(finalRanked);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
    getAllHobbies,
  getHobbyByID,
  createHobbies,
  updateHobbies,
  deleteHobbies,
  chooseFavorite,
  getTop5,
};