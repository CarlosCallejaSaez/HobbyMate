const express = require("express");
const SectionRouter = express.Router();
const { isAuth } = require("../middlewares/user.middleware");

const {
  getAllSections,
  getSectionByName,
  createSections,
  updateSections,
  deleteSections,
} = require("../controllers/section.controller.js");

SectionRouter.get("/", getAllSections);
SectionRouter.get("/:city/:name", getSectionByName);
SectionRouter.post("/", [isAuth], createSections);
SectionRouter.patch("/:id", [isAuth], updateSections);
SectionRouter.delete("/:id", [isAuth], deleteSections);

module.exports = SectionRouter;