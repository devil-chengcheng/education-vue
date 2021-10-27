import request from '@/utils/request'

export function addVideo(data) {
  return request({
    url: '/eduservice/video/addVideo',
    method: 'post',
    data: data
  })
}

export function updateVideo(data) {
  return request({
    url: '/eduservice/video/updateVideo',
    method: 'post',
    data: data
  })
}

// 删除小节
export function deleteVideo(id) {
  return request({
    url: '/eduservice/video/deleteVideo/' + id,
    method: 'delete'
  })
}

export function getVideoInfo(id) {
  return request({
    url: '/eduservice/video/getVideoInfo/' + id,
    method: 'get'
  })
}

// 删除阿里云中视频
export function deleteAlyVideo(id) {
  return request({
    url: '/eduvod/video/deleteAlyVideo/' + id,
    method: 'delete'
  })
}
