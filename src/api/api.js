import { getData, postData} from '../utils/http-service';

let base = 'http://2f9b9a99.ngrok.io/xtjichu';

// 登录接口
export const requestLogin = params => { return postData(`${base}/login`, params) };

//合约管理 - 市场管理
export const agreementsQuest = {
	getMarket: (params) => { return postData(`${base}/market/selectByRecord`, params) },//获取市场列表
	modifyStatus: (params) => { return postData(`${base}/market/modifyStatus`, params) },//修改状态
	addMarket: (params) => { return postData(`${base}/market/add`, params) },//新增市场
	modifyMarket: (params) => { return postData(`${base}/market/modify`, params) },//修改市场
}