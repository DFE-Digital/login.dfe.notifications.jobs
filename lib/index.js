const { union } = require("lodash");
const invite = require("./handlers/invite");
const passwordReset = require("./handlers/passwordReset");
const support = require("./handlers/support");
const registration = require("./handlers/registration");
const confirmMigratedEmail = require("./handlers/confirmMigratedEmail");
const changeProfile = require("./handlers/changeProfile");
const accessRequest = require("./handlers/accessRequest");
const unmigratedSaUser = require("./handlers/unmigratedSaUser");
const newServiceAdded = require("./handlers/serviceAdded");
const userOrganisation = require("./handlers/userOrganisation");
const changeUserPermission = require('./handlers/userPermissions');
const serviceRemoved = require('./handlers/serviceRemoved');
const serviceRequested = require('./handlers/serviceRequested');
const serviceRequestRejected = require('./handlers/serviceRequestRejected');
const subServiceRequested = require('./handlers/subServiceRequested');
const subServiceRequestActioned = require('./handlers/subServiceRequestActioned')

const register = (config, logger) => {
  const inviteHandlers = invite.register(config, logger);
  const passwordResetHandlers = passwordReset.register(config, logger);
  const supportHandlers = support.register(config, logger);
  const registrationHandlers = registration.register(config, logger);
  const confirmMigratedEmailHandlers = confirmMigratedEmail.register(config,logger);
  const changeProfileHandlers = changeProfile.register(config, logger);
  const accessRequestHandler = accessRequest.register(config, logger);
  const unmigratedSaUserHandler = unmigratedSaUser.register(config, logger);
  const newServiceAddedHandler = newServiceAdded.register(config, logger);
  const userOrganisationHandler = userOrganisation.register(config,logger);
  const changeUserPermissionHandler = changeUserPermission.register(config, logger);
  const serviceRemovedHandler = serviceRemoved.register(config, logger);
  const serviceRequestedHandler = serviceRequested.register(config, logger);
  const serviceRequestRejectedHandler = serviceRequestRejected.register(config, logger);
  const subServiceRequestedHandler = subServiceRequested.register(config, logger);
  const subServiceRequestActionedHandler = subServiceRequestActioned.register(config,logger);

  return union(
    inviteHandlers,
    passwordResetHandlers,
    supportHandlers,
    registrationHandlers,
    confirmMigratedEmailHandlers,
    changeProfileHandlers,
    accessRequestHandler,
    unmigratedSaUserHandler,
    newServiceAddedHandler,
    userOrganisationHandler,
    changeUserPermissionHandler,
    serviceRemovedHandler,
    serviceRequestedHandler,
    serviceRequestRejectedHandler,
    subServiceRequestedHandler,
    subServiceRequestActionedHandler
  );
};

module.exports = {
  register
};
