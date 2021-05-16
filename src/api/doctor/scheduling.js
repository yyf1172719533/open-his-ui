import request from '@/utils/request'

// 查询要排班的医生信息
export function queryUsersNeedScheduling(deptId) {
  return request({
    url: '/doctor/scheduling/queryUsersNeedScheduling',
    method: 'get',
    params: { deptId: deptId }
  })
}

// 查询要排班的医生的排班信息
export function queryScheduling(query) {
  return request({
    url: '/doctor/scheduling/queryScheduling',
    method: 'get',
    params: query
  })
}

// 查询当前登录用户的排班信息
export function queryMyScheduling(query) {
  return request({
    url: '/doctor/scheduling/queryMyScheduling',
    method: 'get',
    params: query
  })
}

// 保存排班信息
export function saveScheduling(data) {
  return request({
    url: '/doctor/scheduling/saveScheduling',
    method: 'post',
    data: data
  })
}
