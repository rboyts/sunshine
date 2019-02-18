module.exports = {
  chainWebpack: config => {
    config.module.rules.delete('svg');
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
