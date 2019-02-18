module.exports = {
  chainWebpack: config => {
    config.externals({
      moment: 'moment',
      d3: 'd3',
    });
  },

  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: false,
    },
  },
};
