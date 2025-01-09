
// Realizar una solicitud al endpoint público
document.addEventListener("DOMContentLoaded", (event) => {
    alert("carga de página");
    fetch('http://localhost:3000/packages/')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('carousel-dots-container');
        alert(container);

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
                <li class="info-item"><i class='bx bxs-plane-alt'></i>${pkg.numeroPersonas} personas
                </li>
                <li class="info-item"><i class='bx bx-cycling'></i>${pkg.actividadRecreativa}</li>
                </ul>
                <div class="item-price">
                <p class="item-date">${new Date(pkg.fechaIda).toLocaleDateString()} - ${new Date(pkg.fechaSalida).toLocaleDateString()}</p>
                <h5>${pkg.precio}</h5>
                </div>
                <button class="s_button">Reservar &mdash;></button>
            </div>
            `;
            container.appendChild(packageDiv);
        });
    })
    .catch(err => console.error('Error al cargar los paquetes:', err));
});