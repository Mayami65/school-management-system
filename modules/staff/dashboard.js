document.addEventListener('DOMContentLoaded', () => {
    // Fetch the logged-in user from local storage
    const loggedInUser = JSON.parse(localStorage.getItem('current_user'));
  
    // Check if the user is logged in
    if (loggedInUser) {
      const usernameElement = document.querySelector('.username');
      const roleElement = document.querySelector('.role');
  
      // Replace the username and role dynamically if the elements exist
      if (usernameElement) {
        usernameElement.textContent = loggedInUser.name;  // Display the user's name
      }
      
      if (roleElement) {
        roleElement.textContent = loggedInUser.role;      // Display the user's role
      }
    } else {
      // If no user is found in localStorage, redirect to login page
      window.location.href = '/authentication/login/login.html';
    }
  
    // Logout button functionality
    const logoutBtn = document.querySelector('.logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        // Clear user data from local storage
        localStorage.removeItem('current_user');
        // Redirect to login page
        window.location.href = 'login.html';
      }); 
    }
        // Function to display the staff count on the staff dashboard
    function displayStaffCount() {
      // Retrieve users from localStorage
      const users = JSON.parse(localStorage.getItem("school_users")) || [];

      // Calculate total staff members
      const totalStaff = users.filter(user => user.role.toLowerCase() === "staff").length;

      // Update the card value with the calculated total staff count
      document.getElementById("total-staffs").textContent = totalStaff;
    }

    // Call the function to display the staff count when the page loads
    window.onload = displayStaffCount;


  });
  