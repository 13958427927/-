<template>
  <div>
    <AtcleItem
      v-for="item in atiCles"
      :key="item.art_id"
      :article="item"
    ></AtcleItem>
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
      atiCles: []
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
    }
  }
}
</script>

<style></style>
