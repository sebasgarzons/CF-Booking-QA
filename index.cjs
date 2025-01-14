require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const session = require("express-session");
const authRoutes = require("./routes/auth");
const packageRoutes = require('./routes/packages.routes');
const carritoRoutes = require('./routes/carrito.routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  session({
    secret: "clave_secreta",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// Ajustar CORS para entorno local
app.use(
  cors({
      origin: "https://polar-mountain-17270-cc22e4a69974.herokuapp.com", // Permite solicitudes desde el frontend
      credentials: true, // Permite cookies y encabezados de autorización
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/packages', packageRoutes); //
app.use('/carrito', carritoRoutes); //

app.use((req, res, next) => {
  console.log(`Solicitud recibida: ${req.method} ${req.url}`);
  next();
});

// Conexión a MongoDB
if(!process.env.MONGODB_URI){
  throw new Error("MONGODB_URI no está definido en las variables de entorno. Define la variable de entorno en .env");
}
mongoose
  .connect(process.env.MONGODB_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Conexión exitosa a MongoDB (Producción)'))
  .catch(err => console.error('Error al conectar a MongoDB:', err));

mongoose.connection.on(
  "error",
  console.error.bind(console, "Error al conectar con MongoDB:")
);
mongoose.connection.once("open", () => {
  console.log("Conexión exitosa con MongoDB");
});

const verifyAdmin = (req, res, next) => {
  console.log("Sesión actual:", req.session);
  if (!req.session.user) {
    return res.status(401).json({ error: "No autenticado: inicie sesión primero." });
  }

  if (req.session.user.role !== "admin") {
    return res.status(403).json({ error: "Acceso denegado: solo los administradores pueden acceder a esta página." });
  }

  console.log("Acceso concedido a admin.");
  next();
};

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "register.html"));
});

app.get("/all-packages", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "all-packages.html"));
});

app.get("/cart", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "cart.html"));
});

app.get("/edit-packages", verifyAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "public", "edit-packages.html"));
});

app.use(express.static(path.join(__dirname, "public")));

app.use("/", authRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.use((err, req, res, next) => {
  console.error("Error no manejado:", err);
  res.status(500).json({ error: "Ocurrió un error interno en el servidor" });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en https://polar-mountain-17270-cc22e4a69974.herokuapp.com:${PORT}`);
});