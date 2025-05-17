const { body } = require("express-validator");

exports.validarTarea = [
  body("titulo")
    .notEmpty()
    .withMessage("El título es obligatorio")
    .isLength({ min: 2 })
    .withMessage("El título debe tener al menos 2 caracteres"),
/*
  body("descripcion")
    .notEmpty()
    .withMessage("La descripción es obligatoria")
    .isLength({ min: 3 })
    .withMessage("La descripción debe tener al menos 10 caracteres"),

  body("fechaLimite")
    .notEmpty()
    .withMessage("La fecha límite es obligatoria")
    .isDate()
    .withMessage("Debe ser una fecha válida"),
*/
];
