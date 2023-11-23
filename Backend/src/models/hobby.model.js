const mongoose = require("mongoose");

const HobbySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    image: { type: String, required: false, trim: true },
    description: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    coordinates: { type: String, required: false, trim: true },
    city: {
      type: String,
      required: true,
      trim: true,
      enum: ["Palencia", "Madrid", "Barcelona"],
    },
    type: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "Art",
        "Music",
        "Sports",
        "Traveling",
        "Gaming",
        "Miscellania",
      ],
    },
    comments: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Comment", required: false },
    ],
    feeds: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Feed", required: false },
    ],
    validate: {
      type: Boolean,
      default: false,
      enum: [false, true],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    mediaStars: {
      type: Number,
      trim: true,
      required: false,
      default: 0,
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Hobby = mongoose.model("Hobby", HobbySchema);
module.exports = Hobby;