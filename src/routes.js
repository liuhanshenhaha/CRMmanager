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
import Agent from './views/account/Agent.vue'//代理信息
import Costgroup from './views/account/Costgroup.vue'//代理信息
import CustomerList from './views/account/CustomerList.vue'//客户信息
import CustomerConfigList from './views/account/CustomerConfigList.vue'//客户信息
// 审核
import CustomerAudit from './views/audit/CustomerAudit.vue'//客户审核列表

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
    // 从此往下均是菜单相关 默认hidden均是true
    {
        path: '/account',
        component: Home,
        name: '账户管理 ',
        iconCls: 'fa el-icon-document',//图标样式class
        hidden: false,
        children: [
            { path: 'agent-list', component: Agent, name: '代理信息' },
            { path: 'customer-list', component: CustomerList, name: '客户信息' },
            { path: 'contract', component: Contract, name: '代理设置列表' },
            { path: 'customer-config-list', component: CustomerConfigList, name: '客户设置列表' },
            { path: '2', component: Form, name: '账户配置' },
            { path: 'costgroup', component: Costgroup, name: '佣金组设置' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '交易管理 ',
        iconCls: 'fa el-icon-document',//图标样式class
        hidden: false,
        children: [
            { path: 'market', component: Market, name: '持仓订单' },
            { path: 'form', component: Form, name: '委托订单' },
            { path: 'contract', component: Contract, name: '成交记录' },
            { path: '1', component: Form, name: '平仓订单' },
            { path: '2', component: Form, name: '排行榜' },
            { path: '3', component: Form, name: '跟单' },
        ]
    },
    {
        path: '/audit',
        component: Home,
        name: '后台审核 ',
        iconCls: 'fa el-icon-document',//图标样式class
        hidden: false,
        children: [
            { path: 'market', component: Market, name: '代理审核' },
            { path: 'customer', component: CustomerAudit, name: '客户审核' },
            { path: 'contract', component: Contract, name: '换绑银行卡审核' },
            { path: '1', component: Form, name: '切换IB关系审核' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '财务管理 ',
        iconCls: 'fa el-icon-document',//图标样式class
        hidden: false,
        children: [
            { path: 'market', component: Market, name: '资金流水' },
            { path: 'market2', component: Market, name: '出入金流水' },
            { path: 'market3', component: Market, name: '资金划转' },
            { path: 'form', component: Form, name: '转账审核' },
            { path: 'contract', component: Contract, name: '出金审核' },
            { path: '2', component: Form, name: '汇率列表' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '风控管理 ',
        iconCls: 'fa el-icon-document',//图标样式class
        hidden: false,
        children: [
            { path: 'market', component: Market, name: '交易通道' },
            { path: 'form', component: Form, name: '账户风控' },
            { path: 'contract', component: Contract, name: '强平记录' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '佣金管理 ',
        iconCls: 'fa el-icon-document',//图标样式class
        hidden: false,
        children: [
            { path: 'market', component: Market, name: '佣金汇总' },
            { path: '1', component: Form, name: '佣金审核' },
            { path: 'form', component: Form, name: '佣金明细' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '推广链接 ',
        iconCls: 'fa el-icon-document',//图标样式class
        hidden: false,
        leaf: true,
        children: [
            { path: 'market', component: Market, name: '推广链接' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '客户服务 ',
        iconCls: 'fa el-icon-document',//图标样式class
        hidden: false,
        children: [
            { path: 'market', component: Market, name: '客服信息' },
            { path: 'form', component: Form, name: '下载中心' },
        ]
    },
    {
        path: '/',
        component: Home,
        name: '通知中心 ',
        iconCls: 'fa el-icon-document',//图标样式class
        hidden: false,
        children: [
            { path: 'market', component: Market, name: '期货公告' },
            { path: 'form', component: Form, name: '消息通知' },
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
        path: '/',
        component: Home,
        name: '系统管理',
        code: 'system',
        iconCls: 'fa el-icon-setting',
        hidden: true,
        children: [
            { path: 'page4', component: Page4, code: 'user', name: '用户管理',hidden: true },
            { path: 'page5', component: Page5, code: 'role', name: '角色管理',hidden: true }
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