const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const User = require('../models/User');

const VendorProfile =
  require('../models/VendorProfile');

const ApiError =
  require('../utils/apiError');

const ApiResponse =
  require('../utils/apiResponse');

const emailService =
  require('../services/emailService');

const generateOTP =
  require('../utils/generateOTP');

const generateAccessToken =
  (user) => {

    return jwt.sign(

      {
        userId: user._id,

        role: user.role
      },

      process.env.JWT_SECRET,

      {
        expiresIn:
          process.env.JWT_EXPIRE
      }
    );
  };

const generateRefreshToken =
  (user) => {

    return jwt.sign(

      {
        userId: user._id,

        role: user.role
      },

      process.env.JWT_REFRESH_SECRET,

      {
        expiresIn:
          process.env.JWT_REFRESH_EXPIRE
      }
    );
  };

const register =
  async (
    req,
    res,
    next
  ) => {

    try {

      const {

        fullName,

        email,

        password,

        role,

        phone,

        businessName

      } = req.body;

      if (
        !fullName ||
        !email ||
        !password
      ) {

        throw ApiError.badRequest(

          'Full name, email, and password are required'
        );
      }

      const existingUser =
        await User.findOne({
          email
        });

      if (existingUser) {

        throw ApiError.conflict(

          'A user with this email already exists'
        );
      }

      if (
        role === 'seller' &&
        !businessName
      ) {

        throw ApiError.badRequest(

          'Business name is required for seller registration'
        );
      }

      const passwordHash =
        await bcrypt.hash(
          password,
          12
        );

      const user =
        await User.create({

          fullName,

          email,

          passwordHash,

          role:
            role || 'customer',

          phone:
            phone || ''
        });

      if (
        role === 'seller'
      ) {

        await VendorProfile.create({

          user:
            user._id,

          businessName,

          status:
            'pending'
        });
      }

      const accessToken =
        generateAccessToken(
          user
        );

      const refreshToken =
        generateRefreshToken(
          user
        );

      user.refreshToken =
        refreshToken;

      await user.save();

      emailService.sendWelcomeEmail(

        user.email,

        user.fullName
      );

      const userResponse =
        user.toObject();

      delete userResponse.passwordHash;

      delete userResponse.refreshToken;

      return ApiResponse.created(

        res,

        {
          user:
            userResponse,

          accessToken,

          refreshToken
        },

        'Registration successful'
      );

    } catch (error) {

      next(error);
    }
  };

const login =
  async (
    req,
    res,
    next
  ) => {

    try {

      const {
        email,
        password
      } = req.body;

      if (
        !email ||
        !password
      ) {

        throw ApiError.badRequest(

          'Email and password are required'
        );
      }

      const user =
        await User.findOne({
          email
        });

      if (!user) {

        throw ApiError.unauthorized(

          'Invalid email or password'
        );
      }

      if (
        !user.isActive
      ) {

        throw ApiError.forbidden(

          'Your account has been deactivated'
        );
      }

      const isMatch =
        await bcrypt.compare(

          password,

          user.passwordHash
        );

      if (!isMatch) {

        throw ApiError.unauthorized(

          'Invalid email or password'
        );
      }

      const accessToken =
        generateAccessToken(
          user
        );

      const refreshToken =
        generateRefreshToken(
          user
        );

      user.refreshToken =
        refreshToken;

      await user.save();

      const userResponse =
        user.toObject();

      delete userResponse.passwordHash;

      delete userResponse.refreshToken;

      return ApiResponse.success(

        res,

        {
          user:
            userResponse,

          accessToken,

          refreshToken
        },

        'Login successful'
      );

    } catch (error) {

      next(error);
    }
  };

// ✅ SEND LOGIN OTP
const sendLoginOTP =
  async (
    req,
    res,
    next
  ) => {

    try {

      const { email } =
        req.body;

      const user =
        await User.findOne({
          email
        });

      if (!user) {

        throw ApiError.notFound(
          'User not found'
        );
      }

      const otp =
        generateOTP();

      user.otp = otp;

      user.otpExpiry =
        Date.now() +
        5 * 60 * 1000;

      await user.save();

      await emailService.sendOTPEmail(

        email,

        otp
      );

      return ApiResponse.success(

        res,

        {},

        'OTP sent successfully'
      );

    } catch (error) {

      next(error);
    }
  };

// ✅ VERIFY LOGIN OTP
const verifyLoginOTP =
  async (
    req,
    res,
    next
  ) => {

    try {

      const {
        email,
        otp
      } = req.body;

      const user =
        await User.findOne({
          email
        });

      if (
        !user ||
        user.otp !== otp ||
        user.otpExpiry <
          Date.now()
      ) {

        throw ApiError.badRequest(

          'Invalid or expired OTP'
        );
      }

      user.otp = null;

      user.otpExpiry = null;

      const accessToken =
        generateAccessToken(
          user
        );

      const refreshToken =
        generateRefreshToken(
          user
        );

      user.refreshToken =
        refreshToken;

      await user.save();

      const userResponse =
        user.toObject();

      delete userResponse.passwordHash;

      delete userResponse.refreshToken;

      return ApiResponse.success(

        res,

        {
          user:
            userResponse,

          accessToken,

          refreshToken
        },

        'OTP login successful'
      );

    } catch (error) {

      next(error);
    }
  };

// ✅ SEND RESET OTP
const sendResetOTP =
  async (
    req,
    res,
    next
  ) => {

    try {

      const { email } =
        req.body;

      const user =
        await User.findOne({
          email
        });

      if (!user) {

        throw ApiError.notFound(
          'User not found'
        );
      }

      const otp =
        generateOTP();

      user.resetPasswordOTP =
        otp;

      user.resetPasswordOTPExpiry =
        Date.now() +
        5 * 60 * 1000;

      await user.save();

      await emailService.sendOTPEmail(

        email,

        otp
      );

      return ApiResponse.success(

        res,

        {},

        'Reset OTP sent successfully'
      );

    } catch (error) {

      next(error);
    }
  };

// ✅ RESET PASSWORD
const resetPassword =
  async (
    req,
    res,
    next
  ) => {

    try {

      const {
        email,
        otp,
        newPassword
      } = req.body;

      const user =
        await User.findOne({
          email
        }).select('+passwordHash');

      if (
        !user ||
        user.resetPasswordOTP !== otp ||
        user.resetPasswordOTPExpiry <
          Date.now()
      ) {

        throw ApiError.badRequest(

          'Invalid or expired OTP'
        );
      }

      console.log(
        'OLD HASH:',
        user.passwordHash
      );

      const passwordHash =
        await bcrypt.hash(
          newPassword,
          12
        );

      console.log(
        'NEW HASH:',
        passwordHash
      );

      user.passwordHash =
        passwordHash;

      user.markModified(
        'passwordHash'
      );

      user.resetPasswordOTP =
        null;

      user.resetPasswordOTPExpiry =
        null;

      await user.save();

      console.log(
        'PASSWORD SAVED TO DB'
      );

      const updatedUser =
        await User.findOne({
          email
        }).select('+passwordHash');

      console.log(
        'UPDATED HASH:',
        updatedUser.passwordHash
      );

      return ApiResponse.success(

        res,

        {},

        'Password reset successful'
      );

    } catch (error) {

      next(error);
    }
  };
  const refreshToken =
  async (
    req,
    res,
    next
  ) => {

    try {

      const {
        refreshToken: token
      } = req.body;

      if (!token) {

        throw ApiError.badRequest(

          'Refresh token is required'
        );
      }

      let decoded;

      try {

        decoded =
          jwt.verify(

            token,

            process.env.JWT_REFRESH_SECRET
          );

      } catch (err) {

        throw ApiError.unauthorized(

          'Invalid or expired refresh token'
        );
      }

      const user =
        await User.findById(

          decoded.userId
        );

      if (
        !user ||
        user.refreshToken !== token
      ) {

        throw ApiError.unauthorized(

          'Invalid refresh token'
        );
      }

      const accessToken =
        generateAccessToken(
          user
        );

      return ApiResponse.success(

        res,

        {
          accessToken
        },

        'Token refreshed successfully'
      );

    } catch (error) {

      next(error);
    }
  };

const logout =
  async (
    req,
    res,
    next
  ) => {

    try {

      const user =
        await User.findById(
          req.user._id
        );

      if (!user) {

        throw ApiError.notFound(
          'User not found'
        );
      }

      user.refreshToken =
        undefined;

      await user.save();

      return ApiResponse.success(

        res,

        {},

        'Logged out successfully'
      );

    } catch (error) {

      next(error);
    }
  };

const getMe =
  async (
    req,
    res,
    next
  ) => {

    try {

      const user =
        await User.findById(
          req.user._id
        ).select(

          '-passwordHash -refreshToken'
        );

      if (!user) {

        throw ApiError.notFound(
          'User not found'
        );
      }

      return ApiResponse.success(

        res,

        {
          user
        },

        'User retrieved successfully'
      );

    } catch (error) {

      next(error);
    }
  };

module.exports = {

  register,

  login,

  sendLoginOTP,

  verifyLoginOTP,

  sendResetOTP,

  resetPassword,

  refreshToken,

  logout,

  getMe
};