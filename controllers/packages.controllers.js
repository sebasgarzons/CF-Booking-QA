const Package = require('../models/package');
const packagesCtrl = {};

// Renderizar el formulario para crear un nuevo paquete
packagesCtrl.renderPackageForm = (req, res) => {
    if (req.session.user.role === 'admin') {
        res.status(200).json({ message: 'Formulario de nuevo paquete cargado correctamente.' });
    } else {
        res.status(403).json({ error: 'No tienes permisos para acceder a esta página.' });
    }
};

// Crear un nuevo paquete
/*  if (req.session.user.role === 'admin') {
    } else {
        res.status(403).json({ error: 'No tienes permisos para realizar esta acción.' });
    }
}; */
packagesCtrl.createNewPackage = async (req, res) => {
    const { pais, hotel, precio, numeroPersonas, fechaIda, fechaSalida, actividadRecreativa, imagen } = req.body;
    try {
        const newPackage = new Package({
            pais,
            hotel,
            precio,
            numeroPersonas,
            fechaIda,
            fechaSalida,
            actividadRecreativa,
            imagen,
        });
        await newPackage.save();
        res.status(201).json({ message: 'Paquete creado exitosamente.', paquete: newPackage });
    } catch (error) {
        console.error('Error al crear paquete:', error);
        res.status(500).json({ error: 'Hubo un problema al guardar el paquete.', details: error.message });
    }
};

// Renderizar todos los paquetes
packagesCtrl.renderPackages = async (req, res) => {
    try {
        const packages = await Package.find().lean();
        res.status(200).json({ packages });
    } catch (error) {
        console.error("Error al obtener los paquetes:", error);
        res.status(500).json({ error: "Hubo un problema al cargar los paquetes." });
    }
};

// Mostrar formulario de edición
packagesCtrl.renderEditForm = async (req, res) => {
    try {
        const package = await Package.findById(req.params.id).lean();
        if (!package) {
            res.status(404).json({ error: 'Paquete no encontrado.' });
        } else {
            res.status(200).json({ message: 'Formulario de edición cargado correctamente.', package });
        }
    } catch (error) {
        console.error('Error al cargar el formulario de edición:', error);
        res.status(500).json({ error: 'Hubo un error al cargar el formulario de edición.' });
    }
};

// Procesar la edición del paquete
packagesCtrl.updatePackage = async (req, res) => {
    try {
        const { pais, hotel, precio, numeroPersonas, fechaIda, fechaSalida, actividadRecreativa, imagen } = req.body;
        await Package.findByIdAndUpdate(req.params.id, {
            pais,
            hotel,
            precio,
            numeroPersonas,
            fechaIda,
            fechaSalida,
            actividadRecreativa,
            imagen,
        });
        res.status(200).json({ message: 'Paquete actualizado exitosamente.' });
    } catch (error) {
        console.error('Error al actualizar el paquete:', error);
        res.status(500).json({ error: 'Hubo un error al actualizar el paquete.' });
    }
};

// Renderizar el carrito
packagesCtrl.renderCart = (req, res) => {
    const cart = req.session.cart || [];
    res.status(200).json(cart);
};

// Agregar paquete al carrito
packagesCtrl.addToCart = async (req, res) => {
    try {
        const packageId = req.params.id;
        const selectedPackage = await Package.findById(packageId).lean();
        if (!selectedPackage) {
            res.status(404).json({ error: 'Paquete no encontrado.' });
        } else {
            req.session.cart = req.session.cart || [];
            req.session.cart.push(selectedPackage);
            res.status(200).json({ message: 'Paquete agregado al carrito.' });
        }
    } catch (error) {
        console.error('Error al agregar al carrito:', error);
        res.status(500).json({ error: 'Hubo un problema al agregar el paquete al carrito.' });
    }
};

// Eliminar paquetes del carrito
packagesCtrl.removeFromCart = (req, res) => {
    try {
        const packageId = req.params.id;
        if (!req.session.cart) {
            res.status(400).json({ error: 'El carrito está vacío.' });
        } else {
            req.session.cart = req.session.cart.filter((item) => item._id !== packageId);
            res.status(200).json({ message: 'Paquete eliminado del carrito.' });
        }
    } catch (error) {
        console.error('Error al eliminar el paquete del carrito:', error);
        res.status(500).json({ error: 'Hubo un problema al eliminar el paquete.' });
    }
};

// Eliminar un paquete
/*  if (req.session.user.role === 'admin') {
    } else {
        res.status(403).json({ error: 'No tienes permisos para realizar esta acción.' });
    };
*/
packagesCtrl.deletePackage = async (req, res) => {
    try {
        await Package.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Paquete eliminado exitosamente.' });
    } catch (error) {
        console.error('Error al eliminar el paquete:', error);
        res.status(500).json({ error: 'Hubo un problema al eliminar el paquete.' });
    }
};

module.exports = packagesCtrl;