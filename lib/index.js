const { union } = require('lodash');
const invite = require('./handlers/invite');
const passwordReset = require('./handlers/passwordReset');
const support = require('./handlers/support');
const registration = require('./handlers/registration');
const confirmMigratedEmail = require('./handlers/confirmMigratedEmail');

const register = (config, logger) => {
  const inviteHandlers = invite.register(config, logger);
  const passwordResetHandlers = passwordReset.register(config, logger);
  const supportHandlers = support.register(config, logger);
  const registrationHandlers = registration.register(config, logger);
  const confirmMigratedEmailHandlers = confirmMigratedEmail.register(config, logger);

  return union(inviteHandlers, passwordResetHandlers, supportHandlers, registrationHandlers, confirmMigratedEmailHandlers);
};

module.exports = {
  register,
};