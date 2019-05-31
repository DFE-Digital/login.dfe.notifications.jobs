const userServiceAddedV1 = require('./newServiceAddedV1');

const register = (config, logger) => {
  return [
    userServiceAddedV1.getHandler(config, logger),
  ];
};

module.exports = {
  register
};
