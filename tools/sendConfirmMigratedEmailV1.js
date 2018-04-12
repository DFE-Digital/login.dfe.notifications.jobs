const { send } = require('./sendHelper');

const data = {
  uid: '',
  email: 'test.user@tools.test',
  code: 'XYZ987',
  clientId: 'TESTTOOlS'
};

send('confirmmigratedemail_v1', data)
  .then(() => {
    console.info('done');
  })
  .catch((err) => {
    console.error(err);
  })
  .then(() => {
    process.exit(0);
  });