const { send } = require('./sendHelper');

const data = {
  email: 'test.user@tools.test',
  firstName: 'Test',
  lastName: 'User',
  orgName: 'Org name',
  approved: false,
  reason: 'This is a test reason'
};

send('accessrequest_v1', data)
  .then(() => {
    console.info('done');
  })
  .catch((err) => {
    console.error(err);
  })
  .then(() => {
    process.exit(0);
  });