const { take  } = require('lodash');
const { getEmailAdapter } = require('./../../infrastructure/email');

const process = async (config, logger, data) => {
  const email = getEmailAdapter(config, logger);

  let moreData = true;

  let bccRecipients;
  let emails = data.recipients;
  let skip =0;

  while(moreData) {
    bccRecipients =  take(emails.slice(skip),49);
    if(bccRecipients && bccRecipients.length > 0 ) {
      await email.send('noreply@dfenewsecureaccess.org.uk', 'approver-access-request-email', {
        orgName: data.orgName,
        name: data.name,
        returnUrl:`${config.notifications.servicesUrl}/access-requests`,
      }, `Access request for ${data.orgName}`, bccRecipients);
      skip = skip + 49;
    } else {
      moreData = false;
    }
  }

};

const getHandler = (config, logger) => {
  return {
    type: 'approveraccessrequest_v1',
    processor: async (data) => {
      await process(config, logger, data);
    }
  };
};

module.exports = {
  getHandler,
};