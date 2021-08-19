import request from '@/utils/request'

// 根据挂号ID查询未支付的处方信息及详情
export function getNoChargeCareHistoryByRegId(regId) {
  return request({
    url: '/doctor/charge/getNoChargeCareHistoryByRegId/' + regId,
    method: 'get'
  })
}

// 处方详情现金支付
export function createOrderChargeWithCash(data) {
  return request({
    url: '/doctor/charge/createOrderChargeWithCash',
    method: 'post',
    data
  })
}

// 处方详情支付宝支付
export function createOrderChargeWithZfb(data) {
  return request({
    url: '/doctor/charge/createOrderChargeWithZfb',
    method: 'post',
    data
  })
}

// 根据订单ID查询订单信息【验证是否支付成功】
export function queryOrderChargeOrderId(orderId) {
  return request({
    url: '/doctor/charge/queryOrderChargeOrderId/' + orderId,
    method: 'get'
  })
}
