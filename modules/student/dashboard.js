// dashboard.js

const roleBasedNavLinks = {
    admin: [
        { icon: "fas fa-tachometer-alt", text: "Dashboard", href: "/modules/admin/dashboard.html" },
        { icon: "fas fa-users", text: "Users", href: "/modules/users/users.html" },
        { icon: "fas fa-bullhorn", text: "Announcements", href: "/modules/announcements/announcement.html" },
        { icon: "fas fa-cogs", text: "Settings", href: "settings.html" },
    ],
    staff: [
        { icon: "fas fa-tachometer-alt", text: "Dashboard", href: "/modules/staff/dashboard.html" },
        { icon: "fas fa-chalkboard-teacher", text: "Staff", href: "staff.html" },
        { icon: "fas fa-bullhorn", text: "Announcements", href: "/modules/announcements/announcement.html" },
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

// Load Sidebar
document.addEventListener('DOMContentLoaded', () => {
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
});

