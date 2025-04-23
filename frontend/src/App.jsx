import React, { useEffect, useState } from 'react';
import "./App.css";
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';

import Login from './pages/Login';
import AddBook from './pages/AddBook';
import UpdateBook from './pages/UpdateBook';
import AddUpdateUser from './pages/AddUpdateUser';
import AddMembership from './pages/AddMemberShip';
import UpdateMembership from './pages/UpdateMembership';
import BooksMasterList from './pages/BookMasterList';
import MembershipsMasterList from './pages/MembershipsMasterList';
import CheckBookAndIssue from './pages/CheckBookAndIssue';
import IssueBook from './pages/IssueBook';
import ReturnBook from './pages/ReturnBook';
import ActiveIssues from './pages/ActiveIssues';
import OverdueReturns from './pages/OverdueReturns';
import PendingRequests from './pages/PendingRequests';
import MasterListMovies from './pages/MasterListMovies';
import Navbar from './components/Navbar';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import DashBoard from './pages/DashBoard';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
  
    if (token && user) {
      setIsAuthenticated(true);
  
      if (location.pathname === '/login' || location.pathname === '/') {
        navigate('/dashboard');
      }
  
    } else {
      setIsAuthenticated(false);
      if (location.pathname !== '/login') {
        navigate('/login');
      }
    }
  }, []); 
   

  return (
    <>
      {isAuthenticated && <Navbar />}

      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/dashboard' element={<DashBoard />} />
        <Route path='/maintenance/add-book' element={<AddBook />} />
        <Route path='/maintenance/update-book' element={<UpdateBook />} />
        <Route path='/maintenance/add-user' element={<AddUpdateUser />} />
        <Route path='/maintenance/add-membership' element={<AddMembership />} />
        <Route path='/maintenance/update-membership' element={<UpdateMembership />} />
        <Route path='/reports/master-books' element={<BooksMasterList />} />
        <Route path='/reports/master-memberships' element={<MembershipsMasterList />} />
        <Route path='/transactions/search-book' element={<CheckBookAndIssue />} />
        <Route path="/transactions/issue-book" element={<IssueBook />} />
        <Route path="/transactions/return-book" element={<ReturnBook />} />
        <Route path='/reports/active-issues' element={<ActiveIssues />} />
        <Route path='/reports/overdue-returns' element={<OverdueReturns />} />
        <Route path='/reports/pending-issue-requests' element={<PendingRequests />} />
        <Route path='/reports/master-movies' element={<MasterListMovies />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  );
};

export default App;
