const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const router = express.Router(); // Inicializar el router

// Ruta de registro
router.post('/register', async (req, res) => {
    const { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.status(400).send('Las contraseñas no coinciden');
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('El usuario ya existe');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        // Responde con un 200 OK, sin redirigir aquí.
        res.status(200).send(); // Respuesta sin contenido
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).send('Error al registrar usuario');
    }
});

// Ruta de login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send('Credenciales inválidas');
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send('Credenciales inválidas');
        }

        // Configurar cookies
        res.cookie('loggedIn', 'true', {
            httpOnly: false, // Accesible en el frontend
            maxAge: 24 * 60 * 60 * 1000, // 1 día
            path: '/'
        });

        res.cookie('userEmail', email, {
            httpOnly: false, // Accesible en el frontend
            maxAge: 24 * 60 * 60 * 1000,
            path: '/'
        });

        console.log(`Usuario autenticado: ${email}`);
        
        // Cambiado: ahora solo respondemos con un 200 OK
        res.status(200).send();
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).send('Error al iniciar sesión');
    }
});


// Ruta para cerrar sesión
router.get('/logout', (req, res) => {
    res.clearCookie('loggedIn', { path: '/' }); // Eliminar cookie de autenticación
    res.clearCookie('userEmail', { path: '/' }); // Eliminar cookie del correo
    res.redirect('/login');
});

module.exports = router; // Exportar el router
