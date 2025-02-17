// Fungsi untuk mengecek status login
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
        window.location.href = '../view/login.html';
    }
}

// Fungsi untuk logout
function logout() {
    localStorage.removeItem('isLoggedIn');
    window.location.href = '../view/login.html';
}
