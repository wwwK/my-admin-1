import request from '@/utils/request1'

// 语音转写
export function getAudio(params) {
  return request({
    url: '/audio',
    method: 'get',
    params
  })
}
export function getAudioCount(params) {
  return request({
    url: '/audio/count',
    method: 'get',
    params
  })
}

export function addDepartment(params) {
  return request({
    url: '/department',
    method: 'post',
    params
  })
}

export function delDepartment(id) {
  return request({
    url: '/department/'+id,
    method: 'delete',
  })
}

export function updateDepartment(data) {
  return request({
    url: '/department/'+data.id,
    method: 'put',
    data
  })
}
