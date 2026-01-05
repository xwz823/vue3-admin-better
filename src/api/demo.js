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

export function getWeatherList(data) {
  return request({
    url: 'https://api.open-meteo.com/v1/forecast?latitude=39.9042&longitude=116.4074&current=temperature,weather_code,wind_speed_10m&timezone=auto',
    method: 'get'
  })
}