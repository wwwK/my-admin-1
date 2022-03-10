import request from '@/utils/request1'

export function getDevice(params) {
  return request({
    url: '/app/devices',
    method: 'get',
    params
  })
}
export function updateStatus(params) {
  return request({
    url: '/app/device/status',
    method: 'patch',
    params
  })
}
/**
 * 更新设备信息
 */
export function updateDevice(data) {
  return request({
    url: '/app/devices/'+data.id,
    method: 'put',
    data
  })
}
export function deleteDevice(id) {
  return request({
    url: '/app/devices/'+id,
    method: 'delete',
  })
}
