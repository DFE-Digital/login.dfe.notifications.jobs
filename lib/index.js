const { union } = require('lodash');
const invite = require('./handlers/invite');
const passwordReset = require('./handlers/passwordReset');

const register = (config, logger) => {
  const inviteHandlers = invite.register(config, logger);
  const passwordResetHandlers = passwordReset.register(config, logger);

  return union(inviteHandlers, passwordResetHandlers);
};

module.exports = {
  register,
};