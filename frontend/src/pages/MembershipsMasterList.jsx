import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const MembershipsMasterList = () => {
  const [memberships, setMemberships] = useState([]);

  const fetchMemberships = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/memberships');
      console.log('Memberships fetched:', response.data.data);

      setMemberships(response.data.data);
      toast.success('Memberships loaded successfully!');
    } catch (error) {
      console.error('Error fetching memberships:', error.message);
      toast.error('Failed to load memberships. Please try again later.');
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, []);

  return (
    <div>
      <h2>Memberships Master List</h2>
      <table border="1" cellPadding="8" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Membership ID</th>
            <th>Name of Member</th>
            <th>Contact Number</th>
            <th>Contact Address</th>
            <th>Aadhar Card No</th>
            <th>Start Date of Membership</th>
            <th>End Date of Membership</th>
            <th>Status (Active/Inactive)</th>
            <th>Amount Pending (Fine)</th>
          </tr>
        </thead>
        <tbody>
          {memberships.length === 0 ? (
            <tr>
              <td colSpan="9" align="center">No memberships found</td>
            </tr>
          ) : (
            memberships.map((member,index) => (
              <tr key={index}>
                <td>{member.membershipId}</td>
                <td>{member.nameOfMember}</td>
                <td>{member.contactNumber}</td>
                <td>{member.contactAddress}</td>
                <td>{member.aadharCardNo}</td>
                <td>{new Date(member.startDate).toLocaleDateString()}</td>
                <td>{new Date(member.endDate).toLocaleDateString()}</td>
                <td>{member.status ? 'Active' : 'Inactive'}</td>
                <td>₹{member.pendingAmount || 0}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MembershipsMasterList;
