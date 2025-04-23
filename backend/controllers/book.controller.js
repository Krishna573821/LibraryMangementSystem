import Book from "../models/book.model.js";

// Add a new book
export const addBook = async (req, res) => {
  try {
    const newBook = new Book(req.body);
    const savedBook = await newBook.save();
    res.status(201).json({message:"Book created successfully",data: savedBook});
  } catch (error) {
    res.status(400).json({ message: "Failed to add book", error: error.message });
    console.log("Error in the addBook controller:", error.meessage);
  }
};

// Update an existing book
export const updateBook = async (req, res) => {
  const { bookCode } = req.params;
  const {
    title,
    author,
    category,
    quantity,
    available,
    procurementDate,
  } = req.body;

  try {
    const book = await Book.findOne({ bookCode });

    if (!book) {
      return res.status(404).json({ message: "Book not found with the provided bookCode" });
    }

    if (title) book.title = title;
    if (author) book.author = author;
    if (category) book.category = category;
    if (quantity !== undefined) book.quantity = quantity;
    if (available !== undefined) book.available = available;
    if (procurementDate) book.procurementDate = new Date(procurementDate);

    const updatedBook = await book.save();

    res.status(200).json({ message: "Book Updated Successfully", data: updatedBook });
  } catch (error) {
    console.error("Error in the updateBook controller:", error.message);
    res.status(400).json({ message: "Failed to update book", error: error.message });
  }
};


// Get all books
export const getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    if (!books || books.length === 0) {
      return res.status(404).json({ message: "No books found" });
    }
    const status = books.map((book) => {
      if (book.available > 0) {
        return "Available";
      } else {
        return "Not Available";
      }
    });
    const booksWithStatus = books.map((book, index) => ({
      ...book.toObject(),
      status: status[index],
    }));
    
    res.status(200).json({message:"Books fetched successfully",data: booksWithStatus});
  } catch (error) {
    res.status(400).json({ message: "Failed to fetch books", error });
    console.log("Error in the getAllBooks controller:", error.meessage);
    
  }
};


// Get a book by ID
export const getBookById = async (req, res) => {
  const { bookId } = req.params;
  try {
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found with the provided bookCode" });
    }
    res.status(200).json({ message: "Book fetched successfully", data: book });
  } catch (error) { 
    res.status(400).json({ message: "Failed to fetch book", error });
    console.log("Error in the getBookById controller:", error.meessage);
   }
}
