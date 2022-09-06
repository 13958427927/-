<template>
  <div>
    <div id="app">
      <i class="toutiao toutiao-lishi"></i>
    </div>
    黑马头条
    <van-button type="primary">主要按钮</van-button>
    <van-button type="info">信息按钮</van-button>
    <van-button type="default">默认按钮</van-button>
    <van-button type="warning">警告按钮</van-button>
    <van-button type="danger">危险按钮</van-button>
    <div class="btn">登录</div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style lang="less" scoped>
.btn {
  width: 375px;
  height: 45px;
  text-align: center;
  background-color: aqua;
  font-size: 16px;
  margin: 0 auto;
}
</style>
