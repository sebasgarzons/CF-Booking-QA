const router = require('express').Router();
const User = require('../models/user');
const mongoose = require('mongoose');


// Middleware para verificar autenticación
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    } else {
        return res.status(401).json({ error: 'No estás autenticado. Inicia sesión primero.' });
    }
};

// Obtener el carrito (funciona para autenticados y no autenticados)
router.get('/', async (req, res) => {
    try {
        if (req.session && req.session.user) {
            // Usuario autenticado: obtener carrito de la base de datos
            const user = await User.findById(req.session.user.id)
                .populate({
                    path: 'carrito', // Nombre del campo en el esquema que contiene los ObjectIds
                    model: 'Package', // Modelo al que se refiere
                })
                .lean();

            if (!user) {
                return res.status(404).json({ error: "Usuario no encontrado." });
            }

            // Si el carrito está vacío, devolver un array vacío
            return res.status(200).json({ carrito: user.carrito || [] });
        } else {
            // Usuario no autenticado: obtener carrito desde encabezado
            const localCart = req.headers['x-local-cart'];
            if (!localCart) {
                return res.status(200).json({ carrito: [] }); // Carrito vacío
            }
            
            // Parsear el carrito desde el encabezado
            let parsedCart;
            try {
                parsedCart = JSON.parse(localCart);
            } catch (err) {
                console.error("Error al parsear el carrito local:", err);
                return res.status(400).json({ error: "Carrito local en formato inválido." });
            }

            if (!Array.isArray(parsedCart)) {
                return res.status(400).json({ error: "Carrito local debe ser un array." });
            }

            // Obtener detalles de los paquetes para los IDs en el carrito local
            const packages = await Package.find({ _id: { $in: parsedCart } }).lean();

            return res.status(200).json({ carrito: packages });
        }
    } catch (error) {
        console.error("Error al obtener el carrito:", error);
        return res.status(500).json({ error: "No se pudo obtener el carrito." });
    }
});

// Sincronizar carrito (solo para usuarios autenticados)
router.post('/sync', isAuthenticated, async (req, res) => {
    console.log("Datos recibidos para sincronizar:", req.body);

    try {
        const user = await User.findById(req.session.user.id);
        if (!user) {
            console.error("Usuario no encontrado.");
            return res.status(404).json({ error: "Usuario no encontrado." });
        }

        // Inicializa el carrito si está indefinido
        if (!user.carrito) {
            console.log("Inicializando carrito vacío para el usuario.");
            user.carrito = [];
        }

        const { cart } = req.body;

        if (!cart || !Array.isArray(cart)) {
            console.error("El carrito no está en el formato esperado:", cart);
            return res.status(400).json({ error: "Formato del carrito inválido." });
        }

        console.log("Carrito antes de sincronizar:", user.carrito);
        cart.forEach(packageId => {
            // Validar y convertir el ID a ObjectId
            if (mongoose.Types.ObjectId.isValid(packageId)) {
                const objectId = new mongoose.Types.ObjectId(packageId); // Asegúrate de usar `new`
                
                // Convertir `ObjectId` del carrito a cadenas para comparar
                const carritoIds = user.carrito.map(id => id.toString());
                
                if (!carritoIds.includes(objectId.toString())) {
                    user.carrito.push(objectId); // Agregar al carrito del usuario
                }
            } else {
                console.error(`ID inválido: ${packageId}`);
            }
        });

        await user.save();
        console.log("Carrito después de sincronizar:", user.carrito);
        res.status(200).json({ message: "Carrito sincronizado correctamente." });
    } catch (error) {
        console.error("Error al sincronizar el carrito:", error);
        res.status(500).json({ error: "No se pudo sincronizar el carrito." });
    }
});

// Eliminar un paquete del carrito
router.delete('/remove/:id', async (req, res) => {
    if (req.session && req.session.user) {
        try {
            const packageId = req.params.id;

            const user = await User.findById(req.session.user.id);

            user.carrito = user.carrito.filter(pkgId => !pkgId.equals(packageId));

            await user.save();
            return res.status(200).json({ message: "Paquete eliminado del carrito." });
        } catch (error) {
            return res.status(500).json({ error: "No se pudo eliminar el paquete del carrito." });
        }
    } else {
        console.log("No autenticado.");
        return res.status(401).json({ error: "No estás autenticado. Inicia sesión primero." });
    }
});

// Agregar un paquete al carrito
router.post('/add', isAuthenticated, async (req, res) => {
    try {
        const { packageId } = req.body;

        if (!mongoose.Types.ObjectId.isValid(packageId)) {
            return res.status(400).json({ error: 'ID de paquete inválido.' });
        }

        const user = await User.findById(req.session.user.id);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        // Inicializa el carrito si está indefinido
        if (!user.carrito) {
            user.carrito = [];
        }

        // Verifica si el paquete ya está en el carrito
        const carritoIds = user.carrito.map(id => id.toString());
        if (!carritoIds.includes(packageId)) {
            user.carrito.push(new mongoose.Types.ObjectId(packageId));
        } else {
            return res.status(200).json({ message: 'El paquete ya está en el carrito.' });
        }

        await user.save();
        return res.status(200).json({ message: 'Paquete agregado al carrito.', carrito: user.carrito });
    } catch (error) {
        console.error('Error al agregar el paquete al carrito:', error);
        return res.status(500).json({ error: 'No se pudo agregar el paquete al carrito.' });
    }
});

module.exports = router;