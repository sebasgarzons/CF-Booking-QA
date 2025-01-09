import { isAuthenticated } from "./login";

// Obtener el carrito desde localStorage
export function getCartFromLocalStorage() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

// Guardar carrito en localStorage
export function saveCartToLocalStorage(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Agregar un paquete al carrito
export function addToCartLocal(packageId) {
    const cart = getCartFromLocalStorage(); // Obtener el carrito actual
    if (!cart.includes(packageId)) { // Evitar duplicados
        cart.push(packageId); // Agregar el nuevo paquete
        saveCartToLocalStorage(cart); // Guardar el carrito actualizado
        console.log("Paquete agregado al carrito (localStorage):", packageId);
    } else {
        console.log("El paquete ya está en el carrito.");
    }
}



// Eliminar un paquete del carrito
export function removeFromCartLocal(packageId) {
    let cart = getCartFromLocalStorage();
    cart = cart.filter(id => id !== packageId);
    saveCartToLocalStorage(cart);
    console.log("Paquete eliminado del carrito (localStorage):", packageId);
}

// Renderizar el carrito (solo para pruebas)
export function renderCartLocal() {
    const cartContainer = document.getElementById('cart-container');

    // Verificar si el contenedor existe
    if (!cartContainer) {
        console.log('El contenedor "cart-container" no existe. Deteniendo ejecución.');
        return;
    }

    console.log('Entró al render');
    const cart = getCartFromLocalStorage();
    cartContainer.innerHTML = ''; // Limpia el contenido previo

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>El carrito está vacío.</p>';
    } else {
        cart.forEach(packageId => {
            const packageDiv = document.createElement('div');
            packageDiv.innerHTML = `
                <div>
                    <p>Paquete ID: ${packageId}</p>
                    <button class="remove-from-cart-btn" data-package-id="${packageId}">Eliminar</button>
                </div>
            `;
            cartContainer.appendChild(packageDiv);
        });
    }
}

export async function syncCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length > 0) {
        try {
            const response = await fetch('http://localhost:3000/carrito/sync', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Asegura que la cookie se envíe
                body: JSON.stringify({ cart }),
            });

            if (response.ok) {
                localStorage.removeItem('cart'); // Limpia el carrito local después de sincronizar
                console.log("Carrito sincronizado con la base de datos.");
            } else {
                console.error("Error al sincronizar el carrito.");
            }
        } catch (error) {
            console.error("Error durante la sincronización del carrito:", error);
        }
    }
}

export async function updateCartCount() {
    try {
        // Verificar autenticación
        const authStatus = await isAuthenticated();
        let cartCount = 0;

        if (authStatus.authenticated) {
            // Usuario autenticado: Obtener carrito desde el backend
            const response = await fetch('http://localhost:3000/carrito/', {
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                cartCount = data.carrito.length; // Contar elementos en el carrito
            } else {
                console.error('Error al obtener el carrito del backend.');
            }
        } else {
            // Usuario no autenticado: Obtener carrito desde localStorage
            const cart = getCartFromLocalStorage();
            cartCount = cart.length; // Contar elementos en el carrito local
        }

        // Actualizar el contenido del elemento .cart_anchor span
        const cartSpan = document.querySelector('.cart_anchor span');
        if (cartSpan) {
            cartSpan.textContent = cartCount;
        } else {
            console.error('No se encontró el elemento .cart_anchor span.');
        }
    } catch (error) {
        console.error('Error al actualizar el contador del carrito:', error);
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    updateCartCount();
    const tableBody = document.querySelector('#cart-table tbody');
    const emptyCartMessage = document.getElementById('empty-cart-message');

    async function fetchCart() {
        try {
            const authStatus = await isAuthenticated();
            if (authStatus.authenticated) {
                // Si el usuario está autenticado, consulta el carrito desde el backend
                const response = await fetch('http://localhost:3000/carrito/', {
                    credentials: 'include',
                });
                const data = await response.json();
                return data.carrito || [];
            } else {
                // Si no está autenticado, usa el carrito local
                return getCartFromLocalStorage();
            }
        } catch (err) {
            console.error('Error al obtener el carrito:', err);
            return [];
        }
    }


    async function renderCart() {
        const cart = await fetchCart();

        if (cart.length === 0) {
            emptyCartMessage.style.display = 'block';
            tableBody.innerHTML = '';
            return;
        }

        emptyCartMessage.style.display = 'none';
        tableBody.innerHTML = ''; // Limpia la tabla

        console.log("Datos del carrito:", cart);


        cart.forEach(pkg => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${pkg.pais || 'N/A'}</td>
                <td>${pkg.hotel || 'N/A'}</td>
                <td>$${pkg.precio || '0'}</td>
                <td>${new Date(pkg.fechaIda).toLocaleDateString()}</td>
                <td>${new Date(pkg.fechaSalida).toLocaleDateString()}</td>
                <td>
                    <button class="remove-from-cart-btn" data-package-id="${pkg._id || pkg}">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Agregar funcionalidad de eliminar
        document.querySelectorAll('.remove-from-cart-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const packageId = e.target.dataset.packageId;

                const authStatus = await isAuthenticated();
                if (authStatus.authenticated) {
                    // Eliminar del backend
                    await fetch(`http://localhost:3000/carrito/remove/${packageId}`, {
                        method: 'DELETE',
                        credentials: 'include',
                    });
                } else {
                    // Eliminar del localStorage
                    removeFromCartLocal(packageId);
                }

                // Volver a renderizar el carrito
                renderCart();
            });
            updateCartCount();
        });
    }

    renderCart();
});


// Exponer la función al objeto global
window.addToCartLocal = addToCartLocal;
window.removeFromCartLocal = removeFromCartLocal;
window.getCartFromLocalStorage = getCartFromLocalStorage;