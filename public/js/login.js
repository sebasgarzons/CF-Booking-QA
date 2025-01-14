import { syncCart } from './carrito.js';

export async function isAuthenticated() {
    const response = await fetch('https://polar-mountain-17270-cc22e4a69974.herokuapp.com/auth-status', {
        credentials: 'include',
    });
    const data = await response.json();
    return {
        authenticated: data.authenticated,
        user: data.user || null,
    };
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            // Lógica del formulario de inicio de sesión
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();

            if (!email || !password) {
                alert('Por favor, completa todos los campos.');
                return;
            }

            try {
                const response = await fetch('https://polar-mountain-17270-cc22e4a69974.herokuapp.com/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                    credentials: 'include',
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Inicio de sesión exitoso');
                    localStorage.setItem('role', data.user.role); // Guardar el rol del usuario
                    const authenticated = await isAuthenticated();
                    if (authenticated) {
                        await syncCart(); // Sincronizar carrito
                    } else {
                        console.error("Usuario no autenticado.");
                    }

                    window.location.href = '/';

                } else {
                    alert(`Error: ${data.error || 'Inicio de sesión fallido'}`);
                }
            } catch (error) {
                alert('Ocurrió un error. Por favor, inténtalo de nuevo.');
                console.error('Error:', error);
            }
        });
    }
});