module.exports = {
  chainWebpack: config => {
    config.externals({
      luxon: 'luxon',
      d3: 'd3',
    });
  },

  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: false,
    },
  },
};
