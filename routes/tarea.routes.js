const express = require("express");
const router = express.Router();
const {
  crearTarea,
  obtenerTareaPorId

} = require("../controllers/tarea.controller");
const { validarTarea } = require('../middlewares/tareaValidator');
const authToken = require("../middlewares/auth");

router.post("", authToken, validarTarea, crearTarea);
router.get("/:id", authToken, obtenerTareaPorId);
module.exports = router;