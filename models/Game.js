import mongoose from "mongoose";

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter course title"],
    minLength: [4, "Title must be at least 4 characters"],
    maxLength: [80, "Title size is bagger then 80 characters"],
  },
  description: {
    type: String,
    required: [true, "Please enter course title"],
    minLength: [20, "Title must be at least 4 characters"],
  },
  draft: {
    type: Boolean,
    enum: [true, false],
    default: true,
  },
  comments: [
    {
      name: {
        type: String,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  poster: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  click: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    required: true,
  },
  publishBy: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Game = mongoose.model("Game", schema);
