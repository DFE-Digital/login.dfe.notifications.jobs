jest.mock('./../../../lib/infrastructure/email');

const { getEmailAdapter } = require('./../../../lib/infrastructure/email');
const { getHandler } = require('./../../../lib/handlers/accessRequest/approverAccessRequest');
const emailSend = jest.fn();

const config = {
  notifications: {
    profileUrl: 'https://profile.dfe.signin',
  },
};
const logger = {};
const jobData = {
  orgName: 'Test Organisation',
  name: 'Test One',
  returnUrl: 'https://mytest',
  recipients: ['test1@unit','test2@unit']
};

describe('When handling approverAccessRequest_v1 job', () => {
  beforeEach(() => {
    emailSend.mockReset();

    getEmailAdapter.mockReset();
    getEmailAdapter.mockReturnValue({ send: emailSend });
  });

  it('then it should return a handler with a processor', () => {
    const handler = getHandler(config, logger);

    expect(handler).not.toBeNull();
    expect(handler.type).toBe('approveraccessrequest_v1');
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

  it('then it should send email to users email address', async () => {
    const handler = getHandler(config, logger);

    await handler.processor(jobData);

    expect(emailSend.mock.calls).toHaveLength(1);
    expect(emailSend.mock.calls[0][0]).toBe('noreply@dfenewsecureaccess.org.uk');
  });

  it('then it should send email using approver-access-request-email template', async () => {
    const handler = getHandler(config, logger);

    await handler.processor(jobData);

    expect(emailSend.mock.calls).toHaveLength(1);
    expect(emailSend.mock.calls[0][1]).toBe('approver-access-request-email');
  });

  it('then it should send email using request data as model', async () => {
    const handler = getHandler(config, logger);

    await handler.processor(jobData);

    expect(emailSend.mock.calls).toHaveLength(1);
    expect(emailSend.mock.calls[0][2]).toEqual({
      name: jobData.name,
      orgName: jobData.orgName,
      returnUrl: jobData.returnUrl,
    });
  });

  it('then it should send email with subject', async () => {
    const handler = getHandler(config, logger);

    await handler.processor(jobData);

    expect(emailSend.mock.calls).toHaveLength(1);
    expect(emailSend.mock.calls[0][3]).toBe(`Access request for ${jobData.orgName}`);
  });

  it('then emails are sent in batches of fifty email addresses', async ()=>{
    jobData.recipients = new Array(60).fill('test@test');
    const handler = getHandler(config, logger);

    await handler.processor(jobData);

    expect(emailSend.mock.calls).toHaveLength(2);
    expect(emailSend.mock.calls[0][4]).toHaveLength(49);
    expect(emailSend.mock.calls[1][4]).toHaveLength(11);
  });
});
