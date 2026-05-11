const mongoose =
  require('mongoose');

const userSchema =
  new mongoose.Schema({

    fullName: {

      type: String,

      required: true,

      trim: true,

      maxlength: 100
    },

    email: {

      type: String,

      required: true,

      unique: true,

      lowercase: true,

      trim: true
    },

    passwordHash: {

      type: String,

      required: true
    },

    role: {

      type: String,

      enum: [
        'customer',
        'seller',
        'admin'
      ],

      default:
        'customer'
    },

    phone: {

      type: String,

      default: ''
    },

    avatar: {

      type: String,

      default: ''
    },

    addresses: [

  {

    label: String,

    street: String,

    city: String,

    state: String,

    zipCode: String,

    country: {

      type: String,

      default:
        'Pakistan'
    },

    phone: String,

    isDefault: {

      type: Boolean,

      default: false
    }
  }
],
    isActive: {

      type: Boolean,

      default: true
    },

    isEmailVerified: {

      type: Boolean,

      default: false
    },

    refreshToken: {

      type: String
    },

    // ✅ OTP LOGIN
    otp: {

      type: String,

      default: null
    },

    otpExpiry: {

      type: Date,

      default: null
    },

    // ✅ RESET PASSWORD
    resetPasswordOTP: {

      type: String,

      default: null
    },

    resetPasswordOTPExpiry: {

      type: Date,

      default: null
    }

  }, {

    timestamps: true
  });

userSchema.index({
  email: 1
});

userSchema.index({
  role: 1
});

module.exports =
  mongoose.model(
    'User',
    userSchema
  );