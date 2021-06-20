import request from '@/utils/request'

// 查询排班的部门信息
export function listDeptForScheduling(query) {
  return request({
    url: '/doctor/registration/listDeptForScheduling',
    method: 'get',
    params: query
  })
}

// 根据身份证号查询患者信息
export function getPatientByIdCard(cardNumber) {
  return request({
    url: '/doctor/registration/getPatientByIdCard/' + cardNumber,
    method: 'get'
  })
}

// 患者挂号
export function addRegistration(data) {
  return request({
    url: '/doctor/registration/addRegistration',
    method: 'post',
    data
  })
}

// 挂号单收费
export function collectFee(id) {
  return request({
    url: '/doctor/registration/collectFee/' + id,
    method: 'post'
  })
}

// 条件分页查询挂号列表
export function queryRegistrationForPage(query) {
  return request({
    url: '/doctor/registration/queryRegistrationForPage',
    method: 'get',
    params: query
  })
}

// 挂号单作废
export function doInvalid(id) {
  return request({
    url: '/doctor/registration/doInvalid/' + id,
    method: 'post'
  })
}

// 挂号单退号
export function doReturn(id) {
  return request({
    url: '/doctor/registration/doReturn/' + id,
    method: 'post'
  })
}
