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
