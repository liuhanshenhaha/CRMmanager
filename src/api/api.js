import { getData, postData} from '../utils/http-service';

// 登录接口
export const requestLogin = params => { return postData(`/login`, params) };
// 目录树
export const selectTree = params => { return postData(`/menu/selectTree`) };
// 字典
export const getDictionary = params => { return postData(`/util/getData`) };

//合约管理 - 市场管理
export const marketQuest = {
	getMarket: (params) => { return postData(`/market/selectByRecord`, params) },//获取市场列表
	modifyStatus: (params) => { return postData(`/market/modifyStatus`, params) },//修改状态
	addMarket: (params) => { return postData(`/market/add`, params) },//新增市场
	modifyMarket: (params) => { return postData(`/market/modify`, params) },//修改市场
}

//合约管理 - 合约管理
export const contractQuest = {
	getContract: (params) => { return postData(`/contract/queryPage`, params) },//获取合约列表
	addContract: (params) => { return postData(`/contract/add`, params) },//新增合约
	modifyContract: (params) => { return postData(`/contract/modify`, params) },//修改合约
	modifyStatus: (params) => { return postData(`/contract/modifyStatus`, params) },//修改状态
	getContractByGoodsId: (params) => { return postData(`/contract/selectByGoodsId`, params) },//根据商品查询合约
	getSetting: (params) => { return postData(`/contract/time/selectByContractId`, params) },//新增市场
	addContractTime: (params) => { return postData(`/contract/time/add`, params) },//合约配置增加
	modifyContractTime: (params) => { return postData(`/contract/time/modify`, params) },//合约配置增加
	modifyContractTimeStatus: (params) => { return postData(`/contract/time/modifyStatus`, params) },//合约配置增加
}

//合约管理 - 商品管理
export const goodsQuest = {
	getGoods: (params) => { return postData(`/goods/selectByRecord`, params) },//获取商品列表
	addGoods: (params) => { return postData(`/goods/add`, params) },//新增商品
	modifyStatus: (params) => { return postData(`/contract/modifyStatus`, params) },//修改状态
	addMarket: (params) => { return postData(`/contract/add`, params) },//新增市场
	modifyMarket: (params) => { return postData(`/contract/modify`, params) },//修改市场
}
