import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './AddMembership.css';

const AddMembership = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [membershipForm, setMembershipForm] = useState({
    firstName: '',
    lastName: '',
    contactNumber: '',
    contactAddress: '',
    aadhaarNo: '',
    startDate: '',
    plan: '6-months',
  });

  // Fetch users from the backend with Authorization header
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token'); // Assuming token is stored in localStorage

        const response = await axios.get('http://localhost:5000/api/users', {
          headers: {
            Authorization: `Bearer ${token}`, // Send the token in Authorization header
          },
        });

        setUsers(response.data);  
        
      } catch (error) {
        console.error('Error fetching users:', error.message);
      }
    };

    fetchUsers();
  }, []);

  // Handle input change for membership form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMembershipForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission to add membership
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) {
      alert('Please select a user');
      return;
    }
  
    try {
      const membershipData = { ...membershipForm, userId: selectedUser._id };
      const response = await axios.post('http://localhost:5000/api/memberships', membershipData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`, // Include the token when submitting
        },
      });
      
      // Assuming response.data contains the membership object, including the membershipId
      const { membershipId } = response.data;
  
      // Update the localStorage with the new membershipId
      const currentUser = JSON.parse(localStorage.getItem('user')); // Assuming user object is in localStorage
      if (currentUser) {
        currentUser.membershipId = membershipId;
        localStorage.setItem('user', JSON.stringify(currentUser));
      } else {
        console.error('User not found in localStorage');
      }
  
      toast.success('Membership Created successfully!');
      setSelectedUser(null); // Reset selection after submission
      setMembershipForm({
        firstName: '',
        lastName: '',
        contactNumber: '',
        contactAddress: '',
        aadhaarNo: '',
        startDate: '',
        plan: '6-months',
      }); // Reset form
    } catch (error) {
      console.error('Error creating membership:', error.message);
      toast.error('Failed to create membership. Please try again.');
    }
  };
  

  return (
    <div className='addMembershipContainer' >
      <h2>Add Membership</h2>

      <div>
        <h3>Select a User to Add Membership</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>
                  <button onClick={() => setSelectedUser(user)}>Add Membership</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedUser && (
        <div>
          <h3>Membership Form for {selectedUser.name}</h3>
          <form onSubmit={handleSubmit}>
            <div>
              <label>First Name:</label>
              <input
                type="text"
                name="firstName"
                value={membershipForm.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Last Name:</label>
              <input
                type="text"
                name="lastName"
                value={membershipForm.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Contact Number:</label>
              <input
                type="text"
                name="contactNumber"
                value={membershipForm.contactNumber}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Contact Address:</label>
              <input
                type="text"
                name="contactAddress"
                value={membershipForm.contactAddress}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Aadhaar No:</label>
              <input
                type="text"
                name="aadhaarNo"
                value={membershipForm.aadhaarNo}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Start Date:</label>
              <input
                type="date"
                name="startDate"
                value={membershipForm.startDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <label>Membership Plan:</label>
              <div>
                <input
                  type="radio"
                  name="plan"
                  value="6-months"
                  checked={membershipForm.plan === '6-months'}
                  onChange={handleInputChange}
                />
                6 Months
                <input
                  type="radio"
                  name="plan"
                  value="1-year"
                  checked={membershipForm.plan === '1-year'}
                  onChange={handleInputChange}
                />
                1 Year
                <input
                  type="radio"
                  name="plan"
                  value="2-years"
                  checked={membershipForm.plan === '2-years'}
                  onChange={handleInputChange}
                />
                2 Years
              </div>
            </div>
            <button type="submit">Submit Membership</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default AddMembership;
