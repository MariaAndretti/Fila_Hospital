const { Sequelize } = require('sequelize');
require('dotenv').config();


module.exports = new Sequelize(
  process.env.DB_DATABASE,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 5433,
    dialect: process.env.DB_DIALECT || 'postgres',
    logging: false
  }
);
