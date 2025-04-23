import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const OverdueReturns = () => {
  const [overdueIssues, setOverdueIssues] = useState([]);
  const [userType, setUserType] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUserType(storedUser.userType);
      setUserId(storedUser._id);
      fetchOverdueReturns(storedUser.userType, storedUser._id);
    }
  }, []);

  const fetchOverdueReturns = async (type, id) => {
    try {
      let response;
      if (type === 'admin') {
        response = await axios.get('http://localhost:5000/api/transactions/overdue', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
      } else {
        response = await axios.get(`http://localhost:5000/api/transactions/overdue/${id}`);
      }

      setOverdueIssues(response.data); 
      console.log('Overdue returns fetched:');
    } catch (err) {
      console.error('Error fetching overdue returns:', err.message);
      toast.error('Failed to load overdue returns. Please try again later.');
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: 'auto', padding: 20 }}>
      <h2>Overdue Returns</h2>
      {overdueIssues.length === 0 ? (
        <p>No overdue returns found.</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', marginTop: 20 }}>
          <thead>
            <tr>
              <th>Serial No</th>
              <th>Book/Movie Name</th>
              <th>Membership Id</th>
              <th>Date of Issue</th>
              <th>Due Date</th>
              <th>Days Overdue</th>
              <th>Fine</th>
            </tr>
          </thead>
          <tbody>
            {overdueIssues.map((issue, index) => {
              const today = new Date();
              const dueDate = new Date(issue.dueDate);
              const daysOverdue = Math.max(Math.floor((today - dueDate) / (1000 * 60 * 60 * 24)), 0);
              
              return (
                <tr key={issue.serialNo}>
                  <td>{index + 1}</td> 
                  <td>{issue.book}</td>  
                  <td>{issue.membershipId}</td>
                  <td>{new Date(issue.dateOfIssue).toLocaleDateString()}</td>
                  <td>{new Date(issue.dueDate).toLocaleDateString()}</td>
                  <td>{daysOverdue > 0 ? daysOverdue : 0}</td>
                  <td>{issue.fine ? `₹${issue.fine}` : '₹0'}</td>  
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OverdueReturns;
