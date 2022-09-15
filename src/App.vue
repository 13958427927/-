<template>
  <div>
    <!-- 左滑进入 -->
    <!-- vue内置动画效果 mode是模式 -->
    <transition name="van-slide-left" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style lang="less" scoped></style>
