const { send } = require('./sendHelper');

const data = {
  recipients: ['test.user@tools.test','test.user@tools2.test'],
  name: 'Test User',
  orgName: 'Org name',
};

send('approveraccessrequest_v1', data)
  .then(() => {
    console.info('done');
  })
  .catch((err) => {
    console.error(err);
  })
  .then(() => {
    process.exit(0);
  });