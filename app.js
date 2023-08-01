import express from "express";
import {config} from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import ErrorMiddleware from "./middlewares/Error.js";
import publisherRoutes from "./routes/publisherRoutes.js"
import gameRoutes from './routes/gameRoutes.js'

config({
    path:"./config/config.env"
})

const app = express();

// Using Middlewares
app.use(express.json());
app.use(express.urlencoded({
    extended: true,
}));
app.use(cookieParser())

app.use(
  cors({
    origin: ["https://floot-admin.vercel.app","http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use("/api/v1", publisherRoutes);
app.use("/api/v1", gameRoutes);
app.get("/", (req, res) =>
  res.send(
    `<h1>Server is Working.</h1>`
  )
);  



// Make sure this error handler use in last on the code otherwise its will makes the problumes



export default app;

app.use(ErrorMiddleware)