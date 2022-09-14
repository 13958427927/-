import request from '@/utils/request'

/**
 * 获取用户自己的频道
 * @returns Promise
 */
export const grtChannelAPI = () => {
  return request({
    url: '/v1_0/user/channels'
  })
}
/**
 * 获取所有频道
 * @returns Promise
 */
export const grtAllChannelsApi = () => {
  return request({
    url: '/v1_0/channels'
  })
}
/**
 * 删除频道
 * @param {Number|string}  id 频道id
 * @returns Promise
 */
export const delCHanellAPi = (id) => {
  return request({
    url: `/v1_0/user/channels/${id}`,
    method: 'DELETE'
  })
}
/**
 *  新增频道
 * @param {Number|string} id 新增频道的id
 * @param {*} seq 新增频道添加的索引值
 * @returns Promise
 */
export const addCHanellAPi = (id, seq) => {
  return request({
    url: '/v1_0/user/channels',
    method: 'PATCH',
    data: {
      channels: [{ id, seq }]
    }
  })
}
