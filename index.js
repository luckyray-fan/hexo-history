const fs = require('hexo-fs');

var config = hexo.config.history || {};
function buildGenerator(sourcePath, distPath) {
  return {
    data: () => fs.createReadStream(sourcePath),
    path: distPath
  };
}
//将打包好后的main复制到public中
hexo.extend.generator.register('hexo-history-file', () => {
  return [
    { entry: './hexo-history-main.js', out: '/hexo-history-main.js' },
    {
      entry: './143146fa24554ae2c5ac0a3982abb952.woff2',
      out: '/143146fa24554ae2c5ac0a3982abb952.woff2'
    }
  ].map((i) => buildGenerator(require.resolve(i.entry), i.out));
});
//添加上script标签
hexo.extend.filter.register('after_render:html', (htmlContent) => {
  const scriptToInject = `HexoHistory(${JSON.stringify(config)});`; //把配置注册为全局变量好了
  let vueInject = `<script src="https://cdn.bootcss.com/vue/2.6.10/vue.min.js"></script>`;
  const contentToInject = `${vueInject}<script src="/hexo-history-main.js"></script><script>${scriptToInject}</script>`;
  let newHtmlContent = htmlContent;
  if (/([\n\r\s\t]*<\/body>)/i.test(htmlContent)) {
    const lastIndex = htmlContent.lastIndexOf('</body>');
    newHtmlContent = `${htmlContent.substring(
      0,
      lastIndex
    )}${contentToInject}${htmlContent.substring(lastIndex, htmlContent.length)}`;
  }
  return newHtmlContent;
});
