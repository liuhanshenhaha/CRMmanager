const allows = JSON.parse(localStorage.getItem("allows"));//权限相关信息

import Login from './views/Login.vue'//登陆
import NotFound from './views/404.vue'
import Home from './views/Home.vue'//框架
import Main from './views/Main.vue'//空框架
// 合约管理
import Market from './views/agreements/Market.vue'//市场管理
import Contract from './views/agreements/Contract.vue'//市场管理

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
        path: '/',
        component: Home,
        name: '合约管理',
        iconCls: 'fa el-icon-document',//图标样式class
        hidden: false,
        children: [
            { path: '/market', component: Market, name: '市场管理' },
            { path: '/form', component: Form, name: '商品管理' },
            { path: '/agreements', component: Contract, name: '合约管理' },
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
            { path: '/page4', component: Page4, code: 'user', name: '用户管理',hidden: true },
            { path: '/page5', component: Page5, code: 'role', name: '角色管理',hidden: true }
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