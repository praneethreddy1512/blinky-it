import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import morgan from "morgan";
import connectDB from "./config/connectdb.js";
import userrouter from "./route/user.route.js";
import categoryRouter from "./route/category.route.js";
import uploadRouter from "./route/upload.router.js";
import subCategoryRouter from "./route/subCategory.route.js";
import productRouter from "./route/products.route.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

const PORT = process.env.PORT || 8800;

app.get("/", (req, res) => {
  res.json({
    message: "Server is running " + PORT,
  });
});
app.use("/api/category", categoryRouter);
app.use("/api/user", userrouter);
app.use("/api/file", uploadRouter);
app.use("/api/subcategory", subCategoryRouter);
app.use("/api/product", productRouter);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server is Running on PORT", PORT);
  });
});
