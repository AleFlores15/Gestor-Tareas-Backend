const express = require("express");
const router = express.Router();
const {
  crearUsuario,
 
} = require("../controllers/usuario.controller");
const { validarUsuario } = require('../middlewares/usuarioValidator');

router.post("/register", validarUsuario, crearUsuario);

module.exports = router;
