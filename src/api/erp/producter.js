import request from '@/utils/request'

// 条件分页查询生产厂家信息
export function listProducterForPage(query) {
  return request({
    url: '/erp/producter/listProducterForPage',
    method: 'get',
    params: query
  })
}

// 添加生产厂家
export function addProducter(data) {
  return request({
    url: '/erp/producter/addProducter',
    method: 'post',
    params: data
  })
}

// 修改生产厂家信息
export function updateProducter(data) {
  return request({
    url: '/erp/producter/updateProducter',
    method: 'put',
    params: data
  })
}

// 根据ID查询生产厂家信息
export function getProducterById(id) {
  return request({
    url: '/erp/producter/getProducterById/' + id,
    method: 'get'
  })
}

// 根据ID删除生产厂家
export function deleteProducterByIds(ids) {
  return request({
    url: '/erp/producter/deleteProducterByIds/' + ids,
    method: 'delete'
  })
}

// 查询所有可用的生产厂家
export function selectAllProducter() {
  return request({
    url: '/erp/producter/selectAllProducter',
    method: 'get'
  })
}
