function loadUserDetails() {
  const currentUser = JSON.parse(localStorage.getItem('current_user'));
  if (currentUser) {
      document.getElementById('user-name').textContent = currentUser.name;
      document.getElementById('user-role').textContent = currentUser.role;
  }
}
