import request from '@/utils/request'

// 查询收入支出统计图数据
export function queryAllRevenueData(query) {
  return request({
    url: '/statistics/revenue/queryAllRevenueData',
    method: 'get',
    params: query
  })
}
