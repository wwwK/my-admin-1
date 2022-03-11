import request from '@/utils/request1'

export function getDevice(params) {
  return request({
    url: '/appDevice',
    method: 'get',
    params
  })
}
export function updateStatus(params) {
  return request({
    url: '/appDevice/status',
    method: 'patch',
    params
  })
}
/**
 * 更新设备信息
 */
export function updateDevice(data) {
  return request({
    url: '/appDevice/'+data.id,
    method: 'put',
    data
  })
}
export function deleteDevice(id) {
  return request({
    url: '/appDevice/'+id,
    method: 'delete',
  })
}
