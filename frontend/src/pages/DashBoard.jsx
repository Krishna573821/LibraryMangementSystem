import React, { useEffect, useState } from "react";
import axios from "axios";
import "./DashBoard.css"; 
const DashBoard = () => {
  const [books, setBooks] = useState([]);

  // Fetch books data on component mount
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/books", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setBooks(response.data.data); 
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <>
      <div className="admin-dashboard">
        <h1>Dashboard</h1>
        <div className="admin-dashboard-content">
          <h2>Welcome to the Dashboard</h2>

          <h3>Books List</h3>
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Available</th>
                <th>Procurement Date</th>
              </tr>
            </thead>
            <tbody>
              {books.length > 0 ? (
                books.map((book) => (
                  <tr key={book._id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.category}</td>
                    <td>{book.quantity}</td>
                    <td>{book.available}</td>
                    <td>{new Date(book.procurementDate).toLocaleDateString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No books found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default DashBoard;
