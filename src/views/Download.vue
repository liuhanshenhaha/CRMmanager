<template>
    <section>
	    <div>
	    	<el-form label-position="right" label-width="80px">
	    		<el-row :gutter="20">
	    			<el-col :span="12" :x="24">
			            <el-form-item >
			            	<img src="../../static/logo.png" width="50px" height="50px" />
							<a href="./static/download/天德星setup.exe" class="agreements">PC端实盘下载</a>   
			            </el-form-item>
		            </el-col>
	    			<el-col :span="12" :x="24">
			            <el-form-item >
							注：默认开通， 如需使用易盛交易后台请另行申请切换东航期货极星客户端是一款涵盖行情和交易的期货&期权交易终端。国内首家全面支持郑商所五档深度行情、外盘极速行情，支持内外盘套利、跨市场套利交易、全面支持郑商所期权套利指令；除保留易盛经典版始创的横向一键下单、开平仓自适应插件外，还默认支持竖向三键下单、自动判断锁仓和加仓，支持画线下单、点价下单，多账户批量下单等。      
			            </el-form-item>
		            </el-col>		            
		        </el-row>	 
		        <el-row :gutter="20">
	    			<el-col :span="12" :x="24">
			            <el-form-item >
			            	 <img src="../../static/logo.png" width="50px" height="50px" />
							 <a href="./static/download/天德星-模拟setup.exe" class="agreements">PC端模拟盘下载</a>    
			            </el-form-item>
		            </el-col>
	    			<el-col :span="12" :x="24">
			            <el-form-item >
							提供国内期货、LME、CME、COMEX、TOCOM、NYCE、NYME、美汇、全球主要指数行情，期货评论、农产品信息、金属市场信息及财经信息。成交明细新增“秒行情”，点击菜单栏中闪电图标或者通过键盘上的F12按钮即可启动下单界面：增至四种交易下单界面供选择，支持开平仓自适应、可开&平手数显示、下单合约锁定、鼠标双击下单，拖拽改价、拖拽撤单、多窗口&嵌入式mini下单、委托线修改等。采用最新的BGP多线接入技术，核心节点部署在北上广为主的一线互联网骨干城市，云行情支持电信、联通、移动、铁通、教育网等不同宽带类型接入。     
			            </el-form-item>
		            </el-col>		            
		        </el-row> 
		        <el-row :gutter="20">
	    			<el-col :span="12" :x="24">
			            <el-form-item >
			            	 <vue-q-art :config="config_android" :downloadButton="downloadButton"></vue-q-art>
							 <a href="./static/download/android.txt" class="agreements">安卓手机版</a>    
			            </el-form-item>
		            </el-col>
	    			<el-col :span="12" :x="24">
			            <el-form-item >
							行情：中金所、上期所、大商所、郑商所、上证、深证、外汇、LME、CME、COMEX、NYMEX、CBOT、NYBOT、ICE、SGX、TOCOM。。。
							交易：国内期货、海外期货、仓单融资、香港证券、杠杆外汇、基金投资。。。
							服务：开户、咨询、智能数据、交易策略、投资工具、蓝海密剑。。。     
			            </el-form-item>
		            </el-col>		            
		        </el-row> 
		        	<el-row>
	    			<el-col :span="12" :x="24">
			            <el-form-item width="50px" height="50px">
			            	 <vue-q-art :config="config_apple"></vue-q-art>
							 <a href="./static/download/apple.txt" class="agreements">苹果手机版</a> 
			            </el-form-item>
		            </el-col>
	    			<el-col :span="12" :x="24">
			            <el-form-item >
							行情：中金所、上期所、大商所、郑商所、上证、深证、外汇、LME、CME、COMEX、NYMEX、CBOT、NYBOT、ICE、SGX、TOCOM。。。
							交易：国内期货、海外期货、仓单融资、香港证券、杠杆外汇、基金投资。。。
							服务：开户、咨询、智能数据、交易策略、投资工具、蓝海密剑。。。       
			            </el-form-item>
		            </el-col>		            
		        </el-row> 		      
		        	<el-row :gutter="20">
	    			<el-col :span="12" :x="24">
			            <el-form-item >
							 <a href="./static/download/使用教程.docx" class="agreements">使用教程下载</a>    
			            </el-form-item>
		            </el-col>
		        </el-row> 
	        </el-form>
	    </div>
    </section>
</template>

<script>
	import VueQArt from 'vue-qart'	
	export default {
		data(){
			return {
				config_apple: {
				   value: 'http://www.baidu.com',
				   imagePath: '/static/1.png',
				   filter: 'color'
				},		
				config_android: {
				   value: 'http://www.lebut.com',
				   imagePath: '/static/1.png',
				   filter: 'color'
				},
			}
		},
		components: {VueQArt},
		created(){
		},
	}
</script>