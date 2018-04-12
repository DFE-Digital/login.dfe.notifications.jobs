const verifyChangeEmailV1 = require('./verifyChangeEmailV1');

const register = (config, logger) => {
  return [
    verifyChangeEmailV1.getHandler(config, logger),
  ];
};

module.exports = {
  register,
};