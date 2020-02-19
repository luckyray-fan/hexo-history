<template>
  <div class="skeleton page">
    <p style="width:40%">1</p>
    <p style="width:90%">2</p>
    <p style="width:60%">3</p>
    <p style="width:50%">1</p>
    <p>2</p>
    <p style="width:60%">3</p>
    <p style="width:30%">1</p>
    <p style="width:80%">2</p>
    <p style="width:60%">3</p>
  </div>
</template>
<script>
export default {
  name: "skeleton"
};
</script>
<style scoped>
@keyframes placeHolderShimmer {
  0% {
    background-position: 0px;
  }
  100% {
    background-position: 1000px;
  }
}

p {
  animation: placeHolderShimmer 2s infinite linear;
  background: #ccc;
  background: linear-gradient(90deg, #ddd 0px, #e8e8e8 40px, #ddd 80px);
  background-size: 1000px;
  /* background: #ddd; */
  color: transparent !important;
  text-indent: 100%;
  white-space: nowrap;
  border-radius: 5px;
}
</style>