import { syncCart } from './carrito.js';

export async function isAuthenticated() {
    try {
        // Enviamos la solicitud POST al backend
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
            credentials: 'include',
        });

        if (!response.ok) {
            return { authenticated: false, user: null };
        }

        const data = await response.json();
        return {
            authenticated: data.authenticated,
            user: data.user || null, // Información del usuario si está autenticado
        };
    } catch (error) {
        console.error('Error al verificar autenticación:', error);
        return { authenticated: false, user: null };
    }
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
                const response = await fetch('http://localhost:3000/login', {
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
                    // Redirigir según el rol
                    /* if (data.user.role === 'admin') {
                        window.location.href = '/admin-dashboard.html';
                        console.log('Admin:', data);
                    } else {
                        window.location.href = '/';
                        console.log('No Admin:', data);
                    } */
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