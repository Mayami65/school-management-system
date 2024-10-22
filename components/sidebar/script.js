const roleBasedNavLinks = {
    admin: [
        { icon: "fas fa-home", text: "Home", href: "#home" },
        { icon: "fas fa-user-graduate", text: "Students", href: "#students" },
        { icon: "fas fa-chalkboard-teacher", text: "Staff", href: "#staff" },
        { icon: "fas fa-cogs", text: "Settings", href: "#settings" },
    ],
    staff: [
        { icon: "fas fa-home", text: "Home", href: "#home" },
        { icon: "fas fa-chalkboard-teacher", text: "Staff", href: "#staff" },
    ],
    student: [
        { icon: "fas fa-home", text: "Home", href: "#home" },
        { icon: "fas fa-book", text: "My Classes", href: "#classes" },
    ],
};

function generateSidebarLinks(role) {
    const navLinksContainer = document.getElementById('nav-links-container'); // Get the nav links container
    navLinksContainer.innerHTML = ''; // Clear existing links

    const links = roleBasedNavLinks[role] || []; // Get links for the role

    links.forEach(link => {
        const a = document.createElement('a');
        a.href = link.href;
        a.classList.add('nav-link');
        a.innerHTML = `<i class="${link.icon}"></i> ${link.text}`;
        
        // Add click event listener to handle link functionality
        a.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default anchor behavior
            handleNavLinkClick(link.href); // Call function to handle navigation
        });

        navLinksContainer.appendChild(a);
    });
}

// Function to handle navigation based on link href
function handleNavLinkClick(href) {
    switch (href) {
        case '#home':
            console.log('Navigating to Home');
            // Logic to load home content or redirect
            break;
        case '#students':
            console.log('Navigating to Students');
            // Logic to load students content or redirect
            break;
        case '#staff':
            console.log('Navigating to Staff');
            // Logic to load staff content or redirect
            break;
        case '#settings':
            console.log('Navigating to Settings');
            // Logic to load settings content or redirect
            break;
        case '#classes':
            console.log('Navigating to My Classes');
            // Logic to load classes content or redirect
            break;
        default:
            console.error('Unknown navigation link:', href);
            break;
    }
}

// Get the logged-in user role from local storage and generate links
document.addEventListener('DOMContentLoaded', () => {
    const currentUser = JSON.parse(localStorage.getItem('current_user'));
    const userRole = currentUser ? currentUser.role.toLowerCase() : null; // Normalize role to lowercase

    if (userRole) {
        generateSidebarLinks(userRole);
    } else {
        // Redirect to login if no user is found
        window.location.href = '/authentication/login/login.html';
    }
});
