import productModel from "../models/product.model.js";

// get the stock of a variant of a product
export const stockOfVariant = async (productId, variantId) => {
  const product = await productModel.findOne({
    _id: productId,
    "variants._id": variantId,
  });

 const stock = product.variants.find(variant => variant._id.toString() === variantId).stock;
 return stock;
};
