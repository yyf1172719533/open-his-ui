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
