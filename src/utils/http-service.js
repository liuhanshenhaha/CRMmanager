/*
 * @title axios 二次封装
 * @describe
 *   instance 拦截器
 *       请求200    判断code不是000000的 认为是失败 使用Message提示用户，终止后续then 否则继续then
 *       请求非200  switch http状态 区分错误 使用Message提示用户，终止后续then
 * @export
 *   getData(urlLink, param)
 *   postData(urlLink, param)
 */

import axios from 'axios';
import qs from 'qs';
import { Message } from 'element-ui';
import { getCookie } from './utils';
export const commonParams = {
  "source":"backend"
};

const instance = axios.create({
  baseURL: '/xtjichu',
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8;',
    'Accept': 'application/json',
  }
});

/**
 * 拦截响应response，并做一些错误处理
 */
instance.interceptors.response.use((response) => {
  const data = response.data
  console.log("拦截器 成功",response)

  if(data){
    if(data.code !== "000000"){
      Message.error(data.msg)
      return Promise.reject(response.data)
    }
    data.msg.length>3&&Message.success(data.msg)
    return Promise.resolve(response)
  }else{
    const err = new Error("未知错误，请重试")
    err.data = data
    err.response = response
    throw err
  }
// 根据返回的code值来做不同的处理（和后端约定）
}, function (err) {
      console.log("拦截器 失败",err)
  if (err && err.response) {
    switch (err.response.status) {
      case 400:
        err.message = '请求参数错误'
        break

      case 401:
        err.message = '未授权，请登录'
        break

      case 403:
        err.message = '跨域拒绝访问'
        break

      case 404:
        err.message = `请求地址出错: ${err.response.config.url}`
        break

      case 408:
        err.message = '请求超时'
        break

      case 500:
        err.message = '服务器内部错误'
        break

      case 501:
        err.message = '服务未实现'
        break

      case 502:
        err.message = '网关错误'
        break

      case 503:
        err.message = '服务不可用'
        break

      case 504:
        err.message = '网关超时'
        break

      case 505:
        err.message = 'HTTP版本不受支持'
        break

      default:
    }
  }
  Message.error(err.message)
  return Promise.reject(err)
})

export default axios

/**
 * get请求
 * @param urlLink
 * @param param
 * @returns {Promise<AxiosResponse>}
 */
export function getData(urlLink, param) {
  const url = urlLink
  const data = Object.assign({}, {"token": getCookie("token"), "content": param})

  return instance.get(url, {
    params: data,
    timeout: 5000
  }).then((res) => {
      console.log("get 成功",res)
      return Promise.resolve(res.data)
    });
}

/**
 * post请求
 * @param urlLink
 * @param param
 * @returns {Promise<AxiosResponse>}
 */
export function postData(urlLink, param) {
  const data = Object.assign({}, commonParams, {"token": getCookie("token")||"", "content": param})
  return instance.post(urlLink, JSON.stringify(data))
    .then((res) => {
      console.log("post 成功",res)
      return Promise.resolve(res.data)
    });
}