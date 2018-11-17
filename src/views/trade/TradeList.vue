<template>
	<section>
		<!--工具条-->
		<!-- 非客户账号登陆 -->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;" v-if="customerType !== 'customer'">
			<el-form :inline="true" :model="filters">
				<el-col :span="3" :xs="24">
					<el-form-item>
						<el-input v-model="filters.userAccountNo" placeholder="账户"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="3" :xs="24">
					<el-form-item>
						<el-input v-model="filters.userName" placeholder="姓名"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="3" :xs="24">
					<el-form-item>
						<el-select v-model="filters.openClose" placeholder="开平状态" >
							<el-option v-for="item in buildOptions('OpencloseEnu',true)" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="3" :xs="24">
					<el-form-item>
						<el-input v-model="filters.contractCode" placeholder="合约代码"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="3" :xs="24">
					<el-form-item>
						<el-cascader v-model="filters.superiorUserId" :options="options" @active-item-change="makeCascader"></el-cascader>
					</el-form-item>
				</el-col>
				<el-col :span="3" :xs="24">
					<el-form-item class="w90p">
						<el-date-picker v-model="filters.startDate" type="datetime" placeholder="选择开始日期时间" @change="changeEnd"></el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :span="3" :xs="24">
					<el-form-item class="w90p">
						<el-date-picker :picker-options="pickerOptionsEnd" v-model="filters.endDate" type="datetime" placeholder="选择结束日期时间"></el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :span="3" :xs="24">
					<el-form-item>
						<el-button type="primary" v-on:click="()=>getList(1)">查询</el-button>
					</el-form-item>
				</el-col>
			</el-form>
		</el-col>
		<!-- 客户账号登陆 -->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;" v-if="customerType === 'customer'">
			<el-form :inline="true" :model="filters">
				<el-col :span="5" :xs="24">
					<el-form-item>
						<el-select v-model="filters.openClose" placeholder="开平状态" >
							<el-option v-for="item in buildOptions('OpencloseEnu',true)" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="5" :xs="24">
					<el-form-item>
						<el-input v-model="filters.contractCode" placeholder="合约代码"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="5" :xs="24">
					<el-form-item class="w90p">
						<el-date-picker v-model="filters.startDate" type="datetime" placeholder="选择开始日期时间" @change="changeEnd"></el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :span="5" :xs="24">
					<el-form-item class="w90p">
						<el-date-picker :picker-options="pickerOptionsEnd" v-model="filters.endDate" type="datetime" placeholder="选择结束日期时间"></el-date-picker>
					</el-form-item>
				</el-col>
				<el-col :span="4" :xs="24">
					<el-form-item>
						<el-button type="primary" v-on:click="()=>getList(1)">查询</el-button>
					</el-form-item>
				</el-col>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table class="restyle-table" show-summary :summary-method="getSummaries" stripe border fixed :data="tableData" highlight-current-row v-loading="listLoading" @selection-change="" style="width: 100%;">
			<el-table-column prop="idName" label="订单号" min-width="100">
			</el-table-column>
			<el-table-column prop="tradeAccountNo" label="账户" min-width="150">
			</el-table-column>
			<el-table-column prop="userName" label="姓名" width="100">
			</el-table-column>
			<el-table-column prop="futureName" label="交易品种" width="200">
			</el-table-column>
			<el-table-column prop="side" label="买卖" width="100" :formatter="(row,col,cellValue)=>formatter('SideEnu',cellValue)">
			</el-table-column>
			<el-table-column prop="openclose" label="开平状态" width="100" :formatter="(row,col,cellValue)=>formatter('OpencloseEnu',cellValue)">
			</el-table-column>
			<el-table-column prop="sxf" label="手续费" width="100">
			</el-table-column>
			<el-table-column prop="currency" label="货币类型" width="100" :formatter="(row,col,cellValue)=>formatter('CurrencyTypeEnu',cellValue)">
			</el-table-column>
			<el-table-column prop="tradeNum" label="成交手数" width="100">
			</el-table-column>
			<el-table-column prop="orderPrice" label="报单价格" width="150" :formatter="(row,col,cellValue)=>{if(cellValue==0){return '市价'}else{return cellValue}}">
			</el-table-column>
			<el-table-column prop="tradePrice" label="成交价格" width="150">
			</el-table-column>
			<el-table-column prop="source" label="委托状态" width="100" :formatter="(row,col,cellValue)=>formatter('SourceEnu',cellValue)">
			</el-table-column>
			<el-table-column prop="tradeTime" label="成交时间" width="200">
			</el-table-column>
			<el-table-column prop="orderType" label="标志" width="100" :formatter="(row,col,cellValue)=>formatter('OrderTypeEnu',cellValue)">
			</el-table-column>
		</el-table>

		<div class="block" style="text-align:right">
		  <el-pagination background layout="prev, pager, next" :total="tableDataTotal" @current-change="(currentPage)=>getContract(currentPage)"></el-pagination>
		</div>
	</section>
</template>

<script>
	import { buildOptions,formatters,getAgentOptions, dateFormat } from "../../utils/utils"
	import { tradeQuest } from "../../api/api"
	export default {
		data(){
			return {
				filters:{
					tradeAccountNo: "",
					userName: "",
					contractCode: "",
					superiorUserId: [],
					startDate: "",
					endDate: ""
				},
				tableData: [],//表格数据
				tableDataSummary: {},
				listLoading: false,//表格加载中标识
				curPage: 1,
				tableDataTotal: 1,
				options: [],
				cascade: [],
				pickerOptionsEnd: {},
				customerType: (()=>{
					switch(JSON.parse(localStorage.userInfo).customerType){
				        case 3: return "agent";break;
				        case 4: return "customer";break;
				        default: return "admin";
				    }
				})()
			}
		},
		created(){
			this.getList(1);
			this.customerType !== "customer" && getAgentOptions(this);
		},
		methods:{
			formatter(type,value){
				return formatters(type,value)
			},
			changeEnd(){
				this.pickerOptionsEnd = Object.assign({},this.pickerOptionsEnd,{
					disabledDate: (time) => {
						return time.getTime() < this.filters.startDate.getTime()
					}
				})
			},
			buildOptions(type,boolean){
				return buildOptions(type,boolean);
			},
			//动态生成代理下拉框
			makeCascader(value){
				getAgentOptions(this,value[value.length - 1],value)
			},
			// 获取持仓订单列表
			getList(pageNo){
				this.listLoading = true;
				this.curPage = pageNo;
				let submitData = {...this.filters};
				submitData.startDate = this.filters.startDate ? dateFormat(this.filters.startDate,"yyyy-MM-dd hh:mm:ss") : "";
				submitData.endDate = this.filters.endDate ? dateFormat(this.filters.endDate,"yyyy-MM-dd hh:mm:ss") : "";
				submitData.superiorUserId = this.filters.superiorUserId.length > 0 ? (this.filters.superiorUserId[this.filters.superiorUserId.length - 1] === "straight" ? this.filters.superiorUserId[this.filters.superiorUserId.length - 2] : this.filters.superiorUserId[this.filters.superiorUserId.length - 1]) : "";
				submitData.cascadeType = this.filters.superiorUserId.length > 0 ? (this.filters.superiorUserId[this.filters.superiorUserId.length - 1] === "straight" ? 1 : 2) : "";
				if(this.customerType !== "customer"){
					tradeQuest.getTradeList(submitData).then(res => {
						this.tableData = res.content.dataList;
						this.tableDataSummary = res.content.statisticsData;
						this.tableDataTotal = res.content.count;
						this.listLoading = false;
					}).catch(err=>{this.listLoading = false;});
				}else{
					tradeQuest.getUserTradeList(submitData).then(res => {
						this.tableData = res.content.dataList;
						this.tableDataSummary = res.content.statisticsData;
						this.tableDataTotal = res.content.count;
						this.listLoading = false;
					}).catch(err=>{this.listLoading = false;});
				}
			},
			getSummaries(param) {
				const { columns, data } = param;
				const sums = [];
				columns.forEach((column, index) => {
					if (index === 0) {
						sums[index] = '合计';
						return;
					}
					if(Object.keys(this.tableDataSummary).indexOf(column.property) > -1){
						sums[index] = this.tableDataSummary[column.property]
					}
				});
				return sums;
			}
		}
	}
</script>