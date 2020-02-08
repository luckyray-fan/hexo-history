const gitInfo = require('./git-provider')
var { repo, sha, path, token } = gitInfo
//由提交中的信息获取内容
async function getContent(repo, sha, path, token) {
  const contentResponse = await fetch(
    `https://api.github.com/repos/${repo}/contents${path}?ref=${sha}`,
    { headers: token ? { Authorization: `bearer ${token}` } : {} }
  );

  if (contentResponse.status === 404) {
    return { content: '' };
  }

  const contentJson = await contentResponse.json();

  if (!contentResponse.ok) {
    throw {
      status: contentResponse.status,
      body: contentJson
    };
  }

  const content = Base64.decode(contentJson.content); //原生的atob无法解码中文只能应用于ascii,或者可以先将中文用encodeUri那啥编码再解码
  return { content, url: contentJson.html_url };
}
//获取 github 的提交(commit) 内容与相关信息
async function getCommits() {
  var response = await fetch(
    `https://api.github.com/repos/${repo}/commits?sha=${sha}&path=${path}`
  );
  const json = await response.json();
  var commits = json.map((commit) => ({
    sha: commit.sha,
    date: new Date(commit.commit.author.date),
    author: {
      login: commit.author ? commit.author.login : commit.commit.author.name,
      avatar: commit.author
        ? commit.author.avatar_url
        : 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'
    },
    commitUrl: commit.html_url,
    message: commit.commit.message
  }));
  await Promise.all(
    commits.map(async (commit) => {
      if (!commit.content) {
        const info = await getContent(repo, commit.sha, path, token);
        commit.content = info.content;
        commit.fileUrl = info.url;
      }
    })
  );
  commits = commits.map((i) => i.content); //目前只需要内容
  return commits;
}
module.exports = getCommits;
