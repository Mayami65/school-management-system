const roleBasedNavLinks = {
    admin: [
        { icon: "fas fa-tachometer-alt", text: "Dashboard", href: "/modules/admin/dashboard.html" },
        { icon: "fas fa-users", text: "Users", href: "/modules/users/users.html" },
        { icon: "fas fa-bullhorn", text: "Announcements", href: "/modules/announcements/announcement.html" },
        { icon: "fas fa-cogs", text: "Settings", href: "settings.html" },
    ],
    staff: [
        { icon: "fas fa-tachometer-alt", text: "Dashboard", href: "dashboard.html" },
        { icon: "fas fa-chalkboard-teacher", text: "Staff", href: "staff.html" },
        { icon: "fas fa-bullhorn", text: "Announcements", href: "announcements.html" },
    ],
    student: [
        { icon: "fas fa-tachometer-alt", text: "Dashboard", href: "dashboard.html" },
        { icon: "fas fa-bullhorn", text: "Announcements", href: "announcements.html" },
        { icon: "fas fa-book", text: "My Classes", href: "classes.html" },
    ],
};

// Function to generate sidebar links based on user role
function generateSidebarLinks(role) {
    const navLinksContainer = document.getElementById('nav-links-container');

    if (!navLinksContainer) {
        console.error('Nav Links Container not found!');
        return; // Exit if the container is not found
    }

    navLinksContainer.innerHTML = ''; // Clear existing links

    const normalizedRole = role.toLowerCase(); // Normalize role to lowercase
    const links = roleBasedNavLinks[normalizedRole] || []; // Get links for the normalized role

    links.forEach(link => {
        const a = document.createElement('a');
        a.href = link.href; // Set the href to the dedicated HTML page
        a.classList.add('nav-link');
        a.innerHTML = `<i class="${link.icon}"></i> ${link.text}`;
        navLinksContainer.appendChild(a);
    });
}
  
// Load Sidebar and Navbar
document.addEventListener('DOMContentLoaded', () => {
    // Load Sidebar
    fetch('../../components/sidebar/sidebar.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.text();
        })
        .then(html => {
            document.getElementById('sidebar').innerHTML = html;

            // Fetch the current user from local storage
            const currentUser = JSON.parse(localStorage.getItem('current_user'));

            // Check if the user is logged in
            if (currentUser) {
                // Set the data-role attribute in the sidebar
                const sidebarElement = document.querySelector('.sidebar');
                sidebarElement.setAttribute('data-role', currentUser.role);

                // Generate links based on the normalized user role
                generateSidebarLinks(currentUser.role);

                // Add event listener for logout button
                const logoutButton = document.querySelector('.logout'); // Select the logout button
                if (logoutButton) {
                    logoutButton.addEventListener('click', (event) => {
                        event.preventDefault(); // Prevent the default anchor click behavior
                        // Clear the current user data from local storage
                        localStorage.removeItem('current_user');

                        // Redirect to the login page
                        window.location.href = '/authentication/login/login.html'; // Adjust the path as necessary
                    });
                }
            } else {
                // Redirect to login if no user is found
                window.location.href = '/authentication/login/login.html';
            }
        })
        .catch(error => {
            console.error('Error loading the sidebar:', error.message);
        });

    // Load Navbar
    fetch('../../components/navbar/navbar.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.text();
        })
        .then(html => {
            document.getElementById('navbar').innerHTML = html;

            // Inline script for user details
            const currentUser = JSON.parse(localStorage.getItem('current_user'));
            if (currentUser) {
                document.getElementById('user-name').textContent = currentUser.name;
                document.getElementById('user-role').textContent = currentUser.role;
            }
        })
        .catch(error => {
            console.error('Error loading the navbar:', error.message);
        });

    // Load announcements when the page is loaded
    loadAnnouncements();
});

// Function to open the announcement form modal
function openAnnouncementForm() {
    document.getElementById('announcement-form-modal').style.display = 'flex';
    document.getElementById('form-title').textContent = 'Add Announcement';
    document.getElementById('announcement-id').value = ''; // Clear ID
    document.getElementById('announcement-title').value = ''; // Clear title
    document.getElementById('announcement-details').value = ''; // Clear details
    document.getElementById('announcement-date').value = ''; // Clear date
}

// Function to close the announcement form modal
function closeAnnouncementForm() {
    document.getElementById('announcement-form-modal').style.display = 'none';
}

// Function to load announcements from local storage, sort them by date, and display them in the table
function loadAnnouncements() {
    const announcements = JSON.parse(localStorage.getItem('school_announcements')) || [];
    const announcementTableBody = document.getElementById('announcement-table-body');
    announcementTableBody.innerHTML = ''; // Clear existing rows

    // Sort announcements by date in descending order (latest first)
    announcements.sort((a, b) => new Date(b.date) - new Date(a.date));

    announcements.forEach((announcement, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${announcement.title}</td>
            <td class="details-column">${announcement.details}</td>
            <td>${announcement.date}</td>
            <td>
                <button onclick="editAnnouncement(${index})">Edit</button>
                ${JSON.parse(localStorage.getItem('current_user')).role !== 'staff' ? `<button class="delete-button" onclick="deleteAnnouncement(${index})">Delete</button>` : ''}
            </td>
        `;
        announcementTableBody.appendChild(row);
    });
}

// Function to save announcement (add or edit)
function saveAnnouncement() {
    const title = document.getElementById('announcement-title').value.trim();
    const details = document.getElementById('announcement-details').value.trim();
    const date = document.getElementById('announcement-date').value;

    // Basic validation
    if (!title || !details || !date) {
        alert('Title, Details, and Date are required fields.');
        return; // Exit the function if validation fails
    }

    const id = document.getElementById('announcement-id').value;
    const announcements = JSON.parse(localStorage.getItem('school_announcements')) || [];

    if (id) {
        // Edit existing announcement
        announcements[id] = { title, details, date };
    } else {
        // Add new announcement
        announcements.push({ title, details, date });
    }

    localStorage.setItem('school_announcements', JSON.stringify(announcements));
    loadAnnouncements(); // Reload announcements
    closeAnnouncementForm(); // Close form
}

// Function to edit an existing announcement
function editAnnouncement(index) {
    const announcements = JSON.parse(localStorage.getItem('school_announcements')) || [];
    const announcement = announcements[index];

    document.getElementById('announcement-id').value = index; // Set announcement ID
    document.getElementById('announcement-title').value = announcement.title; // Set title
    document.getElementById('announcement-details').value = announcement.details; // Set details
    document.getElementById('announcement-date').value = announcement.date; // Set date

    openAnnouncementForm(); // Open form to edit
}

// Function to delete an announcement
function deleteAnnouncement(index) {
    const announcements = JSON.parse(localStorage.getItem('school_announcements')) || [];
    announcements.splice(index, 1); // Remove announcement from array
    localStorage.setItem('school_announcements', JSON.stringify(announcements));
    loadAnnouncements(); // Reload announcements
}
