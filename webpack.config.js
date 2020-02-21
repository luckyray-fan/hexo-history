const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
module.exports = {
  entry: './src/index.js',
  mode: 'development', //development
  devtool: 'inline-source-map',
  output: {
    filename: 'hexo-history-main.js',
    path: path.resolve(__dirname)
  },
  module: {
    rules: [
      // ... 其它规则
      {
        test: /\.vue$/,
        use: [
          {
            loader: 'vue-loader',
            options: {}
          }
        ]
      },
      {
        test: /\.js$/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      },
      {
        test: /\.(svg|ttf|eot|woff)\??.*$/,
        use: [
          {
            options: {
              name: '/[name].[ext]' //没必要上hash
            },
            loader: 'file-loader'
          }
        ]
      }
    ]
  },
  plugins: [new VueLoaderPlugin()],
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js'
    }
  },
  devServer: {
    contentBase: '.',
    hot: true,
    liveReload: true
  }
};
