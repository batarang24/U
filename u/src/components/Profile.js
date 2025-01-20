import React from 'react';

const Profile = ({ user }) => {
  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove the token from localStorage
    window.location.href = '/login'; // Redirect to login page after logout
  };

  return (
    <div>
      <h2>Profile Page</h2>
      {user ? (
        <div>
          <p>Welcome, {user.userId}</p>
          <p>Email: {user.email}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Profile;
