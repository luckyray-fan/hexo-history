<template>
  <div>
    <Dropdown style="margin-left: 20px" @on-click="render">
      <Button type="primary">
        查看历史
        <Icon type="ios-arrow-down"></Icon>
      </Button>
      <DropdownMenu slot="list">
        <DropdownItem v-for="(item,index) in items" :key="index" :name="index">
          {{index===0?'当前':item.date}}
          <Badge :count="item.changes" type="info"></Badge>
        </DropdownItem>
        <DropdownItem
          v-if="complete&&!items.complete"
          name="addCommit"
          style="color:#2d8cf0"
          transfer
        >继续加载...</DropdownItem>
        <DropdownItem
          v-if="!complete&&!items.complete"
          style="position:relative;color:#2d8cf0"
        >加载中...</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>
<script>
import getCommits from "./ajax.js";
import dombuild from "./dombuild.js";
import btn from "./components/btn.vue";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  Icon,
  Button,
  Spin,
  Alert,
  Avatar,
  Badge
} from "iview";
import skeleton from "./components/skeleton.vue";
// import Vue from "vue";

Vue.component("skeleton", skeleton);
Vue.component("Alert", Alert);
Vue.component("Avatar", Avatar);
const saveInfo = {
  origin: ""
};

export default {
  name: "app",
  components: {
    btn,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    Icon,
    Button,
    Spin,
    Badge
  },
  methods: {
    async render(name) {
      if (this.cur === name) {
        return;
      }
      if (name === "addCommit") {
        this.complete = false;
        this.items = await getCommits();
        this.complete = true;
        return;
      }
      this.cur = name;
      this.dom.innerHTML = saveInfo.skeleton.innerHTML;
      let temNode = "";
      if (name === 0) {
        temNode = saveInfo.origin;
      } else {
        temNode = await this.domCompare.getDomFragment(
          this.items[+this.cur].content
        );
        temNode = document.importNode(temNode, true); //dom 上事件的复制等等
      }
      this.dom.innerHTML = "";
      this.dom.append(saveInfo.infoAlert);
      this.dom.append(temNode);
      // for (let i = 0; i < newNode.children.length; i++) {
      //   this.dom.append(newNode.children[i]);
      // }
      // this.domCompare.getFragment(+name + 1); //把它换成整数, 防止传入字符串
    }
  },
  async mounted() {
    if (window.hexoHistoryConfig) {
      let pos = window.hexoHistoryConfig.pos;
      if(!pos) return;
      let style = this.$el.style;
      ({
        left: style.left,
        right: style.right,
        top: style.top,
        bottom: style.bottom
      } = pos);
    }
    this.items = await getCommits();
    this.complete = true; //防止连续点多次继续加载

    var skeletonTem = Vue.extend(skeleton);

    //初始化alert, 挂载好, 并保存这个挂载内容

    let $data = this.$data;
    var infoAlert = Vue.extend({
      template: `
      <div id="hexo-history-alert">
      <Alert v-if="cur" type="success" show-icon class="ivu-alert-with-desc">
    切换至{{items[cur].date}}成功
    <span slot="desc">
      <Avatar :src="items[cur].author.avatar" />
      作者: {{items[cur].author.login}}
      <br />
      提交时间: {{items[cur].time}}
    </span>
  </Alert>
  </div>
  `,
      data() {
        return $data;
      }
    });
    //存储
    saveInfo.skeleton = new skeletonTem().$mount().$el;
    saveInfo.origin = this.dom.children[0]; // element.children 是 live 的
    saveInfo.infoAlert = new infoAlert().$mount().$el;

    this.domCompare = new dombuild();
    this.domCompare.setArr([
      this.dom.innerHTML,
      ...this.items.map(i => i.content)
    ]);
    window.test = this.domCompare.astArr[0];
  },
  data() {
    return {
      /**
       * items [{content:,date,time,author,commitInfo}] 以后用用ts
       */
      items: [],
      domCompare: [],
      cur: 0, //index of items
      complete: false
    };
  },
  props: ["dom"]
};
</script>
<style scoped>
.ivu-select-dropdown ul {
  padding: 0;
  margin: 0;
}
.ivu-select-dropdown {
  padding: 0;
}
div {
  position: fixed;
  bottom: 20%;
  right: 30px;
}
</style>