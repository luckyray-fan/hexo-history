# hexo-history

文章历史对比, 显示每次更新差异的一个 hexo 插件, 关于如何开发的详细文章可见[]()

## 使用方法

- 本地执行测试, 更改 info-provider 即可

| 参数名      | 含义                               |
| ----------- | ---------------------------------- |
| repo        | 用户名+仓库名                      |
| path        | 文件路径                           |
| anchorClass | 用于挂载和解析的文章节点           |
| baseUrl     | 使用 iframe 渲染时设定的 base 标签 |

- 正式使用, 设置 config, 名称为 hexoHistory, 参照下图操作即可

## 后续改进

- icon 引入 bug
- diff 算法实现
- hexo 只选择 post 进行处理