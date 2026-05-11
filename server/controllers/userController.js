const bcrypt = require('bcryptjs');
const User = require('../models/User');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');

const updateProfile = async (req, res, next) => {
  try {
    const { fullName, phone, avatar } = req.body;

    const updateData = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (phone !== undefined) updateData.phone = phone;
    if (avatar !== undefined) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-passwordHash -refreshToken');

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    return ApiResponse.success(res, { user }, 'Profile updated successfully');
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw ApiError.badRequest('Current password and new password are required');
    }

    if (newPassword.length < 6) {
      throw ApiError.badRequest('New password must be at least 6 characters long');
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      throw ApiError.unauthorized('Current password is incorrect');
    }

    user.passwordHash = await bcrypt.hash(newPassword, 12);
    await user.save();

    return ApiResponse.success(res, {}, 'Password changed successfully');
  } catch (error) {
    next(error);
  }
};

const addAddress = async (req, res, next) => {
  try {
    // ✅ FIX: added phone
    const { label, street, city, state, zipCode, country, phone, isDefault } = req.body;

    // ✅ FIX: added phone validation
    if (!label || !street || !city || !state || !zipCode || !phone) {
      throw ApiError.badRequest('Label, street, city, state, zip code, and phone are required');
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    if (isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    user.addresses.push({
      label,
      street,
      city,
      state,
      zipCode,
      country: country || 'Pakistan',
      phone, // ✅ FIX: added phone here
      isDefault: isDefault || false
    });

    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.passwordHash;
    delete updatedUser.refreshToken;

    return ApiResponse.created(res, { addresses: updatedUser.addresses }, 'Address added successfully');
  } catch (error) {
    next(error);
  }
};

const updateAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;

    // ✅ FIX: added phone
    const { label, street, city, state, zipCode, country, phone, isDefault } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      throw ApiError.notFound('Address not found');
    }

    if (isDefault) {
      user.addresses.forEach((addr) => {
        addr.isDefault = false;
      });
    }

    if (label !== undefined) address.label = label;
    if (street !== undefined) address.street = street;
    if (city !== undefined) address.city = city;
    if (state !== undefined) address.state = state;
    if (zipCode !== undefined) address.zipCode = zipCode;
    if (country !== undefined) address.country = country;

    // ✅ FIX: update phone
    if (phone !== undefined) address.phone = phone;

    if (isDefault !== undefined) address.isDefault = isDefault;

    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.passwordHash;
    delete updatedUser.refreshToken;

    return ApiResponse.success(res, { addresses: updatedUser.addresses }, 'Address updated successfully');
  } catch (error) {
    next(error);
  }
};

const deleteAddress = async (req, res, next) => {
  try {
    const { addressId } = req.params;

    const user = await User.findById(req.user._id);
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      throw ApiError.notFound('Address not found');
    }

    user.addresses.pull(addressId);
    await user.save();

    const updatedUser = user.toObject();
    delete updatedUser.passwordHash;
    delete updatedUser.refreshToken;

    return ApiResponse.success(res, { addresses: updatedUser.addresses }, 'Address deleted successfully');
  } catch (error) {
    next(error);
  }
};

// ✅ FIX: THIS FUNCTION WAS MISSING
const getAddresses = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      throw ApiError.notFound('User not found');
    }

    return ApiResponse.success(
      res,
      { addresses: user.addresses || [] },
      'Addresses fetched successfully'
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  updateProfile,
  changePassword,
  addAddress,
  updateAddress,
  deleteAddress,
  getAddresses // ✅ FIX
};