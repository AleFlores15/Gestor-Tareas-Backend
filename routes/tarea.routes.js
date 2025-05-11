const express = require("express");
const router = express.Router();
const {
  crearTarea,
  obtenerTareaPorId,
  obtenerTareas,
  eliminarTarea,
  actualizarTarea
} = require("../controllers/tarea.controller");
const { validarTarea } = require("../middlewares/tareaValidator");
const authToken = require("../middlewares/auth");

router.post("", authToken, validarTarea, crearTarea);
router.get("/:id", authToken, obtenerTareaPorId);
router.get("", authToken, obtenerTareas);
router.delete("/:id", authToken, eliminarTarea);
router.put("/:id", authToken, validarTarea, actualizarTarea);
module.exports = router;
