import request from '@/utils/request1'

// 部门
export function getDepartment(params) {
  return request({
    url: '/department',
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

// 账号
export function getAccount(params) {
  return request({
    url: '/account',
    method: 'get',
    params
  })
}

export function addAccount(params) {
  return request({
    url: '/account',
    method: 'post',
    params
  })
}

export function delAccount(id) {
  return request({
    url: '/account/'+id,
    method: 'delete',
  })
}

export function updateAccount(data) {
  return request({
    url: '/account/'+data.id,
    method: 'put',
    data
  })
}

//角色
export function getRole(params) {
  return request({
    url: '/role',
    method: 'get',
    params
  })
}

export function addRole(params) {
  return request({
    url: '/role',
    method: 'post',
    params
  })
}

export function delRole(id) {
  return request({
    url: '/role/'+id,
    method: 'delete',
  })
}

export function updateRole(data) {
  return request({
    url: '/role/'+data.id,
    method: 'put',
    data
  })
}

export function updateRolePermission(params) {
  return request({
    url: '/role/permission',
    method: 'post',
    params
  })
}
