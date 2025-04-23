import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CheckBookAndIssue = () => {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBooks, setFilteredBooks] = useState([]);
  const navigate = useNavigate();

  // Fetch all books on mount
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/books');
        
          setBooks(res.data.data); 
        
      } catch (err) {
        console.error('Error fetching books:', err.message);
      }
    };
    fetchBooks();
  }, []);

  // Handle search query
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    if (!query) {
      setFilteredBooks([]);
    } else {
      const results = books.filter(book =>
        book.title.toLowerCase().includes(query) ||
        (book.author && book.author.toLowerCase().includes(query))
      );
      setFilteredBooks(results);
    }
  }, [searchQuery, books]);

  const handleSelectBook = (bookId) => {
    const selectedBook = books.find((book) => book._id === bookId);
    navigate(`/transactions/issue-book`, { state: { book: selectedBook } });
  };
  

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <h2>Search Book to Issue</h2>
      <input
        type="text"
        placeholder="Search by book name or author..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ width: '100%', padding: '10px', fontSize: '16px' }}
      />
      {filteredBooks.length > 0 && (
        <ul style={{ border: '1px solid #ccc', marginTop: '5px', listStyle: 'none', padding: 0 }}>
          {filteredBooks.map(book => (
            <li
              key={book._id}
              onClick={() => handleSelectBook(book._id)}
              style={{
                padding: '10px',
                cursor: 'pointer',
                borderBottom: '1px solid #eee',
                backgroundColor: '#f9f9f9'
              }}
            >
              <strong>{book.title}</strong> {book.author && `by ${book.author}`}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CheckBookAndIssue;
