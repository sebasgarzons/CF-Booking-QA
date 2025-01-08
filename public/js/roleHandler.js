document.addEventListener('DOMContentLoaded', () => {
    const role = localStorage.getItem('role');
    const adminOptions = document.getElementById('adminOptions');
    const allPackages = document.getElementById('allPackages');
    const loginButton = document.getElementById('loginButton');
    const logoutButton = document.getElementById('logoutButton');
    const userProfile = document.getElementById('userProfile');
    const optionsBox = document.getElementById('optionsBox'); // Contenedor de opciones

    if (role) {
        allPackages.style.display = 'block';
        loginButton.style.display = 'none';
        userProfile.style.display = 'block';
        logoutButton.style.display = 'block';

        if (role === 'admin') {
            adminOptions.style.display = 'block';

            // Agregar evento para acceder a /edit-packages
            const editPackagesLink = document.createElement('a');
            editPackagesLink.addEventListener('click', (e) => {
                e.preventDefault();
                fetch('https://polar-mountain-17270-cc22e4a69974.herokuapp.com/edit-packages', {
                    method: 'GET',
                    credentials: 'include', // Enviar cookies de sesión
                })
                    .then(response => {
                        if (response.ok) {
                            return response.text();
                        } else {
                            throw new Error('No autorizado');
                        }
                    })
                    .then(data => {
                        console.log('Contenido:', data);
                        // Renderizar contenido o redirigir
                    })
                    .catch(error => {
                        console.error('Error:', error.message);
                        alert('Acceso denegado: No tienes permisos.');
                    });
            });

            adminOptions.appendChild(editPackagesLink);
        }
    } else {
        loginButton.style.display = 'block';
        userProfile.style.display = 'none';
        logoutButton.style.display = 'none';
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('role');
            localStorage.removeItem('user');
            window.location.href = '/login.html';
        });
    }

    // Mostrar/ocultar el contenedor de opciones al hacer clic en el perfil
    if (userProfile) {
        userProfile.addEventListener('click', () => {
            if (optionsBox.style.display === 'none' || !optionsBox.style.display) {
                optionsBox.style.display = 'block';
            } else {
                optionsBox.style.display = 'none';
            }
        });
    }
});
