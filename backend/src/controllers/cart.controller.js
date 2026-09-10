import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";
import mongoose from "mongoose";
import { stockOfProduct } from "../dao/product.dao.js";
import { createOrder } from "../services/payment.service.js";
import { getCartDetails } from "../dao/cart.dao.js";
import paymentModel from "../models/payment.model.js";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils.js";
import { config } from "../config/config.js";

const getProductAndStock = async (productId) => {
  const product = await productModel.findById(productId);

  if (!product) {
    return null;
  }

  const stock = await stockOfProduct(productId);

  return { product, stock };
};

const cartItemFilter = (userId, productId) => ({
  user: userId,
  items: {
    $elemMatch: {
      product: productId,
    },
  },
});

//add a product to the cart of the user
export const addToCart = async (req, res) => {
  const { productId } = req.params;
  const { quantity = 1 } = req.body;

  const productDetails = await getProductAndStock(productId);

  if (!productDetails) {
    return res.status(404).json({
      message: "Product not found",
      success: false,
    });
  }

  const { product, stock } = productDetails;

  const cart =
    (await cartModel.findOne({ user: req.user._id })) ||
    (await cartModel.create({ user: req.user._id }));

  const isProductAlreadyInCart = cart.items.some(
    (item) => item.product.toString() === productId,
  );

  if (isProductAlreadyInCart) {
    const quantityInCart = cart.items.find((item) =>
      item.product.toString() === productId,
    ).quantity;
    if (quantityInCart + quantity > stock) {
      return res.status(400).json({
        message: `only ${stock} items left in stock. and you already have ${quantityInCart} items in your cart`,
        success: false,
      });
    }

    const updatedCart = await cartModel.findOneAndUpdate(
      cartItemFilter(req.user._id, productId),
      { $inc: { "items.$.quantity": quantity } },
      { new: true },
    );

    return res.status(200).json({
      message: "cart updated successfully",
      success: true,
      cart: updatedCart,
    });
  }

  if (quantity > stock) {
    return res.status(400).json({
      message: `only ${stock} items left in stock`,
      success: false,
    });
  }

  cart.items.push({
    product: productId,
    quantity,
    price: product.price,
  });

  const updatedCart = await cart.save();

  return res.status(200).json({
    message: "Product added to cart successfully",
    success: true,
    cart: updatedCart,
  });

};

// get all the items in the cart of the user
export const getCart = async (req, res) => {
  const user = req.user;

  let cart = await cartModel
    .findOne({ user: user._id })
    .populate("items.product");

  if (!cart) {
    cart = await cartModel.create({ user: user._id });
  }

  return res.status(200).json({
    message: "Cart fetched successfully",
    success: true,
    cart,
  });
};

// increment the quantity of a product in the cart of the user
export const incrementCartItemQuantity = async (req, res) => {

  const { productId } = req.params;
  const productDetails = await getProductAndStock(productId);

  if(!productDetails){
        return res.status(404).json({
            message: "Product not found",
            success: false,
        });
    }

      const cart = await cartModel.findOne({ user: req.user._id });

    if(!cart){
        return res.status(404).json({
            message: "Cart not found",
            success: false,
        });
    }
          
    const stock = productDetails.stock;

    const itemQuantityInCart = cart.items.find(item =>
      item.product.toString() === productId,
    )?.quantity || 0;
    
    if(itemQuantityInCart + 1 > stock){
      return res.status(400).json({
        message: `only ${stock} items left in stock. and you already have ${itemQuantityInCart} items in your cart`,
        success: false,
      });
    }

    const updatedCart = await cartModel.findOneAndUpdate(
      cartItemFilter(req.user._id, productId),
      { $inc: { "items.$.quantity": 1 } },
      { new: true }
    );

    if (!updatedCart) {
      return res.status(404).json({
        message: "Item not found in cart",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Cart item quantity incremented successfully",
      success: true,
      cart: updatedCart,
    });

};    

// decrement the quantity of a product in the cart of the user
export const decrementCartItemQuantity = async (req, res) => {

  const { productId } = req.params;

  const cart = await cartModel.findOne({ user: req.user._id });

  if(!cart){
    return res.status(404).json({
      message: "Cart not found",
      success: false,
    });
  }

  const item = cart.items.find(item =>
    item.product.toString() === productId,
  );

  if(!item){
    return res.status(404).json({
      message: "Item not found in cart",
      success: false,
    });
  }

  if(item.quantity <= 1){
    return res.status(400).json({
      message: "Item quantity cannot be less than 1",
      success: false,
    });
  }

  const updatedCart = await cartModel.findOneAndUpdate(
    cartItemFilter(req.user._id, productId),
    { $inc: { "items.$.quantity": -1 } },
    { new: true }
  );

  return res.status(200).json({
    message: "Cart item quantity decremented successfully",
    success: true,
    cart: updatedCart,
  });

};    

// remove an item from the cart of the user
export const removeCartItem = async (req, res) => {

  const { productId } = req.params;

  const cart = await cartModel.findOne({ user: req.user._id });

  if(!cart){
    return res.status(404).json({
      message: "Cart not found",
      success: false,
    });
  }

  const itemIndex = cart.items.findIndex(item =>
    item.product.toString() === productId,
  );

  if(itemIndex === -1){ 
    return res.status(404).json({
      message: "Item not found in cart",
      success: false,
    });
  }

  cart.items.splice(itemIndex, 1);
  const updatedCart = await cart.save();

  return res.status(200).json({
    message: "Cart item removed successfully",
    success: true,
    cart: updatedCart,
  });

};

// clear the cart of the user
export const createOrderController = async (req, res) => {
  const cart = await getCartDetails(req.user._id);

    if (!cart) {
        return res.status(400).json({
      message: "Cart is empty",
      success: false,
    });
    }

  for (const item of cart.items) {
    const stock = await stockOfProduct(item.product._id);

    if (item.quantity > stock) {
      return res.status(400).json({
        message: `Only ${stock} items left in stock for ${item.product.title}`,
        success: false,
      });
    }
  }

  const order = await createOrder({
    amount: cart.totalPrice,
    currency: cart.currency,
  });

    const payment = await paymentModel.create({
        user: req.user._id,
        razorpay: {
            orderId: order.id,
        },
        price: {
            amount: cart.totalPrice,
            currency: cart.currency
        },
        orderItems: cart.items.map(item => ({
            title: item.product.title,
            productId: item.product._id,
            quantity: item.quantity,
            images: item.product.images,
            description: item.product.description,
            price: item.price,
        }))
        });

    return res.status(200).json({
          message: "Order created successfully",
          success: true,
          order,
          payment,
        });
      };

// verify the order of the user
export const verifyOrderController = async (req, res) => {
    const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature
    } = req.body

    const payment = await paymentModel.findOne({
        "razorpay.orderId": razorpay_order_id,
        status: "pending"
    });

    if (!payment) {
        return res.status(400).json({
            message: "Payment not found",
            success: false
        });
    }

    const isPaymentValid = validatePaymentVerification({
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
    }, razorpay_signature, config.RAZORPAY_KEY_SECRET);

    if (!isPaymentValid) {
        payment.status = "failed"
        await payment.save();

        return res.status(400).json({
            message: "Payment verification failed",
            success: false
        });
    }

      const session = await mongoose.startSession();

      try {
        await session.withTransaction(async () => {
          const pendingPayment = await paymentModel.findOne({
            _id: payment._id,
            status: "pending",
          }).session(session);

          if (!pendingPayment) {
            throw new Error("Payment has already been processed");
          }

          for (const item of pendingPayment.orderItems) {
            const productFilter = {
              _id: item.productId,
              stock: { $gte: item.quantity },
            };
            const stockUpdate = { $inc: { stock: -item.quantity } };

            const result = await productModel.updateOne(
              productFilter,
              stockUpdate,
              { session },
            );

            if (result.modifiedCount !== 1) {
              throw new Error(`Insufficient stock for ${item.title}`);
            }
          }

          pendingPayment.status = "paid";
          pendingPayment.razorpay.paymentId = razorpay_payment_id;
          pendingPayment.razorpay.signature = razorpay_signature;
          await pendingPayment.save({ session });

          await cartModel.updateOne(
            { user: pendingPayment.user },
            { $set: { items: [] } },
            { session },
          );
        });
      } catch (error) {
        if (error.message.startsWith("Insufficient stock")) {
          return res.status(409).json({
            message: error.message,
            success: false,
          });
        }

        return res.status(500).json({
          message: "Unable to complete payment verification",
          success: false,
        });
      } finally {
        await session.endSession();
      }

    return res.status(200).json({
        message: "Payment verified successfully",
        success: true,
      });
    };