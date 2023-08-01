import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import { User } from "../models/User.js";
import getDataUri from "../utils/dataUri.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sendToken } from "../utils/sendToken.js";
import cloudinary from "cloudinary";


export const register = catchAsyncError(async (req, res, next) => {
  const { name, email, password, dob } = req.body;
  const file = req.file;
  if (!name || !email || !password || !dob )
    return next(new ErrorHandler("Please enter all fields", 400));
  let user = await User.findOne({ email });
  if (user) return next(new ErrorHandler("User Already Exists", 409));

  let avatar = {};

  if (file) {
    const fileUri = getDataUri(file);
    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

    avatar = {
      public_id: mycloud.public_id,
      url: mycloud.secure_url,
    };
  }

  user = await User.create({
    name,
    email,
    password,
    dob,
    avatar,
  });

  sendToken(res, user, "Registered Successfully", 201);
});


export const login = catchAsyncError(async (req, res, next) => {
  const { email, password, dob } = req.body;
  // const file = req.file;
  if (!email || !password || !dob)
  return next(new ErrorHandler("Please enter all fields", 400));

  const user = await User.findOne({ email }).select("+password");
  if (!user) return next(new ErrorHandler("User Doesnt Exist", 401));

  const isMatch = await user.comparePassword(password);
  if (!isMatch) return next(new ErrorHandler("Incorrect Password", 401));

  if (user.dob !== dob) {
    return next(new ErrorHandler("Incorrect Date of Birth", 401));
  }

  sendToken(res, user, `Welcome back, ${user.name}`, 200);
});

export const logout = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .json({
      success: true,
      message: "Logged Out Successfully",
    });
});

export const getMyProfile = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({
    success: true,
    user,
  });
});