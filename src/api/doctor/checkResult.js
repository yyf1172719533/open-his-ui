import request from '@/utils/request'

// 查询已支付的检查处方信息
export function queryNeedCheckItem(data) {
  return request({
    url: '/doctor/check/queryNeedCheckItem',
    method: 'post',
    data
  })
}

// 根据检查单号查询要检查的项目详情
export function queryCheckItemByItemId(itemId) {
  return request({
    url: '/doctor/check/queryCheckItemByItemId/' + itemId,
    method: 'get'
  })
}

// 开始检查
export function startCheck(itemId) {
  return request({
    url: '/doctor/check/startCheck/' + itemId,
    method: 'post'
  })
}

// 条件分页查询检查中的检查数据
export function queryAllCheckingResultForPage(data) {
  return request({
    url: '/doctor/check/queryAllCheckingResultForPage',
    method: 'post',
    data
  })
}

// 条件分页查询所有检查结果数据
export function queryAllCheckResultForPage(data) {
  return request({
    url: '/doctor/check/queryAllCheckResultForPage',
    method: 'post',
    data
  })
}

// 完成检查
export function completeCheckResult(data) {
  return request({
    url: '/doctor/check/completeCheckResult',
    method: 'post',
    data
  })
}
