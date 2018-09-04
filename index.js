const restify = require('restify'),
  restifyPlugins = restify.plugins,
  colors = require('colors'),
  lib = require('./lib'),
  swagger = require('swagger-node-restify'),
  config = require('config');

const server = restify.createServer(config.get('server'));

server.use(restifyPlugins.queryParser({
  mapParams: true
}));
server.use(restifyPlugins.bodyParser());

restify.defaultResponseHeaders = data => {
  this.header('Access-Control-Allow-Origin', '*');
}

server.use((req, res, next) => {
  let results = lib.schemaValidator.validateRequest(req);
  if(results.valid) {
    return next();
  }
  res.send(400, results);
});

//The swagger-ui is inside the "swagger-ui" folder
server.get(/^\/swagger-ui(\/.*)?/, restifyPlugins.serveStatic({
  directory: __dirname + '/',
  default: 'index.html'
}));

swagger.addModels(lib.schemas);
swagger.setAppHandler(server);
lib.helpers.setupRoutes(server, swagger, lib);

swagger.configureSwaggerPaths("", "/api-docs", "");  //We remove the {format} of the paths, to swagger.configure('http://localhost:9000', '0.1')

server.listen(config.get('server.port'), () => {
  lib.logger.info("Server started successfully...");
  lib.db.connect(err => {
    if(err) {
      lib.logger.error("Error trying to connect to database: ", err);
    } else {
      lib.logger.info("Database service successfully started")
    }
  });
});


