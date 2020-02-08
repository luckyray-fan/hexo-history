var diff = require('diff');
var a = '一夹物流1234343243243';
var b = '1234就是3奇异3';
var c = diff.diffChars(a, b);
console.dir(c);

//获取commits的信息 -> 对比信息 -> render(vue), 写好对比算法比较好
