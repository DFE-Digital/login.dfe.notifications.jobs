const migrationV1 = require('./migrationInviteV1');
const newUserInvitationV1 = require('./newUserInvitationV1');

const register = (config, logger) => {
  return [
    migrationV1.getHandler(config, logger),

    newUserInvitationV1.getHandler(config, logger),
  ];
};

module.exports = {
  register,
};