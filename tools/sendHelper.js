const jobs = require('./../lib');

const loadConfig = async () => {
  return Promise.resolve({
    notifications: {
      migrationUrl: 'http://tools.test/migration',
      interactionsUrl: 'http://tools.test/interactions',
      profileUrl: 'http://tools.test/profile',
      servicesUrl: 'https://tools.test/services',
      email: {
        type: 'disk',
        params: {
          renderContent: true,
        },
      },
      sms: {
        type: 'disk',
        params: {
          renderContent: true,
        },
      }
    },
  });
};

const send = async (type, data) => {
  const config = await loadConfig();
  const handlers = jobs.register(config, console);
  const handler = handlers.find(x => x.type === type);
  if (!handler) {
    throw new Error(`Unable to find handler of type ${type}`);
  }

  await handler.processor(data);
};

module.exports = {
  send,
};
