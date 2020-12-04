import request from '@/utils/request'

// 分页查询
export function listForPage(query) {
  return request({
    url: '/system/dict/type/listForPage',
    method: 'get',
    params: query
  })
}

// 添加
export function addDictType(data) {
  return request({
    url: '/system/dict/type/addDictType',
    method: 'post',
    params: data
  })
}

// 修改
export function updateDictType(data) {
  return request({
    url: '/system/dict/type/updateDictType',
    method: 'put',
    params: data
  })
}

// 查询全部
export function selectAllDictType() {
  return request({
    url: '/system/dict/type/selectAllDictType',
    method: 'get'
  })
}

// 根据ID查询
export function getDictTypeById(dictId) {
  return request({
    url: '/system/dict/type/getOne/' + dictId,
    method: 'get'
  })
}

// 删除
export function deleteDictTypeByIds(dictIds) {
  return request({
    url: '/system/dict/type/deleteDictTypeByIds/' + dictIds,
    method: 'delete'
  })
}

// 同步缓存
export function dictCacheAsync() {
  return request({
    url: '/system/dict/type/dictCacheAsync',
    method: 'get'
  })
}

