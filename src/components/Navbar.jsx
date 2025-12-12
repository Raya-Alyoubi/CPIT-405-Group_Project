import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="museum-title-box">
        <span className="museum-title-top">Metropolitan</span>
        <span className="museum-title-bottom">Museum of Art</span>
      </div>

      <nav className="nav-links">
        <NavLink to="/" className="nav-link">Home</NavLink>
        <NavLink to="/search" className="nav-link">Search</NavLink>
        <NavLink to="/departments" className="nav-link">Departments</NavLink>
        <NavLink to="/likes" className="nav-link">Likes</NavLink>
      </nav>

      <div className="nav-right">
        {user ? (
          <>
            <span className="nav-username">{user.name}</span>
            <button className="nav-button" onClick={handleLogout}>Log out</button>
          </>
        ) : (
          <>
            <button className="nav-button secondary" onClick={() => navigate("/login")}>Login</button>
            <button className="nav-button" onClick={() => navigate("/register")}>Register</button>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;
