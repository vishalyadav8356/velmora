import productModel from "../models/product.model.js";
import { uploadFile } from "../services/stroage.service.js";

//create a new product
export const createProduct = async (req, res) => {
  const { title, description, price } = req.body;
  const seller = req.user;

  const images = await Promise.all(
    req.files.map(async (file) => {
      return await uploadFile({
        buffer: file.buffer,
        fileName: file.originalname,
      });
    }),
  );

  const product = await productModel.create({
    title,
    description,
    price,
    images,
    seller: seller._id,
  });

  res.status(201).json({
    message: "Product created successfully",
    success: true,
    product,
  });
};

// get all the products of the seller
export const getProductsSeller = async (req, res) => {
  const seller = req.user;

  const products = await productModel.find({ seller: seller._id });

  res.status(200).json({
    message: "Products retrieved successfully",
    success: true,
    products,
  });
};

// get all the products of the buyer
export const getAllProducts = async (req, res) => {
  const products = await productModel.find();

  res.status(200).json({
    message: "Products retrieved successfully",
    success: true,
    products,
  });
};

// get product details by id
export const getProductDetails = async (req, res) => {
  const { id } = req.params;

  const product = await productModel.findById(id);

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
      success: false,
    });
  }

  res.status(200).json({
    message: "Product details retrieved successfully",
    success: true,
    product,
  });
};

// add a new variant to a product
export const addProductVariant = async (req, res) => {
  const productId = req.params.productId;
  const product = await productModel.findOne({
    _id: productId,
    seller: req.user._id,
  });

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
      success: false,
    });
  }

  const files = req.files;
  const images = [];
  if (files || files.length !== 0) {
    (
      await Promise.all(
        files.map(async (file) => {
          const image = await uploadFile({
            buffer: file.buffer,
            fileName: file.originalname,
          });
          return image;
        }),
      )
    ).map((image) => images.push(image));
  }

  const price = req.body.priceAmount
  const stock = req.body.stock;
  const attributes = JSON.parse(req.body.attributes || "{}");


    product.variants.push({
     images,
        price: {
            amount: Number(price) || product.price.amount,
            currency: req.body.priceCurrency || product.price.currency
        },
        stock,
        attributes
  });

    await product.save();

    res.status(201).json({
        message: "Product variant added successfully",
        success: true,
        product,
    });
};
