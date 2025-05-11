
const { validationResult } = require('express-validator');
const { Usuario } = require("../models");
const bcrypt = require("bcryptjs");

exports.crearUsuario = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  try {
    console.log("Creando usuario...");
    console.log(req.body);
    //HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);


    const newUsuario = await Usuario.create(req.body);
    res.status(201).json(newUsuario);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el usuario", error });
  }
};

/*
const { Usuario } = require("../models");

// Crear un nuevo usuario
exports.crearUsuario = async (req, res) => {
  try {
    console.log("Creando usuario...");
    console.log(req.body);
    const { nombre, email, password } = req.body;
    const newUsuario = await Usuario.create(req.body);
    console.log("Usuario creado:", newUsuario);
    res.status(201).json(newUsuario);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el usuario", error });
  }
};
*/
