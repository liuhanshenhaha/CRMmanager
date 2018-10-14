# How to use
安装依赖包
``` bash
	npm install
```
或直接解压项目目录下的node_modules.zip

开发模式调试
```bash
	npm run dev
```

# Folder structure
* build - webpack config files
* config - webpack config files
* dist - build
* src - app 目录
    * api - 接口配置列表
    * assets - 主题
    * components - 组件目录
    * styles - 样式 （包括vars.scss）
    * views - 页面目录
        * agreements - 合约管理
    * vuex
    * App.vue
    * main.js - 入口js
    * routes.js - 路由配置
* static - static assets

# Theme
You can change theme by 
1. Generate theme packages by [https://elementui.github.io/theme-preview/#/](https://elementui.github.io/theme-preview/#/)
2. Put theme packages in src/assets/theme/
3. Edit src/main.js 
``` bash
   import 'element-ui/lib/theme-default/index.css'
   to
   import './assets/theme/your-theme/index.css'
```
4. Edit src/styles/vars.scss

![theme-blue](https://raw.githubusercontent.com/taylorchen709/markdown-images/master/vueadmin/rec-demo.gif)
![theme-green](https://raw.githubusercontent.com/taylorchen709/markdown-images/master/vueadmin/theme-green.png)

# Browser support

Modern browsers and IE 10+.