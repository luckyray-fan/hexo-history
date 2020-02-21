//直接由配置给定即可, 注意, 这里仅用来测试本地的文件
//对于 melody 的主题的话
var Info = {
  repo: 'luckyray-fan/luckyray-fan.github.io', //用户名+仓库名
  sha: 'master',
  path: '2019/10/20/promise-await-yield/',
  token: '1d5107f3e8a6dd270b60bb70ffce79485b387e53', //提升每小时访问github api 的limit
  anchorClass: 'article-container',
  baseUrl: '<base href="https://luckyray-fan.github.io/"/>'
};
let themeToClass = {
  melody: 'article-container',
  next: 'post-body'
};
if (window.hexoHistoryConfig) {
  Info.path = location.pathname;
  ({ repo: Info.repo, token: Info.token } = window.hexoHistoryConfig);
  if (window.hexoHistoryConfig.theme) {
    Info.anchorClass = themeToClass[window.hexoHistoryConfig.theme.toLowerCase()];
  }
  Info.baseUrl = false;
}

// gitInfo.path = location.pathname;
export default Info;
