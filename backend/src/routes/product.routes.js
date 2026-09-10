import {Router} from "express";
import {authenticateSeller} from "../middlewares/auth.middlewares.js";
import { createProductValidator } from "../validator/product.validator.js";
import { createProduct, getProductsSeller, getAllProducts, getProductDetails, addProductVariant } from "../controllers/product.controller.js";
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
router.post("/", authenticateSeller, upload.array("images", 5),createProductValidator, createProduct)

//@route GET /api/products/seller
//description: Get products for a seller
//access Private (Seller only)
router.get("/seller", authenticateSeller, getProductsSeller);

//@route GET /api/products
//description: Get all products
//access Public
router.get("/", getAllProducts);

//@route GET /api/products/detail/:id
//description: Get product details by ID
//access Public
router.get("/detail/:id", getProductDetails);

//@route POST /api/products/productId/variants
//description: Create a new product variant
//access Private (Seller only)
//at a time 7 images can be uploaded
router.post("/:productId/variants", authenticateSeller, upload.array("images", 7), addProductVariant);

export default router;