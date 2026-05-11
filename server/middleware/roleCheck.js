const ApiError = require('../utils/apiError');

const roleCheck = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(ApiError.unauthorized('Authentication required'));
    }
    if (!allowedRoles.includes(req.user.role)) {
      return next(ApiError.forbidden('You do not have permission to access this resource'));
    }
    next();
  };
};

module.exports = roleCheck;
