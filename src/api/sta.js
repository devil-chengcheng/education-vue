import request from '@/utils/request'

export function createStatistics(day) {
  return request({
    url: '/staservice/daily/createStatisticsByDay/' + day,
    method: 'get'
  })
}

export function getChartData(data) {
  return request({
    url: '/staservice/daily/getGraphData',
    method: 'post',
    data: data
  })
}
