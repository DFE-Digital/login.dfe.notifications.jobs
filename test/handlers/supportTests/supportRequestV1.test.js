jest.mock('./../../../lib/infrastructure/email');

const { getEmailAdapter } = require('./../../../lib/infrastructure/email');
const { getHandler } = require('./../../../lib/handlers/support/supportRequestV1');
const emailSend = jest.fn();

const config = {
  notifications: {
    supportEmailAddress: 'support@unit.tests',
  },
};
const logger = {};
const jobData = {
  name: 'User One',
  email: 'user.one@unit.tests',
  saUsername: 'userone',
  phone: '1234567890',
  message: 'I am having issues signing in using my new details',
  reference: 'SIN123456798',
  service: 'Service Name',
  type: 'type of issue',
};

describe('When handling supportrequest_v1 job', () => {
  beforeEach(() => {
    emailSend.mockReset();

    getEmailAdapter.mockReset();
    getEmailAdapter.mockReturnValue({ send: emailSend });
  });

  it('then it should return a handler with a processor', () => {
    const handler = getHandler(config, logger);

    expect(handler).not.toBeNull();
    expect(handler.type).toBe('supportrequest_v1');
    expect(handler.processor).not.toBeNull();
    expect(handler.processor).toBeInstanceOf(Function);
  });

  it('then it should get email adapter with supplied config and logger', async () => {
    const handler = getHandler(config, logger);

    await handler.processor(jobData);

    expect(getEmailAdapter.mock.calls).toHaveLength(1);
    expect(getEmailAdapter.mock.calls[0][0]).toBe(config);
    expect(getEmailAdapter.mock.calls[0][1]).toBe(logger);
  });

  it('then it should send email to support email address', async () => {
    const handler = getHandler(config, logger);

    await handler.processor(jobData);

    expect(emailSend.mock.calls).toHaveLength(1);
    expect(emailSend.mock.calls[0][0]).toBe(config.notifications.supportEmailAddress);
  });

  it('then it should send email using support-request template', async () => {
    const handler = getHandler(config, logger);

    await handler.processor(jobData);

    expect(emailSend.mock.calls).toHaveLength(1);
    expect(emailSend.mock.calls[0][1]).toBe('support-request');
  });

  it('then it should send email using request data as model', async () => {
    const handler = getHandler(config, logger);

    await handler.processor(jobData);

    expect(emailSend.mock.calls).toHaveLength(1);
    expect(emailSend.mock.calls[0][2]).toEqual({
      name: jobData.name,
      email: jobData.email,
      saUsername: jobData.saUsername,
      phone: jobData.phone,
      message: jobData.message,
      reference: jobData.reference,
      service: jobData.service,
      type: jobData.type,
    });
  });

  it('then it should send email with subject', async () => {
    const handler = getHandler(config, logger);

    await handler.processor(jobData);

    expect(emailSend.mock.calls).toHaveLength(1);
    expect(emailSend.mock.calls[0][3]).toBe('DfE Sign-in service desk request: SIN123456798');
  });
});
