const express = require("express");

const {
  createWorkspace,
  getWorkspace
} = require("../controllers/workspaceController");

const authenticate = require("../middleware/auth");

const router = express.Router();

router.use(authenticate);

router.get("/", getWorkspace);
router.post("/", createWorkspace);

module.exports = router;
