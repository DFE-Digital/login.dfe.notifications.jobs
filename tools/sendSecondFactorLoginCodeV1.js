const { send } = require('./sendHelper');

const data = {
  phoneNumber: '07700123456',
  code: '123456',
};

send('secondfactorlogincode_v1', data)
  .then(() => {
    console.info('done');
  })
  .catch((err) => {
    console.error(err);
  })
  .then(() => {
    process.exit(0);
  });