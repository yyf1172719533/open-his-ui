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
