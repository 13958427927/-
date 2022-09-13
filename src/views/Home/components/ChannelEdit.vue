<template>
  <div class="channels">
    <!-- 我的频道 -->
    <!-- 标题 -->
    <van-cell title="我的频道">
      <van-button
        class="btn"
        round
        size="mini"
        style="color: red; border-color: red"
        @click="isEdit = !isEdit"
        >{{ isEdit ? '完成' : '编辑' }}</van-button
      >
    </van-cell>
    <!-- 频道 -->
    <div class="my-pannel">
      <van-grid :column-num="4" gutter="10" :border="false">
        <van-grid-item
          v-for="(item, index) in myChannels"
          :class="{ active: item.name === '推荐' }"
          :key="item.id"
          :text="item.name"
          :icon="isEdit && item.name !== '推荐' ? 'cross' : ''"
          @click="handleMyChannels(item, index)"
        >
        </van-grid-item>
      </van-grid>
    </div>
    <!-- 推荐频道 -->
    <van-cell title="推荐频道"></van-cell>
    <!-- 频道 -->
    <div class="recommend-pannel">
      <van-grid :column-num="4" gutter="10" :border="false">
        <van-grid-item
          v-for="item in recommendChannels"
          :key="item.id"
          :text="item.name"
          icon="plus"
        >
        </van-grid-item>
      </van-grid>
    </div>
  </div>
</template>

<script>
import { grtAllChannelsApi } from '@/Api'
export default {
  name: 'ChannelEdit',
  props: {
    myChannels: Array
  },
  data() {
    return {
      isEdit: false,
      allChannels: []
    }
  },
  computed: {
    recommendChannels() {
      // 推荐频道： 所有频道-我的频道
      // filter返回值：数组
      return this.allChannels.filter((allChannelsItem) => {
        // 所有频道-我的频道
        // 我的频道数组里面，看一下，有没有allChannelsItem, 有return 没有false
        return !this.myChannels.find(
          (myChannelsItem) => myChannelsItem.id === allChannelsItem.id
        )
      })
    }
  },
  created() {
    this.grtAllChannels()
  },
  methods: {
    async grtAllChannels() {
      try {
        const { data } = await grtAllChannelsApi()
        this.allChannels = data.data.channels
        console.log(this.allChannels)
      } catch (error) {}
    },
    handleMyChannels({ name }, index) {
      if (this.isEdit && name !== '推荐') {
        console.log(11)
      } else {
        // 关闭弹窗
        // 切换频道
        this.$emit('change-active', index)
      }
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.active {
  .van-grid-item__text {
    color: red;
  }
}
.channels {
  padding-top: 92px;
}
.btn {
  font-size: 25px;
  width: 100px;
}
:deep(.van-grid-item__content) {
  background-color: #f4f5f6;
  height: 100%;
}
// 我的频道
.my-pannel {
  // 编辑按钮居中
  .van-cell__value {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  // 关闭按钮样式
  :deep(.van-grid-item__content) {
    position: relative;

    .van-grid-item__content {
      position: absolute;
      top: 0;
      right: 0;
    }
  }
}
:deep(.van-icon-cross) {
  position: absolute;
  top: 0;
  right: 0;
  font-size: 25px;
  transform: translate(20%, -35%);
  border: 0.02667rem solid #000;
  border-radius: 50%;
  text-align: center;
  line-height: 0.32rem;
}
// 推荐频道
.recommend-pannel {
  // 推荐频道加号样式
  :deep(.van-grid-item__content) {
    flex-direction: row;

    .van-grid-item__icon {
      font-size: 12px;
      line-height: 50.57px;
    }

    .van-grid-item__text {
      margin-top: 0;
    }
  }
}
</style>
