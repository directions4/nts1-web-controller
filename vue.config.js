// var webpack = require("webpack");

module.exports = {
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
