const express = require("express");

const {
  register,
  login
} = require("../controllers/authController");

const {
  getMe
} = require("../controllers/meController");

const authenticate = require("../middleware/auth");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authenticate, getMe);

module.exports = router;
