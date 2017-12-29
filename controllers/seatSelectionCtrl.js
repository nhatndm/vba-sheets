module.exports = (io) => {
  io.on('connection', (client) => {
    console.log(client.id);
  });
};
