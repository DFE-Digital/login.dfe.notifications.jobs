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
    profileUrl: 'https://profile.test/reg',
    helpUrl: 'https://help.test',
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

  it('then it should use override subject line if one is present', async () => {
    data.overrides = {subject: "HELLO WORLD"};

    await handler.processor(data);

    expect(send.mock.calls).toHaveLength(1);
    expect(send.mock.calls[0][3]).toBe("HELLO WORLD");
  });

  it('then it should add html version of override body if one is present', async () => {
    data.overrides = {
      body: '#This is a test\n\nIt should *ignore* the formatting in _here_',
    };

    await handler.processor(data);

    expect(send.mock.calls).toHaveLength(1);
    expect(send.mock.calls[0][2].overrides.htmlBody).toBe("<h1>This is a test</h1>\n\n<p>It should <em>ignore</em> the formatting in <em>here</em></p>");
  });

  it('then it should add a plain text version of override body if one is present', async () => {
    data.overrides = {
      body: '#This is a test\n\nIt should *ignore* the formatting in _here_',
    };

    await handler.processor(data);

    expect(send.mock.calls).toHaveLength(1);
    expect(send.mock.calls[0][2].overrides.textBody).toBe("This is a test\nIt should ignore the formatting in here");
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
      helpUrl: `${config.notifications.helpUrl}/contact`,
      returnUrl: `${config.notifications.profileUrl}/register/${data.invitationId}`,
      overrides: {},
      email: 'stephen.strange@new-avengers.test'
    });
  });
});
