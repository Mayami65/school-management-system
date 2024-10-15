// Function to display the counts on the dashboard
function displayCounts() {
    // Retrieve users from localStorage
    const users = JSON.parse(localStorage.getItem("school_users")) || [];

    // Calculate totals for each role
    const totalAdmins = users.filter(user => user.role.toLowerCase() === "admin").length;
    const totalStudents = users.filter(user => user.role.toLowerCase() === "student").length;
    const totalStaff = users.filter(user => user.role.toLowerCase() === "staff").length;

    // Update the card values with the calculated totals
    document.getElementById("total-admins").textContent = totalAdmins;
    document.getElementById("total-students").textContent = totalStudents;
    document.getElementById("total-staff").textContent = totalStaff;
}

// Call the function to display the counts when the page loads
window.onload = displayCounts;

document.getElementById('logoutButton').addEventListener('click', () => {
    localStorage.removeItem('current_user'); // Remove user data from local storage
    window.location.href = '/authentication/login/login.html'; // Redirect to the login page
});
