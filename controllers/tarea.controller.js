const { validationResult } = require("express-validator");
const { Tarea } = require("../models");

// Crear una nueva tarea para el usuario autenticado con el jwt
exports.crearTarea = async (req, res) => {
  try {
    console.log("req.usuario: ", req.usuario);
    console.log("req.body: ", req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!req.usuario) {
      return res.status(401).json({
        ok: false,
        msg: "No autorizado",
      });
    }
    const { id } = req.usuario;
    const { titulo, descripcion, estado, fechaLimite } = req.body;
    const nuevaTarea = await Tarea.create({
      titulo,
      descripcion,
      estado: estado || "pendiente", 
      fechaLimite,
      usuarioId: id,
    });

    return res.status(201).json({
      message: "Tarea creada exitosamente",
      tarea: {
        id: nuevaTarea.id,
        titulo: nuevaTarea.titulo,
        descripcion: nuevaTarea.descripcion,
        estado: nuevaTarea.estado,
        fechaLimite: nuevaTarea.fechaLimite,
        usuarioId: nuevaTarea.usuarioId,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error al crear la tarea",
    });
  }
};
