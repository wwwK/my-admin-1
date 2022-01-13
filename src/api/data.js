import request from '@/utils/request1'

export function login(data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function getCount(token) {
  return request({
    url: '/count',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}
