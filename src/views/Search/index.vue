<template>
  <div>
    <!-- 搜索框 -->
    <form action="/">
      <van-search
        class="Search"
        v-model.trim="keywords"
        background="#3296fa"
        placeholder="请输入搜索关键词"
        show-action
        @search="onSearch"
        @focus="isShowSearchResult = false"
        @cancel="$router.push('/')"
      />
    </form>
    <!-- 搜索历史/建议/搜索结果 -->
    <!-- <SearchHistory></SearchHistory>
    <SearchResult></SearchResult>
    <SearchSuggestion></SearchSuggestion> -->
    <component
      :keywords="keywords"
      :is="componentName"
      @change-keywords="onSearch"
    ></component>
  </div>
</template>

<script>
// class和style属性的特殊
// - vue自动帮你把class和style合并到组件的根节点上
import SearchHistory from './components/SearchHistory.vue'
import SearchResult from './components/SearchResult.vue'
import SearchSuggestion from './components/SearchSuggestion.vue'

import { mapMutations, mapState } from 'vuex'
export default {
  data() {
    return {
      keywords: '',
      // 记录触发@search
      isShowSearchResult: false
    }
  },
  components: {
    SearchHistory,
    SearchResult,
    SearchSuggestion
  },
  computed: {
    ...mapState(['histories']),
    componentName() {
      // 搜索历史：搜索框的值空
      // 搜索建议：搜索框有值，并且不渲染搜索结果
      // 搜索结果：触发搜索时，显示搜索结果
      // 历史
      if (this.keywords === '') {
        return 'SearchHistory'
      }
      // 结果
      if (this.isShowSearchResult) {
        return 'SearchResult'
      }
      // 建议
      return 'SearchSuggestion'
    }
  },
  methods: {
    ...mapMutations(['SET_HISTORIES']),
    onSearch(keywords) {
      // 把keywords关键词存起来
      // 1.用户手动敲回车 2. 点击了搜索
      const distinctHistories = [...new Set([keywords, ...this.histories])]
      this.SET_HISTORIES(distinctHistories)
      // 自定义事件触发搜索,接受子组件(搜索建议)传来的当前点击的第几项的值把他赋值给当前页面的keywords 并且调用搜索
      this.keywords = keywords
      // 当搜索框触发搜索事件 把记录搜索的变量改为true
      this.isShowSearchResult = true
    }
  }
}
</script>

<style lang="less" scoped>
.Search {
  [role='button'] {
    color: #fff;
  }
}
</style>
