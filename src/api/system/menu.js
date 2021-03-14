import request from '@/utils/request'

// 不分页条件查询菜单信息
export function listAllMenus(query) {
  return request({
    url: '/system/menu/listAllMenus',
    method: 'get',
    params: query
  })
}

// 查询可用的菜单信息
export function selectMenuTree() {
  return request({
    url: '/system/menu/selectMenuTree',
    method: 'get'
  })
}

// 添加菜单信息
export function addMenu(data) {
  return request({
    url: '/system/menu/addMenu',
    method: 'post',
    params: data
  })
}

// 修改菜单信息
export function updateMenu(data) {
  return request({
    url: '/system/menu/updateMenu',
    method: 'put',
    params: data
  })
}

// 根据菜单ID查询菜单信息
export function getMenuById(id) {
  return request({
    url: '/system/menu/getMenuById/' + id,
    method: 'get'
  })
}

// 根据菜单ID删除菜单信息
export function deleteMenuById(id) {
  return request({
    url: '/system/menu/deleteMenuById/' + id,
    method: 'delete'
  })
}

