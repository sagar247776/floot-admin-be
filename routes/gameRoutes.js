import express from "express";
import { createGame, getAllGames } from "../controllers/gameController.js";
import singleUpload from "../middlewares/multer.js";

const router = express.Router();

router.route("/games").get(getAllGames);
router.route("/games").post(singleUpload,createGame);



export default router;