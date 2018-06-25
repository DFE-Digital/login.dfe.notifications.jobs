const accessRequestV1 = require('./accessRequestV1');

const register = (config, logger) => {
  return [
    accessRequestV1.getHandler(config, logger),
  ];
};

module.exports = {
  register,
};