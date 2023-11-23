const mongoose = require("mongoose");

const SectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      enum: [
        "Art",
        "Music",
        "Sports",
        "Traveling",
        "Gaming",
        "Miscellania",
      ],
    },
    activities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: "Activity",
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Section = mongoose.model("Section", SectionSchema);
module.exports = Section;