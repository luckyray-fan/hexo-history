<template>
  <ins v-if="select" class="ins">{{value}}</ins>
  <del v-else class="del">{{value}}</del>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: ["value", "select"],
  computed: {
    select: function() {
      return this.select === "ins";
    }
  }
};
</script>

<style scoped>
.ins {
  background: honeydew;
}
.del {
  background: #ffe6e6;
}
</style>