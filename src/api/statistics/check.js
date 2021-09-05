import request from '@/utils/request'

// 查询检查项统计列表
export function queryCheckStat(query) {
  return request({
    url: '/statistics/check/queryCheckStat',
    method: 'get',
    params: query
  })
}

// 查询检查项列表
export function queryCheck(query) {
  return request({
    url: '/statistics/check/queryCheck',
    method: 'get',
    params: query
  })
}
