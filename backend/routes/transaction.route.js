import express from "express";
import { getIssuedBooks, getIssuedBooksByUser, getOverdueReturns, getPendingIssueRequests, getUserOverdueBooks, getUserPendingRequests, issueBook, returnBook } from "../controllers/transaction.controller.js";
import { allowRoles, verifyToken } from "../middlewares/auth.js";

const router = express.Router();

//to get all currently issued books (not yet returned)
router.get('/issued', verifyToken, allowRoles('admin'), getIssuedBooks);

// Route to get all books issued by a user
router.get("/issued-books/:userId", getIssuedBooksByUser);



// Route to get all overdue returns
router.get('/overdue', verifyToken, allowRoles('admin'), getOverdueReturns);

//Route to get overdue books by user
router.get('/overdue/:userId', getUserOverdueBooks);


// get pending issue requests
router.get('/pending-requests', verifyToken, allowRoles('admin'), getPendingIssueRequests);

//get pending requests by user
router.get('/:userId/pending-requests', getUserPendingRequests);

// Issue a book
router.post('/issue/:id', issueBook);

// Route to return a book
router.put('/return/:transactionId', returnBook);

export default router;
