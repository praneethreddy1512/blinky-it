import { createProduct, getProductController } from "../controllers/product.controller.js";
import { Router } from "express";
import auth from "../middleware/auth.js";

const productRouter = Router()

productRouter.post("/upload-product", auth ,createProduct)
productRouter.get("/get-product", auth,getProductController)
export default productRouter;