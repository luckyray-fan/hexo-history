const getCommits = require('./ajax');
const dombuild = require('./dombuild');

var domResult; //= = 不能这样使用const
async function init() {
  var content = await getCommits();
  domResult = new dombuild(content);
}
init();
