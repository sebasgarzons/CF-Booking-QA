const Package = require('../models/package');
const packagesCtrl = {};

// Renderizar el formulario para crear un nuevo paquete
packagesCtrl.renderPackageForm = (req, res) => {
    if (req.user.role === 'admin') {
        res.render('packages/new-package');
    } else {
        req.flash('error_msg', 'No tienes permisos para acceder a esta página.');
        res.redirect('/packages');
    }
};

// Crear un nuevo paquete
packagesCtrl.createNewPackage = async (req, res) => {
    const { pais, hotel, precio, numeroPersonas, fechaIda, fechaSalida, actividadRecreativa } = req.body;
    if (req.user.role === 'admin') {
        const newPackage = new Package({
            pais,
            hotel,
            precio,
            numeroPersonas,
            fechaIda,
            fechaSalida,
            actividadRecreativa,
        });
        await newPackage.save();
        req.flash('success_msg', 'Paquete agregado exitosamente');
        res.redirect('/packages');
    } else {
        req.flash('error_msg', 'No tienes permisos para realizar esta acción.');
        res.redirect('/packages');
    }
};

// Renderizar todos los paquetes
packagesCtrl.renderPackages = async (req, res) => {
    try {
        const packages = await Package.find().lean();
        res.render('packages/all-packages', { packages: packages || [] });
    } catch (error) {
        console.error("Error al obtener los paquetes:", error);
        req.flash('error_msg', 'Hubo un problema al cargar los paquetes.');
        res.render('packages/all-packages', { packages: [] });
    }
};

// Mostrar formulario de edición
packagesCtrl.renderEditForm = async (req, res) => {
    try {
        const package = await Package.findById(req.params.id).lean();
        if (!package) {
            req.flash('error_msg', 'Paquete no encontrado');
            return res.redirect('/packages');
        }
        res.render('packages/edit-package', { package });
    } catch (error) {
        console.error("Error al cargar el formulario de edición:", error);
        req.flash('error_msg', 'Hubo un error al cargar el formulario de edición.');
        res.redirect('/packages');
    }
};

// Procesar la edición del paquete
packagesCtrl.updatePackage = async (req, res) => {
    try {
        const { pais, hotel, precio, numeroPersonas, fechaIda, fechaSalida, actividadRecreativa } = req.body;
        await Package.findByIdAndUpdate(req.params.id, {
            pais,
            hotel,
            precio,
            numeroPersonas,
            fechaIda,
            fechaSalida,
            actividadRecreativa,
        });
        req.flash('success_msg', 'Paquete actualizado exitosamente');
        res.redirect('/packages');
    } catch (error) {
        console.error("Error al actualizar el paquete:", error);
        req.flash('error_msg', 'Hubo un error al actualizar el paquete.');
        res.redirect('/packages');
    }
};

// Renderizar el carrito
packagesCtrl.renderCart = (req, res) => {
    const cart = req.session.cart || [];
    res.render('packages/cart', { cart });
};

// Agregar paquete al carrito
packagesCtrl.addToCart = async (req, res) => {
    try {
        const packageId = req.params.id;
        const selectedPackage = await Package.findById(packageId).lean();
        if (!selectedPackage) {
            req.flash('error_msg', 'Paquete no encontrado.');
            return res.redirect('/packages');
        }
        req.session.cart = req.session.cart || [];
        req.session.cart.push(selectedPackage);
        req.flash('success_msg', 'Paquete agregado al carrito.');
        res.redirect('/packages');
    } catch (error) {
        console.error("Error al agregar al carrito:", error);
        req.flash('error_msg', 'Hubo un problema al agregar el paquete al carrito.');
        res.redirect('/packages');
    }
};

// Eliminar paquetes del carrito
packagesCtrl.removeFromCart = (req, res) => {
    console.log("ID recibido para eliminar:", req.params.id);
    console.log("Carrito actual:", req.session.cart);
    try {
        const packageId = req.params.id;
        if (!req.session.cart) {
            req.flash('error_msg', 'El carrito está vacío.');
            return res.redirect('/packages/cart');
        }

        req.session.cart = req.session.cart.filter((item) => item._id !== packageId);

        console.log("Carrito después de eliminar:", req.session.cart);
        req.flash('success_msg', 'Paquete eliminado del carrito.');
        res.redirect('/packages/cart');
    } catch (error) {
        console.error("Error al eliminar el paquete del carrito:", error);
        req.flash('error_msg', 'Hubo un problema al eliminar el paquete.');
        res.redirect('/packages/cart');
    }
};

// Eliminar un paquete
packagesCtrl.deletePackage = async (req, res) => {
    if (req.user.role === 'admin') {
        await Package.findByIdAndDelete(req.params.id);
        req.flash('success_msg', 'Paquete eliminado exitosamente');
        res.redirect('/packages');
    } else {
        req.flash('error_msg', 'No tienes permisos para realizar esta acción.');
        res.redirect('/packages');
    }
};

module.exports = packagesCtrl;



