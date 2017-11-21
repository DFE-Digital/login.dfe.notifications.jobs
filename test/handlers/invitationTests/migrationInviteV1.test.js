jest.mock('./../../../lib/infrastructure/email');

const config = {
  notifications: {
    type: 'disk',
    migrationUrl: 'http://unit.test/migration/',
  },
};
const logger = {
  info: jest.fn(),
  error: jest.fn(),
};
const data = {
  email: 'user.one@unit.test',
  firstName: 'User',
  lastName: 'One',
  serviceWelcomeMessage: 'welcome user one',
  serviceWelcomeMessageDescription: 'this is a unit test',
  serviceName: 'unit tests',
};

describe('when processing a migrationinvite_v1 job', () => {
  let emailSend;
  let email;
  let handler;

  beforeEach(() => {
    emailSend = jest.fn();
    email = require('./../../../lib/infrastructure/email');
    email.getEmailAdapter = jest.fn().mockImplementation(() => {
      return {
        send: emailSend,
      };
    });

    handler = require('./../../../lib/handlers/invite/migrationInviteV1').getHandler(config, logger);
  });

  it('then it should get email adapter with config and logger', async () => {
    await handler.processor(data);

    expect(email.getEmailAdapter.mock.calls.length).toBe(1);
    expect(email.getEmailAdapter.mock.calls[0][0]).toBe(config);
    expect(email.getEmailAdapter.mock.calls[0][1]).toBe(logger);
  });

  it('then it should send an email using the invitation template', async () => {
    await handler.processor(data);

    expect(emailSend.mock.calls.length).toBe(1);
    expect(emailSend.mock.calls[0][1]).toBe('invitation');
  });

  it('then it should send an email to the user', async () => {
    await handler.processor(data);

    expect(emailSend.mock.calls[0][0]).toBe(data.email);
  });

  it('then it should include the users name in the email data', async () => {
    await handler.processor(data);

    expect(emailSend.mock.calls[0][2]).toMatchObject({
      firstName: data.firstName,
      lastName: data.lastName,
    });
  });

  it('then it should include a link to migration site in the email data', async () => {
    await handler.processor(data);

    expect(emailSend.mock.calls[0][2]).toMatchObject({
      returnUrl: config.notifications.migrationUrl,
    });
  });

  it('then it should include a subject', async () =>{
    await handler.processor(data);

    expect(emailSend.mock.calls[0][3]).toBe('You have been invited to unit tests using DfE Sign in');
  });
});
