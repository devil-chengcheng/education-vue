import request from '@/utils/request'

// 根据 id 获取课程的小节信息
export function getChapterVideo(id) {
  return request({
    url: '/eduservice/chapter/getChapterVideo/' + id,
    method: 'get'
  })
}

// 添加章节
export function addChapter(data) {
  return request({
    url: '/eduservice/chapter/addChapter',
    method: 'post',
    data: data
  })
}

// 根据 id 查询章节
export function getChapterInfo(id) {
  return request({
    url: '/eduservice/chapter/getChapterInfo/' + id,
    method: 'get'
  })
}

// 修改章节
export function updateChapter(data) {
  return request({
    url: '/eduservice/chapter/updateChapter',
    method: 'post',
    data: data
  })
}

// 删除章节
export function deleteChapter(id) {
  return request({
    url: '/eduservice/chapter/deleteChapter/' + id,
    method: 'delete'
  })
}
