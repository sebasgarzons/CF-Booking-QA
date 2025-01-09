import { isAuthenticated } from './login.js';
import { renderCartLocal, syncCart } from './carrito.js';

// main.js
document.addEventListener('DOMContentLoaded', async () => {
    const authStatus = await isAuthenticated();

    if (authStatus.authenticated) {
        console.log('Usuario autenticado:', authStatus.user);
        // Lógica para manejar carrito en el backend
        await syncCart(); // Sincronizar el carrito local con la base de datos
    } else {
        console.log('Usuario no autenticado. Usando localStorage para el carrito.');
        renderCartLocal(); // Renderizar carrito desde localStorage
    }

    renderCart();
});

export async function renderCart() {
    const authStatus = await isAuthenticated();

    if (authStatus.authenticated) {
        try {
            // Usuario autenticado: obtener carrito del backend
            const response = await fetch('http://localhost:3000/carrito/', {
                credentials: 'include',
            });

            if (!response.ok) {
                console.error("Error del servidor al obtener el carrito.");
                return;
            }

            const data = await response.json();

            if (!data.carrito || !Array.isArray(data.carrito)) {
                console.error("El carrito recibido no es válido:", data.carrito);
                return;
            }

            const cartContainer = document.getElementById('cart-container');
            cartContainer.innerHTML = ''; // Limpia el contenedor

            data.carrito.forEach(pkg => {
                cartContainer.innerHTML += `
                    <div>
                        <p>Paquete: ${pkg.name || 'Sin nombre'}</p>
                        <button class="remove-from-cart-btn" data-package-id="${pkg._id}">Eliminar</button>
                    </div>
                `;
            });

            console.log("Carrito renderizado desde el backend:", data.carrito);
        } catch (err) {
            console.error("Error al cargar el carrito (backend):", err);
        }
    } else {
        try {
            // Usuario no autenticado: obtener carrito de localStorage
            renderCartLocal();
        } catch (err) {
            console.error("Error al renderizar el carrito desde localStorage:", err);
        }
    }
}

const createPackageForm = document.getElementById('create-package-form');

if (createPackageForm) {
    createPackageForm.addEventListener('submit', async function (e) {
        e.preventDefault(); // Evita el comportamiento predeterminado del formulario

        // Verifica autenticación y rol
        const authStatus = await isAuthenticated();
        if (!authStatus.authenticated || authStatus.user.role !== 'admin') {
            alert('No tienes permisos para realizar esta acción.');
            return;
        }

        const formData = new FormData(e.target);
        const packageData = Object.fromEntries(formData.entries()); // Convierte FormData a un objeto

        try {
            const response = await fetch('http://localhost:3000/packages/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(packageData),
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                alert('Package created successfully!');
                console.log('Response:', data);
            } else {
                const error = await response.json();
                console.error('Error:', error);
                alert(`Error: ${error.message || 'Failed to create package'}`);
            }
        } catch (err) {
            console.error('Error al enviar el formulario:', err);
            alert('An error occurred while creating the package.');
        }
    });
} else {
    console.log('El formulario "create-package-form" no se encuentra en la página.');
}