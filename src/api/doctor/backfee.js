import request from '@/utils/request'

// 根据挂号ID查询已支付的处方信息及详情
export function getChargedCareHistoryByRegId(regId) {
  return request({
    url: '/doctor/backfee/getChargedCareHistoryByRegId/' + regId,
    method: 'get'
  })
}

// 现金退款
export function createOrderBackfeeWithCash(data) {
  return request({
    url: '/doctor/backfee/createOrderBackfeeWithCash',
    method: 'post',
    data
  })
}

// 支付宝退款
export function createOrderBackfeeWithZfb(data) {
  return request({
    url: '/doctor/backfee/createOrderBackfeeWithZfb',
    method: 'post',
    data
  })
}

// 条件分页查询退款订单
export function queryAllOrderBackfeeForPage(query) {
  return request({
    url: '/doctor/backfee/queryAllOrderBackfeeForPage',
    method: 'get',
    params: query
  })
}

// 根据退款订单ID查询退款订单详情
export function queryOrderBackfeeItemByBackId(backId) {
  return request({
    url: '/doctor/backfee/queryOrderBackfeeItemByBackId/' + backId,
    method: 'get'
  })
}
