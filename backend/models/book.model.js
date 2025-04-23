import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
   {
      bookCode: { type: String, unique: true },
      title: { type: String, required: true },
      author: { type: String, required: true },
      category: { type: String, required: true },
      quantity: { type: Number, default: 1 },
      available: { type: Number, default: 1 },
      cost: { type: Number, default: 0 },
      procurementDate: { type: Date, default: Date.now },
   },
   { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);
export default Book;
