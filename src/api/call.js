import request from '@/utils/request1'

export function getDeviceCall(params) {
  return request({
    url: '/deviceCall',
    method: 'get',
    params
  })
}
export function delDeviceCall(id) {
  return request({
    url: '/deviceCall/'+id,
    method: 'delete',
  })
}
export function getAppCall(params) {
  return request({
    url: '/appCall',
    method: 'get',
    params
  })
}
export function download(params) {
  return request({
    url: '/download',
    method: 'get',
    params
  })
}
//语音转写
export function getAudioText(params) {
  return request({
    url: '/audioText',
    method: 'get',
    params
  })
}
