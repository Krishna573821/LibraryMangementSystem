import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";


const ActiveIssues = () => {
  const [issues, setIssues] = useState([]);
  const [userType, setUserType] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUserType(storedUser.userType);
      setUserId(storedUser._id);
      fetchIssuedBooks(storedUser.userType, storedUser._id);
    }
  }, []);

  const fetchIssuedBooks = async (type, id) => {
    try {
      let response;
      if (type === 'admin') {
        response = await axios.get('http://localhost:5000/api/transactions/issued', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
      } else {
        response = await axios.get(`http://localhost:5000/api/transactions/issued-books/${id}`);
      }

      setIssues(response.data.data);
      toast.success("Issued Book fetched successfully!");
    } catch (err) {
      console.error('Error fetching issued books:', err.message);
      toast.error("Error fetching issued books");
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: 'auto', padding: 20 }}>
      <h2>Active Issued Books</h2>
      {issues.length === 0 ? (
        <p>No active issues found.</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', marginTop: 20 }}>
          <thead>
            <tr>
              <th>Serial No</th>
              <th>Book/Movie Name</th>
              <th>Membership Id</th>
              <th>Date of Issue</th>
              <th>Date of Return</th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue, index) => (
              <tr key={issue._id}>
                <td>{index + 1}</td>
                <td>{issue.bookId?.title || issue.movieId?.title}</td>
                <td>{issue.membershipId}</td>
                <td>{new Date(issue.issueDate).toLocaleDateString()}</td>
                <td>{new Date(issue.dueDate).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ActiveIssues;
