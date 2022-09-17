<template>
  <div class="">
    <van-nav-bar
      class="navBar"
      title="更新名称"
      left-text="取消"
      right-text="保存"
      @click-left="$parent.$parent.isShowName = false"
      @click-right="onClickRight"
    />
    <van-field
      v-model="message"
      rows="2"
      autosize
      type="textarea"
      maxlength="7"
      placeholder="请输入新的名称"
      show-word-limit
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      message: ''
    }
  },
  methods: {
    onClickRight() {
      console.log(1)
    }
  }
}
</script>

<style scoped lang="less"></style>
