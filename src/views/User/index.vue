<template>
  <div>
    <!-- 导航条 -->
    <van-nav-bar
      class="navbar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />
    <!-- 信息修改 -->
    <!-- 更改头像 -->
    <input
      type="file"
      ref="file"
      hidden
      accept=".png,.jpg,.pdf,.svg"
      @change="selectPhoto"
    />
    <van-cell title="头像" is-link @click="$refs.file.click()"
      ><van-image round width="0.8rem" height="0.8rem" :src="avator"
    /></van-cell>
    <!-- 更改头像的弹出层 -->
    <van-popup
      v-model="isShowPhoto"
      closeable
      position="bottom"
      :style="{ height: '100%' }"
    >
      <!-- 让这个组件调用的new Cropper 创建出来的对象随着新创建的对象出来而销毁 -->
      <update-avator
        v-if="isShowPhoto"
        :avator.sync="avator"
        :photo="photo"
      ></update-avator>
    </van-popup>
    <!-- 名称 -->
    <van-cell title="昵称" is-link @click="isShowName = true">{{
      this.myName
    }}</van-cell>
    <!-- 更改名称的弹出框 -->
    <van-popup
      v-model="isShowName"
      position="bottom"
      :style="{ height: '100%' }"
    >
      <van-nav-bar
        class="navBar"
        title="更新名称"
        left-text="取消"
        right-text="保存"
        @click-left="onCancel"
        @click-right="onClickRight"
      />
      <van-field
        v-model="myName"
        rows="2"
        autosize
        type="textarea"
        maxlength="11"
        placeholder="请输入新的名称"
        show-word-limit
        autofocus
      />
    </van-popup>
    <!-- 性别 -->
    <van-cell title="性别" is-link @click="isShowGender = true">{{
      this.gender === 0 ? '男' : '女'
    }}</van-cell>
    <!-- 更改性别的弹出层 -->
    <van-popup
      v-model="isShowGender"
      position="bottom"
      :style="{ height: '50%' }"
    >
      <van-picker
        title="更新性别"
        show-toolbar
        :columns="columns"
        @confirm="onConfirm"
        @cancel="isShowGender = false"
    /></van-popup>
    <!-- 生日 -->
    <van-cell title="生日" is-link @click="isShowNewdata = true">{{
      this.birthday
    }}</van-cell>
    <!-- 更改生日的弹出框-->
    <van-popup
      v-model="isShowNewdata"
      position="bottom"
      :style="{ height: '50%' }"
    >
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="isShowNewdata = false"
        @confirm="dataConfirm"
      />
    </van-popup>
  </div>
</template>

<script>
// 1. 点击修改头像
// - 手动触发input:file的点击事件

// 2. 获取用户选择的图片
// - 给input:file绑定change事件
// - 选择的图片被保存在了input:file.value属性上，保存的文件的绝对路径.
// - files数组里，保存的File对象
// -  input 里有个multiple属性 使用后可以多选上传的图片

// 3. 如何将file对象转成base64
// - FileReader : 文件阅读器
// - const fr = new FileReader(); fr.readAsDataURL(file);
// - 接受读取的结果 ： fr.onload = (e) =>{ e.target.result /* base64 */}

// - input:file 属性
// - hidden: 等于display:none 隐藏文件上传按钮
// - accept: 规定file选择文件的类型
import UpdateAvator from './components/UpdateAvator.vue'
import { resolveToBase64 } from '@/utils'
import { personalDataAPI, amendDataAPI } from '@/Api'
import dayjs from 'dayjs'
export default {
  components: { UpdateAvator },
  data() {
    return {
      Cancel: false, // 取消按钮计数
      minDate: new Date(1900, 0, 1), // 最小时间
      maxDate: new Date(), // 最大时间
      currentDate: new Date(), // 默认时间
      isShowNewdata: false, // 时间显
      isShowGender: false, // 性别
      isShowName: false, // 名称
      isShowPhoto: false,
      photo: '',
      avator: '',
      information: '', // 接受用户信息
      myName: '',
      name: '',
      gender: 0,
      columns: ['男', '女'],
      birthday: ''
    }
  },
  created() {
    this.personalData()
  },
  methods: {
    // 图片
    async selectPhoto() {
      // 获取到用户选择的图片的lile对象
      const file = this.$refs.file.files[0]
      // file对象转成img.src可识别的属性、
      // file对象转成base64
      const base64 = await resolveToBase64(file)
      // 传递base64给子组件
      this.photo = base64
      // 打开弹窗
      this.isShowPhoto = true
      // 解决不能连续选中同一张图片的bug
      this.$refs.file.value = ''
    },
    // 登录获取用户数据
    async personalData() {
      const { data } = await personalDataAPI()
      this.information = data.data
      this.avator = data.data.photo
      this.myName = data.data.name
      // this.gender = data.data.gender
      this.birthday = data.data.birthday
    },
    // 没有点击确定之前, 原始数据不能发生改变
    onCancel() {
      this.Cancel = true
      // 如果用户点击了取消 就让默认数据为接口请求回来的数据
      if (this.Cancel === true) {
        this.myName = this.information.name
      }
      this.isShowName = false
    },
    // 名字
    async onClickRight() {
      try {
        this.name = this.myName
        await amendDataAPI({ name: this.name })
        this.isShowName = false
        this.$toast.success('更新成功')
      } catch (error) {
        if (
          (error.response && error.response.status === 400) ||
          error.response.status === 401
        ) {
          this.$toast.fail('用户认证失败，请重新登录')
        } else {
          throw error
        }
      }
    },
    // 性别
    async onConfirm(value, index) {
      try {
        this.gender = index
        await amendDataAPI({ gender: this.gender })
        this.isShowGender = false
        this.$toast.success('更新成功')
      } catch (error) {
        if (
          (error.response && error.response.status === 400) ||
          error.response.status === 401
        ) {
          this.$toast.fail('用户认证失败，请重新登录')
        } else {
          throw error
        }
      }
    },
    // 生日
    async dataConfirm(value) {
      try {
        this.birthday = dayjs(value).format('YYYY-MM-DD')
        console.log(this.birthday)
        await amendDataAPI({ birthday: this.birthday })
        this.isShowNewdata = false
        this.$toast.success('更新成功')
      } catch (error) {
        if (
          (error.response && error.response.status === 400) ||
          error.response.status === 401
        ) {
          this.$toast.fail('用户认证失败，请重新登录')
        } else {
          throw error
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.navbar {
  background: #3296fa;
  /deep/.van-nav-bar__title {
    color: #fff;
  }
  /deep/.van-icon {
    color: #fff;
  }
}
</style>
