import Transaction from "../models/transaction.model.js";
import Membership from '../models/membership.model.js';
import Book from '../models/book.model.js';
import User from "../models/user.model.js";
import mongoose from "mongoose";


// Get all currently issued books (not yet returned)
export const getIssuedBooks = async (req, res) => {
  try {
    const issued = await Transaction.find({ status: 'issued' })
      .populate('bookId')
      .populate('userId')
      .lean();

    res.status(200).json({ data: issued });
  } catch (error) {
    console.error('Error fetching issued books:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all books issued by a specific user
export const getIssuedBooksByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const transactions = await Transaction.find({
      userId: new mongoose.Types.ObjectId(userId),
      status: 'issued',
    })
      .populate('bookId')
      .lean();

    const membership = await Membership.findOne({ userId });

    const enrichedTransactions = transactions.map(tx => ({
      ...tx,
      membershipId: membership ? membership._id : null,
    }));

    res.status(200).json({ data: enrichedTransactions });
  } catch (error) {
    console.error('Error fetching issued books:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



// Get all overdue returns
export const getOverdueReturns = async (req, res) => {
  try {
    const overdueTransactions = await Transaction.find({
      status: 'overdue', // you should check for overdue status and if the book is not returned
      returnDate: { $exists: false } // Ensuring the book hasn't been returned yet
    })
      .populate('bookId', 'title') // Book title population
      .populate('userId', 'membershipId') // Populate membership ID of user
      .lean();

    const results = [];

    for (let i = 0; i < overdueTransactions.length; i++) {
      const tx = overdueTransactions[i];

      // Calculate fine
      const today = new Date();
      const daysLate = Math.floor((today - new Date(tx.dueDate)) / (1000 * 60 * 60 * 24)); // Days overdue
      const fine = daysLate > 0 ? daysLate * 100 : 0; // Fine calculation

      // Push result in the array
      results.push({
        serialNo: i + 1, // Serial number starts from 1
        book: tx.bookId.title, // Book name
        membershipId: tx.userId.membershipId || 'N/A', // Membership ID
        dateOfIssue: new Date(tx.issueDate).toLocaleDateString(), // Issue Date
        dateOfReturn: tx.returnDate ? new Date(tx.returnDate).toLocaleDateString() : 'Not Returned', // Return Date
        fine: fine // Fine calculation
      });
    }

    res.status(200).json(results); // Return the results
  } catch (error) {
    console.error('Error fetching overdue returns:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Get overdue of a specific user
export const getUserOverdueBooks = async (req, res) => {
  try {
    const { userId } = req.params;

    const today = new Date();
    const overdue = await Transaction.find({
      userId,
      status: 'issued', // Filter by issued status
      dueDate: { $lt: today }, // Filter for overdue items
      returnDate: { $exists: false } // Ensure that the book hasn't been returned
    })
      .populate('bookId', 'title') // Populate book title
      .lean();

    const results = overdue.map((tx, index) => {
      const daysLate = Math.floor((today - new Date(tx.dueDate)) / (1000 * 60 * 60 * 24)); // Days overdue
      const fine = daysLate > 0 ? daysLate * 100 : 0; // Fine calculation

      return {
        serialNo: index + 1,
        book: tx.bookId.title,
        membershipId: tx.userId.membershipId || 'N/A', // Membership ID
        dateOfIssue: new Date(tx.issueDate).toLocaleDateString(), // Issue Date
        dateOfReturn: 'Not Returned', // Since it's overdue, the return date is not available
        fine: fine // Fine calculation
      };
    });

    res.status(200).json({ overdue: results }); // Send the results as response
  } catch (error) {
    console.error('Error fetching user overdue books:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



// Get all pending issue requests
export const getPendingIssueRequests = async (req, res) => {
  try {
    const pendingRequests = await Transaction.find({ status: 'requested' })
      .populate('bookId', 'title')
      .lean();

    const results = [];

    for (let i = 0; i < pendingRequests.length; i++) {
      const tx = pendingRequests[i];
      const membership = await Membership.findOne({ userId: tx.userId });

      let title = tx.bookId?.title || tx.movieId?.title || 'N/A';

      results.push({
        serialNo: i + 1,
        membershipId: membership ? membership._id : 'N/A',
        title,
        requestedDate: tx.issueDate,
        fulfilledDate: tx.status === 'issued' ? tx.issueDate : null
      });
    }

    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching pending issue requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

//get pending issue requests by user
export const getUserPendingRequests = async (req, res) => {
  try {
    const { userId } = req.params;

    const pending = await Transaction.find({
      userId,
      status: 'requested',
    })
      .populate('bookId', 'title')
      .lean();

    res.status(200).json({ pending });
  } catch (error) {
    console.error('Error fetching user pending requests:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Issue a book
export const issueBook = async (req, res) => {
  try {
    const { id } = req.params; 
    const { userId } = req.body;

    // Fetch the user and extract membershipId from the user data
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const membershipId = user.membershipId; // Assuming user has a membershipId field

    // Check if book exists
    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    let status = 'issued';

    // If the book is not available, mark it as 'requested'
    if (book.available <= 0) {
      status = 'requested';
    }

    // Create the transaction with membershipId
    const transaction = new Transaction({
      userId,
      bookId: id,
      membershipId, // Include membershipId here
      status
    });

    await transaction.save();

    // Decrease available count only if issued
    if (status === 'issued') {
      book.available -= 1;
      await book.save();
    }

    res.status(201).json({
      message:
        status === 'issued'
          ? 'Book issued successfully'
          : 'Book is unavailable, added to request queue',
      transaction
    });
  } catch (error) {
    console.error('Error issuing book:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Return a book
export const returnBook = async (req, res) => {
  try {
    const { transactionId } = req.params; 
    const transaction = await Transaction.findById(transactionId)
      .populate('bookId');

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    if (transaction.status === 'returned') {
      return res.status(400).json({ message: 'Book already returned' });
    }

    // Calculate fine if the book is overdue
    const today = new Date();
    const daysLate = Math.floor(
      (today - new Date(transaction.dueDate)) / (1000 * 60 * 60 * 24)
    );
    const fine = daysLate > 0 ? daysLate * 100 : 0; // 100 Rs per day after due date

    // Set return date, fine, and update status
    transaction.status = 'returned';
    transaction.returnDate = today;
    transaction.fine = fine;

    // Save transaction with updated status and fine
    await transaction.save();

    // Increase the available quantity of the book
    const book = await Book.findById(transaction.bookId._id);
    if (book) {
      book.available += 1;
      await book.save();
    }

    res.status(200).json({ message: 'Book returned successfully', transaction });
  } catch (error) {
    console.error('Error returning book:', error);
    res.status(500).json({ message: 'Server error' });
  }
};