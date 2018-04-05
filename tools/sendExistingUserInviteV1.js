const { send } = require('./sendHelper');

const data = {
  email: 'test.user@tools.test',
  firstName: 'Test',
  lastName: 'User',
  serviceName: 'Some Service',
  returnUrl: 'http://example.com?outcome=account_exists'
};

send('existinguserinvitation_v1', data)
  .then(() => {
    console.info('done');
  })
  .catch((err) => {
    console.error(err);
  })
  .then(() => {
    process.exit(0);
  });