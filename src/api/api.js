import { getData, postData} from '../utils/http-service';

// 登录接口
export const requestLogin = params => { return postData(`/login`, params) };
// 目录树
export const selectTree = params => { return postData(`/menu/selectTree`) };

//合约管理 - 市场管理
export const marketQuest = {
	getMarket: (params) => { return postData(`/market/selectByRecord`, params) },//获取市场列表
	modifyStatus: (params) => { return postData(`/market/modifyStatus`, params) },//修改状态
	addMarket: (params) => { return postData(`/market/add`, params) },//新增市场
	modifyMarket: (params) => { return postData(`/market/modify`, params) },//修改市场
}

//合约管理 - 合约管理
export const contractQuest = {
	getContract: (params) => { return postData(`/contract/selectByRecord`, params) },//获取合约列表
	addContract: (params) => { return postData(`/contract/add`, params) },//新增合约
	modifyStatus: (params) => { return postData(`/contract/modifyStatus`, params) },//修改状态
	addMarket: (params) => { return postData(`/contract/add`, params) },//新增市场
	modifyMarket: (params) => { return postData(`/contract/modify`, params) },//修改市场
}
