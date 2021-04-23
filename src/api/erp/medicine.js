import request from '@/utils/request'

// 条件分页查询药品信息
export function listMedicinesForPage(query) {
  return request({
    url: 'erp/medicines/listMedicinesForPage',
    method: 'get',
    params: query
  })
}

// 添加药品信息
export function addMedicines(data) {
  return request({
    url: 'erp/medicines/addMedicines',
    method: 'post',
    params: data
  })
}

// 修改药品信息
export function updateMedicines(data) {
  return request({
    url: 'erp/medicines/updateMedicines',
    method: 'put',
    params: data
  })
}

// 根据ID查询药品信息
export function getMedicinesById(id) {
  return request({
    url: 'erp/medicines/getMedicinesById/' + id,
    method: 'get'
  })
}

// 根据ID删除药品信息
export function deleteMedicinesByIds(ids) {
  return request({
    url: 'erp/medicines/deleteMedicinesByIds/' + ids,
    method: 'delete'
  })
}

// 查询可用的药品信息
export function selectAllMedicines() {
  return request({
    url: 'erp/medicines/selectAllMedicines',
    method: 'get'
  })
}

// 调整药品库存量
export function updateMedicinesStorage(medicineId, medicineStockNum) {
  return request({
    url: 'erp/medicines/updateMedicinesStorage/' + medicineId + '/' + medicineStockNum,
    method: 'post'
  })
}
