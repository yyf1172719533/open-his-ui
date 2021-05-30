import request from '@/utils/request'

// 条件分页查询患者信息
export function listPatientForPage(query) {
  return request({
    url: '/doctor/patient/listPatientForPage',
    method: 'get',
    params: query
  })
}

// 根据ID查询患者信息
export function getPatientById(patientId) {
  return request({
    url: '/doctor/patient/getPatientById/' + patientId,
    method: 'get'
  })
}

// 根据ID查询患者档案
export function getPatientFileById(patientId) {
  return request({
    url: '/doctor/patient/getPatientFileById/' + patientId,
    method: 'get'
  })
}
