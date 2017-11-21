const jobs = require('./../lib');

const loadConfig = async () => {
  return Promise.resolve({
    notifications: {
      migrationUrl: 'http://tools.test/migration',
      interactionsUrl: 'http://tools.test/interactions',
      email: {
        type: 'disk',
      },
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
