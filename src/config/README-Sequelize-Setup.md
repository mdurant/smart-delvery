
## Sequelize

Cómo trabajar con este Package en NodeJS, para ello estaremos trabajando con MYSQL como motor de datos.


## Conceptos

- ### sequelize: 
ORM para gestionar la base de datos.
- ### sequelize-cli: 
Herramienta CLI para migraciones y modelos.

### Configuración de config/config.js
El archivo config/config.js define las credenciales de la base de datos para Sequelize CLI. Crea este archivo en la carpeta config/:

Crear la carpeta y el archivo:


```bash
mkdir config
touch config/config.js
```
- Contenido de config/config.js:

```bash
// Carga variables de entorno desde .env usando Node.js nativo
process.loadEnvFile();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
  },
  test: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME + '_test',
    host: process.env.DB_HOST,
    dialect: 'mysql',
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
  },
};
```

## Configurar .ENV 

```bash
PORT=3000
DB_HOST=localhost
DB_USER=[user]
DB_PASSWORD=[tu_contraseña]
DB_NAME=smart_delivery
JWT_SECRET=[tu_secreto_jwt]
GOOGLE_MAPS_API_KEY=[tu_clave_api]
```

## Generación de Modelos con model:generate

Usaremos npx sequelize-cli model:generate para crear modelos y migraciones. Tomemos como ejemplo el modelo User (src/models/User.js):

### Definición de User:

```bash
const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: { notEmpty: { msg: 'El nombre de usuario no puede estar vacío' } },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        len: { args: [6, 255], msg: 'La contraseña debe tener entre 6 y 255 caracteres' },
        isAlphanumeric: { msg: 'La contraseña debe ser alfanumérica' },
      },
    },
    company: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: { notEmpty: { msg: 'La compañía no puede estar vacía' } },
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

```

### Comando para generar User:

```bash
npx sequelize-cli model:generate --name User --attributes "username:string,password:string,company:string"

```
### Detalle de --attributes

- username:string: Campo STRING.
- password:string: Campo STRING.
- company:string: Campo STRING.

### Esto genera:

Modelo: src/models/user.js (ajusta con validaciones, hooks y asociaciones como arriba).
Migración: migrations/YYYYMMDDHHMMSS-create-user.js.

```bash
'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
      id: { allowNull: false, autoIncrement: true, primaryKey: true, type: Sequelize.INTEGER },
      username: { type: Sequelize.STRING, allowNull: false, unique: true },
      password: { type: Sequelize.STRING, allowNull: false },
      company: { type: Sequelize.STRING, allowNull: false },
      createdAt: { allowNull: false, type: Sequelize.DATE },
      updatedAt: { allowNull: false, type: Sequelize.DATE }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Users');
  }
};

```

## Proceso de Migración

Las migraciones crean y gestionan el esquema de la base de datos. Usa Sequelize CLI para aplicarlas o deshacerlas.

### Paso 1: Ejecutar Migraciones
Aplica todas las migraciones en orden:

```bash
npx sequelize db:migrate

```

### Salida esperada:

```bash
Sequelize CLI [Node: 22.8.0, CLI: 6.6.2, ORM: 6.37.5]
Loaded configuration file "config/config.js".
Using environment "development".
== 20250228010000-create-user: migrating =======
== 20250228010000-create-user: migrated   0.123s

```
### Deshacer Migraciones (Ejemplo de UNDO)
Si necesitas revertir una migración (por ejemplo, la última aplicada):

```bash
npx sequelize db:migrate:undo

```
### Salida esperada:

```bash
== 20250228010000-create-user: reverting =======
== 20250228010000-create-user: reverted   0.123s
```

### Para deshacer todas las migraciones:

```bash
npx sequelize db:migrate:undo:all
```


## Notas Adicionales

**Variables de entorno:** Usa process.loadEnvFile() (Node 22.x) en lugar de dotenv para cargar .env.

**Orden de migraciones:** Si agregas modelos con claves foráneas (como Delivery.routeId → Routes), asegúrate de que las tablas referenciadas se creen primero.

**Soporte:** Reporta problemas en GitHub Issues.
¡Gracias por usar Smart Delivery! 🚚




## Support

Mauricio Durán - IntegralTech Spa - Santiago-Chile

