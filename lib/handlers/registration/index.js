const registrationCompleteV1 = require('./registrationCompleteV1');

const register = (config, logger) => {
  return [
    registrationCompleteV1.getHandler(config, logger),
  ];
};

module.exports = {
  register,
};