import {
  createAddress,
  getAddressesByUserId,
  getAddressById,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from "../models/addressModel.js";

export const addAddress = async (req, res) => {
  try {
    const {
      name,
      phone,
      address_line1,
      address_line2,
      city,
      state,
      pincode,
      landmark,
      address_type,
      is_default,
    } = req.body;

    if (
      !name ||
      !phone ||
      !address_line1 ||
      !city ||
      !state ||
      !pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "Name, phone, address, city, state and pincode are required",
      });
    }

    const addressId = await createAddress({
      userId: req.user.id,
      name,
      phone,
      address_line1,
      address_line2,
      city,
      state,
      pincode,
      landmark,
      address_type,
      is_default,
    });

    if (is_default) {
      await setDefaultAddress(addressId, req.user.id);
    }

    const address = await getAddressById(
      addressId,
      req.user.id
    );

    return res.status(201).json({
      success: true,
      message: "Address added successfully",
      address,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyAddresses = async (req, res) => {
  try {
    const addresses = await getAddressesByUserId(
      req.user.id
    );

    return res.json({
      success: true,
      addresses,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSingleAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const address = await getAddressById(
      id,
      req.user.id
    );

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    return res.json({
      success: true,
      address,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const editAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const existingAddress = await getAddressById(
      id,
      req.user.id
    );

    if (!existingAddress) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    const {
      name,
      phone,
      address_line1,
      address_line2,
      city,
      state,
      pincode,
      landmark,
      address_type,
    } = req.body;

    if (
      !name ||
      !phone ||
      !address_line1 ||
      !city ||
      !state ||
      !pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    await updateAddress({
      id,
      userId: req.user.id,
      name,
      phone,
      address_line1,
      address_line2,
      city,
      state,
      pincode,
      landmark,
      address_type,
    });

    const address = await getAddressById(
      id,
      req.user.id
    );

    return res.json({
      success: true,
      message: "Address updated successfully",
      address,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await deleteAddress(
      id,
      req.user.id
    );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    return res.json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const makeDefaultAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const address = await getAddressById(
      id,
      req.user.id
    );

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    await setDefaultAddress(
      id,
      req.user.id
    );

    return res.json({
      success: true,
      message: "Default address updated successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};