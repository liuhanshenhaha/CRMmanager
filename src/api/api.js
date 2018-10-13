import axios from 'axios';

let base = 'http://97498cc2.ngrok.io/xtjichu';

export const getCaptcha = () => { return `${base}/login/getAuthImage?deviceId=gyk`};

export const requestLogin = params => { return axios.post(`${base}/login`, params, {"headers":{"Content-Type": "application/json;charset=utf-8;"}}).then(res => res.data); };

export const getUserList = params => { return axios.get(`${base}/user/list`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };