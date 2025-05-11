const {usuario} = require("../models");

// Crear un nuevo usuario
exports.crearUsuario = async (req, res) => {
  try {
    //const { nombre, email, password } = req.body;
    const newUsuario = await usuario.create(req.body);//{ nombre, email, password });
    res.status(201).json(newUsuario);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el usuario", error });
  }
};
