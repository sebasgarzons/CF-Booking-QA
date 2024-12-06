document.addEventListener('DOMContentLoaded', function() {

    function showModal(id_modal){
        $("div[modal-backdrop]").remove();
        $('#'+id_modal).toggleClass("hidden");
        $('#'+id_modal).toggleClass("flex");
        $('#'+id_modal).attr("role", "dialog");
        $('#'+id_modal).attr("aria-modal", "true");
        $("body").append(
        '<div modal-backdrop="" class="bg-gray-900 bg-opacity-50 dark:bg-opacity-80 fixed inset-0 z-40"></div>');
    }

    function closeModal(id_modal){
        $('#'+id_modal).toggleClass("hidden");
        $('#'+id_modal).toggleClass("flex");
        $("div[modal-backdrop]").remove();
        $("div[modal-backdrop]").fadeOut();
    }

    
    const openContactModal = document.querySelectorAll('.open_contact_modal')
    const modalContactNeeded = document.getElementById('modal_reservation')
    const cerrarContactModal = document.getElementById('close_modal_reservation')

    modalContactNeeded.style.display = 'none'

    openContactModal.forEach(element => {
        element.addEventListener('click', () => {
            modalContactNeeded.style.display = 'flex'
            modalContactNeeded.classList.remove('animate__zoomOut');
            modalContactNeeded.classList.add('animate__zoomIn');
        })
    });

    cerrarContactModal.addEventListener('click', () => {

            modalContactNeeded.style.display = 'none';
        
    })

    const carousel = document.querySelector('.carousel');
    const content = carousel.querySelector('.carousel-content');
    const items = carousel.querySelectorAll('.carousel-item');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    const playPauseBtn = carousel.querySelector('.carousel-play-pause');

    let currentIndex = 0;
    let interval;
    const intervalTime = 5000; // 5 seconds

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

    // Optional: Pause on hover
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
        scrollLeft = trackDrag.style.transform ? 
            parseInt(trackDrag.style.transform.slice(11)) : 0;
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
        const walk = (x - startX);
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

    // setInterval(() => {
    //     currentSlideT = (currentSlideT + 1) % slidesNoEstoNoVa.length;
    //     goToSlideT(currentSlideT);
    // }, 5000);

    const profile = document.querySelector('.profile');
    const dropdown = document.querySelector('.dropdown__wrapper');

    profile.addEventListener('click', () => {
        dropdown.classList.remove('none');
        dropdown.classList.toggle('hide');
    })


    document.addEventListener("click", (event) => {
        const isClickInsideDropdown = dropdown.contains(event.target);
        const isProfileClicked = profile.contains(event.target);

        if (!isClickInsideDropdown && !isProfileClicked) {
            dropdown.classList.add('hide');
            dropdown.classList.add('dropdown__wrapper--fade-in');
        }
    });
});