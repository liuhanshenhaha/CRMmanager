import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-customer/index.css'
//import './assets/theme/theme-green/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import routes from './routes'
import VueClipboard from 'vue-clipboard2'
import 'font-awesome/css/font-awesome.min.css'
import './styles/custome.scss'
import {getCookie,delCookie} from './utils/utils';

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(VueClipboard)

//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
  routes
})

// 登录限制 -- 必须登录才能访问其他页面
router.beforeEach((to, from, next) => {
  //NProgress.start();
  if (to.path == '/login') {
    delCookie('token');
  }
  let token = getCookie('token');
  if (!token && to.path != '/login' && to.path != "/customer-register" && to.path != "/agent-register") {
    next({ path: '/login' })
  } else {
    next()
  }
})

//router.afterEach(transition => {
//NProgress.done();
//});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

