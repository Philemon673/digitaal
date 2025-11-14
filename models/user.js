import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // Store Clerk's user ID safely (not as _id)
    clerkId: {
      type: String,
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    imageUrl: {
      type: String,
      default: "",
    },

    cartItem: {
      type: Object,
      default: {},
    },

    role: {
      type: String,
      enum: ["buyer", "seller", "admin"],
      default: "buyer",
    },
  },
  {
    minimize: false,
    timestamps: true,
  }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
