const ENV = process.env.NODE_ENV || "development";
const { Sequelize } = require("sequelize");
const { MysqlConfig } = require("../environments/" + ENV).config;
// const userDb = require("../../entities/users");

const mySqlSequelize = new Sequelize(
  MysqlConfig.Db,
  MysqlConfig.User,
  MysqlConfig.Password,
  {
    host: MysqlConfig.Host,
    dialect: MysqlConfig.Dialect,
    operatorsAliases: 0,
  }
);

const initDatabase = () => {
  mySqlSequelize.sync({ force: false }).then(() => {
    console.log("Data base connection established");
  });
};

module.exports = {
  initDatabase,
};