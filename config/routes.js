const express = require("express");
const usersController = require("../src/controllers/users-controller");
const authMiddleware = require("./middlewares/auth-middleware");

const initApiRoutes = () => {
  const router = express.Router();

  router.get("/users", usersController.getBandas);
  //   router.post("/users", usersController.createUser);
  //   router.put("/users", usersController.updateUser);

  return router;
};

module.exports = { initApiRoutes };
