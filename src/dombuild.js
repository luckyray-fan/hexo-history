const parser = require('./parser');
const diff = require('diff');
const ratio = 0.8;
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
  constructor(content) {
    this.content = content;
  }
  getClasses(i) {
    var res;
    if (i.added) res = classes.add;
    if (i.del) res = classes.del;
    return res;
  }
  getdiffer(cur, compare) {
    var curArr = [],
      compareArr = [],
      result = '';
    cur.content
      .filter((i) => i.tag || /\S/.test(i))
      .forEach((i) => {
        curArr.push(this.getNodes(i).outerHTML);
      });
    compare.content
      .filter((i) => i.tag || /\S/.test(i))
      .forEach((i) => {
        compareArr.push(this.getNodes(i).outerHTML);
      });
    var temDiff = diff.diffLines(curArr.join('\n'), compareArr.join('\n'));
    temDiff.forEach((i) => {
      if (i.added || i.removed) {
        var reg = /class="(.*?)"/;
        var temClass = this.getClasses(i);
        i.value = i.value.replace(reg, (match, p1) => {
          var res = `class="${p1} ${temClass}"`;
          return res;
        });
      }
      result += i.value;
    });
    return result;
  }
  getFragment(base, compare) {
    var content = this.content;
    var astArr = content.map((i) => {
      var temAST = parser(i);
      return this.findNode(temAST, 'article-container');
    });
    var cur = astArr[base];
    var result = this.getdiffer(cur, astArr[compare]);
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
          temElem.appendChild(document.createTextNode(i));
        }
      });
    }
    return temElem;
  }
  findNode(ast, className) {
    var result;
    if (!ast) return result;
    ast = ast.filter((i) => i.tag);
    for (let i = 0; i < ast.length; i++) {
      var tem = ast[i];
      if (tem.attrs && tem.attrs.class && tem.attrs.class.indexOf(className) !== -1) {
        return tem;
      } else {
        result = result ? result : this.findNode(tem.content, className);
      }
    }
    return result;
  }
}

module.exports = dombuild;
