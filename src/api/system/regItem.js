import request from '@/utils/request'

// 条件分页查询挂号费用列表
export function listForPage(query) {
  return request({
    url: '/system/registeredItem/listRegisteredItemForPage',
    method: 'get',
    params: query
  })
}

// 添加挂号费用
export function addRegisteredItem(data) {
  return request({
    url: '/system/registeredItem/addRegisteredItem',
    method: 'post',
    params: data
  })
}

// 修改挂号费用
export function updateRegisteredItem(data) {
  return request({
    url: '/system/registeredItem/updateRegisteredItem',
    method: 'put',
    params: data
  })
}

// 根据ID查询挂号费用
export function getRegisteredItemById(regItemId) {
  return request({
    url: '/system/registeredItem/getRegisteredItemById/' + regItemId,
    method: 'get'
  })
}

// 根据ID删除挂号费用
export function deleteRegisteredItemByIds(ids) {
  return request({
    url: '/system/registeredItem/deleteRegisteredItemByIds/' + ids,
    method: 'delete'
  })
}

// 查询所有可用的挂号费用
export function selectAllRegisteredItem() {
  return request({
    url: '/system/registeredItem/selectAllRegisteredItem',
    method: 'get'
  })
}
