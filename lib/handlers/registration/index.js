const registerExistingUserV1 = require('./registerExistingUserV1');
const registrationCompleteV1 = require('./registrationCompleteV1');
const sendEntraIdOTP = require('./sendEntraIdOTP');

const register = (config, logger) => [
  registerExistingUserV1.getHandler(config, logger),

  registrationCompleteV1.getHandler(config, logger),

  sendEntraIdOTP.getHandler(config, logger),
];

module.exports = {
  register,
};
