const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authenticate = async (req, res, next) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing",
        code: "AUTH_REQUIRED"
      });
    }

    if (!authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization format",
        code: "INVALID_AUTH_FORMAT"
      });
    }

    const token = authorization.slice(7).trim();

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token missing",
        code: "TOKEN_MISSING"
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
        code: "INVALID_TOKEN"
      });
    }

    const user = await User.findById(decoded.userId)
      .select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account not found",
        code: "USER_NOT_FOUND"
      });
    }

    req.user = user;
    req.userId = user._id.toString();

    next();

  } catch (error) {
    console.error(
      "Authentication middleware error:",
      error.message
    );

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
      code: "INVALID_TOKEN"
    });
  }
};

module.exports = authenticate;
