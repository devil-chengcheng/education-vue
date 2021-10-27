import request from '@/utils/request'

// 得到所有课程分类
export function getSubjectList() {
  return request({
    url: '/eduservice/subject/getAllSubject',
    method: 'get'
  })
}

// 添加课程信息
export function addCourseInfo(data) {
  return request({
    url: '/eduservice/course/saveCourseInfo',
    method: 'post',
    data: data
  })
}

// 查询所有讲师
export function getAllTeacher() {
  return request({
    url: '/eduservice/teacher/findAll',
    method: 'get'
  })
}

// 上传图片封面资源
export function uploadCover(file) {
  return request({
    url: '/eduoss/fileoss/uploadCover',
    method: 'post',
    data: file
  })
}

// 根据 id 获得课程信息
export function getCourseInfoById(id) {
  return request({
    url: '/eduservice/course/getCourseInfo/' + id,
    method: 'get'
  })
}

// 修改课程信息
export function updateCourseInfo(data) {
  return request({
    url: '/eduservice/course/updateCourseInfo',
    method: 'post',
    data: data
  })
}

// 课程确认信息回显
export function getCoursePublishInfo(id) {
  return request({
    url: '/eduservice/course/getPublishCourseInfo/' + id,
    method: 'get'
  })
}

// 课程最终发布，修改状态
export function publishCourse(id) {
  return request({
    url: '/eduservice/course/publishCourse/' + id,
    method: 'post'
  })
}

// 课程列表分页查询
export function getCourseListPage(current, limit, courseQuery) {
  return request({
    url: `/eduservice/course/getCourseListPage/${current}/${limit}`,
    method: 'post',
    data: courseQuery
  })
}

// 删除课程
export function deleteCourse(id) {
  return request({
    url: '/eduservice/course/deleteCourse/' + id,
    method: 'delete'
  })
}
