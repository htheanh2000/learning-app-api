const { authJwt } = require("../middlewares");
const controller = require("../controllers/vocabulary.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get("/api/vocabulary", controller.getAll);
  app.post("/api/vocabulary", controller.create);
  app.put("/api/vocabulary/:id", controller.update);
  app.delete("/api/vocabulary/:id", controller.delete);
  app.get("/api/vocabulary/:id", controller.getById);
};