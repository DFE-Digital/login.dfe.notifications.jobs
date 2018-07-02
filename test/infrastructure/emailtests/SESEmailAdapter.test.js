jest.mock('./../../../lib/infrastructure/email/utils');
jest.mock('aws-sdk');

describe('When sending an email using SES', () => {
  const sender = 'noreply@secure.access';
  const recipient = 'user.one@unit.tests';
  const bccRecipient = ['secondUser@unit.tests'];
  const template = 'some-email';
  const data = {
    item1: 'something'
  };
  const subject = 'some email to user';

  let awsSESSendEmail;
  let emailUtilsRenderEmailContent;

  let adapter;

  beforeEach(() => {
    awsSESSendEmail = jest.fn().mockImplementation((data, done) => {
      done();
    });
    const aws = require('aws-sdk');
    aws.SES.mockImplementation(() => {
      return {
        sendEmail: awsSESSendEmail
      }
    });

    emailUtilsRenderEmailContent = jest.fn().mockReturnValue([
      { type: 'html', content: 'some html' },
      { type: 'text', content: 'some plain text' },
    ]);
    const emailUtils = require('./../../../lib/infrastructure/email/utils');
    emailUtils.renderEmailContent = emailUtilsRenderEmailContent;

    const SESEmailAdapter = require('./../../../lib/infrastructure/email/SESEmailAdapter');
    adapter = new SESEmailAdapter({
      notifications: {
        email: {
          params: {
            accessKey: 'accessKey',
            accessSecret: 'accessKey',
            region: 'region',
            sender,
          }
        }
      }
    }, {
      info: jest.fn(),
      error: jest.fn(),
    });
  });

  it('then it should render the content using the template', async () => {
    await adapter.send(recipient, template, data, subject);

    expect(emailUtilsRenderEmailContent.mock.calls.length).toBe(1);
    expect(emailUtilsRenderEmailContent.mock.calls[0][0]).toBe(template);
    expect(emailUtilsRenderEmailContent.mock.calls[0][1]).toBe(data);
  });

  it('then it should send an email from the configured sender', async () => {
    await adapter.send(recipient, template, data, subject);

    expect(awsSESSendEmail.mock.calls[0][0].Source).toBe(sender);
  });

  it('then it should send an email to the recipient', async () => {
    await adapter.send(recipient, template, data, subject);

    expect(awsSESSendEmail.mock.calls.length).toBe(1);
    expect(awsSESSendEmail.mock.calls[0][0].Destination.ToAddresses.length).toBe(1);
    expect(awsSESSendEmail.mock.calls[0][0].Destination.ToAddresses[0]).toBe(recipient);
  });

  it('then it will send to the bcc addresses', async () => {
    await adapter.send(recipient, template, data, subject, bccRecipient);

    expect(awsSESSendEmail.mock.calls.length).toBe(1);
    expect(awsSESSendEmail.mock.calls[0][0].Destination.BccAddresses.length).toBe(1);
    expect(awsSESSendEmail.mock.calls[0][0].Destination.BccAddresses).toBe(bccRecipient);
  });

  it('then it should send an email with the subject', async () => {
    await adapter.send(recipient, template, data, subject);

    expect(awsSESSendEmail.mock.calls.length).toBe(1);
    expect(awsSESSendEmail.mock.calls[0][0].Message.Subject.Data).toBe(subject);
  });

  it('then it should send an email with html content', async () => {
    await adapter.send(recipient, template, data, subject);

    expect(awsSESSendEmail.mock.calls.length).toBe(1);
    expect(awsSESSendEmail.mock.calls[0][0].Message.Body.Html.Data).toBe('some html');
  });

  it('then it should send an email with plain text content', async () => {
    await adapter.send(recipient, template, data, subject);

    expect(awsSESSendEmail.mock.calls.length).toBe(1);
    expect(awsSESSendEmail.mock.calls[0][0].Message.Body.Text.Data).toBe('some plain text');
  });

  it('then it should send an email with plain text content', async () => {
    await adapter.send(recipient, template, data, subject);

    expect(awsSESSendEmail.mock.calls.length).toBe(1);
    expect(awsSESSendEmail.mock.calls[0][0].Message.Body.Text.Data).toBe('some plain text');
  });

  it('then it should throw an error if sending fails', async () => {
    awsSESSendEmail.mockImplementation((data, done) => {
      done('test error');
    });

    try {
      await adapter.send(recipient, template, data, subject);
      throw 'no error thrown';
    } catch (e) {
      expect(e).toBe('test error');
    }
  });
});