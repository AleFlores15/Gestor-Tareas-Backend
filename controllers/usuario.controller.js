const { validationResult } = require("express-validator");
const { Usuario } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Crear un nuevo usuario
exports.crearUsuario = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  try {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);

    const newUsuario = await Usuario.create(req.body);
    //mostrar solo usuario creado sin password  xon ek mensaje de exito
    res.status(201).json({
      message: "Usuario creado exitosamente",
      usuario: {
        id: newUsuario.id,
        nombre: newUsuario.nombre,
        email: newUsuario.email,
      },
    });
    
  } catch (error) {
    res.status(500).json({ message: "Error al crear el usuario", error });
  }
};

// Login de usuario
exports.loginUsuario = async (req, res) => {
  console.log("Login usuario");
  console.log("Body: ", req.body);
  const { email, password } = req.body;
  try {
    console.log("Email: ", email);
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }
    console.log("Usuario encontrado: ", usuario);

    const esPasswordValido = await bcrypt.compare(password, usuario.password);
    if (!esPasswordValido) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRATION || "1h",
      }
    );

    res.json({ 
      message: "Login exitoso",
      token: token
    });
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión", error });
  }
};


//obtener usuario por el token
exports.obtenerUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.usuario.id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json({
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
    });	
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el usuario", error });
  }
};