import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const ReturnBook = () => {
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [returnDate, setReturnDate] = useState('');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser?._id) {
      fetchIssuedBooks(storedUser._id);
    }

    const today = new Date().toISOString().split('T')[0];
    setReturnDate(today);
  }, []);

  const fetchIssuedBooks = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/transactions/issued-books/${userId}`);
      setIssuedBooks(res.data?.data || []);
    } catch (error) {
      console.error('Error fetching issued books:', error.message);
    }
  };

  const handleSelectBook = (e) => {
    const transactionId = e.target.value;
    const foundTransaction = issuedBooks.find((entry) => entry._id === transactionId);
    setSelectedBook(foundTransaction || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBook) return toast.error('Please select a book to return.');

    try {
      const res = await axios.put(
        `http://localhost:5000/api/transactions/return/${selectedBook._id}`,
        {
          remarks,
          returnDate,
        }
      );
      toast.success('Book returned successfully!');
      setSelectedBook(null);
      setRemarks('');
      fetchIssuedBooks(selectedBook.userId); 
    } catch (err) {
      console.error('Error returning book:', err.message);
      toast.error('Failed to return the book. Please try again later.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h2>Return Book</h2>

      <label>Enter Book Name:</label>
      <select onChange={handleSelectBook} required>
        <option value="">Select a book</option>
        {issuedBooks.map((entry) => (
          <option key={entry._id} value={entry._id}>
            {entry.bookId?.title}
          </option>
        ))}
      </select>

      <div style={{ marginTop: 10 }}>
        <label>Enter Author:</label>
        <input type="text" value={selectedBook?.bookId?.author || ''} disabled />
      </div>

      <div style={{ marginTop: 10 }}>
        <label>Serial No:</label>
        <select value={selectedBook?.serialNo || ''} disabled required>
          <option value={selectedBook?.serialNo}>{selectedBook?.serialNo}</option>
        </select>
      </div>

      <div style={{ marginTop: 10 }}>
        <label>Issue Date:</label>
        <input
          type="date"
          value={selectedBook?.issueDate?.split('T')[0] || ''}
          disabled
        />
      </div>

      <div style={{ marginTop: 10 }}>
        <label>Return Date:</label>
        <input
          type="date"
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
          required
        />
      </div>

      <div style={{ marginTop: 10 }}>
        <label>Remarks:</label>
        <textarea
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
          placeholder="Optional"
          rows={3}
          style={{ width: '100%' }}
        />
      </div>

      <button type="submit" style={{ marginTop: 15 }}>
        Return
      </button>
    </form>
  );
};

export default ReturnBook;
