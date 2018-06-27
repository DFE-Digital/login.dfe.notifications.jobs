const loginCodeV1 = require('./loginCodeV1');

const register = (config, logger) => {
  return [
    loginCodeV1.getHandler(config, logger),

  ];
};

module.exports = {
  register,
};