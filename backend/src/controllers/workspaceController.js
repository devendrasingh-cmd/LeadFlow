const Workspace = require("../models/Workspace");

const createWorkspace = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Workspace name is required"
      });
    }

    const cleanName = name.trim();

    const slug =
      cleanName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "") +
      "-" +
      Date.now().toString().slice(-6);

    const workspace = await Workspace.create({
      name: cleanName,
      slug,
      ownerId: req.user._id,
      plan: "FREE"
    });

    return res.status(201).json({
      success: true,
      message: "Workspace created successfully",
      workspace
    });

  } catch (error) {
    console.error("Create workspace error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create workspace"
    });
  }
};

const getWorkspace = async (req, res) => {
  try {
    const workspace = await Workspace.findOne({
      ownerId: req.user._id
    }).sort({ createdAt: -1 });

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found"
      });
    }

    return res.status(200).json({
      success: true,
      workspace
    });

  } catch (error) {
    console.error("Get workspace error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load workspace"
    });
  }
};

module.exports = {
  createWorkspace,
  getWorkspace
};
