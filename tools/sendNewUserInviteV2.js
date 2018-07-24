const { send } = require('./sendHelper');

const data = {
  email: 'floyd.price@digitial.education.gov.uk',
  firstName: 'Test',
  lastName: 'User',
  code: 'ABC123X',
  serviceName: 'local test',
  requiresDigipass: false,
  selfInvoked: false,
  invitationId: 'f5c3329d-a798-4e7e-aa15-b4b2c340df4a',
  overrides: {
    subject: "SUBJECT OVERRIDE",
    body: "BODY OVERRIDE",
  }
};

send('invitation_v2', data)
  .then(() => {
    console.info('done');
  })
  .catch((err) => {
    console.error(err);
  })
  .then(() => {
    process.exit(0);
  });