import {
  getAllCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../models/categoryModel.js";

export const listCategories = async (req, res) => {
  try {
    const categories = await getAllCategories();

    res.json({
      success: true,
      categories,
    });
  } catch (error) {
    console.error("List categories error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};

export const showCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await getCategoryById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({
      success: true,
      category,
    });
  } catch (error) {
    console.error("Get category error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch category",
    });
  }
};

export const storeCategory = async (req, res) => {
  try {
    const {
      name,
      slug,
      description,
      image,
      status,
    } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: "Name and slug are required",
      });
    }

    const existing = await getCategoryBySlug(slug);

    if (existing) {
      return res.status(409).json({
        success: false,
        message: "Category slug already exists",
      });
    }

    const id = await createCategory({
      name,
      slug,
      description,
      image,
      status,
    });

    const category = await getCategoryById(id);

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    console.error("Create category error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create category",
    });
  }
};

export const editCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      slug,
      description,
      image,
      status,
    } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        success: false,
        message: "Name and slug are required",
      });
    }

    const category = await getCategoryById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const existing = await getCategoryBySlug(slug);

    if (existing && existing.id !== Number(id)) {
      return res.status(409).json({
        success: false,
        message: "Category slug already exists",
      });
    }

    await updateCategory(id, {
      name,
      slug,
      description,
      image,
      status,
    });

    const updatedCategory = await getCategoryById(id);

    res.json({
      success: true,
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.error("Update category error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update category",
    });
  }
};

export const removeCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await getCategoryById(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    await deleteCategory(id);

    res.json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    console.error("Delete category error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete category",
    });
  }
};