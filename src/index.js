import Vue from 'vue';
import app from './index.vue';
Vue.config.productionTip = false; //防止生成生产提示
import 'iview/dist/styles/iview.css';
import infoProvider from './info-provider.js';

window.HexoHistory = (function() {
  Vue.component('app', app);
  function start() {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(initPlugin, 1000); //和文档一块加载出来, TODO 加载动画
    });
  }
  // 将html格式字符串转化为dom的函数
  function htmlStrToDom(htmlstr, parentdata) {
    let obj = Object.assign({}, parentdata);
    let component = Vue.extend({
      template: htmlstr,
      data() {
        return obj;
      }
    });
    let instance = new component().$mount();
    return instance.$el;
  }
  function initPlugin() {
    var vue = new Vue({
      el: '.' + infoProvider.anchorClass,
      data: {
        dom: ''
      },
      mounted() {
        let dom = this.$el;
        this.dom = dom;
        var appDom = htmlStrToDom('<app :dom="dom"/>', this.$data);
        document.body.append(appDom);
      }
    });
  }
  return start;
})();
HexoHistory();
