import request from '@/utils/request'

// 分页查询
export function listForPage(query) {
  return request({
    url: '/system/dept/listDeptForPage',
    method: 'get',
    params: query
  })
}

// 添加科室
export function addDept(data) {
  return request({
    url: '/system/dept/addDept',
    method: 'post',
    params: data
  })
}

// 修改科室
export function updateDept(data) {
  return request({
    url: '/system/dept/updateDept',
    method: 'put',
    params: data
  })
}

// 根据ID查询科室
export function getDeptById(id) {
  return request({
    url: '/system/dept/getDeptById/' + id,
    method: 'get'
  })
}

// 查询所有可用科室
export function selectAllDept() {
  return request({
    url: '/system/dept/selectAllDept',
    method: 'get'
  })
}

// 批量删除
export function deleteDeptByIds(ids) {
  return request({
    url: '/system/dept/deleteDeptByIds/' + ids,
    method: 'delete'
  })
}
