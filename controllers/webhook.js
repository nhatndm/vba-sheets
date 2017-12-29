const cmd = require('node-cmd');

exports.webhook = (req, res, next) => {
  console.log(req.body);
  res.status(200).send();
};
