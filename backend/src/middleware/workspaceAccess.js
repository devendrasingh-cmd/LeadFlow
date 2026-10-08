const mongoose = require("mongoose");
const WorkspaceMember = require("../models/WorkspaceMember");

const requireWorkspaceAccess = async (req, res, next) => {
  try {
    const workspaceId =
      req.params.workspaceId ||
      req.body.workspaceId ||
      req.query.workspaceId;

    if (!workspaceId) {
      return res.status(400).json({
        success: false,
        message: "workspaceId is required"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(workspaceId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid workspaceId"
      });
    }

    const membership = await WorkspaceMember.findOne({
      workspaceId,
      userId: req.userId
    });

    if (!membership) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this workspace"
      });
    }

    req.workspaceId = workspaceId;
    req.workspaceRole = membership.role;

    next();
  } catch (error) {
    console.error("Workspace access error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to verify workspace access"
    });
  }
};

module.exports = requireWorkspaceAccess;
