// user .js 划分是跟后端接口文档
import request from '@/utils/request'

/**
 * @param {string} mobile  手机号
 * @param {number}} code  验证码
 * @returns Promise
 */
export const login = (mobile, code) => {
  return request({
    url: '/v1_0/authorizations',
    method: 'POST',
    data: {
      mobile,
      code
    }
  })
}

/**
 * @param {string} mobile 手机号
 * @returns Promise
 */
export const sendCodeApi = (mobile) => {
  return request({
    url: `/v1_0/sms/codes/${mobile}`
  })
}

/**
 * 获取用户信息
 *  注意
 * 在这里this.$store.state.tokenObj获取不到token
 * 因为js没有this 只能引入import
 * @returns Promise
 */
export const getUserInfoAPI = () => {
  return request({
    url: '/v1_0/user'
    // 由于每次登录都要加这个所以给他抽出去挂载在request拦截器上面
    // headers: {
    //   Authorization: `Bearer ${store.state.tokenObj.token}`
    // }
  })
}
/**
 *
 * @param {String} file 传base64
 * @returns
 */
export const uploadPhoto = (file) => {
  const fm = new FormData()
  fm.append('photo', file)
  return request({
    url: '/v1_0/user/photo',
    method: 'PATCH',
    data: fm
  })
}
/**
 *
 * @returns Promise
 */
export const personalDataAPI = () => {
  return request({
    url: '/v1_0/user/profile'
  })
}
export const amendDataAPI = (data) => {
  return request({
    url: '/v1_0/user/profile',
    method: 'PATCH',
    data
  })
}
