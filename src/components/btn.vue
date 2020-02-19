<template>
  <button @click="btn">{{value}}</button>
</template>
<script>
export default {
  data() {
    return {};
  },
  props:["value"],
  methods:{
    btn(){
      this.$emit("btn")
    }
  }
};
</script>