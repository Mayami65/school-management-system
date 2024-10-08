// register.js

// Function to handle registration
function handleRegistration(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;
    const role = document.getElementById("role").value;

    if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
    }

    // Retrieve users from localStorage
    const users = JSON.parse(localStorage.getItem("school_users")) || [];

    // Check if the email already exists
    const userExists = users.some(user => user.email === email);

    if (userExists) {
        alert("Email is already registered.");
    } else {
        // Add the new user
        users.push({ name, email, password, role });
        localStorage.setItem("school_users", JSON.stringify(users));
        alert("Registration successful! You can now log in.");
        window.location.href = "/authentication/login/login.html"; // Change to your login page URL
    }
}

// Attach the event listener to the registration form
document.querySelector(".registration-form").addEventListener("submit", handleRegistration);
