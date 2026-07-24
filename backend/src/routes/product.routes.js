import {Router} from "express";
import {authenticateSeller} from "../middlewares/auth.middlewares.js";
import { createProductValidator } from "../validator/product.validator.js";
import { createProduct, getProductsSeller } from "../controllers/product.controller.js";
import multer from "multer";

// Multer configuration for file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits :{
        fileSize: 5 * 1024 * 1024 // 5MB
    }
})

const router = Router();

//@route POST /api/products
//description: Create a new product
//access Private (Seller only)
//at a time 5 images can be uploaded
router.post("/", authenticateSeller, createProductValidator, upload.array("images", 5), createProduct)

//@route GET /api/products/seller
//description: Get products for a seller
//access Private (Seller only)
router.get("/seller", authenticateSeller, getProductsSeller);

export default router;