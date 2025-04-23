import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
   userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
   },
   membershipId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Membership",
      required: true,
    },
   bookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
   },
   issueDate: {
      type: Date,
      default: Date.now,
   },
   dueDate: Date,
   returnDate: Date,
   fine: {
      type: Number,
      default: 0,
   },
   status: {
      type: String,
      enum: ["requested", "issued", "returned", "overdue"],
      default: "requested",
   },
});

//pre-save middleware to calculate dueDate
transactionSchema.pre("save", function (next) {
   if (!this.dueDate) {
      const issue = this.issueDate || new Date();
      this.dueDate = new Date(issue.getTime() + 15 * 24 * 60 * 60 * 1000);
   }
   next();
});

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
