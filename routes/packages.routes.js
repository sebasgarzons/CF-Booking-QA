const path = require('path');
const { Router } = require('express');
const router = Router();
const packagesCtrl = require('../controllers/packages.controllers');
const Package = require('../models/package');

// Middleware para verificar permisos de administrador
const isAdmin = (req, res, next) => {
    console.log("Sesión actual en isAdmin:", req.session);
    if (req.session && req.session.user && req.session.user.role === "admin") {
        console.log("Usuario es admin.");
        return next();
    }
    console.log("Acceso denegado. No es admin.");
    res.status(403).json({ error: "No tienes permisos para realizar esta acción." });
};

// Verificar si el usuario está autenticado
const isAuthenticated = (req, res, next) => {
    console.log('Sesión actual en isAuthenticated:', req.session);
    console.log('Middleware isAuthenticated - Sesión actual:', req.session);
    if (req.session && req.session.user) {
        return next();
    }
    res.status(401).json({ error: 'No estás autenticado. Inicia sesión primero.' });
};

// Ver todos los paquetes
router.get('/', packagesCtrl.renderPackages);

// Mostrar carrito
router.get('/cart', packagesCtrl.renderCart);

// Agregar al carrito
router.post('/add-to-cart/:id', packagesCtrl.addToCart);

// Eliminar paquetes del carrito
router.post('/cart/remove/:id', packagesCtrl.removeFromCart);

// Mostrar formulario para editar un paquete
/* router.get('/edit/:id', isAdmin, packagesCtrl.renderEditForm); */
router.get('/edit/:id', packagesCtrl.renderEditForm);

// Procesar formulario de edición de paquete
router.post('/edit/:id', isAuthenticated, isAdmin, packagesCtrl.updatePackage);

// Mostrar formulario para agregar un nuevo paquete
/* router.get('/add', isAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/add-package.html'));
}); */
router.get('/add', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/add-package.html'));
});

// Crear un nuevo paquete
router.post('/add', isAuthenticated, isAdmin, packagesCtrl.createNewPackage);


// Eliminar un paquete
router.post('/delete/:id', isAuthenticated, isAdmin, packagesCtrl.deletePackage);

router.get('/filter', async (req, res) => {
    try {
        const { numeroPersonas, precioMin, precioMax, fechaInicio, fechaFin } = req.query;

        const filters = {};

        // Filtro por número de personas
        if (numeroPersonas) {
            filters.numeroPersonas = parseInt(numeroPersonas, 10); // Convierte a número
        }

        // Filtro por rango de precios
        if (precioMin || precioMax) {
            filters.precio = {};
            if (precioMin) filters.precio.$gte = Number(precioMin);
            if (precioMax) filters.precio.$lte = Number(precioMax);
        }

        // Filtro por rango de fechas
        if (fechaInicio || fechaFin) {
            filters.fechaIda = {};
            if (fechaInicio) filters.fechaIda.$gte = new Date(fechaInicio);
            if (fechaFin) filters.fechaIda.$lte = new Date(fechaFin);
        }

        console.log("Filtros aplicados:", filters); // Para depuración

        const packages = await Package.find(filters).lean();

        console.log("Resultados encontrados:", packages.length);
        res.status(200).json({ packages });
    } catch (error) {
        console.error("Error al filtrar paquetes:", error);
        res.status(500).json({ error: "No se pudo realizar el filtro." });
    }
});

module.exports = router;






