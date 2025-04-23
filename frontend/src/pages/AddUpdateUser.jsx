import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddUpdateUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    userType: 'user',
    status: 'active',
  });

  const [isNewUser, setIsNewUser] = useState(true); // State to switch between new and existing user

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: checked ? value : name === 'userType' ? 'user' : 'inactive',
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleRadioChange = (e) => {
    setIsNewUser(e.target.value === 'new'); // Set if the user is new or existing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      let response;

      // If updating an existing user, use the name to identify and update the user
      if (!isNewUser) {
        response = await axios.patch(
          'http://localhost:5000/api/users/update', 
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        // If creating a new user, use POST to add the user
        response = await axios.post(
          'http://localhost:5000/api/users/add',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }
      toast.success(isNewUser ? 'User created successfully!' : 'User updated successfully!');
      console.log(response.data);
    } catch (error) {
      toast.error(isNewUser ? 'Registration Failed!' : 'Updation Failed!');
      console.error(error);
    }
  };

  return (
    <div>
      <h2>{isNewUser ? 'Add New User' : 'Update User'}</h2>
      <form onSubmit={handleSubmit}>
        {/* Radio buttons to choose between new and existing user */}
        <div>
          <label>
            <input
              type="radio"
              name="userTypeSelection"
              value="new"
              checked={isNewUser}
              onChange={handleRadioChange}
            />
            New User
          </label>
          <label>
            <input
              type="radio"
              name="userTypeSelection"
              value="existing"
              checked={!isNewUser}
              onChange={handleRadioChange}
            />
            Existing User
          </label>
        </div>

        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required={isNewUser} // Password is required only for new users
          />
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              name="userType"
              value="admin"
              checked={formData.userType === 'admin'}
              onChange={handleChange}
            />
            Make Admin
          </label>
        </div>

        <div>
          <label>
            <input
              type="checkbox"
              name="status"
              value="active"
              checked={formData.status === 'active'}
              onChange={handleChange}
            />
            Active Status
          </label>
        </div>

        <button type="submit">{isNewUser ? 'Add User' : 'Update User'}</button>
      </form>
    </div>
  );
};

export default AddUpdateUser;
