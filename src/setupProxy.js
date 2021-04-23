const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/calendar",
    createProxyMiddleware({
      target: "https://yortrips-service.herokuapp.com/api",
      //target: "http://localhost:51044/api",
      secure: false,
      changeOrigin: true,
    })
  );
};
