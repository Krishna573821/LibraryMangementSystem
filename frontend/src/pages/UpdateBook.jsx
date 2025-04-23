import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const UpdateBook = () => {
  const [mediaType, setMediaType] = useState('book');

  const [bookCode, setBookCode] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    quantity: 1,
    available: 1,
    procurementDate: '',
    authorName: '', 
    status: 'available',
    cost: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ['quantity', 'available', 'cost'].includes(name) ? Number(value) : value,
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      if (mediaType === 'book') {
        const response = await axios.patch(
          `http://localhost:5000/api/books/${bookCode}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success('Book updated successfully!');
        console.log(response.data);
      } else {
        const response = await axios.patch(
          `http://localhost:5000/api/movies`,
          {
            title: formData.title,
            authorName: formData.authorName,
            category: formData.category,
            status: formData.status,
            cost: formData.cost,
            procurementDate: formData.procurementDate,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success('Movie updated successfully!');
        console.log(response.data);
      }
    } catch (error) {
      toast.error('Failed to update. Please try again later.');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Update {mediaType === 'book' ? 'Book' : 'Movie'}</h2>

      <div>
        <label>
          <input
            type="radio"
            value="book"
            checked={mediaType === 'book'}
            onChange={() => setMediaType('book')}
          />
          Book
        </label>
        <label>
          <input
            type="radio"
            value="movie"
            checked={mediaType === 'movie'}
            onChange={() => setMediaType('movie')}
          />
          Movie
        </label>
      </div>

      <form onSubmit={handleUpdate}>
        {mediaType === 'book' && (
          <div>
            <label>Book Code:</label>
            <input
              type="text"
              value={bookCode}
              onChange={(e) => setBookCode(e.target.value)}
              required
            />
          </div>
        )}

        <div>
          <label>Title:</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>

        {mediaType === 'book' ? (
          <>
            <div>
              <label>Author:</label>
              <input
                type="text"
                name="author"
                value={formData.author}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Category:</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Quantity:</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Available:</label>
              <input
                type="number"
                name="available"
                value={formData.available}
                onChange={handleChange}
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label>Author Name:</label>
              <input
                type="text"
                name="authorName"
                value={formData.authorName}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Category:</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Status:</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="available">Available</option>
                <option value="not available">Not Available</option>
              </select>
            </div>

            <div>
              <label>Cost:</label>
              <input
                type="number"
                name="cost"
                value={formData.cost}
                onChange={handleChange}
              />
            </div>
          </>
        )}

        <div>
          <label>Procurement Date:</label>
          <input
            type="date"
            name="procurementDate"
            value={formData.procurementDate}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UpdateBook;
