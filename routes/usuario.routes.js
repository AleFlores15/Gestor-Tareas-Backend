const express = require("express");
const router = express.Router();
const {
  crearUsuario,
  loginUsuario,
  obtenerUsuario
  
 
} = require("../controllers/usuario.controller");
const { validarUsuario } = require('../middlewares/usuarioValidator');
const authToken = require("../middlewares/auth");

router.post("/register", validarUsuario, crearUsuario);
router.post("/login", loginUsuario);
router.get("/me", authToken, obtenerUsuario);


module.exports = router;
