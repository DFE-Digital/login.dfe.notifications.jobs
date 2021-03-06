const { send } = require('./sendHelper');

const data = {
  email: 'test.user@tools.test',
  firstName: 'Test',
  lastName: 'User',
  code: 'ABC123X',
  invitationId: 'f5c3329d-a798-4e7e-aa15-b4b2c340df4a',
};

send('invitation_v1', data)
  .then(() => {
    console.info('done');
  })
  .catch((err) => {
    console.error(err);
  })
  .then(() => {
    process.exit(0);
  });