const express = require("express");

const authenticate = require("../middleware/auth");

const {
  createLead,
  getLeads,
  getLead,
  updateLead,
  deleteLead
} = require("../controllers/leadController");

const router = express.Router();

router.use(authenticate);

router.post("/", createLead);
router.get("/", getLeads);
router.get("/:id", getLead);
router.patch("/:id", updateLead);
router.delete("/:id", deleteLead);

module.exports = router;
