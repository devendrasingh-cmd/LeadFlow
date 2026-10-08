const User = require("../models/User");

const getMe = async (req, res) => {
  const user = await User.findById(req.userId).select("-password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
      code: "USER_NOT_FOUND"
    });
  }

  return res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    }
  });
};

module.exports = {
  getMe
};
