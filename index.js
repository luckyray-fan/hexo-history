const fs = require('hexo-fs');

const scriptUrl = '/post-history/main.js';
var config = hexo.config.history;
function buildGenerator(sourcePath, distPath) {
  return {
    data: () => fs.createReadStream(sourcePath),
    path: distPath
  };
}
//将打包好后的main复制到public中
hexo.extend.generator.register('test', () => {
  return buildGenerator(require.resolve('./dist/main.js'), scriptUrl);
});
//添加上script标签
hexo.extend.filter.register('after_render:html', (htmlContent) => {
  const scriptToInject = `hexoHistory.init(${JSON.stringify(config)});`;
  const contentToInject = `<script src="${scriptUrl}"></script><script>${scriptToInject}</script>`;
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
