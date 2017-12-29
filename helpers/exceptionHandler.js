const error = require('./error');

module.exports = (app) => {
  // If no route is matched, this route will be triggered
  app.use((req, res, next) => {
    return error(404, 'Not Found', next);
  });

  // All error will be handled by this function and raise message for client
  app.use((err, req, res, next) => {
    res.status(err.status || 500).send({
      status: err.status,
      message: err.message,
    });
  });
};
