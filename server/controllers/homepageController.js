import {
  getHomepageFeatures,
  getAllHomepageFeatures,
  getHomepageFeatureById,
  createHomepageFeature,
  updateHomepageFeature,
  deleteHomepageFeature,
} from "../models/homepageModel.js";


/*
|--------------------------------------------------------------------------
| CUSTOMER - GET ACTIVE HOMEPAGE FEATURES
|--------------------------------------------------------------------------
*/

export const getPublicHomepageFeatures = async (req, res) => {
  try {
    const features = await getHomepageFeatures();

    return res.json({
      success: true,
      features,
    });
  } catch (error) {
    console.error(
      "Get Homepage Features Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to get homepage features",
    });
  }
};


/*
|--------------------------------------------------------------------------
| ADMIN - GET ALL HOMEPAGE FEATURES
|--------------------------------------------------------------------------
*/

export const getAdminHomepageFeatures = async (req, res) => {
  try {
    const features = await getAllHomepageFeatures();

    return res.json({
      success: true,
      features,
    });
  } catch (error) {
    console.error(
      "Get Admin Homepage Features Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to get homepage features",
    });
  }
};


/*
|--------------------------------------------------------------------------
| ADMIN - GET SINGLE FEATURE
|--------------------------------------------------------------------------
*/

export const getAdminHomepageFeature = async (req, res) => {
  try {
    const feature = await getHomepageFeatureById(
      req.params.id
    );

    if (!feature) {
      return res.status(404).json({
        success: false,
        message: "Homepage feature not found",
      });
    }

    return res.json({
      success: true,
      feature,
    });
  } catch (error) {
    console.error(
      "Get Admin Homepage Feature Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to get homepage feature",
    });
  }
};


/*
|--------------------------------------------------------------------------
| ADMIN - CREATE FEATURE
|--------------------------------------------------------------------------
*/

export const createAdminHomepageFeature = async (
  req,
  res
) => {
  try {
    const {
      icon,
      title,
      description,
      sort_order,
      status,
    } = req.body;

    if (!icon || !title) {
      return res.status(400).json({
        success: false,
        message: "Icon and title are required",
      });
    }

    const featureId =
      await createHomepageFeature({
        icon: String(icon).trim(),
        title: String(title).trim(),
        description:
          description
            ? String(description).trim()
            : null,
        sort_order:
          sort_order !== undefined
            ? Number(sort_order)
            : 0,
        status:
          status === "inactive"
            ? "inactive"
            : "active",
      });

    const feature =
      await getHomepageFeatureById(featureId);

    return res.status(201).json({
      success: true,
      message: "Homepage feature created successfully",
      feature,
    });
  } catch (error) {
    console.error(
      "Create Homepage Feature Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to create homepage feature",
    });
  }
};


/*
|--------------------------------------------------------------------------
| ADMIN - UPDATE FEATURE
|--------------------------------------------------------------------------
*/

export const updateAdminHomepageFeature = async (
  req,
  res
) => {
  try {
    const featureId = req.params.id;

    const existingFeature =
      await getHomepageFeatureById(featureId);

    if (!existingFeature) {
      return res.status(404).json({
        success: false,
        message: "Homepage feature not found",
      });
    }

    const {
      icon,
      title,
      description,
      sort_order,
      status,
    } = req.body;

    if (!icon || !title) {
      return res.status(400).json({
        success: false,
        message: "Icon and title are required",
      });
    }

    if (
      status &&
      !["active", "inactive"].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Status must be active or inactive",
      });
    }

    await updateHomepageFeature(
      featureId,
      {
        icon: String(icon).trim(),
        title: String(title).trim(),
        description:
          description
            ? String(description).trim()
            : null,
        sort_order:
          sort_order !== undefined
            ? Number(sort_order)
            : existingFeature.sort_order,
        status:
          status || existingFeature.status,
      }
    );

    const feature =
      await getHomepageFeatureById(featureId);

    return res.json({
      success: true,
      message: "Homepage feature updated successfully",
      feature,
    });
  } catch (error) {
    console.error(
      "Update Homepage Feature Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to update homepage feature",
    });
  }
};


/*
|--------------------------------------------------------------------------
| ADMIN - DELETE FEATURE
|--------------------------------------------------------------------------
*/

export const deleteAdminHomepageFeature = async (
  req,
  res
) => {
  try {
    const featureId = req.params.id;

    const existingFeature =
      await getHomepageFeatureById(featureId);

    if (!existingFeature) {
      return res.status(404).json({
        success: false,
        message: "Homepage feature not found",
      });
    }

    await deleteHomepageFeature(featureId);

    return res.json({
      success: true,
      message: "Homepage feature deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Homepage Feature Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to delete homepage feature",
    });
  }
};