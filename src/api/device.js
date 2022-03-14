import request from '@/utils/request1'

export function getDevice(params) {
  return request({
    url: '/devices',
    method: 'get',
    params
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
 * 更新设备信息
 */
export function updateDevice(data) {
  return request({
    url: '/devices/'+data.id,
    method: 'put',
    data
  })
}
export function deleteDevice(id) {
  return request({
    url: '/devices/'+id,
    method: 'delete',
  })
}


// 手机端
export function getAppDevice(params) {
  return request({
    url: '/appDevice',
    method: 'get',
    params
  })
}
export function updateAppStatus(params) {
  return request({
    url: '/appDevice/status',
    method: 'patch',
    params
  })
}
/**
 * 更新设备信息
 */
export function updateAppDevice(data) {
  return request({
    url: '/appDevice/'+data.id,
    method: 'put',
    data
  })
}
export function deleteAppDevice(id) {
  return request({
    url: '/appDevice/'+id,
    method: 'delete',
  })
}
