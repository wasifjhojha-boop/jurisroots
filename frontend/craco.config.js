const { whenDev } = require("@craco/craco");

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      return webpackConfig;
    },
  },
};
