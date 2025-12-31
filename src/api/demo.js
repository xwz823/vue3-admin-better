import request from '@/utils/request'

export function getLocationList(data) {
  return request({
    url: '/demo/demo2/locationList',
    method: 'get'
  })
}