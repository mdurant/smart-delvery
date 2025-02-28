const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: {
          msg: 'El nombre de usuario no puede estar vacío',
        },
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: {
          args: [6, 255],
          msg: 'La contraseña debe tener entre 6 y 255 caracteres',
        },
        isAlphanumeric: {
          msg: 'La contraseña debe ser alfanumérica',
        },
      },
    },
    company: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'La compañía no puede estar vacía',
        },
      },
    },
  }, {
    timestamps: true,
    hooks: {
      beforeCreate: async (user) => {
        try {
          user.password = await bcrypt.hash(user.password, 10);
        } catch (error) {
          throw new Error('Error al encriptar la contraseña: ' + error.message);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed('password')) {
          try {
            user.password = await bcrypt.hash(user.password, 10);
          } catch (error) {
            throw new Error('Error al encriptar la contraseña: ' + error.message);
          }
        }
      },
    },
  });

  User.associate = (models) => {
    User.hasMany(models.Delivery, { foreignKey: 'driverId', as: 'deliveries' });
    User.hasMany(models.Route, { foreignKey: 'driverId', as: 'routes' });
  };

  return User;
};