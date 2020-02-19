const parser = require('./parser');
import { diff, diffPage } from './diff';
const ratio = 0.8;
var anchorClass = 'article-container';
if (window.hexoHistoryConfig) {
  let themeToClass = {
    melody: 'article-container',
    next: 'post-body'
  };
  anchorClass = themeToClass[window.hexoHistoryConfig.theme];
}
const classes = {
  add: 'add',
  del: 'del',
  change: 'change'
};
class node {
  constructor(tag) {
    this.tag = tag || 'div';
    this.content = [];
    this.attrs = {
      class: ''
    };
  }
}
class dombuild {
  constructor() {
    this.astArr = []; //突然想到, 写一个set函数不就好了吗, 还更符合面向对象🙃
  }
  setArr(arr) {
    arr = typeof arr === 'string' ? [arr] : arr;
    arr.forEach((i) => {
      let tem = parser(i);
      window.tem = tem;
      tem = this.findNode(tem, anchorClass);
      tem = tem.filter(
        (i) => i !== ' ' //去除无意义文本节点
      );
      this.astArr.push(tem);
    });
  }
  getPageArr(ast) {
    let result = [],
      content = (content = ast.length > 0 ? ast : ast.content);
    if (!content) return [];
    content.forEach((i) => {
      let res = '';
      if (typeof i !== 'string') {
        if (['br'].includes(i.tag)) {
          res += '<br>';
        } else {
          res += this.getPageArr(i).join('');
        }
      } else {
        res += i;
      }
      if (['a'].includes(i.tag)) {
        res += i.attrs.href;
      }
      result.push(res);
    });
    return result;
  }
  getdiffer(base, compare) {
    let [baseAst, compareAst] = [base, compare].map((i) => this.astArr[i]);
    let [baseArr, compareArr] = [baseAst, compareAst].map((i) => this.getPageArr(i));
    let resultArr = diffPage(baseArr, compareArr);
    resultArr.map((i) => {
      //对于p元素等内容并不是很复杂的一套, 然后img一套处理, 还有pre一套处理, 如果还有其他想到的再加
      //a链接也要处理, 目标是从得到的文章新旧整体对比细化, 其实可以直接表现出来没必要找到那个不同的点标记
    });
    return resultArr;
  }
  getFragment(base, compare) {
    if (compare === undefined) {
      compare = base;
      base = 0;
    }
    var result = this.getdiffer(base, compare);

    result = this.getNodes(result);
    return result;
  }
  getNodes(elem) {
    var temElem = document.createElement(elem.tag);
    if (elem.attrs) {
      var attrs = Object.keys(elem.attrs);
      attrs.forEach((i) => temElem.setAttribute(i, elem.attrs[i]));
    }
    if (elem.content) {
      elem.content.forEach((i) => {
        if (i.tag) {
          temElem.appendChild(this.getNodes(i));
        } else {
          temElem.appendChild(document.createTextNode(i)); //将来优化直接在原dom上改, 而不是新建一个dom
        }
      });
    }
    return temElem;
  }
  findNode(ast, className) {
    let result = [];
    if (!ast) return result;
    ast = ast.filter((i) => i.content);
    for (let i = 0; i < ast.length; i++) {
      let tem = ast[i];
      if (tem.attrs && tem.attrs.class && tem.attrs.class.includes(className)) {
        return tem.content;
      } else {
        result = result.length > 0 ? result : this.findNode(tem.content, className);
        if (result.length > 0) return result; //[]竟然会被判断为true
      }
    }
    return result;
  }
  async getDomFragment(item) {
    let iframe = document.getElementById('hexo-history-iframe');
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.setAttribute('id', 'hexo-history-iframe');
      document.body.appendChild(iframe);
    }
    if (!window.hexoHistoryConfig) {
      item =
        item.slice(0, item.indexOf('<head>') + 6) +
        '<base href="https://luckyray-fan.github.io/"/>' +
        item.slice(item.indexOf('<head>') + 6);
    }

    iframe.srcdoc = item; //也存在采用异步的加载方式
    return new Promise((resolve, rej) => {
      iframe.onload = function() {
        let node = iframe.contentDocument.getElementsByClassName(anchorClass)[0];
        resolve(node);
      };
    });
  }
}

export default dombuild;
