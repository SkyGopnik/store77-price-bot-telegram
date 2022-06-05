import {Sequelize, SequelizeOptions} from 'sequelize-typescript';
import {createNamespace} from 'cls-hooked';

Sequelize.useCLS(createNamespace('transactional'));

const config:SequelizeOptions = require("@config/db.json");

const db:Sequelize = new Sequelize({
  port: config.port,
  host: config.host,
  username: config.username,
  password: config.password,
  database: config.database,

  native: config.native,
  dialect: config.dialect,
  dialectOptions: config.dialectOptions,

  pool: config.pool,
  define: config.define,

  logging: true,

  models: [__dirname + '/**/*.model.*'],
  modelMatch: (filename, member) => {
    return filename.substring(0, filename.indexOf('.model')) === member.toLowerCase();
  },
});

export default db;
