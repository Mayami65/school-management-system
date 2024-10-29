// Default password for new users
const DEFAULT_PASSWORD = 'default123';

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
                <button class="delete-button" onclick="confirmDeleteUser(${index})">Delete</button>
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
        Swal.fire('Error', 'Name and Email are required fields.', 'error');
        return;
    }

    // Simple email format validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        Swal.fire('Error', 'Please enter a valid email address.', 'error');
        return;
    }

    const id = document.getElementById('user-id').value;
    const users = JSON.parse(localStorage.getItem('school_users')) || [];

    if (id) {
        // Edit existing user
        users[id] = { name, email, role }; // Password remains unchanged
        Swal.fire('Success', 'User details updated successfully!', 'success');
    } else {
        // Add new user with default password
        users.push({ name, email, role, password: DEFAULT_PASSWORD });
        Swal.fire('Success', 'New user added with default password!', 'success');
    }

    localStorage.setItem('school_users', JSON.stringify(users));
    loadUsers();
    closeUserForm();
}

// Function to edit an existing user
function editUser(index) {
    const users = JSON.parse(localStorage.getItem('school_users')) || [];
    const user = users[index];
    
    openUserForm(true); // Open form to edit

    // Set form fields with the user's data
    document.getElementById('user-id').value = index; // Set user ID
    document.getElementById('name').value = user.name; // Set name
    document.getElementById('email').value = user.email; // Set email
    document.getElementById('role').value = user.role; // Set role
}

// Function to confirm delete user with SweetAlert
function confirmDeleteUser(index) {
    Swal.fire({
        title: 'Are you sure?',
        text: 'This action cannot be undone!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            deleteUser(index);
            Swal.fire('Deleted!', 'User has been deleted.', 'success');
        }
    });
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
