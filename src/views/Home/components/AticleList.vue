<template>
  <div class="article">
    <!--  -->
    <van-pull-refresh v-model="refreshLoaing" @refresh="getNextPageArticle">
      <!-- @load:触底触发load事件 -->
      <!-- offset: 滚动条和底部距离多少的时候触发load事件，默认值是300px -->
      <!-- immediate-check: 初渲染的时候是否执行load事件，默认值是true -->
      <!-- v-model="loading" -->
      <!-- loading为true，Load事件不会触发 -->
      <!-- loading为false，Load事件会触发 -->
      <!-- loading会在load事件执行后，被van-list组件自动设置为ture -->
      <!-- finished 是否已加载完成，加载完成后不再触发load事件 -->
      <!-- finished-text 加载完成后的提示文案 -->
      <!-- error 是否加载失败，加载失败后点击错误提示可以重新
      触发load事件，必须使用sync修饰符 -->
      <!-- error-text 加载失败后的提示文案  -->
      <van-list
        v-model="loading"
        @load="getNextPageArticle"
        offset="100"
        :immediate-check="false"
        :finished="finished"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        finished-text="没有更多了"
      >
        <AtcleItem
          v-for="item in atiCles"
          :key="item.art_id"
          :article="item"
        ></AtcleItem> </van-list
    ></van-pull-refresh>
  </div>
</template>

<script>
// 发送请求拿到对应数据
import { getArticlesAPI } from '@/Api'
import AtcleItem from './Atcleitem.vue'
export default {
  name: 'Article',
  props: {
    id: [String, Number]
  },
  components: { AtcleItem },
  data() {
    return {
      atiCles: [],
      preTimestamp: '',
      loading: false,
      finished: false,
      error: false,
      refreshLoaing: false
    }
  },
  created() {
    this.getArticles()
  },
  methods: {
    async getArticles() {
      // new Date().valueof
      // Date.now()
      // +new Date()
      try {
        const { data } = await getArticlesAPI(this.id, +new Date())
        this.atiCles = data.data.results
        this.preTimestamp = data.data.pre_timestamp
      } catch (error) {
        // js的错误，上抛， 400 上抛中文 ，507原封不动上抛
        const status = error.response?.status
        if (!error.response || status === 507) {
          throw error
        } else {
          if (status === 400) {
            throw new Error(error.response.data.message)
          }
        }
      }
    },
    async getNextPageArticle() {
      try {
        // 错误测试
        // if (Math.random() < 0.5) {
        //   throw new Error()
        // }
        // 发送请求
        const { data } = await getArticlesAPI(this.id, this.preTimestamp)
        if (!data.data.pre_timestamp) {
          this.finished = true
        }
        if (this.refreshLoaing) {
          this.atiCles.unshift(...data.data.results)
        } else {
          // 添加到 article
          this.atiCles.push(...data.data.results)
        }
        // 更新时间戳
        this.preTimestamp = data.data.pre_timestamp
        // 手动更改loading
        this.loading = false
      } catch (error) {
        this.error = true
      } finally {
        this.loading = false
        this.refreshLoaing = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
// 如何给盒子拥有子的滚动条
// 1. 定高
// 2. overflow: auto/scroll/overlay
.article {
  height: calc(100vh - 82px - 100px - 92px);
  overflow: auto;
  // &: 代表当前元素他爹
  // ::-webkit-scrollbar : 滚动槽
  // ::-webkit-scrollbar-thumb: 滚动的滑块
  // ::after一个伪元素  content定义里面的内容
  &::-webkit-scrollbar {
    width: 10px;
    background-color: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #3296fa;
    border-radius: 10px;
  }
}
</style>
