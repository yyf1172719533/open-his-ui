import request from '@/utils/request'

// 条件分页查询用户信息
export function listForPage(query) {
  return request({
    url: '/system/user/listUserForPage',
    method: 'get',
    params: query
  })
}

// 添加用户信息
export function addUser(data) {
  return request({
    url: '/system/user/addUser',
    method: 'post',
    params: data
  })
}

// 修改用户信息
export function updateUser(data) {
  return request({
    url: '/system/user/updateUser',
    method: 'put',
    params: data
  })
}

// 根据ID查询用户信息
export function getUserById(userId) {
  return request({
    url: '/system/user/getUserById/' + userId,
    method: 'get'
  })
}

// 根据ID删除用户信息
export function deleteUserByIds(ids) {
  return request({
    url: '/system/user/deleteUserByIds/' + ids,
    method: 'delete'
  })
}

// 重置用户密码
export function resetPwd(userIds) {
  return request({
    url: '/system/user/resetPwd/' + userIds,
    method: 'put'
  })
}

// 保存用户和角色之间的关系
export function saveUserRole(userId, roleIds) {
  // 处理没有选择角色时 无法匹配后端数据的问题
  if (roleIds.length === 0) {
    roleIds = [-1]
  }
  return request({
    url: '/system/user/saveUserRole/' + userId + '/' + roleIds,
    method: 'post'
  })
}
