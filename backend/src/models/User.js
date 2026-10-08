const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true,
      minlength: 8
    },

    role: {
      type: String,
      enum: ["OWNER", "ADMIN", "AGENT"],
      default: "AGENT"
    },

    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      default: null,
      index: true
    }
  },
  {
    timestamps: true
  }
);

userSchema.index({ workspaceId: 1 });

module.exports = mongoose.model("User", userSchema);
