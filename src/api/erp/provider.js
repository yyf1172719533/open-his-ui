import request from '@/utils/request'

// 条件分页查询
export function listProviderForPage(query) {
  return request({
    url: 'erp/provider/listProviderForPage',
    method: 'get',
    params: query
  })
}

// 添加供应商信息
export function addProvider(data) {
  return request({
    url: 'erp/provider/addProvider',
    method: 'post',
    params: data
  })
}

// 修改供应商信息
export function updateProvider(data) {
  return request({
    url: 'erp/provider/updateProvider',
    method: 'put',
    params: data
  })
}

// 根据ID查询
export function getProviderById(id) {
  return request({
    url: 'erp/provider/getProviderById/' + id,
    method: 'get'
  })
}

// 根据ID删除
export function deleteProviderByIds(ids) {
  return request({
    url: 'erp/provider/deleteProviderByIds/' + ids,
    method: 'delete'
  })
}

// 查询可用的供应商信息
export function selectAllProvider() {
  return request({
    url: 'erp/provider/selectAllProvider',
    method: 'get'
  })
}
