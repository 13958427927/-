import Vue from 'vue'
import VueRouter from 'vue-router'
// import login from '@/views/login'
Vue.use(VueRouter)
// SPA
// 首屏加载速度很慢
// 路由懒加载
// - 使用路由页面，再去请求
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login')
  }
]

const router = new VueRouter({
  routes
})

export default router
