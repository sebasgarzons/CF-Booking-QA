const express = require('express');
const { engine } = require('express-handlebars');
const path = require('path');
const morgan = require('morgan');
const methodOverride = require('method-override');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

// Initializations
const app = express();
require('./config/passport');

// Registrar helpers
const hbsHelpers = {
    endsWith: function (str, suffix) {
        return str && typeof str === 'string' && str.endsWith(suffix);
    },
    equals: function (a, b) {
        return a === b; 
    },
    calcTotal: function (cart) {
        return cart.reduce((total, item) => total + (item.precio || 0), 0); 
    }
};

// Settings
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine(
    '.hbs',
    engine({
        defaultLayout: 'main',
        layoutsDir: path.join(app.get('views'), 'layouts'),
        partialsDir: path.join(app.get('views'), 'partials'),
        extname: '.hbs',
        helpers: hbsHelpers, 
        runtimeOptions: {
            allowProtoPropertiesByDefault: true, 
            allowProtoMethodsByDefault: true,    
        },
    })
);
app.set('view engine', '.hbs');

// Middleware para procesar JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;

    
    next();
});

// Routers
app.use('/packages', require('./routes/packages.routes'));
app.use(require('./routes/index.routes'));
app.use(require('./routes/users.routes'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;




