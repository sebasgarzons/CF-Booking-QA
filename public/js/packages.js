import { updateCartCount } from "./carrito.js";


// Realizar una solicitud al endpoint público
document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('carousel-dots-container');

    // Verificar si el contenedor existe
    if (!container) {
        console.log('El contenedor "carousel-dots-container" no existe. Deteniendo ejecución.');
        return;
    }

    fetch('https://polar-mountain-17270-cc22e4a69974.herokuapp.com/packages/')
        .then(response => response.json())
        .then(data => {

            // Renderizar los paquetes
            data.packages.forEach(pkg => {
                const packageDiv = document.createElement('div');
                packageDiv.innerHTML = `
                <div class="relative">
                    <img src="./assets/img/${pkg.imagen}" />
                </div>
                <div class="description-dots">
                    <div class="flex items-center justify-between">
                        <h4>${pkg.hotel}</h4>
                    </div>

                    <ul class="info-list">
                        <li class="info-item"><i class='bx bxs-plane-alt'></i>${pkg.numeroPersonas} personas</li>
                        <li class="info-item"><i class='bx bx-cycling'></i>${pkg.actividadRecreativa}</li>
                    </ul>
                    <div class="item-price">
                        <p class="item-date">${new Date(pkg.fechaIda).toLocaleDateString()} - ${new Date(pkg.fechaSalida).toLocaleDateString()}</p>
                        <h5>${pkg.precio}</h5>
                    </div>
                    <button class="s_button add-to-cart-btn" data-package-id="${pkg._id}">Reservar &mdash;></button>
                </div>
            `;
                container.appendChild(packageDiv);
            });

            updateCartCount();
        })
        .catch(err => console.error('Error al cargar los paquetes:', err));
});
