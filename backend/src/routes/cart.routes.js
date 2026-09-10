import express from "express";
import { authenticateUser } from "../middlewares/auth.middlewares.js";
import { validateAddToCart, validateIncrementCartItemQuantity, validateDecrementCartItemQuantity, validateRemoveCartItem } from "../validator/cart.validator.js";
import { addToCart, getCart, incrementCartItemQuantity, decrementCartItemQuantity, removeCartItem, createOrderController, verifyOrderController } from "../controllers/cart.controller.js";


const router = express.Router();

//@route POST /api/cart/add/:productId/:variantId
//description: Add a itmes to the cart
//access Private (User only) 
//@arguments: productId, variantId
//@arguments: quantity (optional, default is 1)   

router.post("/add/:productId/:variantId", authenticateUser, validateAddToCart, addToCart);

//@route GET /api/cart
//description: Get the cart of the user
//access Private (User only)
router.get("/", authenticateUser, getCart);

//@route PATCH /api/cart/quantity/increment/:productId/:variantId
//description: increment item quantity in the cart by one
//access Private (User only)
router.patch("/quantity/increment/:productId/:variantId", authenticateUser, validateIncrementCartItemQuantity, incrementCartItemQuantity);

//@route PATCH /api/cart/quantity/decrement/:productId/:variantId
//description: decrement item quantity in the cart by one
//access Private (User only)
router.patch("/quantity/decrement/:productId/:variantId", authenticateUser, validateDecrementCartItemQuantity, decrementCartItemQuantity);

//@route DELETE /api/cart/remove/:productId/:variantId
//description: remove an item from the cart
//access Private (User only)
router.delete("/remove/:productId/:variantId", authenticateUser, validateRemoveCartItem, removeCartItem);

//@route POST /api/cart/payment/create/order
//description: create an order after payment
//access Private (User only)
router.post("/payment/create/order", authenticateUser, createOrderController);

//@route POST /api/cart/payment/verify/order
//description: verify the order after payment
//access Private (User only)
router.post("/payment/verify/order", authenticateUser, verifyOrderController)

export default router;