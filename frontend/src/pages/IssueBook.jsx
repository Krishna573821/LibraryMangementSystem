import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const IssueBookForm = () => {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [issueDate, setIssueDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [userId, setUserId] = useState('');

  const location = useLocation();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/books');
        setBooks(res.data?.data || []);
      } catch (error) {
        console.error('Error fetching books:', error.message);
      }
    };

    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser?._id) {
      setUserId(storedUser._id);
    }

    const today = new Date().toISOString().split('T')[0];
    const nextWeek = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    setIssueDate(today);
    setReturnDate(nextWeek);

    fetchBooks();
  }, []);

  // Set selected book if passed via location.state
  useEffect(() => {
    if (location.state?.book) {
      setSelectedBook(location.state.book);
    }
  }, [location.state]);

  const handleSelectBook = (e) => {
    const bookId = e.target.value;
    const book = books.find((b) => b._id === bookId);
    setSelectedBook(book);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBook || !userId) return alert('Select a book and make sure user is logged in.');

    try {
      const res = await axios.post(`http://localhost:5000/api/transactions/issue/${selectedBook._id}`, {
        userId,
      });
      toast.success('Book issued successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Error issuing book. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: 'auto', padding: 20 }}>
      <h2>Issue Book</h2>

      <label>Enter Book Name:</label>
      <select onChange={handleSelectBook} value={selectedBook?._id || ''} required>
        <option value="">Select a book</option>
        {books.map((book) => (
          <option key={book._id} value={book._id}>
            {book.title}
          </option>
        ))}
      </select>

      <div style={{ marginTop: 10 }}>
        <label>Enter Author:</label>
        <input type="text" value={selectedBook?.author || ''} disabled />
      </div>

      <div style={{ marginTop: 10 }}>
        <label>Issue Date:</label>
        <input type="date" value={issueDate} disabled />
      </div>

      <div style={{ marginTop: 10 }}>
        <label>Return Date:</label>
        <input type="date" value={returnDate} disabled />
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
        Issue
      </button>
    </form>
  );
};

export default IssueBookForm;
