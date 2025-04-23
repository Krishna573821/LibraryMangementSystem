import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const PendingRequests = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [userType, setUserType] = useState('');
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUserType(storedUser.userType);
      setUserId(storedUser._id);
      fetchPendingRequests(storedUser.userType, storedUser._id);
    }
  }, []);

  const fetchPendingRequests = async (type, id) => {
    try {
      let response;
      if (type === 'admin') {
        response = await axios.get('http://localhost:5000/api/transactions/pending-requests', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
      } else {
        response = await axios.get(`http://localhost:5000/api/transactions/${id}/pending-requests`);
      }

      setPendingRequests(response.data);  
      toast.success('Pending requests loaded successfully!');
    } catch (err) {
      console.error('Error fetching pending requests:', err.message);
      toast.error('Failed to load pending requests. Please try again later.');
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: 'auto', padding: 20 }}>
      <h2>Pending Requests</h2>
      {pendingRequests.length === 0 ? (
        <p>No pending requests found.</p>
      ) : (
        <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', marginTop: 20 }}>
          <thead>
            <tr>
              <th>Serial No</th>
              <th>Membership Id</th>
              <th>Name of Book/Movie</th>
              <th>Requested Date</th>
              <th>Request Fulfilled Date</th>
            </tr>
          </thead>
          <tbody>
            {pendingRequests.map((request, index) => (
              <tr key={index}>
                <td>{index + 1}</td> 
                <td>{request.membershipId}</td> 
                <td>{request.title}</td>  
                <td>{new Date(request.requestedDate).toLocaleDateString()}</td>
                <td>{request.requestFulfilledDate ? new Date(request.requestFulfilledDate).toLocaleDateString() : 'Pending'}</td>  
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PendingRequests;
