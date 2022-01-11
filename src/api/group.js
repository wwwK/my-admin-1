import request from '@/utils/request1'

export function getDeviceGroup(params) {
  return request({
    url: '/deviceGroup',
    method: 'get',
    params
  })
}
/**
 * 添加设备分组
 */
export function addDeviceGroup(data) {
  return request({
    url: '/deviceGroup',
    method: 'post',
    data
  })
}
export function updateStatus(params) {
  return request({
    url: '/device/status',
    method: 'patch',
    params
  })
}
/**
 * 更新设备组信息
 */
export function updateDeviceGroup(data) {
  return request({
    url: '/deviceGroup/'+data.id,
    method: 'put',
    data
  })
}
export function deleteDeviceGroup(id) {
  return request({
    url: '/deviceGroup/'+id,
    method: 'delete',
  })
}

