import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const MasterListMovies = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/movies', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMovies(response.data);
        toast.success('Movies loaded successfully!');
      } catch (error) {
        console.error('Error fetching movies:', error);
        toast.error('Failed to load movies. Please try again later.');
      }
    };

    fetchMovies();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Master List of Movies</h2>
      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Serial No</th>
            <th>Name of Movie</th>
            <th>Author Name</th>
            <th>Category</th>
            <th>Status</th>
            <th>Cost</th>
            <th>Procurement Date</th>
          </tr>
        </thead>
        <tbody>
          {movies.length === 0 ? (
            <tr>
              <td colSpan="7" align="center">No movies found</td>
            </tr>
          ) : (
            movies.map((movie, index) => (
              <tr key={movie._id}>
                <td>{index + 1}</td>
                <td>{movie.title}</td>
                <td>{movie.authorName}</td>
                <td>{movie.category}</td>
                <td>{movie.status}</td>
                <td>{movie.cost}</td>
                <td>{new Date(movie.procurementDate).toLocaleDateString()}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MasterListMovies;
