// Function to handle login
function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const role = document.getElementById("role").value.trim().toLowerCase();

    // Retrieve users from localStorage
    const users = JSON.parse(localStorage.getItem("school_users")) || [];
    console.log("Email:", email);
    console.log("Password:", password);
    console.log("Role:", role);

    // Check if user exists and password matches
    const user = users.find(user => 
        user.email === email &&
        user.password === password &&
        user.role.toLowerCase() === role
    );

    if (user) {
        alert("Login successful!");

        // Redirect based on the user role
        if (user.role.toLowerCase() === "admin") {
            window.location.href = "/modules/admin/dashboard.html"; // Change to your admin dashboard URL
        } else if (user.role.toLowerCase() === "staff") {
            window.location.href = "/modules/staff/dashboard.html"; // Change to your staff dashboard URL
        } else if (user.role.toLowerCase() === "student") {
            window.location.href = "/modules/student/dashboard.html"; // Change to your student dashboard URL
        }
    } else {
        alert("Invalid email, password, or role. Please try again.");
    }
}

// Attach the event listener to the login form
document.querySelector(".login-form").addEventListener("submit", handleLogin);
