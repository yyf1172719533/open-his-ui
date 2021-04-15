import request from '@/utils/request'

// 条件分页查询检查项目列表
export function listCheckItemForPage(query) {
  return request({
    url: '/system/checkItem/listCheckItemForPage',
    method: 'get',
    params: query
  })
}

// 添加检查项目
export function addCheckItem(data) {
  return request({
    url: '/system/checkItem/addCheckItem',
    method: 'post',
    params: data
  })
}

// 修改检查项目
export function updateCheckItem(data) {
  return request({
    url: '/system/checkItem/updateCheckItem',
    method: 'put',
    params: data
  })
}

// 根据ID查询检查项目
export function getCheckItemById(checkItemId) {
  return request({
    url: '/system/checkItem/getCheckItemById/' + checkItemId,
    method: 'get'
  })
}

// 根据ID删除检查项目
export function deleteCheckItemByIds(ids) {
  return request({
    url: '/system/checkItem/deleteCheckItemByIds/' + ids,
    method: 'delete'
  })
}

// 查询所有可用的检查项目
export function selectAllCheckItem() {
  return request({
    url: '/system/checkItem/selectAllCheckItem',
    method: 'get'
  })
}
