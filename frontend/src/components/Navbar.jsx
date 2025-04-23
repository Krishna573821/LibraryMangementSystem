import "./Navbar.css";
import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
   const user = JSON.parse(localStorage.getItem("user"));
   const userType = user?.userType;

   return (
      <nav className="navbar">
         <div className="navbar-logo">
            <Link
               to="/dashboard"
               style={{ textDecoration: "none", color: "inherit" }}
            >
               <h1>Library System</h1>
            </Link>
         </div>
         <ul className="navbar-menu">
            {userType !== "user" && (
               <li className="navbar-item">
                  <Link to="#">Maintenance</Link>
                  <ul className="sub-menu">
                     <li>
                        <Link to="/maintenance/add-user">
                           Add / Update User
                        </Link>
                     </li>
                     <li>
                        <Link to="/maintenance/add-membership">
                           Add Membership
                        </Link>
                     </li>
                     <li>
                        <Link to="/maintenance/update-membership">
                           Update Membership
                        </Link>
                     </li>
                     <li>
                        <Link to="/maintenance/add-book">Add Book/Movie</Link>
                     </li>
                     <li>
                        <Link to="/maintenance/update-book">
                           Update Book/Movie
                        </Link>
                     </li>
                  </ul>
               </li>
            )}

            <li className="navbar-item">
               <Link to="#">Reports</Link>
               <ul className="sub-menu">
                  <li>
                     <Link to="/reports/master-books">
                        Master List of Books
                     </Link>
                  </li>
                  <li>
                     <Link to="/reports/master-movies">
                        Master List of Movies
                     </Link>
                  </li>
                  <li>
                     <Link to="/reports/master-memberships">
                        Master List of Memberships
                     </Link>
                  </li>
                  <li>
                     <Link to="/reports/active-issues">Active Issues</Link>
                  </li>
                  <li>
                     <Link to="/reports/overdue-returns">Overdue Returns</Link>
                  </li>
                  <li>
                     <Link to="/reports/pending-issue-requests">
                        Pending Issue Requests
                     </Link>
                  </li>
               </ul>
            </li>

            <li className="navbar-item">
               <Link to="#">Transactions</Link>
               <ul className="sub-menu">
                  <li>
                     <Link to="/transactions/search-book">Search a Book</Link>
                  </li>
                  <li>
                     <Link to="/transactions/issue-book">Issue Book</Link>
                  </li>
                  <li>
                     <Link to="/transactions/return-book">Return Book</Link>
                  </li>
               </ul>
            </li>
         </ul>
      </nav>
   );
};

export default Navbar;
