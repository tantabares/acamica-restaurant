const { MysqlConfig } = require("../config/environments/development").config;
const { Sequelize } = require("sequelize");

const mySqlSequelize = new Sequelize(
  "",
  MysqlConfig.User,
  MysqlConfig.Password,
  {
    host: MysqlConfig.Host,
    dialect: MysqlConfig.Dialect,
    dialectOptions: {
      multipleStatements: true,
    },
    operatorsAliases: 0,
  }
);

const setDb = async () => {
  try {
    await mySqlSequelize.query(
      `CREATE SCHEMA IF NOT EXISTS larissa_restaurant; 
      USE larissa_restaurant;`
    );
  } catch (err) {
    console.log(err.errors);
  }
};

const createUserTable = async () => {
  try {
    await mySqlSequelize.query(
      `CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        admin BOOL DEFAULT false,
        name VARCHAR(60) NOT NULL,
        username VARCHAR(60) NOT NULL UNIQUE,
        password VARCHAR(60) NOT NULL,
        email VARCHAR(60) NOT NULL,
        phone VARCHAR(60) NOT NULL,
        address VARCHAR(60) NOT NULL,
        active BOOL DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP);`
    );
  } catch (err) {
    console.log(err.errors);
  }
};

const createProductTable = async () => {
  try {
    await mySqlSequelize.query(
      `CREATE TABLE IF NOT EXISTS products (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(60) NOT NULL UNIQUE,
        image_url  VARCHAR(60) NOT NULL NOT NULL,
        description  VARCHAR(100) NOT NULL NOT NULL,
        price INT NOT NULL,
        active BOOL DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );`
    );
  } catch (err) {
    console.log(err.errors);
  }
};

const createOrderTable = async () => {
  try {
    await mySqlSequelize.query(
      `CREATE TABLE IF NOT EXISTS orders (
        id INT PRIMARY KEY AUTO_INCREMENT,
        id_user INT NOT NULL,
        price INT NOT NULL,
        payment_method ENUM('cash', 'card') NOT NULL,
        status ENUM('new', 'confirmed', 'preparing', 'out', 'delivered') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      );`
    );
  } catch (err) {
    console.log(err.errors);
  }
};

const createProductsByOrderTable = async () => {
  try {
    await mySqlSequelize.query(
      `CREATE TABLE products_by_order (
        id_order INT NOT NULL,
        id_product INT NOT NULL,
        quantity INT DEFAULT 1
      );`
    );
  } catch (err) {
    console.log(err.errors);
  }
};

const addForeignKeys = async () => {
  try {
    await mySqlSequelize.query(
      `ALTER TABLE orders
      ADD CONSTRAINT FK_ORDER_USER
      FOREIGN KEY (id_user) REFERENCES users(id);
      
      ALTER TABLE products_by_order
      ADD CONSTRAINT FK_PRODUCTBY_ORDER
      FOREIGN KEY (id_order) REFERENCES orders(id);
      
      ALTER TABLE products_by_order
      ADD CONSTRAINT FK_PRODUCTBY_PRODUCT
      FOREIGN KEY (id_product) REFERENCES products(id);`
    );
  } catch (err) {
    console.log(err.errors);
  }
};

const populateDb = async (req, res, next) => {
  try {
    await mySqlSequelize.query(
      `INSERT INTO users (name, admin, username, password, email, phone, address)
      VALUES ('david', 1, 'juan12da', '5646*', '1@.com', '3201230', 'cra 43d 23s'),
      ('daniel', 0, 'dan34de', '12345', '2@.com', '5412545', 'cl 23d 43');
      
      INSERT IGNORE INTO products (name, image_url, description, price)
      VALUES 
      ('perro', 'http://sasdas.co', 'perro cliente', '1000'),
      ('burger', 'http://sasdas.co', 'burger', '3000');

      INSERT INTO orders (id_user, price, payment_method, status)
      VALUES (1, 2000, 'cash', 'new');

      INSERT INTO products_by_order (id_order, id_product, quantity)
      VALUES (1, 1, 1),
      (1, 2, 2);`
    );
  } catch (err) {
    console.log(err.errors);
  }
};

const listQuery = async (req, res, next) => {
  return await mySqlSequelize.query(`SELECT * FROM users`, {
    type: mySqlSequelize.QueryTypes.SELECT,
  });
};

//como hacer esas funciones que se ejecutan de una?
const initSeed = async () => {
  await setDb();
  await createUserTable();
  await createProductTable();
  await createOrderTable();
  await createProductsByOrderTable();
  await addForeignKeys();
  await populateDb();
  // console.log(await listQuery());
};

initSeed();
