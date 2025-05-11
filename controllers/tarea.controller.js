const { validationResult } = require("express-validator");
const { Tarea } = require("../models");
const { Op } = require("sequelize");

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

// obtener una tarea por id
exports.obtenerTareaPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const tarea = await Tarea.findOne({
      where: { id },
    });

    if (!tarea) {
      return res.status(404).json({
        message: "Tarea no encontrada",
      });
    }

    if (tarea.usuarioId !== req.usuario.id) {
      return res.status(403).json({
        message: "No tienes permiso para acceder a esta tarea",
      });
    }

    return res.status(200).json({
      message: "Tarea encontrada",
      tarea,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error al obtener la tarea",
    });
  }
};

// obtener todas las tareas del usuario autenticado con filtros y paginación

exports.obtenerTareas = async (req, res) => {
  try {
    const rawPage = parseInt(req.query.page);
    const rawLimit = parseInt(req.query.limit);
    const { estado, fechaInicio, fechaFin, search } = req.query;

    // Validación de paginación
    if (rawPage < 1 || isNaN(rawPage)) {
      return res.status(400).json({
        message: "El número de página debe ser mayor o igual a 1.",
      });
    }

    if (rawLimit < 1 || isNaN(rawLimit)) {
      return res.status(400).json({
        message: "El límite debe ser mayor o igual a 1.",
      });
    }

    const page = rawPage;
    const limit = rawLimit;
    const offset = (page - 1) * limit;

    const where = {
      usuarioId: req.usuario.id,
    };

    if (estado) {
      where.estado = estado;
    }

    if (fechaInicio && fechaFin) {
      where.fechaLimite = {
        [Op.between]: [new Date(fechaInicio), new Date(fechaFin)],
      };
    }

    if (search) {
      where[Op.and] = where[Op.and] || [];
      where[Op.and].push({
        [Op.or]: [
          { titulo: { [Op.iLike]: `%${search}%` } },
          { descripcion: { [Op.iLike]: `%${search}%` } },
        ],
      });
    }

    const tareas = await Tarea.findAndCountAll({
      where,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      message: "Tareas encontradas",
      tareas: tareas.rows,
      total: tareas.count,
      page,
      limit,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error al obtener las tareas",
    });
  }
};

// eliminar una tarea por id, pero solo si el estado es "Completada"
exports.eliminarTarea = async (req, res) => {
  try {
    const { id } = req.params;
    const tarea = await Tarea.findOne({
      where: { id },
    });

    if (!tarea) {
      return res.status(404).json({
        message: "Tarea no encontrada",
      });
    }

    if (tarea.usuarioId !== req.usuario.id) {
      return res.status(403).json({
        message: "No tienes permiso para eliminar esta tarea",
      });
    }

    if (tarea.estado !== "Completada") {
      return res.status(400).json({
        message: "Solo se pueden eliminar tareas completadas",
      });
    }

    await tarea.destroy();

    return res.status(200).json({
      message: "Tarea eliminada exitosamente",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error al eliminar la tarea",
    });
  }
};


exports.actualizarTarea = async (req, res) => {
  console.log("Nuevo estado recibido:", req.body.estado);

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params;
    const { titulo, descripcion, estado, fechaLimite } = req.body;

    const tarea = await Tarea.findOne({ where: { id } });

    if (!tarea) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    if (tarea.usuarioId !== req.usuario.id) {
      return res.status(403).json({ message: "No tienes permiso para modificar esta tarea" });
    }

    if (tarea.estado === "completada") {
      return res.status(400).json({ message: "No se puede modificar una tarea completada" });
    }
    
    if (estado && !["pendiente", "en progreso", "completada"].includes(estado)) {
      return res.status(400).json({ message: "Estado inválido" });
    }

    // Validaciones de cambio de estado
    if (estado) {
      if (estado === "pendiente") {
        return res.status(400).json({ message: "No se puede volver a 'pendiente'" });
      }

      if (estado === "en progreso" && tarea.estado !== "pendiente") {
        return res.status(400).json({ message: "Solo se puede cambiar a 'en progreso' desde 'pendiente'" });
      }

      if (estado === "completada" && tarea.estado !== "en progreso") {
        return res.status(400).json({ message: "Solo se puede marcar como 'completada' si está en 'en progreso'" });
      }
    }

    // Actualizar la tarea
    tarea.titulo = titulo || tarea.titulo;
    tarea.descripcion = descripcion || tarea.descripcion;
    tarea.estado = estado || tarea.estado;
    tarea.fechaLimite = fechaLimite || tarea.fechaLimite;
    await tarea.save();



    return res.status(200).json({
      message: "Tarea actualizada exitosamente",
      tarea,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al actualizar la tarea" });
  }
};

