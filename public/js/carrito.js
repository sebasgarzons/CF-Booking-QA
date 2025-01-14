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
            const response = await fetch('https://polar-mountain-17270-cc22e4a69974.herokuapp.com/carrito/sync', {
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
            const response = await fetch('https://polar-mountain-17270-cc22e4a69974.herokuapp.com/carrito/', {
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

    const table = document.querySelector('#cart-table'); // Verificar si el elemento existe
    const tableBody = table ? table.querySelector('tbody') : null;
    const emptyCartMessage = document.getElementById('empty-cart-message');

    if (!table || !tableBody) {
        console.log('No se encontró el elemento #cart-table. Deteniendo renderCart.');
        return;
    }

    async function fetchCart() {
        try {
            const authStatus = await isAuthenticated();
            if (authStatus.authenticated) {
                // Si el usuario está autenticado, consulta el carrito desde el backend
                const response = await fetch('https://polar-mountain-17270-cc22e4a69974.herokuapp.com/carrito/', {
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

    async function renderCartFormTable() {
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

            const packageId = pkg._id || pkg;


            row.innerHTML = `
                <td>${pkg.pais || 'N/A'}</td>
                <td>${pkg.hotel || 'N/A'}</td>
                <td>$${pkg.precio || '0'}</td>
                <td>${pkg.fechaIda ? new Date(pkg.fechaIda).toLocaleDateString() : 'N/A'}</td>
                <td>${pkg.fechaSalida ? new Date(pkg.fechaSalida).toLocaleDateString() : 'N/A'}</td>
                <td>
                    <button class="remove-from-cart-btn" data-package-id="${packageId}"><img src="./img/recycle-bin.png" /></button>
                </td>
            `;
            console.log("Botón generado con ID:", packageId);
            tableBody.appendChild(row);
        });

        // Agregar funcionalidad de eliminar
        document.querySelectorAll('.remove-from-cart-btn').forEach(button => {
            button.addEventListener('click', async (e) => {
                const packageId = e.target.closest('.remove-from-cart-btn').dataset.packageId;
                console.log("ID del paquete para eliminar:", packageId);
        
                const authStatus = await isAuthenticated();
                if (authStatus.authenticated) {
                    await fetch(`https://polar-mountain-17270-cc22e4a69974.herokuapp.com/carrito/remove/${packageId}`, {
                        method: 'DELETE',
                        credentials: 'include',
                    });
                } else {
                    removeFromCartLocal(packageId);
                }
        
                renderCartFormTable();
            });
        });

        updateCartCount();
    }

    renderCartFormTable();
});


// Exponer la función al objeto global
window.addToCartLocal = addToCartLocal;
window.removeFromCartLocal = removeFromCartLocal;
window.getCartFromLocalStorage = getCartFromLocalStorage;