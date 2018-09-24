const supportRequestV1 = require('./supportRequestV1');
const supportRequestConfirmationV1 = require('./supportRequestConfirmationV1');

const register = (config, logger) => {
  return [
    supportRequestV1.getHandler(config, logger),
    supportRequestConfirmationV1.getHandler(config, logger),
  ];
};

module.exports = {
  register,
};
