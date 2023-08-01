import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { Game } from "../models/Game.js";
import getDataUri from "../utils/dataUri.js";
import ErrorHandler from "../utils/errorHandler.js";
import cloudinary from "cloudinary";


export const getAllGames = catchAsyncError(async (req, res, next) => {
  const keyword = req.query.keyword || "";
  const category = req.query.category || "";
  

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  
  const query = {
    title: {
      $regex: keyword,
      $options: "i",
    },
    category: {
      $regex: category,
      $options: "i",
    },
  };
  
  const gamesQuery = Game.find(query).select("-comments");
  const gamesCount = Game.countDocuments(query);
  const games = await gamesQuery.skip(skip).limit(limit);
  

  const [gamesData, totalGames] = await Promise.all([games, gamesCount]);
  

  const totalPages = Math.ceil(totalGames / limit);
  
  res.status(200).json({
    success: true,
    games: gamesData,
    pagination: {
      totalGames,
      totalPages,
      currentPage: page,
      gamesPerPage: limit,
    },
  });
});



  export const createGame = catchAsyncError(async (req, res, next) => {
    const { title, description, category, publishBy } = req.body;
    if (!title || !description || !category || !publishBy)
      return next(new ErrorHandler("Please add all fields", 400));
  
    const file = req.file;
  
    const fileUri = getDataUri(file);
  
    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);
  
    await Game.create({
      title,
      description,
      category,
      publishBy,
      poster: {
        public_id: mycloud.public_id,
        url: mycloud.secure_url,
      },
    });
    res.status(201).json({
      success: true,
      message: "Game created successfully",
    });
  });