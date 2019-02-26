module.exports = {
  chainWebpack: config => {
    config.externals({
      moment: 'moment',
      d3: 'd3',
      vuex: 'vuex',
    });
  },

  pluginOptions: {
    webpackBundleAnalyzer: {
      openAnalyzer: false,
    },
  },
};
