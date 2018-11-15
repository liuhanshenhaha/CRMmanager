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
};

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
	getDate: (params) => { return postData(`/contract/date/selectByRecord`, params) },//新增市场
	addDate: (params) => { return postData(`/contract/date/add`, params) },//合约配置增加
	modifyDate: (params) => { return postData(`/contract/date/modify`, params) },//合约配置增加
	modifyDateStatus: (params) => { return postData(`/contract/date/modifyStatus`, params) },//合约配置增加
};

//合约管理 - 商品管理
export const goodsQuest = {
	getGoods: (params) => { return postData(`/goods/queryPage`, params) },//获取分页商品列表
	getAllGoods: (params) => { return postData(`/goods/selectByRecord`, params) },//获取全部商品列表
	addGoods: (params) => { return postData(`/goods/add`, params) },//新增商品
	modifyGoods: (params) => { return postData(`/goods/modify`, params) },//修改商品
	modifyStatus: (params) => { return postData(`/goods/modifyStatus`, params) },//修改状态
	addMarket: (params) => { return postData(`/contract/add`, params) },//新增市场
	modifyMarket: (params) => { return postData(`/contract/modify`, params) },//修改市场
};

//账户管理
export const accountQuest = {
	getGroup: (params) => { return postData(`/goods/group/selectByOwner`, params) },//获取佣金组列表
	addGroup: (params) => { return postData(`/goods/group/add`, params) },//新增佣金组
	modifyGroup: (params) => { return postData(`/goods/group/modify`, params) },//修改佣金组
	configureGoodsGroup: (params) => { return postData(`/agent/configureGoodsGroup`, params) },//配置佣金组
	modifyStatusGroup: (params) => { return postData(`/goods/group/modifyStatus`, params) },//删除佣金组
	deleteGoods: (params) => { return postData(`/goods/group/detail/delete`, params) },//删除佣金组商品
	getGoods: (params) => { return postData(`/goods/group/detail/selectMyCostByGoodsGroupId`, params) },//获取佣金组商品列表
	modifyGoods: (params) => { return postData(`/goods/group/detail/modify`, params) },//修改客户成本
	getNotAddedGoods: (params) => { return postData(`/goods/group/detail/selectNoConfigByGoodsGroupId`, params) },//查看未添加的商品
	addBatch: (params) => { return postData(`/goods/group/detail/addBatch`, params) },//批量添加商品
	uploadPic: (params) => { return postData(`/agent/uploadPic`, params) },//上传图片
	customerRegister: (params) => { return postData(`/customer/register`, params) },//客户开户
	auditList: (params) => { return postData(`/agent/audit/list`, params) },//客户/代理待审核列表
	getAuditInfo: (params) => { return postData(`/agent/get`, params) },//获取客户/代理信息
	getTradeChannelId: (params) => { return postData(`/channel/selectValid`, params) },//获取交易通道
	getRoleId: (params) => { return postData(`/role/selectValidRole`, params) },//获取角色
	customerAudit: (params) => { return postData(`/customer/audit`, params) },//客户审核通过
	agentAudit: (params) => { return postData(`/agent/auditAgent`, params) },//代理审核通过
	selectCustomerByParent: (params) => { return postData(`/customer/selectCustomerByParent`, params) },//客户配置列表
	selectAgentOptionByParent: (params) => { return postData(`/customer/selectCustomerByParent`, params) },//获取代理级联信息
	selectTradeAccountByUserId: (params) => { return postData(`/agent/selectTradeAccountByUserId`, params) },//根据用户查询账户
	resetPassword: (params) => { return postData(`/user/resetPassword`, params) },//重置密码
	selectAgentOptionByParent: (params) => { return postData(`/agent/selectAgentOptionByParent`, params) },//查询代理级联关系信息
	selectAgentByParent: (params) => { return postData(`/agent/selectAgentByParent`, params) },//根据父代理查询子代理
};