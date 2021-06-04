const { send } = require('./sendHelper');

const data = {
  name: 'test name',
  email: 'test email',
  orgName: 'test org name',
  urn: 'test urn',
  message: 'message',
  service: 'service',
  type: 'other',
  typeAdditionalInfo: 'test message',
};

send('supportrequest_v1', data)
  .then(() => {
    console.info('done');
  })
  .catch((err) => {
    console.error(err);
  })
  .then(() => {
    process.exit(0);
  });
