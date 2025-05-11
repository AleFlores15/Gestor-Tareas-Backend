const express = require("express");
const router = express.Router();
const {
  crearUsuario,
 
} = require("../controllers/usuario.controller");
router.post("/register", crearUsuario);

module.exports = router;
