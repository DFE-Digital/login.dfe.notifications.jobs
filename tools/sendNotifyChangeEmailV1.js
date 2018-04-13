const { send } = require('./sendHelper');

const data = {
  email: 'test.user@tools.test',
  firstName: 'Test',
  lastName: 'User',
  newEmail: 'test.user123@tools.test',
};

send('notifychangeemail_v1', data)
  .then(() => {
    console.info('done');
  })
  .catch((err) => {
    console.error(err);
  })
  .then(() => {
    process.exit(0);
  });