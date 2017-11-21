const getDefaultConfig = () => {
  return {
    loggerSettings: {
      logLevel: 'info',
      coors: {
        info: 'red',
        ok: 'green',
        error: 'yellow',
      },
    },
    notifications: {
      email: {
        type: 'disk'
      },
    },
  };
};

module.exports = {
  getDefaultConfig,
};
