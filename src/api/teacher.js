import request from '@/utils/request'

export function getTeacherListPage(current, limit, teacherQuery) {
  return request({
    url: `/eduservice/teacher/pageTeacherCondition/${current}/${limit}`,
    method: 'post',
    // 将对象转换为 json 传递到接口中
    data: teacherQuery
  })
}

export function deleteTeacherById(id) {
  return request({
    url: `/eduservice/teacher/${id}`,
    method: 'delete'
  })
}

export function addTeacher(teacherInfo) {
  return request({
    url: '/eduservice/teacher/addTeacher',
    method: 'post',
    data: teacherInfo
  })
}

export function getTeacherInfo(id) {
  return request({
    url: `/eduservice/teacher/getTeacher/${id}`,
    method: 'get'
  })
}

export function updateTeacher(id, teacherInfo) {
  return request({
    url: `/eduservice/teacher/updateTeacherById/${id}`,
    method: 'post',
    data: teacherInfo
  })
}
