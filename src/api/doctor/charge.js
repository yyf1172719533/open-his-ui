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

// 分页查询所有收费单
export function queryAllOrderChargeForPage(query) {
  return request({
    url: '/doctor/charge/queryAllOrderChargeForPage',
    method: 'get',
    params: query
  })
}

// 根据收费单的ID查询收费详情信息
export function queryOrderChargeItemByOrderId(orderId) {
  return request({
    url: '/doctor/charge/queryOrderChargeItemByOrderId/' + orderId,
    method: 'get'
  })
}

// 订单列表现金支付
export function payWithCash(orderId) {
  return request({
    url: '/doctor/charge/payWithCash/' + orderId,
    method: 'get'
  })
}

// 订单列表支付宝支付
export function toPayOrderWithZfb(orderId) {
  return request({
    url: '/doctor/charge/toPayOrderWithZfb/' + orderId,
    method: 'get'
  })
}
