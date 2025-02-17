document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Ganti dengan kredensial yang diinginkan
    if (username === 'admin' && password === 'stand14') {
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = 'list.html';
    } else {
        alert('Username atau password salah!');
    }
});
