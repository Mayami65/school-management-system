// Load Navbar and set up route protection
document.addEventListener('DOMContentLoaded', () => {
    // Retrieve current user from local storage
    const currentUser = JSON.parse(localStorage.getItem('current_user'));

    // Check if user is not logged in
    if (!currentUser) {
        // Redirect to login page if not logged in
        window.location.href = '/authentication/login/login.html';
        return;
    }

    // Role-based access control (example: allow access only to students)
    if (currentUser.role.toLowerCase() !== 'student') {
        alert('You do not have access to this page.');
        window.location.href = '/unauthorized.html'; // Redirect to an unauthorized access page
        return;
    }

    // Load the navbar if user is authorized
    fetch('../../components/navbar/navbar.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.text();
        })
        .then(html => {
            document.getElementById('navbar').innerHTML = html;

            // Load the navbar JavaScript after the HTML has been added
            const script = document.createElement('script');
            script.src = '/components/navbar/navbar.js';
            document.body.appendChild(script);

            // Setup user data
            document.getElementById('userName').textContent = currentUser.name; // Set username
            document.getElementById('userRole').textContent = currentUser.role; // Set user role

            // Logout functionality
            document.getElementById('logoutButton').addEventListener('click', () => {
                localStorage.removeItem('current_user'); // Remove user data from local storage
                window.location.href = '/authentication/login/login.html'; // Redirect to the login page
            });
        })
        .catch(error => {
            console.error('Error loading the navbar:', error.message);
        });
});

// Function to display the total number of students
function displayCounts() {
    // Retrieve users from localStorage
    const users = JSON.parse(localStorage.getItem("school_users")) || [];

    // Calculate totals for student role
    const totalStudents = users.filter(user => user.role.toLowerCase() === "student").length;

    // Update the card value with the calculated total
    document.getElementById("total-students").textContent = totalStudents;
}

// Call the function to display the counts when the page loads
window.onload = displayCounts;
