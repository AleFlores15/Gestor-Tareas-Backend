const { tarea } = require("../models");

// Crear una nueva tarea
exports.crearTarea = async (req, res) => {
  try {
    const { nombre, descripcion, fechaLimite } = req.body;

    if (!nombre || !descripcion || !fechaLimite) {
      return res.status(400).json({ error: "Faltan datos requeridos" });
    }

    const nuevaTarea = await tarea.create({
      nombre,
      descripcion,
      fechaLimite,
    });

    return res.status(201).json(nuevaTarea);
  } catch (error) {
    console.error("Error al crear la tarea:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
