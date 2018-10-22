import { getData, postData} from '../utils/http-service';

let base = 'http://642bf6c4.ngrok.io/xtjichu';

// 登录接口
export const requestLogin = params => { return postData(`${base}/login`, params) };
// 目录树
export const selectTree = params => { return postData(`${base}/menu/selectTree`) };

//合约管理 - 市场管理
export const marketQuest = {
	getMarket: (params) => { return postData(`${base}/market/selectByRecord`, params) },//获取市场列表
	modifyStatus: (params) => { return postData(`${base}/market/modifyStatus`, params) },//修改状态
	addMarket: (params) => { return postData(`${base}/market/add`, params) },//新增市场
	modifyMarket: (params) => { return postData(`${base}/market/modify`, params) },//修改市场
}

//合约管理 - 合约管理
export const contractQuest = {
	getContract: (params) => { return postData(`${base}/contract/selectByRecord`, params) },//获取合约列表
	addContract: (params) => { return postData(`${base}/contract/add`, params) },//新增合约
	modifyStatus: (params) => { return postData(`${base}/contract/modifyStatus`, params) },//修改状态
	addMarket: (params) => { return postData(`${base}/contract/add`, params) },//新增市场
	modifyMarket: (params) => { return postData(`${base}/contract/modify`, params) },//修改市场
}
