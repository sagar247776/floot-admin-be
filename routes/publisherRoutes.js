import express from "express";
import { getMyProfile, login, logout,  register } from "../controllers/publisherController.js";
import singleUpload from "../middlewares/multer.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.route("/register").post(singleUpload, register);
router.route("/login").post(singleUpload, login);
router.route("/logout").get(logout);
router.route("/me").get(isAuthenticated, getMyProfile);
export default router;