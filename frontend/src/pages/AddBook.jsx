import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddBook = () => {
  const navigate = useNavigate();
  const [type, setType] = useState('book');

  const [bookForm, setBookForm] = useState({
    bookCode: '',
    title: '',
    author: '',
    category: '',
    quantity: 1,
    available: 1,
    cost: 0,
    procurementDate: '',
  });

  const [movieForm, setMovieForm] = useState({
    title: '',
    authorName: '',
    category: '',
    status: 'available',
    cost: 1,
    procurementDate: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (type === 'book') {
      setBookForm((prev) => ({
        ...prev,
        [name]: name === 'quantity' || name === 'available' ? Number(value) : value,
      }));
    } else {
      setMovieForm((prev) => ({
        ...prev,
        [name]: name === 'cost' ? Number(value) : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = type === 'book' ? 'http://localhost:5000/api/books' : 'http://localhost:5000/api/movies';
      const data = type === 'book' ? bookForm : movieForm;

      const response = await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success(`${type === 'book' ? 'Book' : 'Movie'} added successfully!`);
      
      console.log(response.data);
      navigate('/adminDashboard');
    } catch (error) {
      toast.error('Failed to add item');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Add New {type === 'book' ? 'Book' : 'Movie'}</h2>

      <div style={{ marginBottom: 20 }}>
        <label>
          <input
            type="radio"
            value="book"
            checked={type === 'book'}
            onChange={() => setType('book')}
          />
          Book
        </label>
        <label style={{ marginLeft: 10 }}>
          <input
            type="radio"
            value="movie"
            checked={type === 'movie'}
            onChange={() => setType('movie')}
          />
          Movie
        </label>
      </div>

      <form onSubmit={handleSubmit}>
        {type === 'book' ? (
          <>
            <div>
              <label>Book Code:</label>
              <input
                type="text"
                name="bookCode"
                value={bookForm.bookCode}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Title:</label>
              <input
                type="text"
                name="title"
                value={bookForm.title}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Author:</label>
              <input
                type="text"
                name="author"
                value={bookForm.author}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Category:</label>
              <input
                type="text"
                name="category"
                value={bookForm.category}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Quantity:</label>
              <input
                type="number"
                name="quantity"
                value={bookForm.quantity}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Available:</label>
              <input
                type="number"
                name="available"
                value={bookForm.available}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Cost:</label>
              <input
                type="number"
                name="cost"
                value={bookForm.cost}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Procurement Date:</label>
              <input
                type="date"
                name="procurementDate"
                value={bookForm.procurementDate}
                onChange={handleChange}
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label>Title:</label>
              <input
                type="text"
                name="title"
                value={movieForm.title}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Author Name:</label>
              <input
                type="text"
                name="authorName"
                value={movieForm.authorName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Category:</label>
              <input
                type="text"
                name="category"
                value={movieForm.category}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Status:</label>
              <select name="status" value={movieForm.status} onChange={handleChange}>
                <option value="available">Available</option>
                <option value="not available">Not Available</option>
              </select>
            </div>

            <div>
              <label>Cost:</label>
              <input
                type="number"
                name="cost"
                value={movieForm.cost}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Procurement Date:</label>
              <input
                type="date"
                name="procurementDate"
                value={movieForm.procurementDate}
                onChange={handleChange}
              />
            </div>
          </>
        )}

        <button type="submit">Add {type === 'book' ? 'Book' : 'Movie'}</button>
      </form>
    </div>
  );
};

export default AddBook;
