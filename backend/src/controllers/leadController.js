const Lead = require("../models/Lead");
const Workspace = require("../models/Workspace");

const getOwnerWorkspace = async (userId) => {
  return Workspace.findOne({
    ownerId: userId
  });
};

const createLead = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      company,
      source,
      status,
      value,
      notes,
      assignedTo
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Lead name is required"
      });
    }

    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: "Lead email is required"
      });
    }

    const workspace = await getOwnerWorkspace(req.user._id);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found"
      });
    }

    const lead = await Lead.create({
      workspaceId: workspace._id,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || "",
      company: company?.trim() || "",
      source: source || "Other",
      status: status || "New",
      value: Number(value) || 0,
      notes: notes?.trim() || "",
      assignedTo: assignedTo || null,
      createdBy: req.user._id
    });

    return res.status(201).json({
      success: true,
      message: "Lead created successfully",
      lead
    });
  } catch (error) {
    console.error("Create lead error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to create lead"
    });
  }
};

const getLeads = async (req, res) => {
  try {
    const workspace = await getOwnerWorkspace(req.user._id);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found"
      });
    }

    const {
      search = "",
      status = ""
    } = req.query;

    const query = {
      workspaceId: workspace._id
    };

    if (status) {
      query.status = status;
    }

    if (search.trim()) {
      const searchRegex = new RegExp(
        search.trim(),
        "i"
      );

      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { company: searchRegex }
      ];
    }

    const leads = await Lead.find(query)
      .populate(
        "assignedTo",
        "name email"
      )
      .sort({
        createdAt: -1
      })
      .lean();

    return res.status(200).json({
      success: true,
      count: leads.length,
      leads
    });
  } catch (error) {
    console.error("Get leads error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load leads"
    });
  }
};

const getLead = async (req, res) => {
  try {
    const workspace = await getOwnerWorkspace(req.user._id);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found"
      });
    }

    const lead = await Lead.findOne({
      _id: req.params.id,
      workspaceId: workspace._id
    })
      .populate(
        "assignedTo",
        "name email"
      )
      .lean();

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found"
      });
    }

    return res.status(200).json({
      success: true,
      lead
    });
  } catch (error) {
    console.error("Get lead error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load lead"
    });
  }
};

const updateLead = async (req, res) => {
  try {
    const workspace = await getOwnerWorkspace(req.user._id);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found"
      });
    }

    const allowedFields = [
      "name",
      "email",
      "phone",
      "company",
      "source",
      "status",
      "value",
      "notes",
      "assignedTo"
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] =
          field === "value"
            ? Number(req.body[field]) || 0
            : req.body[field];
      }
    }

    if (updates.name !== undefined) {
      updates.name = updates.name.trim();
    }

    if (updates.email !== undefined) {
      updates.email = updates.email
        .trim()
        .toLowerCase();
    }

    const lead = await Lead.findOneAndUpdate(
      {
        _id: req.params.id,
        workspaceId: workspace._id
      },
      updates,
      {
        new: true,
        runValidators: true
      }
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lead updated successfully",
      lead
    });
  } catch (error) {
    console.error("Update lead error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update lead"
    });
  }
};

const deleteLead = async (req, res) => {
  try {
    const workspace = await getOwnerWorkspace(req.user._id);

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found"
      });
    }

    const lead = await Lead.findOneAndDelete({
      _id: req.params.id,
      workspaceId: workspace._id
    });

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: "Lead not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Lead deleted successfully"
    });
  } catch (error) {
    console.error("Delete lead error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to delete lead"
    });
  }
};

module.exports = {
  createLead,
  getLeads,
  getLead,
  updateLead,
  deleteLead
};
