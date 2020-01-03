import request from '@/utils/request'

export function register(param) {
    return request({
        url: '/admin/register',
        method: 'post',
        data: param
    })
}