import request from '@/utils/request'

// 查询发药数量统计列表
export function queryDrugStat(query) {
  return request({
    url: '/statistics/drug/queryDrugStat',
    method: 'get',
    params: query
  })
}

// 查询发药统计列表
export function queryDrug(query) {
  return request({
    url: '/statistics/drug/queryDrug',
    method: 'get',
    params: query
  })
}
