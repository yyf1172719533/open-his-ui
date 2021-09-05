import request from '@/utils/request'

// 总体工作量统计列表
export function queryWorkloadStat(query) {
  return request({
    url: '/statistics/workload/queryWorkloadStat',
    method: 'get',
    params: query
  })
}

// 医生工作量统计列表
export function queryWorkload(query) {
  return request({
    url: '/statistics/workload/queryWorkload',
    method: 'get',
    params: query
  })
}
