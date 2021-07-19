const serviceRequestedV1 = require('./serviceRequestToApproversV1');

const register = (config, logger) => {
  return [
    serviceRequestedV1.getHandler(config, logger),
  ];
};

module.exports = {
  register
};
