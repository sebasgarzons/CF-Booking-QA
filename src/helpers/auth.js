const helpers = {};

// Verificar si el usuario está autenticado
helpers.isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error_msg', 'No autorizado');
    res.redirect('/user/signin');
};

// Verificar si el usuario es administrador
helpers.isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.email.endsWith('@admin.com')) {
        return next();
    }
    req.flash('error_msg', 'No tienes permisos para realizar esta acción.');
    res.redirect('/packages');
};

module.exports = helpers;
