const { Router } = require('express');
const router = Router();
const packagesCtrl = require('../controllers/packages.controllers');

// Middleware para verificar permisos de administrador
const isAdmin = (req, res, next) => {
    console.log('Middleware isAdmin - Usuario autenticado:', req.user);
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    console.log('Permisos denegados.');
    req.flash('error_msg', 'No tienes permisos para realizar esta acción.');
    return res.redirect('/packages');
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
router.get('/edit/:id', isAdmin, packagesCtrl.renderEditForm);

// Procesar formulario de edición de paquete
router.post('/edit/:id', isAdmin, packagesCtrl.updatePackage);

// Mostrar formulario para agregar un nuevo paquete
router.get('/add', isAdmin, (req, res) => {
    res.render('packages/add-package');
});

// Crear un nuevo paquete
router.post('/add', isAdmin, packagesCtrl.createNewPackage);

// Eliminar un paquete
router.post('/delete/:id', isAdmin, packagesCtrl.deletePackage);

module.exports = router;






