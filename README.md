- 刚测试了一下, 本来打算用 iframe 加载能够把事件也附带上, 但似乎没有用
- 如果有侧边栏的话, 会和文章内容不匹配

# hexo-history

文章历史对比, 显示每次更新差异的一个 hexo 插件, 关于如何开发的详细文章可见 [hexo history 插件开发](https://luckyray-fan.github.io/2020/02/19/hexo-history/)

## 展示

![](http://img.luckyray.cn/hexo-history.gif)

## 本地执行测试

- 本地执行测试, 更改 info-provider 内的 info 对象即可

| 参数名      | 含义                               |
| ----------- | ---------------------------------- |
| repo        | 用户名+仓库名                      |
| path        | 文件路径                           |
| anchorClass | 用于挂载和解析的文章节点           |
| baseUrl     | 使用 iframe 渲染时设定的 base 标签 |

- 执行 npm run s, 即可使用 webpack server 热加载
- 执行 npm run build, 即可构建开发版本
- 在当前文件夹下测试, 复制一个 index.html 过来, 当然要记得配置 info-provider
- hexo 实地测试, 把构建好的覆盖到 hexo node_modules 的 hexo-history 文件夹下, 当然在此之前先 npm install hexo-history, 然后 hexo clean(删除目录), hexo g(generate 的缩写), hexo s 即可

## 正式使用

设置 config, 名称为 hexoHistory, 参照下图操作即可

![](https://luckyray-fan.github.io/image/hexo-history-1.png)

> 拥有改变按钮位置的功能但**并未测试**, 可以配置 pos 字段, 当然你也可以在 theme 的 css 文件中强势覆盖

## 后续改进

- [x] icon 引入 bug
- [ ] diff 算法实现
- [ ] hexo 只选择 post 进行处理
