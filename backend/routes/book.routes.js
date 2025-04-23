import express from "express";
import { addBook, getAllBooks, getBookById, updateBook } from "../controllers/book.controller.js";
import { allowRoles, verifyToken } from "../middlewares/auth.js";

const router = express.Router();

// Route to add a book
router.post("/",verifyToken, allowRoles('admin'), addBook);

// Route to update a book by ID
router.patch("/:bookCode",verifyToken, allowRoles('admin'), updateBook);

// Route to add a book
router.get("/", getAllBooks);

//route to get a book by ID
router.get("/:id", getBookById);

export default router;
