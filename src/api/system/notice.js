import request from '@/utils/request'

// 条件分页查询公告列表
export function listNoticeForPage(query) {
  return request({
    url: '/system/notice/listNoticeForPage',
    method: 'get',
    params: query
  })
}

// 添加公告
export function addNotice(data) {
  return request({
    url: '/system/notice/addNotice',
    method: 'post',
    params: data
  })
}

// 修改公告
export function updateNotice(data) {
  return request({
    url: '/system/notice/updateNotice',
    method: 'put',
    params: data
  })
}

// 根据ID查询公告
export function getNoticeById(noticeId) {
  return request({
    url: '/system/notice/getNoticeById/' + noticeId,
    method: 'get'
  })
}

// 根据ID删除公告
export function deleteNoticeByIds(noticeIds) {
  return request({
    url: '/system/notice/deleteNoticeByIds/' + noticeIds,
    method: 'delete'
  })
}
