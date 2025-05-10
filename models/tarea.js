"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const Tarea = sequelize.define(
    "Tarea",
    {
      titulo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      estado: {
        type: DataTypes.STRING,
        defaultValue: "pendiente",
      },
      fechaLimite: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      usuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: "tareas",
      timestamps: true,
    }
  );

  Tarea.associate = function (models) {
    Tarea.belongsTo(models.Usuario, { foreignKey: "usuarioId", as: "usuario" });
  };

  return Tarea;
};
