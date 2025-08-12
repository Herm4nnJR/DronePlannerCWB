// login.js

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('loginForm');
    const errorMsg = document.getElementById('loginInvalido');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const login = document.getElementById('loginInput').value;
        const password = document.getElementById('password').value;

        fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ login, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                localStorage.setItem('user', login);
                window.location.href = 'index.html';
            } else {
                errorMsg.style.display = 'block';
            }
        })
        .catch(() => {
            errorMsg.style.display = 'block';
        });
    });
});
