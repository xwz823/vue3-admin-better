import request from '@/utils/request'

export function getRouterList(data) {
  return request({
    //url: '/menu/navigate',
    url: '/system/menu/getRouters',
    //method: 'post',
    method: 'get',
    //data,
  })
}
