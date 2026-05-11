class ApiResponse {
  static success(res, data = {}, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      ...data
    });
  }

  static created(res, data = {}, message = 'Created successfully') {
    return ApiResponse.success(res, data, message, 201);
  }

  static error(res, statusCode = 500, message = 'Internal server error', errors = []) {
    return res.status(statusCode).json({
      success: false,
      message,
      errors
    });
  }
}

module.exports = ApiResponse;
