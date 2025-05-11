"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");
module.exports = (sequelize, DataTypes) => {
  const Usuario = sequelize.define(
    "Usuario",
    {
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      hooks: {
        beforeCreate: async (usuario) => {
          const salt = await bcrypt.genSalt(10);
          usuario.password = await bcrypt.hash(usuario.password, salt);
        },
        beforeUpdate: async (usuario) => {
          if (usuario.changed("password")) {
            const salt = await bcrypt.genSalt(10);
            usuario.password = await bcrypt.hash(usuario.password, salt);
          }
        },
      },
    }
  );

  Usuario.associate = function (models) {
    Usuario.hasMany(models.Tarea, { foreignKey: "usuarioId", as: "tareas" });
  };

  Usuario.prototype.validarPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  return Usuario;
};
