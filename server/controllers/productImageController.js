import cloudinary from "../config/cloudinary.js";

import {
  createProductImage,
  getProductImages,
  getProductImageById,
  setPrimaryImage,
  deleteProductImage,
} from "../models/productImageModel.js";

import pool from "../config/db.js";

export const uploadProductImage = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const [products] = await pool.query(
      "SELECT id FROM products WHERE id = ? LIMIT 1",
      [productId]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const [countRows] = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM product_images
      WHERE product_id = ?
      `,
      [productId]
    );

    const isFirstImage = countRows[0].total === 0;

    const imageId = await createProductImage({
      product_id: productId,
      image_url: req.file.path,
      public_id: req.file.filename,
      is_primary: isFirstImage ? 1 : 0,
      sort_order: countRows[0].total,
    });

    return res.status(201).json({
      success: true,
      message: "Product image uploaded successfully",
      image: {
        id: imageId,
        product_id: Number(productId),
        image_url: req.file.path,
        public_id: req.file.filename,
        is_primary: isFirstImage,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to upload product image",
      error: error.message,
    });
  }
};

export const getImages = async (req, res) => {
  try {
    const { productId } = req.params;

    const images = await getProductImages(productId);

    return res.json({
      success: true,
      images,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch product images",
    });
  }
};

export const makePrimaryImage = async (req, res) => {
  try {
    const { productId, imageId } = req.params;

    const image = await getProductImageById(imageId);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    if (image.product_id != productId) {
      return res.status(400).json({
        success: false,
        message: "Image does not belong to this product",
      });
    }

    await setPrimaryImage(imageId, productId);

    return res.json({
      success: true,
      message: "Primary image updated successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update primary image",
    });
  }
};

export const removeProductImage = async (req, res) => {
  try {
    const { imageId } = req.params;

    const image = await getProductImageById(imageId);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: "Image not found",
      });
    }

    if (image.public_id) {
      await cloudinary.uploader.destroy(image.public_id);
    }

    await deleteProductImage(imageId);

    return res.json({
      success: true,
      message: "Product image deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete product image",
    });
  }
};