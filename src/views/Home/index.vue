<template>
  <div>
    <!-- 搜索框 -->
    <van-nav-bar class="nav-bar">
      <template #title>
        <van-button
          @click="$router.push('/search')"
          icon="search"
          size="small"
          round
          block
        >
          搜索</van-button
        >
      </template>
    </van-nav-bar>
    <!-- 频道及文章展示  -->
    <van-tabs v-model="active" swipeable>
      <van-tab v-for="item in channels" :key="item.id" :title="item.name">
        <AticleList :id="item.id"></AticleList>
      </van-tab>
      <span class="toutiao toutiao-gengduo" @click="isShow = true"></span>
    </van-tabs>
    <!-- 弹出层 -->
    <van-popup
      v-model="isShow"
      closeable
      close-icon-position="top-left"
      position="bottom"
      :style="{ height: '100%' }"
      ><ChannelEdit
        v-if="isShow"
        @change-active=";[(isShow = false), (active = $event)]"
        :myChannels="channels"
        @del-channel="delChannel"
        @add-channel="addChannel"
      ></ChannelEdit>
    </van-popup>
  </div>
</template>
<script>
import { grtChannelAPI, delCHanellAPi, addCHanellAPi } from '@/Api'
import AticleList from './components/AticleList.vue'
import ChannelEdit from './components/ChannelEdit.vue'
import { mapGetters, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapGetters(['isLogin'])
  },
  components: {
    AticleList,
    ChannelEdit
  },
  data() {
    return {
      active: 2,
      channels: [],
      isShow: false
    }
  },
  created() {
    // this.grtChannel()
    this.initChannels()
  },
  // 1. ?? ==> 相当于|| ，常用于语句
  // 2. ？. ===> 可选链操作符，？前面是undifined,那么不会往后取值

  methods: {
    ...mapMutations(['SET_MY_CHANNELS']),

    initChannels() {
      if (this.isLogin) {
        // 1. 如果你登陆了
        // channels 应该发送请求
        this.grtChannel()
      } else {
        // 2. 未登录
        // - 本地储存里有数据 channels用本地储存
        // - 本地储存没有数据 发送请求 获取默认的频道数据
        const myChannels = this.$store.state.myChannels
        if (myChannels.length === 0) {
          this.grtChannel()
        } else {
          this.channels = myChannels
        }
      }
    },
    async grtChannel() {
      try {
        const { data } = await grtChannelAPI()
        this.channels = data.data.channels
      } catch (error) {
        if (!error.response) {
          throw error
        } else {
          const status = error.response.status
          status === 507 && this.$toast.fail('请刷新')
        }
      }
    },
    async delChannel(id) {
      try {
        const newChannels = this.channels.filter((item) => item.id !== id)
        if (this.isLogin) {
          await delCHanellAPi(id)
        } else {
          // 把我频道存在本体储存
          this.SET_MY_CHANNELS(newChannels)
        }
        // 视图层删除
        this.channels = newChannels
        this.$toast.success('删除频道成功')
      } catch (error) {
        if (
          (error.response && error.response.status === 401) ||
          error.response.status === 400
        ) {
          this.$toast.fail('请重新登录或刷新重试')
        } else {
          throw error
        }
      }
    },
    async addChannel(item) {
      try {
        if (this.isLogin) {
          await addCHanellAPi(item.id, this.channels.length)
        } else {
          // 把我频道存在本体储存
          // 利用扩展运算符把没改变前的channels 和 新添加的item放进去
          this.SET_MY_CHANNELS([...this.channels, item])
        }
        this.$toast.success('添加频道成功')
        this.channels.push(item)
      } catch (error) {
        if (
          (error.response && error.response.status === 401) ||
          error.response.status === 400
        ) {
          this.$toast.fail('请重新登录或刷新重试')
        } else {
          throw error
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.nav-bar {
  background-color: #3296fa;

  // inherit 继承
  // unset 不设置
  :deep(.van-nav-bar__title) {
    max-width: unset;
  }
  .van-button--default {
    background-color: #5babfb;
    border: 0;
    color: #fff;
    font-size: 30px;
  }

  .van-icon {
    color: #fff;
  }
  .van-button--block {
    width: 7.4rem;
  }
}
/* tabs导航条样式 */
:deep(.van-tabs__wrap) {
  padding-right: 66px;

  .van-tabs__nav {
    padding-left: 0;
    padding-right: 0;

    /* tab标签 */
    .van-tab {
      border: 1px solid #eee;
      width: 200px;
      height: 82px;
    }

    /* tab标签下划线 */
    .van-tabs__line {
      width: 31px;
      height: 6px;
      background-color: #3296fa;
      bottom: 40px;
    }
  }
}

/* 字体图标 */
.toutiao-gengduo {
  position: absolute;
  top: 0;
  right: 0;
  width: 66px;
  height: 82px;
  font-size: 40px;
  line-height: 82px;
  text-align: center;
  opacity: 0.6;
  border-bottom: 1px solid #eee;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 70%;
    width: 1px;
    background-image: url('~@/assets/images/gradient-gray-line.png');
  }
}
</style>
