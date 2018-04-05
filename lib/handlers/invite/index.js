const migrationV1 = require('./migrationInviteV1');
const newUserInvitationV1 = require('./newUserInvitationV1');
const newUserInvitationV2 = require('./newUserInvitationV2');
const existingUserInvitationV1 = require('./existingUserInvitationV1');

const register = (config, logger) => {
  return [
    migrationV1.getHandler(config, logger),

    newUserInvitationV1.getHandler(config, logger),
    newUserInvitationV2.getHandler(config, logger),

    existingUserInvitationV1.getHandler(config, logger),
  ];
};

module.exports = {
  register,
};