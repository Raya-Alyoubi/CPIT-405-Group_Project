import React from "react";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user } = useAuth();

  const openPhpProfile = () => {
    // If your React app is running under XAMPP like:
    // http://localhost/TheMet/
    // then this path works:
    window.open("/TheMet/php/profile.php", "_blank");
  };

  return (
    <div className="page profile-page">
      <h1 className="section-title">Profile</h1>

      {user ? (
        <div className="profile-card">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>

          <button className="nav-button" onClick={openPhpProfile} style={{ marginTop: 12 }}>
            Open PHP Profile
          </button>
        </div>
      ) : (
        <p>Not logged in.</p>
      )}
    </div>
  );
}

export default Profile;
