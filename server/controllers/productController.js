import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../models/productModel.js";


export const create = async (req, res) => {
  try {
    const {
      category_id,
      name,
      slug,
      sku,
      description,
      price,
      sale_price,
      stock_quantity,
      unit,
      weight,
      status,
      featured,
    } = req.body;


    if (
      !category_id ||
      !name ||
      !slug ||
      !sku ||
      price === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Category, name, slug, SKU and price are required",
      });
    }


    const productId = await createProduct({
      category_id,
      name,
      slug,
      sku,
      description,
      price,
      sale_price,
      stock_quantity,
      unit,
      weight,
      status,
      featured,
    });


    const product = await getProductById(productId);


    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });

  } catch (error) {

    console.error("Create product error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const getAll = async (req, res) => {
  try {

    const products = await getAllProducts();

    return res.json({
      success: true,
      count: products.length,
      products,
    });

  } catch (error) {

    console.error("Get products error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const getOne = async (req, res) => {
  try {

    const { id } = req.params;

    const product = await getProductById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.json({
      success: true,
      product,
    });

  } catch (error) {

    console.error("Get product error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const update = async (req, res) => {
  try {

    const { id } = req.params;

    const existingProduct = await getProductById(id);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }


    const {
      category_id,
      name,
      slug,
      sku,
      description,
      price,
      sale_price,
      stock_quantity,
      unit,
      weight,
      status,
      featured,
    } = req.body;


    if (
      !category_id ||
      !name ||
      !slug ||
      !sku ||
      price === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Category, name, slug, SKU and price are required",
      });
    }


    const validStatuses = [
      "active",
      "inactive",
      "out_of_stock",
    ];


    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Status must be active, inactive or out_of_stock",
      });
    }


    await updateProduct(id, {
      category_id,
      name,
      slug,
      sku,
      description,
      price,
      sale_price,
      stock_quantity,
      unit,
      weight,
      status,
      featured,
    });


    const product = await getProductById(id);


    return res.json({
      success: true,
      message: "Product updated successfully",
      product,
    });

  } catch (error) {

    console.error("Update product error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const remove = async (req, res) => {
  try {

    const { id } = req.params;

    const existingProduct = await getProductById(id);

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }


    await deleteProduct(id);


    return res.json({
      success: true,
      message: "Product deleted successfully",
    });

  } catch (error) {

    console.error("Delete product error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};