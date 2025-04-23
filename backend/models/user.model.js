import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
   {
      name: { type: String, required: true },
      password: { type: String },
      status: { type: String, enum: ["active", "inactive"], default: "active" },
      userType: { type: String, enum: ["user", "admin"], default: "user" },
      membershipId: { type: mongoose.Schema.Types.ObjectId, ref: "Membership" },
   },
   { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
