/**
 * 计算新旧字符串的相似度
 * @param {string} o old string
 * @param {string} n new string
 * @returns {number} 计算得到的比率作为参考的相似度
 */
function getSimilar(o, n) {
  /** 将输入的字符串去除标点符号并转为数组 */
  let temO = o.replace(/[, ，。！？：“；‘\s]/g, '').split('');
  let temN = n.replace(/[, ，。！？：“；‘\s]/g, '').split('');
  [temO, temN] = [temO, temN].map((i) => {
    let temObj = {};
    i.forEach((j) => {
      temObj[j] = true;
    });
    return temObj;
  });
  let [oLen, nLen] = [temO, temN].map((i) => Object.keys(i).length);
  let count = 0;
  for (var i in temN) {
    if (temO[i] !== undefined) {
      count += 1;
    }
  }
  let ratio = count / nLen;
  return ratio;
}
/**
 * 挨个对比, 确定旧文本和新文本中相似的最大值, 超过一定程度视新文本的片段由旧文本更改过来
 * @returns 返回一个旧文本对应在新文本中的位置
 * @param os 旧文本对象
 * @param ns 新文本对象
 */
function getSimilarArr(os, ns) {
  let oRes = {};
  let [oArr, nArr] = [os, ns].map(Object.keys);
  oArr.forEach((i) => {
    let similarArr = nArr.map((j) => getSimilar(j, i));
    let similarMax = Math.max(similarArr); //找到最相似的文本中的第一个
    if (similarMax < 0.9) {
      oRes[i] = null;
      return;
    }
    let similarIndex = similarArr.indexOf(similarMax);
    let similarObj = ns[nArr[similarIndex]];
    oRes[i] = similarObj.rows[0];
  });
  return { oRes };
}
/**
 * 输入新旧数组返回以旧文本为基础的更改过程的文本数组
 * @param {string[]} o 旧文本数组
 * @param {string[]} n 新文本数组
 */
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
   * 一个旧的字符串应该是怎样子转变为一个新的字符串, 旧到新的顺序
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
  return res;
}
/**
 * 整个项目中最核心的数据转换函数, 从新旧数组转为渲染对象
 * @param {} baseArr
 * @param {*} compareArr
 * @param {*} baseAst
 * @param {*} compareAst
 */
function diffPage(o, n) {
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
  let { oRes, nRes } = getSimilarArr(os, ns);
  let res = [];
  //在这一步转换为[{ori:{text:'',pos:''},newOne:{text:'',pos:''}},{del:{text:'',pos:''}},{ins:{text:'',pos:''}]
  //pos新旧ast中对应的索引, 其余就是文本的意思, 目标是组织由旧到新文章的过程的数组, 并由一定格式表现
  for (let i = 0; i < o.length; i++) {}
  return res;
}
// var a = '开发流程: 开发打包好, 复制到博客下面, hexo g 运行, 观察结果, hexo';
// var b = '开发打包, 复制到博客下面, 同偶,hexo g 运行, 观察结果, 开发流程: hexo 观察结果';
// console.log(getSimilar(a, b));
export { getSimilar, getSimilarArr, diff, diffPage };
