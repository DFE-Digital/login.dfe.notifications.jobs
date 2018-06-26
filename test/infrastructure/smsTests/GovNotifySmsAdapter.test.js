jest.mock('notifications-node-client');

const { NotifyClient } = require('notifications-node-client');
const GovNotifySmsAdapter = require('./../../../lib/infrastructure/sms/GovNotifySmsAdapter');

const config = {
  notifications: {
    sms: {
      params: {
        apiKey: 'some-api-key',
        templates: {
          template1: 'some-template-id',
        },
      },
    },
  },
};
const logger = {
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
const sendSms = jest.fn();

const recipient = '07777123456';
const template = 'template1';
const data = {
  code: 'ABC123'
};

describe('when sending an SMS using Gov Notify', () => {
  let adapter;

  beforeEach(() => {
    sendSms.mockReset();

    NotifyClient.mockReset().mockImplementation(() => ({
      sendSms,
    }));

    adapter = new GovNotifySmsAdapter(config, logger);
  });

  it('then it should provide API key to new instance of notify client', () => {
    expect(NotifyClient.mock.calls).toHaveLength(1);
    expect(NotifyClient.mock.calls[0][0]).toBe(config.notifications.sms.params.apiKey);
  });

  it('then it should send SMS using mapped template id', async () => {
    await adapter.send(recipient, template, data);

    expect(sendSms.mock.calls).toHaveLength(1);
    expect(sendSms.mock.calls[0][0]).toBe(config.notifications.sms.params.templates.template1);
  });

  it('then it should send SMS to recipient', async () => {
    await adapter.send(recipient, template, data);

    expect(sendSms.mock.calls).toHaveLength(1);
    expect(sendSms.mock.calls[0][1]).toBe(recipient);
  });

  it('then it should send SMS with personalisation data', async () => {
    await adapter.send(recipient, template, data);

    expect(sendSms.mock.calls).toHaveLength(1);
    expect(sendSms.mock.calls[0][2]).toEqual({
      personalisation: data,
    });
  });

  it('then it should throw error if template name not mapped', async () => {
    try {
      await adapter.send(recipient, 'template2', data);
      throw new Error('No error thrown');
    } catch (e) {
      expect(e.message).toBe('No template by name template2 has been configured');
    }
  });

  it('then it should throw error if notify client throws error', async () => {
    sendSms.mockImplementation(() => {
      const e = new Error('some message');
      e.error = {
        status_code: 429,
        errors: [{
          error: 'RateLimitError',
          message: 'Exceeded rate limit for key type TEAM of 10 requests per 10 seconds'
        }]
      };
      throw e;
    });

    try {
      await adapter.send(recipient, template, data);
      throw new Error('No error thrown');
    } catch (e) {
      expect(e.message).toBe('Error sending template1 SMS to 07777123456. 429(RateLimitError): Exceeded rate limit for key type TEAM of 10 requests per 10 seconds');
    }
  })
});
