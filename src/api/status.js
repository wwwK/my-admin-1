import request from '@/utils/request1'

export function getDeviceStatus(params) {
  return request({
    url: '/deviceStatus',
    method: 'get',
    params
  })
}

//仅在线状态
export function getDeviceOnline(params) {
  return request({
    url: '/deviceOnline',
    method: 'get',
    params
  })
}

//仅端口状态
export function getLineStatus(params) {
  return request({
    url: '/deviceLine/status',
    method: 'get',
    params
  })
}

export function getAppStatus(params) {
  return request({
    url: '/appStatus',
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
