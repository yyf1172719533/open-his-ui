import request from '@/utils/request'

// 条件分页查询
export function listInventoryLogForPage(query) {
  return request({
    url: '/erp/inventoryLog/listInventoryLogForPage',
    method: 'get',
    params: query
  })
}
