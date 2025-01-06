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
        const allPackages = document.getElementById('allPackages');
        const adminOptions = document.getElementById('adminOptions');

        if (isLoggedIn && isLoggedIn.split('=')[1] === 'true') {
            // Usuario autenticado
            if (userProfile) userProfile.style.display = 'block';
            if (loginButton) loginButton.style.display = 'none';
            if (logoutButton) logoutButton.style.display = 'block';

            // Mostrar opciones básicas (Todos los paquetes)
            if (optionsBox) optionsBox.style.display = 'block'; 
            if (allPackages) {
                allPackages.style.display = 'block';
            }

            // Mostrar opciones de admin solo si el correo contiene "admin"
            if (userEmail && userEmail.split('=')[1].includes('admin')) {
                if (adminOptions) adminOptions.style.display = 'block';
            } else {
                if (adminOptions) adminOptions.style.display = 'none';
            }
        } else {
            // Usuario no autenticado o cookie ausente
            if (userProfile) userProfile.style.display = 'none';
            if (loginButton) loginButton.style.display = 'block';
            if (logoutButton) logoutButton.style.display = 'none';
            if (optionsBox) optionsBox.style.display = 'none';
            if (allPackages) allPackages.style.display = 'none';
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
});

