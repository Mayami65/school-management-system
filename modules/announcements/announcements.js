const roleBasedNavLinks = {
    admin: [
        { icon: "fas fa-tachometer-alt", text: "Dashboard", href: "/modules/admin/dashboard.html" },
        { icon: "fas fa-users", text: "Users", href: "/modules/users/users.html" },
        { icon: "fas fa-bullhorn", text: "Announcements", href: "/modules/announcements/announcement.html" },
        { icon: "fas fa-cogs", text: "Settings", href: "/modules/settings/settings.html" },
    ],
    staff: [
        { icon: "fas fa-tachometer-alt", text: "Dashboard", href: "dashboard.html" },
        { icon: "fas fa-chalkboard-teacher", text: "Staff", href: "staff.html" },
        { icon: "fas fa-bullhorn", text: "Announcements", href: "announcements.html" },
    ],
    student: [
        { icon: "fas fa-tachometer-alt", text: "Dashboard", href: "/modules/student/dashboard.html" },
        { icon: "fas fa-bullhorn", text: "Announcements", href: "/modules/announcements/announcement.html" },
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

            const currentUser = JSON.parse(localStorage.getItem('current_user'));

            if (currentUser) {
                const sidebarElement = document.querySelector('.sidebar');
                sidebarElement.setAttribute('data-role', currentUser.role);

                generateSidebarLinks(currentUser.role);

                const logoutButton = document.querySelector('.logout');
                if (logoutButton) {
                    logoutButton.addEventListener('click', (event) => {
                        event.preventDefault();
                        localStorage.removeItem('current_user');
                        window.location.href = '/authentication/login/login.html';
                    });
                }
            } else {
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

            const currentUser = JSON.parse(localStorage.getItem('current_user'));
            if (currentUser) {
                document.getElementById('user-name').textContent = currentUser.name;
                document.getElementById('user-role').textContent = currentUser.role;
            }
        })
        .catch(error => {
            console.error('Error loading the navbar:', error.message);
        });

    // Check user role to disable or hide "Add Announcement" button for students
    const currentUser = JSON.parse(localStorage.getItem('current_user'));
    if (currentUser && currentUser.role.toLowerCase() === 'student') {
        const addAnnouncementBtn = document.getElementById('add-announcement-btn');
        if (addAnnouncementBtn) {
            addAnnouncementBtn.style.display = 'none'; // Hide the button for students
        }
    }

    // Load announcements when the page is loaded
    loadAnnouncements();
});

function openAnnouncementForm() {
    document.getElementById('announcement-form-modal').style.display = 'flex';
    document.getElementById('form-title').textContent = 'Add Announcement';
    document.getElementById('announcement-id').value = ''; // Clear ID
    document.getElementById('announcement-title').value = ''; // Clear title
    document.getElementById('announcement-details').value = ''; // Clear details
    document.getElementById('announcement-date').value = ''; // Clear date
}

function closeAnnouncementForm() {
    document.getElementById('announcement-form-modal').style.display = 'none';
}

function loadAnnouncements() {
    const announcements = JSON.parse(localStorage.getItem('school_announcements')) || [];
    const announcementCardsContainer = document.getElementById('announcement-cards');
    const currentUserRole = JSON.parse(localStorage.getItem('current_user')).role.toLowerCase();
    
    announcementCardsContainer.innerHTML = ''; // Clear existing cards

    // Sort announcements by date in descending order (latest first)
    announcements.sort((a, b) => new Date(b.date) - new Date(a.date));

    announcements.forEach((announcement, index) => {
        const card = document.createElement('div');
        card.classList.add('announcement-card');
        card.innerHTML = `
            <div class="announcement-header">
                <h3 class="announcement-heading">${announcement.title}</h3>
                <span class="announcement-date">${announcement.date}</span>
            </div>
            <p class="announcement-content">${announcement.details}</p>
            <div class="announcement-actions">
                ${currentUserRole === 'admin' || currentUserRole === 'staff' ? `<button onclick="editAnnouncement(${index})">Edit</button>` : ''}
                ${currentUserRole === 'admin' ? `<button class="delete-button" onclick="deleteAnnouncement(${index})">Delete</button>` : ''}
            </div>
        `;
        announcementCardsContainer.appendChild(card);
    });
}

// Function to save announcement (add or edit)
function saveAnnouncement() {
    const title = document.getElementById('announcement-title').value.trim();
    const details = document.getElementById('announcement-details').value.trim();
    const date = document.getElementById('announcement-date').value;

    // Basic validation
    if (!title || !details || !date) {
        Swal.fire({
            icon: 'warning',
            title: 'Missing Information',
            text: 'Title, Details, and Date are required fields.'
        });
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

    Swal.fire({
        icon: 'success',
        title: 'Success',
        text: id ? 'Announcement updated successfully!' : 'Announcement added successfully!'
    });
}

function editAnnouncement(index) {
    const announcements = JSON.parse(localStorage.getItem('school_announcements')) || [];
    const announcement = announcements[index];

    openAnnouncementForm(); // Open form with prepopulated values

    // Prepopulate the form fields with the announcement data
    document.getElementById('announcement-id').value = index; // Set announcement ID
    document.getElementById('announcement-title').value = announcement.title; // Set title
    document.getElementById('announcement-details').value = announcement.details; // Set details
    document.getElementById('announcement-date').value = announcement.date; // Set date

    document.getElementById('form-title').textContent = 'Edit Announcement'; // Update form title
}

function deleteAnnouncement(index) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            // Proceed with the deletion
            const announcements = JSON.parse(localStorage.getItem('school_announcements')) || [];
            announcements.splice(index, 1); // Remove the announcement from the array
            localStorage.setItem('school_announcements', JSON.stringify(announcements));
            loadAnnouncements(); // Reload announcements

            Swal.fire(
                'Deleted!',
                'Your announcement has been deleted.',
                'success'
            );
        }
    });
}
