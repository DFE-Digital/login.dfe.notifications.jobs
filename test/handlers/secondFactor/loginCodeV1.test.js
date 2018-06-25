jest.mock('./../../../lib/infrastructure/sms');

const { getSmsAdapter } = require('./../../../lib/infrastructure/sms');
const { getHandler } = require('./../../../lib/handlers/secondFactor/loginCodeV1');

const config = {};
const logger = {};
const data = {
  phoneNumber: '07700123456',
  code: '987654',
};
const send = jest.fn();

describe('when sending a second factor login code', () => {
  let handler;

  beforeEach(() => {
    send.mockReset();

    getSmsAdapter.mockReset().mockReturnValue({ send });

    handler = getHandler(config, logger);
  });

  it('then handler should be of type secondfactorlogincode_v1', () => {
    expect(handler.type).toBe('secondfactorlogincode_v1');
  });

  it('then handler should have a processor', () => {
    expect(handler.processor).toBeDefined();
  });

  it('then it should use config and logger with sms adapter', async () => {
    await handler.processor(data);

    expect(getSmsAdapter.mock.calls).toHaveLength(1);
    expect(getSmsAdapter.mock.calls[0][0]).toBe(config);
    expect(getSmsAdapter.mock.calls[0][1]).toBe(logger);
  });

  it('then it should send SMS to phone number', async () => {
    await handler.processor(data);

    expect(send.mock.calls).toHaveLength(1);
    expect(send.mock.calls[0][0]).toBe(data.phoneNumber);
  });

  it('then it should send SMS using 2FA template', async () => {
    await handler.processor(data);

    expect(send.mock.calls).toHaveLength(1);
    expect(send.mock.calls[0][1]).toBe('2FA');
  });

  it('then it should send SMS including code', async () => {
    await handler.processor(data);

    expect(send.mock.calls).toHaveLength(1);
    expect(send.mock.calls[0][2].code).toBe(data.code);
  });
});
