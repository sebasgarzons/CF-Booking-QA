import { isAuthenticated } from './login.js';
import { renderCartLocal } from './carrito.js';
import { renderCart } from './index.js';
import { updateCartCount } from './carrito.js';

document.addEventListener('DOMContentLoaded', function () {
    function showModal(id_modal) {
        $("div[modal-backdrop]").remove();
        $('#' + id_modal).toggleClass("hidden");
        $('#' + id_modal).toggleClass("flex");
        $('#' + id_modal).attr("role", "dialog");
        $('#' + id_modal).attr("aria-modal", "true");
        $("body").append('<div modal-backdrop="" class="bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40"></div>');
    }

    function closeModal(id_modal) {
        $('#' + id_modal).toggleClass("hidden");
        $('#' + id_modal).toggleClass("flex");
        $("div[modal-backdrop]").remove();
        $("div[modal-backdrop]").fadeOut();
    }

    const openContactModal = document.querySelectorAll('.open_contact_modal');
    const modalContactNeeded = document.getElementById('modal_reservation');
    const cerrarContactModal = document.getElementById('close_modal_reservation');

    modalContactNeeded.style.display = 'none';

    openContactModal.forEach(element => {
        element.addEventListener('click', () => {
            modalContactNeeded.style.display = 'flex';
            modalContactNeeded.classList.remove('animate__zoomOut');
            modalContactNeeded.classList.add('animate__zoomIn');
        });
    });

    cerrarContactModal.addEventListener('click', () => {
        modalContactNeeded.style.display = 'none';
    });

    const carousel = document.querySelector('.carousel');
    const content = carousel.querySelector('.carousel-content');
    const items = carousel.querySelectorAll('.carousel-item');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    const playPauseBtn = carousel.querySelector('.carousel-play-pause');

    let currentIndex = 0;
    let interval;
    const intervalTime = 5000;

    function showSlide(index) {
        content.style.transform = `translateX(-${index * 100}%)`;
        items.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
        currentIndex = index;
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % items.length;
        showSlide(currentIndex);
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        showSlide(currentIndex);
    }

    function togglePlayPause() {
        if (interval) {
            clearInterval(interval);
            interval = null;
            playPauseBtn.classList.remove('playing');
        } else {
            interval = setInterval(nextSlide, intervalTime);
            playPauseBtn.classList.add('playing');
        }
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
    playPauseBtn.addEventListener('click', togglePlayPause);

    carousel.addEventListener('mouseenter', () => {
        if (interval) clearInterval(interval);
    });

    carousel.addEventListener('mouseleave', () => {
        if (playPauseBtn.classList.contains('playing')) {
            interval = setInterval(nextSlide, intervalTime);
        }
    });

    const carouselDrag = document.querySelector('.carousel-container-drag');
    const trackDrag = document.querySelector('.carousel-track-drag');
    let startX;
    let scrollLeft;
    let isDragging = false;

    carouselDrag.addEventListener('mousedown', (e) => {
        isDragging = true;
        carouselDrag.classList.add('dragging');
        startX = e.pageX - carouselDrag.offsetLeft;
        scrollLeft = trackDrag.style.transform
            ? parseInt(trackDrag.style.transform.slice(11))
            : 0;
    });

    carouselDrag.addEventListener('mouseleave', () => {
        isDragging = false;
        carouselDrag.classList.remove('dragging');
    });

    carouselDrag.addEventListener('mouseup', () => {
        isDragging = false;
        carouselDrag.classList.remove('dragging');
    });

    carouselDrag.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - carouselDrag.offsetLeft;
        const walk = x - startX;
        trackDrag.style.transform = `translateX(${scrollLeft + walk}px)`;
    });

    carouselDrag.addEventListener('dragstart', (e) => e.preventDefault());

    const carouselDots = document.querySelector('.carousel-dots');
    const slidesDots = document.querySelectorAll('.carousel-dots-slide');
    const dotsContainer = document.querySelector('.carousel-dots-indicators');
    let currentSlide = 0;

    console.log(carouselDots)
    console.log(slidesDots)
    console.log(dotsContainer)

    // Create dots
    slidesDots.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    function goToSlide(n) {
        carouselDots.style.transform = `translateX(-${n * 100}%)`;
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === n);
        });
        currentSlide = n;
    }

    // setInterval(() => {
    //     currentSlide = (currentSlide + 1) % slides.length;
    //     goToSlide(currentSlide);
    // }, 5000);


    const carouselTestimonials = document.querySelector('.carousel-testimonials');
    const slidesTestimonials = document.querySelectorAll('.carousel-testimonials-slide');
    const dotsTestimonialContainer = document.querySelector('.carousel-testimonials-indicators');
    let currentSlideT = 0;

    console.log(carouselTestimonials)
    console.log(slidesTestimonials)
    console.log(dotsTestimonialContainer)

    // Create dots
    slidesTestimonials.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlideT(index));
        dotsTestimonialContainer.appendChild(dot);
    });

    function goToSlideT(n) {
        carouselTestimonials.style.transform = `translateX(-${n * 100}%)`;
        document.querySelectorAll('.dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === n);
        });
        currentSlideT = n;
    }





















    const profile = document.querySelector('.profile');
    const dropdown = document.querySelector('.dropdown__wrapper');

    profile.addEventListener('click', () => {
        dropdown.classList.remove('none');
        dropdown.classList.toggle('hide');
    });

    document.addEventListener("click", (event) => {
        const isClickInsideDropdown = dropdown.contains(event.target);
        const isProfileClicked = profile.contains(event.target);

        if (!isClickInsideDropdown && !isProfileClicked) {
            dropdown.classList.add('hide');
            dropdown.classList.add('dropdown__wrapper--fade-in');
        }
    });
});


document.querySelectorAll('.add-to-cart-btn-front').forEach(button => {
    button.addEventListener('click', async (e) => {
        const packageId = e.target.dataset.packageId;

        const authStatus = await isAuthenticated();
        if (authStatus.authenticated) {
            // Usuario autenticado: enviar al backend
            fetch('http://localhost:3000/carrito/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ packageId }),
            })
            .then(response => response.json())
            .then(data => console.log("Paquete agregado al carrito (backend):", data))
            .catch(err => console.error("Error al agregar al carrito (backend):", err));
        } else {
            // Usuario no autenticado: usar localStorage
            addToCartLocal(packageId);
            renderCartLocal();
        }
    });
});

document.getElementById('carousel-dots-container').addEventListener('click', async (e) => {
    if (e.target.classList.contains('add-to-cart-btn')) {
        const packageId = e.target.dataset.packageId;

        if (!packageId) {
            console.error('ID del paquete no encontrado en el botón.');
            return;
        }

        try {
            const authStatus = await isAuthenticated();

            if (authStatus.authenticated) {
                console.log('Usuario autenticado. Enviando al backend...');
                // Usuario autenticado: enviar al backend
                const response = await fetch('http://localhost:3000/carrito/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({ packageId }),
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Carrito del backend actualizado:', data.carrito);
                    await renderCart(); // Actualizar el carrito renderizado
                } else {
                    const errorData = await response.json();
                    console.error('Error al agregar al carrito (backend):', errorData);
                    alert(`Error al agregar al carrito: ${errorData.error || 'Error desconocido'}`);
                }
            } else {
                console.log('Usuario no autenticado. Usando localStorage...');
                // Usuario no autenticado: usar localStorage
                addToCartLocal(packageId);
                renderCartLocal(); // Actualiza el carrito renderizado
            }
            updateCartCount();
        } catch (err) {
            console.error('Error al manejar el evento de carrito:', err);
        }
    }
});

document.addEventListener('click', (e) => {
    
    if (e.target.classList.contains('remove-from-cart-btn')) {
        const packageId = e.target.dataset.packageId;
        removeFromCartLocal(packageId); // Elimina del carrito localStorage
        renderCartLocal(); // Actualiza la vista del carrito
    }
});

document.addEventListener('DOMContentLoaded', function () {
    // Función para verificar si el usuario está autenticado y es admin
    function checkLoginStatus() {
        // Obtener la cookie "loggedIn" y "userEmail"
        const isLoggedIn = document.cookie.split('; ').find(row => row.startsWith('loggedIn='));
        const userEmail = document.cookie.split('; ').find(row => row.startsWith('userEmail='));

        // Elementos de la interfaz
        const userProfile = document.getElementById('userProfile');
        const loginButton = document.getElementById('loginButton');
        const logoutButton = document.getElementById('logoutButton');
        const optionsBox = document.getElementById('optionsBox'); 
        /* const allPackages = document.getElementById('allPackages'); */
        const adminOptions = document.getElementById('adminOptions');

        if (isLoggedIn && isLoggedIn.split('=')[1] === 'true') {
            // Usuario autenticado
            if (userProfile) userProfile.style.display = 'block';
            if (loginButton) loginButton.style.display = 'none';
            if (logoutButton) logoutButton.style.display = 'flex';

            // Mostrar opciones básicas (Todos los paquetes)
            if (optionsBox) optionsBox.style.display = 'block'; 
            /* if (allPackages) {
                allPackages.style.display = 'block';
            } */

            // Mostrar opciones de admin solo si el correo contiene "admin"
            if (userEmail && userEmail.split('=')[1].includes('admin')) {
                if (adminOptions) adminOptions.style.display = 'flex';
            } else {
                if (adminOptions) adminOptions.style.display = 'none';
            }
        } else {
            // Usuario no autenticado o cookie ausente
            if (userProfile) userProfile.style.display = 'none';
            if (loginButton) loginButton.style.display = 'block';
            if (logoutButton) logoutButton.style.display = 'none';
            if (optionsBox) optionsBox.style.display = 'none';
            /* if (allPackages) allPackages.style.display = 'none'; */
            if (adminOptions) adminOptions.style.display = 'none';
        }
    }

    // Llamar a la función al cargar la página
    checkLoginStatus();

    // Opcional: actualizar la interfaz al cerrar sesión
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', function () {
            document.cookie = 'loggedIn=; Max-Age=0; path=/'; // Eliminar cookie
            document.cookie = 'userEmail=; Max-Age=0; path=/'; // Eliminar cookie de correo
            checkLoginStatus();
        });
    }

    updateCartCount();
});

document.getElementById('filter-button').addEventListener('click', async () => {
    const numeroPersonas = document.getElementById('numero-personas').value;
    const precioMin = document.getElementById('precio-min').value;
    const precioMax = document.getElementById('precio-max').value;
    const fechaInicio = document.getElementById('fecha-inicio').value;
    const fechaFin = document.getElementById('fecha-fin').value;

    const queryParams = new URLSearchParams();

    if (numeroPersonas) queryParams.append('numeroPersonas', numeroPersonas);
    if (precioMin) queryParams.append('precioMin', precioMin);
    if (precioMax) queryParams.append('precioMax', precioMax);
    if (fechaInicio) queryParams.append('fechaInicio', fechaInicio);
    if (fechaFin) queryParams.append('fechaFin', fechaFin);

    try {
        const response = await fetch(`http://localhost:3000/packages/filter?${queryParams.toString()}`);
        const data = await response.json();

        if (response.ok) {
            console.log('Filtered Packages:', data.packages);

            // Renderizar paquetes filtrados
            const container = document.getElementById('carousel-dots-container');
            container.innerHTML = ''; // Limpia el contenido previo
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
        } else {
            console.error('Error al filtrar:', data.error);
        }
    } catch (err) {
        console.error('Error al realizar el filtro:', err);
    }
});
