const Section = require("../models/section.model");
const Hobby = require("../models/hobby.model");

const getAllSections = async (req, res, next) => {
  try {
    const sections = await Section.find().populate("hobbies").populate({
      path: "hobbies",
      populate: "feeds comments favorites",
    });

    res.status(200).json(sections);
  } catch (error) {
    return next(error);
  }
};

const getSectionByName = async (req, res, next) => {
  try {
    if (req.query.page && !isNaN(parseInt(req.query.page))) {
      const numHobby = await Hobby.find({
        city: req.params.city,
        type: req.params.name,
      }).countDocuments();

      let page = parseInt(req.query.page);

      let limit = req.query.limit ? parseInt(req.query.limit) : 10;

      let numPages =
        numHobby % limit > 0 ? numHobby / limit + 1 : numHobby / limit;

      if (page > numPages || page < 1) {
        page = 1;
      }

      const skip = (page - 1) * limit;

      const allHobbies = await Hobby.find({
        city: req.params.city,
        type: req.params.name,
      })
        .skip(skip)
        .limit(limit)
        .populate("feeds comments createdBy")
        .populate({
          path: "feeds",
          populate: "idUser idHobby",
        })
        .populate({
          path: "comments",
          populate: "idUser idHobby",
        })
        .populate({
          path: "createdBy",
          populate: "createdHobbies comments feeds favorites",
        });
      let media;

      for (const hobby of allHobbies) {
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
      return res.status(200).json({
        info: {
          total: numHobby,
          page: page,
          limit: limit,
          next:
            numPages >= page + 1
              ? `/api/v1/sections/${req.params.city}/${req.params.name}?page=${
                  page + 1
                }&limit=${limit}`
              : null,
          prev:
            page != 1
              ? `/api/v1/sections/${req.params.city}/${req.params.name}?page=${
                  page - 1
                }&limit=${limit}`
              : null,
        },
        results: allHobbies,
      });
    } else {
      const allHobbies = await Hobby.find({
        city: req.params.city,
        type: req.params.name,
      })
        .limit(10)
        .populate("feeds comments createdBy")
        .populate({
          path: "feeds",
          populate: "idUser idHobby",
        })
        .populate({
          path: "comments",
          populate: "idUser idHobby",
        })
        .populate({
          path: "createdBy",
          populate: "createdHobbies comments feeds favorites",
        });
      let media;

      for (const hobby of allHobbies) {
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
      const numHobby = await Hobby.find({
        city: req.params.city,
        type: req.params.name,
      }).countDocuments();

      return res.status(200).json({
        info: {
          total: numHobby,
          page: 1,
          limit: 10,
          next:
            numHobby > 10
              ? `/api/v1/sections/${req.params.city}/${req.params.name}?page=2&limit=10`
              : null,
          prev: null,
        },
        results: allHobbies,
      });
    }
  } catch (error) {
    return next(error);
  }
};

const createSections = async (req, res, next) => {
  try {
    const newSection = new Section(req.body);
    const createdSection = await newSection.save();
    return res.status(201).json(createdSection);
  } catch (error) {
    return next(error);
  }
};

const updateSections = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedSection = await Section.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    return res.status(200).json(updatedSection);
  } catch (error) {
    return next(error);
  }
};

const deleteSections = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleteSections = await Section.findByIdAndDelete(id);
    res.status(200).json(deleteSections);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getAllSections,
  getSectionByName,
  createSections,
  updateSections,
  deleteSections,
};