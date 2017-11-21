const { send } = require('./sendHelper');

const data = {
  email: 'test.user@tools.test',
  firstName: 'Test',
  lastName: 'User',
  serviceWelcomeMessage: 'Welcome',
  serviceWelcomeMessageDescription: 'this is a welcome message for you',
  serviceName: 'Test tools',
};

send('migrationinvite_v1', data)
  .then(() => {
    console.info('done');
  })
  .catch((err) => {
    console.error(err);
  })
  .then(() => {
    process.exit(0);
  });