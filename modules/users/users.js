// Default password for new users
const DEFAULT_PASSWORD = 'default123'; // You can change this to any default password

// Function to open the user form modal
function openUserForm(isEdit = false) {
    document.getElementById('user-form-modal').style.display = 'flex';
    
    if (!isEdit) {
        // Clear the form only when it's not editing
        document.getElementById('form-title').textContent = 'Add User';
        document.getElementById('user-id').value = ''; // Clear ID
        document.getElementById('name').value = ''; // Clear name
        document.getElementById('email').value = ''; // Clear email
        document.getElementById('role').value = ''; // Reset role
    } else {
        document.getElementById('form-title').textContent = 'Edit User';
    }
}


// Function to close the user form modal
function closeUserForm() {
    document.getElementById('user-form-modal').style.display = 'none';
}

// Function to load users from local storage and display them in the table
function loadUsers() {
    const users = JSON.parse(localStorage.getItem('school_users')) || [];
    const userTableBody = document.getElementById('user-table-body');
    userTableBody.innerHTML = ''; // Clear existing rows

    users.forEach((user, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.role}</td>
            <td>
                <button onclick="editUser(${index})">Edit</button>
                <button class="delete-button" onclick="deleteUser(${index})">Delete</button>
            </td>
        `;
        userTableBody.appendChild(row);
    });
}

// Function to save user (add or edit)
function saveUser() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const role = document.getElementById('role').value;

    // Basic validation
    if (!name || !email) {
        alert('Name and Email are required fields.');
        return; // Exit the function if validation fails
    }

    // Simple email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert('Please enter a valid email address.');
        return; // Exit the function if email format is invalid
    }

    const id = document.getElementById('user-id').value;
    const users = JSON.parse(localStorage.getItem('school_users')) || [];

    if (id) {
        // Edit existing user
        users[id] = { name, email, role }; // Password remains unchanged
    } else {
        // Add new user with default password
        users.push({ name, email, role, password: DEFAULT_PASSWORD });
    }

    localStorage.setItem('school_users', JSON.stringify(users));
    loadUsers(); // Reload users
    closeUserForm(); // Close form
}

// Function to edit an existing user
function editUser(index) {
    const users = JSON.parse(localStorage.getItem('school_users')) || [];
    const user = users[index];
    
    // Open the modal after the fields have been populated
    openUserForm(); // Open form to edit

    // Set form fields with the user's data
    document.getElementById('user-id').value = index; // Set user ID
    document.getElementById('name').value = user.name; // Set name
    document.getElementById('email').value = user.email; // Set email
    document.getElementById('role').value = user.role; // Set role

}


// Function to delete a user
function deleteUser(index) {
    const users = JSON.parse(localStorage.getItem('school_users')) || [];
    users.splice(index, 1); // Remove user from array
    localStorage.setItem('school_users', JSON.stringify(users));
    loadUsers(); // Reload users
}

// Load users when the page is loaded
document.addEventListener('DOMContentLoaded', loadUsers);
