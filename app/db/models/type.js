'use strict';
module.exports = (sequelize, DataTypes) => {
  const Type = sequelize.define('Type', {
    q_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {});
  Type.associate = (models) => {
    // associations can be defined here
  };
  return Type;
};
