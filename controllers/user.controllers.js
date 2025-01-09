const usersCtrl = {};
const passport = require('passport');
const User = require('../models/user');

// Renderizar formulario de registro
usersCtrl.renderSignUpForm = (req, res) => {
    res.render('user/signup');
};

// Registrar un usuario
usersCtrl.signup = async (req, res) => {
    const errors = [];
    const { name, email, password, confirm_password } = req.body;

    // Validar contraseñas
    if (password !== confirm_password) {
        errors.push({ text: 'Las contraseñas no coinciden' });
    }
    if (password.length < 4) {
        errors.push({ text: 'La contraseña debe tener al menos 4 caracteres' });
    }

    if (errors.length > 0) {
        res.render('user/signup', {
            errors,
            name,
            email,
        });
    } else {
        const emailUser = await User.findOne({ email: email });
        if (emailUser) {
            req.flash('error_msg', 'Este correo ya está registrado');
            res.redirect('/user/signup');
        } else {
            const newUser = new User({ name, email, password });
            newUser.password = await newUser.encryptPassword(password);
            await newUser.save();
            req.flash('success_msg', 'Te has registrado correctamente');
            res.redirect('/user/signin');
        }
    }
};

// Renderizar formulario de inicio de sesión
usersCtrl.renderSigninForm = (req, res) => {
    res.render('user/signin');
};

// Iniciar sesión
usersCtrl.signin = passport.authenticate('local', {
    failureRedirect: '/user/signin',
    successRedirect: '/packages', 
    failureFlash: true,
});

// Cerrar sesión
usersCtrl.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err); 
        }
        req.flash('success_msg', 'Sesión cerrada correctamente');
        res.redirect('/user/signin'); 
    });
};

module.exports = usersCtrl;
