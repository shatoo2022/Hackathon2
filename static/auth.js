document.addEventListener('DOMContentLoaded', function() {
    // Handle login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = {
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            };

            fetch('http://127.0.0.1:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    // Store the token in localStorage
                    localStorage.setItem('userToken', data.token);
                    localStorage.setItem('userName', data.name);
                    window.location.href = '/';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Login failed. Please try again.');
            });
        });
    }

    // Handle signup form submission
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                alert("Passwords don't match!");
                return;
            }

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                password: password
            };

            fetch('http://127.0.0.1:5000/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    alert(data.error);
                } else {
                    alert('Account created successfully! Please login.');
                    window.location.href = '/login';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Signup failed. Please try again.');
            });
        });
    }

    // Check authentication status and update UI
    const token = localStorage.getItem('userToken');
    const userName = localStorage.getItem('userName');
    const navLinks = document.querySelector('nav .space-x-4');
    
    if (token && userName && navLinks) {
        navLinks.innerHTML = `
            <span class="text-gray-600">Welcome, ${userName}</span>
            <a href="/donate" class="text-gray-600 hover:text-blue-600">Donate Food</a>
            <a href="/listings" class="text-gray-600 hover:text-blue-600">Find Food</a>
            <a href="#" onclick="logout()" class="text-gray-600 hover:text-blue-600">Logout</a>
        `;
    }
});

function logout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userName');
    window.location.href = '/login';
}
