import request from '@/utils/request'

// 条件分页查询
export function listForPage(query) {
  return request({
    url: '/system/role/listRoleForPage',
    method: 'get',
    params: query
  })
}

// 添加角色信息
export function addRole(data) {
  return request({
    url: '/system/role/addRole',
    method: 'post',
    params: data
  })
}

// 修改角色信息
export function updateRole(data) {
  return request({
    url: '/system/role/updateRole',
    method: 'put',
    params: data
  })
}

// 根据角色ID查询角色信息
export function getRoleById(id) {
  return request({
    url: '/system/role/getRoleById/' + id,
    method: 'get'
  })
}

// 根据角色ID删除角色信息
export function deleteRoleByIds(roleIds) {
  return request({
    url: '/system/role/deleteRoleByIds/' + roleIds,
    method: 'delete'
  })
}

// 保存角色和菜单权限之间的关系
export function saveRoleMenu(roleId, menuIds) {
  // 处理没有选择菜单权限时 无法匹配后端数据的问题
  if (menuIds.length === 0) {
    menuIds = [-1]
  }
  return request({
    url: '/system/role/saveRoleMenu/' + roleId + '/' + menuIds,
    method: 'post'
  })
}

// 查询所有可用的角色信息
export function selectAllRole() {
  return request({
    url: '/system/role/selectAllRole',
    method: 'get'
  })
}

// 根据用户ID查询角色ID集合
export function getRoleIdsByUserId(userId) {
  return request({
    url: '/system/role/getRoleIdsByUserId/' + userId,
    method: 'get'
  })
}
