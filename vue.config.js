// var webpack = require("webpack");

module.exports = {
  publicPath: "/nts1-web-controller/",
  lintOnSave: false,
  pluginOptions: {
    quasar: {
      treeShake: true
    }
  },
  transpileDependencies: [/[\\/]node_modules[\\/]quasar[\\/]/]
  // configureWebpack: {
  //   plugins: [new webpack.HotModuleReplacementPlugin()]
  // }
};
