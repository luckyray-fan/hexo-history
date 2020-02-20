var diff = require('diff');
var johDiff = require('./jognDiff');
var a = '开发流程: 开发打包好, 复制到博客下面, hexo g 运行, 观察结果';
var b = '开发打包, 复制到博客下面, 同偶,hexo g 运行, 观察结果, 开发流程: ';
var c = johDiff(a, b);
console.dir(c);

// 开发流程: 开发打包好, 复制到博客下面, hexo g 运行, 观察结果
// - hexo 是如何读取插件的
//获取commits的信息 -> 对比信息 -> render(vue), 写好对比算法比较好
//如何开始写 vue -> 整个项目的运行流程
/**
 * - 可以参考的项目
 *  - https://juejin.im/post/5b8fe0aff265da0afc2bd725
 *  - https://github.com/JunJieFu/secdra-web/tree/master/components/global
 *  - https://juejin.im/post/5bd0283df265da0afc2c3b63
 * - webpack vue-loader, 将打包出来的 main.js 插入html
 * - template runtime error https://www.imooc.com/article/17868
 * - hmr, webpack-dev-server, hot, live-reload
 * - 插件应该如何运行
 *  - 目标
 *    - 可以看出来原句和更新后的句子, 如果原句某些部分过长就省略
 *    - 同上可以看出原来的文章和更新后的文章
 *    - 只有一行文字, 没有对比, 可以查看另一版本的文字
 *  - 原文可能的差异
 *    - 原文没有这句
 *    - 原文有新文没有
 *    - 双方都有, 但是位置不一样
 *    - 双方都有, 且位置相似, 但是有改动, 包括, 删减, 增加
 *  - 如何显示差异
 *    - 在原句上直接有三种类型, 增加, 删除, 改动, 按照原文数据比照下来, 移动位置不会管
 *    - github 类型, 只有加减, 在最前面有加减号
 *    > 参考网站 http://cn.piliapp.com/text-diff/#diff http://www.mergely.com/
 *    > 参考资料, 算法: A technique for isolating differences between files, mergely js,jsdifflib
 *      https://github.com/myndzi/heckel-diff http://documents.scribd.com/docs/10ro9oowpo1h81pgh1as.pdf
 *      http://cacycle.altervista.org/wikEd-diff-tool.html
 *  - 有什么操作
 *    - 更换对比日期, 重复上述操作
 *    - 不显示 history
 *  - 流程
 *    - 加载插件, 初始化
 *    - 获取数据, diff 对比, 输出数组
 *    - 根据输出渲染页面
 *  - 针对 p, h1-6, ol 等标签
 *
 */
/** 骨架屏
 * https://juejin.im/post/5b79a2786fb9a01a18267362
 * https://www.imooc.com/article/289688
 * https://github.com/Jocs/jocs.github.io/issues/22
 * https://segmentfault.com/a/1190000014832185 vue页面骨架屏注入实践
 * - 采用 css 处理, 行内元素防止一行一行, 不让字体显示, transparent+text-indent
 * 解决diff算法, 思考渲染方式, 获取到commits信息处理得到渲染数据
 * 预渲染骨架屏, 如何用vue渲染一篇文章, 写出删减与增加的样式和段落展示并构成组件,
 * - vue绑定id, 按钮样式, 按钮与父子组件通讯, 插入拼接字符串, 然后替换$el
 *    - base64 https://www.jianshu.com/p/54084db83d70
 * - 按钮信息, 保存最开始的dom元素
 * - 加载commits限制(https://developer.github.com/v3/#rate-limiting)(https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line)
 * - 对比差异渲染
 *  - 选用解析库(https://astexplorer.net/#/2AmVrGuGVJ https://www.npmtrends.com/cheerio-vs-htmlparser2-vs-jsdom-vs-parse5-vs-scraper), 可以比较一下 domparser()
 *  - 检测对比数组变动(https://blog.csdn.net/wang839305939/article/details/79063320 | https://stackoverflow.com/questions/5100376/how-to-watch-for-array-changes)
 *  - 304处理(按理来说浏览器会给我处理, 但是这里却没有, 奇怪, 可以试试no-cache https://stackoverflow.com/questions/49751311/are-browsers-supposed-to-handle-304-responses-automagically | https://stackoverflow.com/questions/41549540/does-the-cache-for-fetch-need-to-be-managed-by-the-client), http cache (https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/304)
 *  - 解析文章方法, 从一篇文章到另一篇的过程
 *    - 递归元素节点, 获取字符串拼接, 当做数组
 *    - iframe, embed, tag加上地址
 *    - 对于a链接, 每个文字后面带着链接地址
 *    - 递归找到节点
 *    - 遍历寻找相似节点
 *    - 对比结果对象与原ast对象对应
 *  - 选择commit直接更新返回到文章(可能需要重新加载一下js)
 *    - 显示当前查看的信息
 *    - 可以返回之前的查询页面
 *    - 增加切换的左右两个箭头
 *    - 增加选择更多的commit的功能
 *  - 根据用户配置与url得到git-provider
 *  - 重新加载js -> 重新加载整个页面, 保留main.js
 *  - vue.extend 挂载
 *  - 全局刷新, dom注入 -> 使用iframe解决
 *  - 保存dom不被修改, 同时保存事件
 *  - 显示有多少差异
 *  - 比较文章内容差异, 并加上样式
 *  - 打包优化发布, 写文章
 *    - 优化webpack, 写好 config 部分, 除去个人信息
 *      - 可以选择按钮的位置
 *    - 编写好hexo 插件部分, 上传npm
 *    - 在自己那直接测试
 *    - 文章内容: 如何本地测试与使用(readme), 如何开发的
 *  - bug fix
 *    - 请求没有按照顺序返回
 *  - 兼容next主题
 *  - **换主题的解决方案**
 *  - 挂载点问题解决
 *  - style icon bug 解决
 */
