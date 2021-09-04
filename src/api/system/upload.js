import request from '@/utils/request'

// 根据文件路径删除文件
export function deleteFile(filePath) {
  return request({
    url: '/system/upload/deleteFile',
    method: 'delete',
    params: filePath
  })
}
