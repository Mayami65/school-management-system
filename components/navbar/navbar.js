// This is where your JavaScript code will go
document.addEventListener('DOMContentLoaded', () => {
    // Fetch the logged-in user from local storage
    const loggedInUser = JSON.parse(localStorage.getItem('current_user'));

    // Check if the user is logged in
    if (loggedInUser) {
      const usernameElement = document.getElementById('username');
      const roleElement = document.getElementById('role');

      // Display the user's name and role dynamically
      if (usernameElement) {
        usernameElement.textContent = loggedInUser.name; // Display the user's name
      }
      
      if (roleElement) {
        roleElement.textContent = loggedInUser.role; // Display the user's role
      }
    } else {
      // If no user is found in localStorage, redirect to login page
      window.location.href = '../../authentication/login/login.html';
    }

    // Logout button functionality
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      // Add event listener for the logout button
      logoutBtn.addEventListener('click', () => {
        // Log the action for debugging
        console.log('Logout button clicked');
        // Clear user data from local storage
        localStorage.removeItem('current_user'); // Remove the user data
        // Redirect to the login page
        window.location.href = '../../authentication/login/login.html';
      });
    }
  });