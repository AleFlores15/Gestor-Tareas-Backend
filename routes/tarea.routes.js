const express = require("express");
const router = express.Router();
const {
  crearTarea,

} = require("../controllers/tarea.controller");

router.post("/", crearTarea); 
module.exports = router;