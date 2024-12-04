const password = require ('passport');
const LocalStrategy = require ('passport-local').Strategy;

const User = require('../models/user');
const passport = require('passport');

password.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, async(email, password, done) => {
    // validar correo
    const user = await User.findOne({email})
    if (!user){
        return done (null, false, {message: 'Usuario no encontrado'})
    } else{
        //Validar contraseña
        const match = await user.matchPassword(password)
        if (match){
            return done (null, user);
        }else{
            return done (null, false, {message:'Contraseña Incorrecta'})
        }
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id).select('name email role').lean();
        if (!user) {
            return done(null, false, { message: 'Usuario no encontrado' });
        }
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});