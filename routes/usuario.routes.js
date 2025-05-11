const express = require("express");
const router = express.Router();
const {
  crearUsuario,
 
} = require("../controllers/usuario.controller");
router.get("/register", crearUsuario);

module.exports = router;
