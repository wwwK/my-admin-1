import request from '@/utils/request1'

export function getDeviceStatus(params) {
  return request({
    url: '/deviceStatus',
    method: 'get',
    params
  })
}
//端口
export function getDeviceLine(params) {
  return request({
    url: '/deviceLine',
    method: 'get',
    params
  })
}
export function updateDeviceLine(params) {
  return request({
    url: '/deviceLine',
    method: 'patch',
    params
  })
}
