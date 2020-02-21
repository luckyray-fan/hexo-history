const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
module.exports = {
  entry: './src/index.js',
  mode: 'production',
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
        use: ['vue-style-loader', 'css-loader'] //没有分css文件了
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
  externals: {
    vue: 'Vue'
  }
};
