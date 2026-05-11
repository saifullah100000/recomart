const express =
  require('express');

const router =
  express.Router();

const {
  auth
} = require(
  '../middleware/auth'
);

const validate =
  require(
    '../middleware/validate'
  );

const {
  authValidators
} = require(
  '../utils/validators'
);

const authController =
  require(
    '../controllers/authController'
);

// NORMAL AUTH
router.post(

  '/register',

  authValidators.register,

  validate,

  authController.register
);

router.post(

  '/login',

  authValidators.login,

  validate,

  authController.login
);

router.post(

  '/refresh-token',

  authValidators.refreshToken,

  validate,

  authController.refreshToken
);

router.post(

  '/logout',

  auth,

  authController.logout
);

router.get(

  '/me',

  auth,

  authController.getMe
);

// ✅ OTP LOGIN
router.post(

  '/send-login-otp',

  authController.sendLoginOTP
);

router.post(

  '/verify-login-otp',

  authController.verifyLoginOTP
);

// ✅ RESET PASSWORD
router.post(

  '/send-reset-otp',

  authController.sendResetOTP
);

router.post(

  '/reset-password',

  authController.resetPassword
);

module.exports =
  router;