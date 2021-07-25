import request from '@/utils/request'

// 查询待就诊的挂号单信息
export function queryToBeSeenRegistration(schedulingType) {
  return request({
    url: '/doctor/care/queryToBeSeenRegistration/' + schedulingType,
    method: 'get'
  })
}

// 查询就诊中的挂号单信息
export function queryVisitingRegistration(schedulingType) {
  return request({
    url: '/doctor/care/queryVisitingRegistration/' + schedulingType,
    method: 'get'
  })
}

// 查询就诊完成的挂号单信息
export function queryVisitCompletedRegistration(schedulingType) {
  return request({
    url: '/doctor/care/queryVisitCompletedRegistration/' + schedulingType,
    method: 'get'
  })
}

// 根据患者ID查询病历信息、患者信息、患者档案信息
export function getPatientAllMessageByPatientId(patientId) {
  return request({
    url: '/doctor/care/getPatientAllMessageByPatientId/' + patientId,
    method: 'get'
  })
}

// 医生接诊
export function receivePatient(regId) {
  return request({
    url: '/doctor/care/receivePatient/' + regId,
    method: 'post'
  })
}

// 保存病历信息
export function saveCareHistory(data) {
  return request({
    url: '/doctor/care/saveCareHistory',
    method: 'post',
    data
  })
}

// 根据挂号单ID查询病历信息
export function getCareHistoryByRegId(regId) {
  return request({
    url: '/doctor/care/getCareHistoryByRegId/' + regId,
    method: 'get'
  })
}

// 根据病历ID查询处方以及处方详情信息
export function queryCareOrdersByChId(careHistoryId) {
  return request({
    url: '/doctor/care/queryCareOrdersByChId/' + careHistoryId,
    method: 'get'
  })
}

// 保存处方以及处方详情信息
export function saveCareOrderItem(data) {
  return request({
    url: '/doctor/care/saveCareOrderItem',
    method: 'post',
    data
  })
}

// 根据处方详情ID删除处方详情【只能删除未支付的】
export function deleteCareOrderItemById(itemId) {
  return request({
    url: '/doctor/care/deleteCareOrderItemById/' + itemId,
    method: 'delete'
  })
}

// 完成就诊
export function visitComplete(regId) {
  return request({
    url: '/doctor/care/visitComplete/' + regId,
    method: 'post'
  })
}
