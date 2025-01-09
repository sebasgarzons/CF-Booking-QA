const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const router = express.Router();


function isAdmin(req, res, next) {
  if (req.session && req.session.user && req.session.user.role === "admin") {
    return next();
  } else {
    return res.status(403).send("Acceso denegado. Solo administradores pueden acceder.");
  }
}


router.post("/register", async (req, res) => {
  const { username, email, password, confirmPassword, role } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).send("Las contraseñas no coinciden");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user", 
    });

    await newUser.save();
    res.status(201).send("Usuario registrado exitosamente");
  } catch (err) {
    console.error("Error al registrar usuario:", err);
    res.status(500).send("Error al registrar usuario");
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
  }

  try {
      const user = await User.findOne({ email });
      if (!user) {
          return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
          return res.status(401).json({ error: 'Contraseña incorrecta' });
      }

      // Aquí se configura la sesión
      req.session.user = {
          id: user._id,
          email: user.email,
          role: user.role // Asegúrate de incluir el role aquí
      };

      console.log("Usuario autenticado:", req.session.user);

      res.status(200).json({
          message: 'Inicio de sesión exitoso',
          user: req.session.user // Opcional, para verificar en Postman
      });
  } catch (err) {
      console.error('Error al iniciar sesión:', err);
      res.status(500).json({ error: 'Error del servidor' });
  }
});


router.get('/auth-status', (req, res) => {
  if (req.session && req.session.user) {
    res.status(200).json({ authenticated: true, user: req.session.user });
  } else {
    res.status(401).json({ authenticated: false, error: 'No estás autenticado' });
  }
});


router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error al cerrar sesión:", err);
      return res.status(500).send("Error al cerrar sesión");
    }
    res.status(200).send("Sesión cerrada");
  });
});


router.get("/edit-packages", isAdmin, (req, res) => {
  res.send("Página de edición de paquetes");
});

module.exports = router;
