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
