const allows = JSON.parse(localStorage.getItem("allows")) || [];//权限相关信息

import Login from './views/Login.vue'//登陆
import CustomerRegister from './views/CustomerRegister.vue'//客户开户
import NotFound from './views/404.vue'
import Home from './views/Home.vue'//框架
import Main from './views/Main.vue'//空框架
// 合约管理
import Market from './views/agreements/Market.vue'//市场管理
import Contract from './views/agreements/Contract.vue'//市场管理
import Goods from './views/agreements/Goods.vue'//市场管理
// 账户管理
import AgentRegister from './views/account/AgentRegister.vue'//代理开户
import AgentRegisterNonLogin from './views/AgentRegisterNonLogin.vue'//代理开户
import Costgroup from './views/account/Costgroup.vue'//代理信息
import CustomerConfigList from './views/account/CustomerConfigList.vue'//客户信息
import AgentConfigList from './views/account/AgentConfigList.vue'//客户信息
import AccountList from './views/account/AccountList.vue'//客户信息
import CustomerLevel from './views/account/CustomerLevel.vue'//客户层级
import AgentList from './views/account/AgentList.vue'//客户信息
import CustomerList from './views/account/CustomerList.vue'//客户信息

// 审核
import CustomerAudit from './views/audit/CustomerAudit.vue'//客户审核列表
import AgentAudit from './views/audit/AgentAudit.vue'//代理审核列表
import RejectAudit from './views/audit/RejectAudit.vue'//审核失败列表
import ChangeBankCard from './views/audit/ChangeBankCard.vue'//查询待审核换绑银行卡
import ChangeBankCardHistory from './views/audit/ChangeBankCardHistory.vue'//查询换绑银行卡记录
// 交易管理
import TradeList from './views/trade/TradeList.vue'//成交订单
import HoldingList from './views/trade/HoldingList.vue'//持仓订单
import ClosePosition from './views/trade/ClosePosition.vue'//持仓订单
import WTList from './views/trade/WTList.vue'//持仓订单
import TradeListHis from './views/tradeHis/TradeList.vue'//成交订单
import ClosePositionHis from './views/tradeHis/ClosePosition.vue'//持仓订单
import WTListHis from './views/tradeHis/WTList.vue'//持仓订单

// 推广链接
import ReferralLink from './views/ReferralLink.vue'//推广链接
import Download from './views/Download.vue'//下载中心
import CustomerService from './views/CustomerService.vue'//下载中心

//风控管理
import Channel from './views/risk/Channel.vue'//通道管理
import SwitchChannel from './views/risk/SwitchChannel.vue'//通过通道切换

//财务管理
import Rate from './views/finance/Rate.vue'//汇率管理
import FlowInOut from './views/money/FlowInOut.vue'//出入金流水

//系统管理
import SystemUser from './views/system/SystemUser.vue'//系统用户管理
import SystemParameter from './views/system/SystemParameter.vue'//系统参数

// 佣金管理
import CommList from './views/comm/CommList.vue'//佣金汇总
import CommDetail from './views/comm/CommDetail.vue'//佣金详细

// 消息通知
import Notice from './views/information/Notice.vue'//公告
import Notify from './views/information/Notify.vue'//消息管理
import MyNotify from './views/information/MyNotify.vue'//消息通知

import MoneyFlows from './views/money/MoneyFlows.vue'//资金流水
//其他
import Index from './views/index/Index.vue' //主界面

import Form from './views/nav1/Form.vue'
import user from './views/nav1/user.vue'
import Page4 from './views/nav2/Page4.vue'
import Page5 from './views/nav2/Page5.vue'
import Page6 from './views/nav3/Page6.vue'
import echarts from './views/charts/echarts.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/customer-register',
        component: CustomerRegister,
        name: '',
        hidden: true
    },
    {
        path: '/agent-register',
        component: AgentRegisterNonLogin,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    },
    {
        path: '/',
        component: Home,
        name: '主页 ',
        iconCls: 'fa el-icon-document',//图标样式class
        hidden: true,
        children: [
            { path: 'index', component: Index, name: '主页' }
        ]
    },
    // 从此往下均是菜单相关 默认hidden均是true
    {
        path: '/account',
        component: Home,
        name: '账户管理 ',
        iconCls: 'fa el-icon-document',//图标样式class
        hidden: false,
        children: [
            { path: 'agent-list', component: AgentList, name: '代理信息' },
            { path: 'customer-list', component: CustomerList, name: '客户信息' },
            { path: 'customer-level', component: CustomerLevel, name: '客户层级' },
            { path: 'agent-config-list', component: AgentConfigList, name: '代理配置' },
            { path: 'agent-register', component: AgentRegister, name: '代理开户', hidden: true },
            { path: 'customer-config-list', component: CustomerConfigList, name: '客户配置' },
            { path: 'account-list', component: AccountList, name: '账户信息' },
            { path: 'costgroup', component: Costgroup, name: '佣金组设置' },
        ]
    },
    {
        path: '/trade',
        component: Home,
        name: '交易管理 ',
        iconCls: 'fa el-icon-document',//图标样式class
        hidden: false,
        children: [
            { path: 'holding-list', component: HoldingList, name: '持仓订单' },
            { path: 'wt-list', component: WTList, name: '委托订单' },
            { path: 'tj-list', component: TradeList, name: '条件单记录' },
            { path: 'trade-list', component: TradeList, name: '成交记录' },
            { path: 'close-position', component: ClosePosition, name: '平仓订单' },
        ]
    },
    {
        path: '/trade/his',
        component: Home,
        name: '历史交易 ',
        iconCls: 'fa el-icon-document',//图标样式class
        hidden: false,
        children: [
            { path: 'wt-list', component: WTListHis, name: '历史委托' },
            { path: 'trade-his-list', component: TradeListHis, name: '历史成交' },
            { path: 'close-his-position', component: ClosePositionHis, name: '历史平仓' },
        ]
    },  
    {
        path: '/follow',
        component: Home,
        name: '跟单管理 ',
        iconCls: 'fa el-icon-document',//图标样式class
        hidden: false,
        children: [
            { path: 'set', component: HoldingList, name: '设置排行显示' },
            { path: '3', component: Form, name: '设置跟单' },            
            { path: '2', component: Form, name: '排行榜' },            
        ]
    },      
    {
        path: '/audit',
        component: Home,
        name: '后台审核 ',
        iconCls: 'fa el-icon-document',//图标样式class
        hidden: false,
        children: [
            { path: 'agent', component: AgentAudit, name: '代理审核' },
            { path: 'customer', component: CustomerAudit, name: '客户审核' },
            { path: 'reject', component: RejectAudit, name: '审核失败列表' },
            { path: 'change-bank-card', component: ChangeBankCard, name: '换绑银行卡审核' },
            { path: 'change-bank-card-history', component: ChangeBankCardHistory, name: '换绑银行卡历史' },
            { path: '1', component: Form, name: '切换IB关系审核' },
        ]
    },
    {
        path: '/finance',
        component: Home,
        name: '财务管理 ',
        iconCls: 'fa el-icon-document',//图标样式class
        hidden: false,
        children: [
            { path: 'money-flows', component: MoneyFlows, name: '资金流水' },
            { path: 'flow-in-out', component: FlowInOut, name: '出入金流水' },
            { path: 'market3', component: Market, name: '资金划转' },
            { path: 'form', component: Form, name: '转账审核' },
            { path: 'contract', component: Contract, name: '出金审核' },
            { path: 'rate', component: Rate, name: '汇率列表' },
        ]
    },
    {
        path: '/risk',
        component: Home,
        name: '风控管理 ',
        iconCls: 'fa el-icon-document',//图标样式class
        hidden: false,
        children: [
            { path: 'switchChannel', component: SwitchChannel, name: '交易通道' },
            { path: 'channel', component: Channel, name: '通道管理' },
        ]
    },
    {
        path: '/comm',
        component: Home,
        name: '佣金管理 ',
        iconCls: 'fa el-icon-document',//图标样式class
        hidden: false,
        children: [
            { path: 'comm-list', component: CommList, name: '佣金汇总' },
            { path: 'comm-detail', component: CommDetail, name: '佣金明细' },
            // { path: 'form', component: Form, name: '佣金审核' },
        ]
    },
    {
        path: '/referral-link',
        component: Home,
        iconCls: 'fa el-icon-document',//图标样式class
        hidden: false,
        leaf: true,
        children: [
            { path: '', component: ReferralLink, name: '推广链接' },
        ]
    },
    {
        path: '/service',
        component: Home,
        name: '客户服务 ',
        iconCls: 'fa el-icon-document',//图标样式class
        hidden: false,
        children: [
            { path: 'info', component: CustomerService, name: '客服信息' },
            { path: 'download', component: Download, name: '下载中心' },
        ]
    },
    {
        path: '/information',
        component: Home,
        name: '通知中心 ',
        iconCls: 'fa el-icon-document',//图标样式class
        hidden: false,
        children: [
            { path: 'notice', component: Notice, name: '期货公告' },
            { path: 'notify', component: Notify, name: '消息管理' },
            { path: 'myNotify', component: MyNotify, name: '消息通知' },
        ]
    },
    {
        path: '/contract',
        component: Home,
        name: '合约管理 ',
        iconCls: 'fa el-icon-document',//图标样式class
        hidden: false,
        children: [
            { path: 'market', component: Market, name: '交易市场' },
            { path: 'goods', component: Goods, name: '交易商品' },
            { path: 'contract', component: Contract, name: '合约列表' },
        ]
    },
    {
        path: '/system',
        component: Home,
        name: '系统管理',
        code: 'system',
        iconCls: 'fa el-icon-setting',
        hidden: true,
        children: [
            { path: 'user', component: SystemUser,  name: '用户管理' },
            { path: 'parameter', component: SystemParameter,  name: '系统参数' },
            { path: 'role', component: SystemUser,  name: '角色管理' }
        ]
    }
];

// 菜单根据权限重构routes
allows.map((menuItem,index) => {
    routes.map((routeItem,idx) => {
        if(menuItem.code === routeItem.code){
            routeItem.hidden = false;
            if(routeItem.children && routeItem.children.length > 0){
                routeItem.children.map((routeItemChild,ix) => {
                    menuItem.childs.map((menuItemChild,i) => {
                        if(menuItemChild.code === routeItemChild.code){
                            routeItemChild.hidden = false;
                        }
                    })
                })
            }
        }
    })
})

export default routes;