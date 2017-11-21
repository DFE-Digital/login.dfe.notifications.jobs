jest.mock('./../../../lib/infrastructure/email');
jest.mock('uuid/v4', () => {
  return jest.fn().mockReturnValue('some-uuid');
});

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
  code: 'TEST01',
  clientId: 'CLIENT1',
};

describe('when processing a passwordreset_v1 job', () => {
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

    handler = require('./../../../lib/handlers/passwordReset/passwordResetV1').getHandler(config, logger);
  });

  it('then it should get email adapter with config and logger', async () => {
    await handler.processor(data);

    expect(email.getEmailAdapter.mock.calls.length).toBe(1);
    expect(email.getEmailAdapter.mock.calls[0][0]).toBe(config);
    expect(email.getEmailAdapter.mock.calls[0][1]).toBe(logger);
  });

  it('then it should send an email using the password-reset template', async () => {
    await handler.processor(data);

    expect(emailSend.mock.calls.length).toBe(1);
    expect(emailSend.mock.calls[0][1]).toBe('password-reset');
  });

  it('then it should send an email to the user', async () => {
    await handler.processor(data);

    expect(emailSend.mock.calls[0][0]).toBe(data.email);
  });

  it('then it should include the reset code in the email data', async () => {
    await handler.processor(data);

    expect(emailSend.mock.calls[0][2]).toMatchObject({
      code: data.code,
    });
  });

  it('then it should include the client id in the email data', async () => {
    await handler.processor(data);

    expect(emailSend.mock.calls[0][2]).toMatchObject({
      clientId: data.clientId,
    });
  });

  it('then it should include a link to interactions in the email data', async () => {
    await handler.processor(data);

    expect(emailSend.mock.calls[0][2]).toMatchObject({
      returnUrl: `${config.notifications.interactionsUrl}/some-uuid/resetpassword/confirm?clientid=${data.clientId}`,
    });
  });

  it('then it should include a subject', async () =>{
    await handler.processor(data);

    expect(emailSend.mock.calls[0][3]).toBe('Password reset');
  });
});
