const express = require("express");
const router = express.Router();
const {
  crearTarea,

} = require("../controllers/tarea.controller");
const { validarTarea } = require('../middlewares/tareaValidator');
const authToken = require("../middlewares/auth");

router.post("", authToken, validarTarea, crearTarea);
module.exports = router;