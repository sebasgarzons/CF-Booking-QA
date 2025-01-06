document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Evita el comportamiento predeterminado del formulario

    // Recopila los datos del formulario
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    // Validación rápida en el cliente
    if (!email || !password) {
        alert('Por favor, completa todos los campos.');
        return;
    }

    try {
        // Enviamos la solicitud POST al backend
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
            localStorage.setItem('role', data.role); // Guardar el rol del usuario
            localStorage.setItem('user', JSON.stringify(data.username)); // Guardar el nombre del usuario
            // Redirigir según el rol
            if (data.role === 'admin') {
                window.location.href = '/admin-dashboard.html';
            } else {
                window.location.href = '/user-dashboard.html';
            }
        } else {
            alert(`Error: ${data.error || 'Inicio de sesión fallido'}`);
        }
    } catch (error) {
        alert('Ocurrió un error. Por favor, inténtalo de nuevo.');
        console.error('Error:', error);
    }
           
});