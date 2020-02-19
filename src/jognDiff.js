let { diffString } = (function() {
  class words {
    constructor(type, text) {
      this.type = type;
      this.text = text;
    }
  }
  function escape(s) {
    var n = s;
    n = n.replace(/&/g, '&amp;');
    n = n.replace(/</g, '&lt;');
    n = n.replace(/>/g, '&gt;');
    n = n.replace(/"/g, '&quot;');

    return n;
  }

  function diffString(o, n) {
    //去除尾部空格
    o = o.replace(/\s+$/, '');
    n = n.replace(/\s+$/, '');

    var out = diff(o == '' ? [] : o.split(/\s+/), n == '' ? [] : n.split(/\s+/));
    var str = '';

    var oSpace = o.match(/\s+/g);
    if (oSpace == null) {
      oSpace = ['\n'];
    } else {
      oSpace.push('\n');
    }
    var nSpace = n.match(/\s+/g);
    if (nSpace == null) {
      nSpace = ['\n'];
    } else {
      nSpace.push('\n');
    }

    if (out.n.length == 0) {
      for (var i = 0; i < out.o.length; i++) {
        str += '<del>' + escape(out.o[i]) + oSpace[i] + '</del>';
      }
    } else {
      if (out.n[0].text == null) {
        for (n = 0; n < out.o.length && out.o[n].text == null; n++) {
          str += '<del>' + escape(out.o[n]) + oSpace[n] + '</del>';
        }
      }

      for (var i = 0; i < out.n.length; i++) {
        if (out.n[i].text == null) {
          str += '<ins>' + escape(out.n[i]) + nSpace[i] + '</ins>';
        } else {
          var pre = '';

          for (n = out.n[i].row + 1; n < out.o.length && out.o[n].text == null; n++) {
            pre += '<del>' + escape(out.o[n]) + oSpace[n] + '</del>';
          }
          str += ' ' + out.n[i].text + nSpace[i] + pre;
        }
      }
    }

    return str;
  }

  function diff(o, n) {
    var ns = {},
      os = {};

    //将分解后的o,n按顺序传入对象并计数
    for (var i = 0; i < n.length; i++) {
      if (ns[n[i]] == null) ns[n[i]] = { rows: [], o: null };
      ns[n[i]].rows.push(i);
    }

    for (var i = 0; i < o.length; i++) {
      if (os[o[i]] == null) os[o[i]] = { rows: [], n: null };
      os[o[i]].rows.push(i);
    }
    //遍历属性名赋值给i
    for (var i in ns) {
      //ns 与 os 都有该属性名, 且均只出现了一次
      if (ns[i].rows.length == 1 && typeof os[i] != 'undefined' && os[i].rows.length == 1) {
        // 将n与o中这个部分的值改为文本与之前相同, row对应对比数组中的位置的对象
        n[ns[i].rows[0]] = { text: n[ns[i].rows[0]], row: os[i].rows[0] };
        o[os[i].rows[0]] = { text: o[os[i].rows[0]], row: ns[i].rows[0] };
      }
    }
    var res = [],
      nInd = 0;

    /**
     * move, insert, delete, original
     * 一个旧的字符串应该是怎样子转变为一个新的字符串
     */
    for (let i = 0; i < o.length; i++) {
      let nRow = o[i].row;
      switch (typeof nRow) {
        case 'undefined':
          res.push(new words('del', o[i]));
          break;
        case 'number':
          for (let j = nInd; j <= n.length; j++) {
            oRow = n[j].row;
            if (oRow) {
              if (oRow > i) {
                res.push(new words('del', o[i].text));
              } else if (oRow == i) {
                res.push(new words('ori', o[i].text));
              } else {
                res.push(new words('ins', n[j].text));
              }
              nInd = j;
              break;
            } else {
              res.push(new words('ins', n[j]));
            }
          }
          if (nInd >= nRow) {
            res.push(new words('ori', o[i].text));
          }
          break;
        default:
      }
    }
    res.push(
      ...n.slice(nInd).map((i) => {
        let temText = i.text ? i.text : i;
        return new words('ins', temText);
      })
    );
    console.log(res);
    return { o: o, n: n };
  }
  return { diffString };
})();
if (!window) {
  module.exports = diffString;
}
