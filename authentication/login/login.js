// Function to handle login
function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Retrieve users from localStorage
    const users = JSON.parse(localStorage.getItem("school_users")) || [];
    console.log("Email:", email);
    console.log("Password:", password);

    // Check if user exists and password matches
    const user = users.find(user => 
        user.email === email &&
        user.password === password
    );

    if (user) {
        alert("Login successful!");

        // Store current user in local storage
        localStorage.setItem("current_user", JSON.stringify(user)); // Add this line

        // Redirect based on the user role
        const role = user.role.toLowerCase();

        if (role === "admin") {
            window.location.href = "/modules/admin/dashboard.html"; // Change to your admin dashboard URL
        } else if (role === "staff") {
            window.location.href = "/modules/staff/dashboard.html"; // Change to your staff dashboard URL
        } else if (role === "student") {
            window.location.href = "/modules/student/dashboard.html"; // Change to your student dashboard URL
        }
    } else {
        alert("Invalid email or password. Please try again.");
    }
}

// Attach the event listener to the login form
document.querySelector(".login-form").addEventListener("submit", handleLogin);
