import request from '@/utils/request'

export function getLocationList(data) {
  return request({
    url: '/custom/demo2/locationList',
    method: 'get'
  })
}

export function getQuarkResourceList(data) {
  return request({
    url: '/pansou-api/search',
    method: 'post',
    data
  })
}