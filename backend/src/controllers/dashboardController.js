const Lead = require("../models/Lead");
const Workspace = require("../models/Workspace");

const getDashboard = async (req, res) => {
  try {
    const workspace = await Workspace.findOne({
      ownerId: req.user._id
    }).lean();

    if (!workspace) {
      return res.status(404).json({
        success: false,
        message: "Workspace not found"
      });
    }

    const workspaceId = workspace._id;

    const [
      totalLeads,
      newLeads,
      contactedLeads,
      qualifiedLeads,
      proposalLeads,
      wonLeads,
      lostLeads,
      pipelineResult,
      recentLeads
    ] = await Promise.all([
      Lead.countDocuments({ workspaceId }),
      Lead.countDocuments({ workspaceId, status: "New" }),
      Lead.countDocuments({ workspaceId, status: "Contacted" }),
      Lead.countDocuments({ workspaceId, status: "Qualified" }),
      Lead.countDocuments({ workspaceId, status: "Proposal" }),
      Lead.countDocuments({ workspaceId, status: "Won" }),
      Lead.countDocuments({ workspaceId, status: "Lost" }),

      Lead.aggregate([
        {
          $match: {
            workspaceId
          }
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: {
                $ifNull: ["$value", 0]
              }
            }
          }
        }
      ]),

      Lead.find({ workspaceId })
        .sort({ createdAt: -1 })
        .limit(6)
        .select("name email company status value source createdAt")
        .lean()
    ]);

    const pipelineValue =
      pipelineResult.length > 0
        ? pipelineResult[0].total
        : 0;

    const conversionRate =
      totalLeads > 0
        ? Number(((wonLeads / totalLeads) * 100).toFixed(1))
        : 0;

    return res.status(200).json({
      success: true,
      data: {
        workspace: {
          id: workspace._id,
          name: workspace.name,
          plan: workspace.plan
        },

        stats: {
          totalLeads,
          newLeads,
          contactedLeads,
          qualifiedLeads,
          proposalLeads,
          wonLeads,
          lostLeads,
          pipelineValue,
          conversionRate
        },

        recentLeads
      }
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to load dashboard"
    });
  }
};

module.exports = {
  getDashboard
};
