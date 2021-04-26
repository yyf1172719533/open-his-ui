import request from '@/utils/request'

// 条件分页查询
export function listPurchaseForPage(query) {
  return request({
    url: '/erp/purchase/listPurchaseForPage',
    method: 'get',
    params: query
  })
}

// 采购单提交审核
export function doAudit(purchaseId) {
  return request({
    url: '/erp/purchase/doAudit/' + purchaseId,
    method: 'post'
  })
}

// 采购单作废
export function doInvalid(purchaseId) {
  return request({
    url: '/erp/purchase/doInvalid/' + purchaseId,
    method: 'post'
  })
}

// 分页条件查询待审核的采购单信息
export function listPurchasePendingForPage(query) {
  return request({
    url: '/erp/purchase/listPurchasePendingForPage',
    method: 'get',
    params: query
  })
}

// 采购单审核通过
export function auditPass(purchaseId) {
  return request({
    url: '/erp/purchase/auditPass/' + purchaseId,
    method: 'post'
  })
}

// 采购单审核不通过
export function auditNoPass(purchaseId, auditMsg) {
  return request({
    url: '/erp/purchase/auditNoPass/' + purchaseId + '/' + auditMsg,
    method: 'post'
  })
}

// 根据单据ID查询单据详情
export function getPurchaseItemById(purchaseId) {
  return request({
    url: '/erp/purchase/getPurchaseItemById/' + purchaseId,
    method: 'get'
  })
}

// 生产采购单据ID
export function generatePurchaseId() {
  return request({
    url: '/erp/purchase/generatePurchaseId',
    method: 'get'
  })
}
