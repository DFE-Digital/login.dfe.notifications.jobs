jest.mock('./../../../lib/infrastructure/email');

const { getEmailAdapter } = require('./../../../lib/infrastructure/email');
const { getHandler } = require('./../../../lib/handlers/invite/newUserInvitationV2');

const send = jest.fn();
const logger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
const config = {
  notifications: {
    migrationUrl: 'https://profile.test/reg',
  },
};

describe('when sending v2 user invitation', () => {
  let data;
  let handler;

  beforeEach(() => {
    send.mockReset();
    getEmailAdapter.mockReset().mockReturnValue({
      send,
    });

    data = {
      invitationId: 'invitation-1',
      email: 'stephen.strange@new-avengers.test',
      firstName: 'Stephen',
      lastName: 'Strange',
      serviceName: 'Unit Test',
      requiresDigipass: true,
      selfInvoked: false,
      code: 'ABC123',
    };

    handler = getHandler(config, logger);
  });

  it('then it should send email using invitation template', async () => {
    await handler.processor(data);

    expect(send.mock.calls).toHaveLength(1);
    expect(send.mock.calls[0][1]).toBe('invitation');
  });

  it('then it should send email to email address in data', async () => {
    await handler.processor(data);

    expect(send.mock.calls).toHaveLength(1);
    expect(send.mock.calls[0][0]).toBe(data.email);
  });

  it('then it should use invite subject line if not self invoked', async () => {
    await handler.processor(data);

    expect(send.mock.calls).toHaveLength(1);
    expect(send.mock.calls[0][3]).toBe(`You’ve been invited to join ${data.serviceName}`);
  });

  it('then it should use register subject line if not self invoked', async () => {
    data.selfInvoked = true;

    await handler.processor(data);

    expect(send.mock.calls).toHaveLength(1);
    expect(send.mock.calls[0][3]).toBe(`You’ve registered to join ${data.serviceName}`);
  });

  it('then it should send email using template data', async () => {
    await handler.processor(data);

    expect(send.mock.calls).toHaveLength(1);
    expect(send.mock.calls[0][2]).toEqual({
      firstName: data.firstName,
      lastName: data.lastName,
      serviceName: data.serviceName,
      requiresDigipass: data.requiresDigipass,
      selfInvoked: data.selfInvoked,
      code: data.code,
      returnUrl: `${config.notifications.migrationUrl}/${data.invitationId}`,
    });
  });
});
