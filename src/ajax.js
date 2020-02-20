import gitInfo from './info-provider';
var { repo, sha, path, token } = gitInfo;
import { Base64, dateContract } from './util/index.js';
//由提交中的信息获取内容
function getFetch(url) {
  let storageData = sessionStorage.getItem(url);
  if (storageData === null) {
    return fetch(url, { headers: token ? { Authorization: `token ${token}` } : {} })
      .then(async (response) => {
        response = await response.json();
        sessionStorage.setItem(url, JSON.stringify(response));
        return response;
      })
      .catch((i) => {
        console.log(i);
        return i;
      });
  }
  return Promise.resolve(JSON.parse(storageData));
}
async function getContent(url) {
  const contentJson = await getFetch(url);
  let temJson = contentJson.files.find((i) => i.filename.includes(path.slice(1)));
  var fileContent = await getFetch(temJson.contents_url);

  const content = Base64.decode(fileContent.content); //原生的atob无法解码中文只能应用于ascii,或者可以先将中文用encodeUri那啥编码再解码
  return { content, changes: temJson.changes };
}
async function getCommitsInfo() {
  let temUrl = `https://api.github.com/repos/${repo}/commits?sha=${sha}&path=${path}`;
  var json = await getFetch(temUrl);

  var commits = json.map((commit) => ({
    sha: commit.sha,
    date: commit.commit.author.date,
    author: {
      login: commit.author ? commit.author.login : commit.commit.author.name,
      avatar: commit.author
        ? commit.author.avatar_url
        : 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'
    },
    commitUrl: commit.html_url,
    message: commit.commit.message,
    url: commit.url
  }));
  return commits;
}
var commits = '';
var commitsArr = [];
var count = 0;
//获取 github 的提交(commit) 内容与相关信息
async function getCommits() {
  if (commits.length <= 0) {
    commits = await getCommitsInfo();
  }
  var maxLen = commitsArr.length + 3 > commits.length ? commits.length : commitsArr.length + 3;
  let countCommits = commits.slice(commitsArr.length, maxLen);
  await Promise.all(
    countCommits.map(async (commit) => {
      if (!commit.content) {
        const info = await getContent(commit.url);
        commit.content = info.content;
        commit.time = commit.date;
        commit.date = dateContract(new Date(commit.date).getTime() / 1000);
        commit.changes = info.changes;
        commitsArr[count++] = commit;
      }
    })
  );
  if (commitsArr.length === commits.length) commitsArr.complete = true;
  return commitsArr; //获取日期与内容
}

export default getCommits;
