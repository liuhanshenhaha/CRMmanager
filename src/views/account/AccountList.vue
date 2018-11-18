<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.userAccountNo" placeholder="账户"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.userName" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-cascader v-model="filters.superiorUserId" :options="options" @active-item-change="makeCascader"></el-cascader>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="()=>getAgents(1)">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table stripe border fixed :data="tableData" highlight-current-row v-loading="listLoading" @selection-change="" style="width: 100%;">
			<el-table-column prop="tradeAccountNo" label="账户" min-width="150">
			</el-table-column>
			<el-table-column prop="name" label="姓名" min-width="150">
			</el-table-column>
			<el-table-column prop="level" label="层级" width="100">
			</el-table-column>
			<el-table-column prop="superiorUserName" label="归属" width="100">
			</el-table-column>
			<el-table-column prop="accountMoney" label="余额" width="150">
			</el-table-column>
			<el-table-column prop="" label="持仓手数" width="100">
			</el-table-column>
			<el-table-column prop="" label="浮动盈亏" width="150">
			</el-table-column>
			<el-table-column prop="" label="净值" width="150">
			</el-table-column>
			<el-table-column prop="" label="占用保证金" width="150">
			</el-table-column>
			<el-table-column prop="" label="隔夜保证金" width="150">
			</el-table-column>
			<el-table-column prop="" label="风险率" width="150">
			</el-table-column>
			<el-table-column label="操作" align="center" fixed="right" width="120">
				<template slot-scope="scope">
					<el-button type="danger" size="small" @click="()=>resetPassword(scope.row)">重置密码</el-button>
				</template>
			</el-table-column>
		</el-table>

		<div class="block" style="text-align:right">
		  <el-pagination background layout="prev, pager, next" :total="tableDataTotal" @current-change="(currentPage)=>getContract(currentPage)"></el-pagination>
		</div>
	</section>
</template>

<script>
	import { buildOptions,formatters,getAgentOptions } from "../../utils/utils"
	import { accountQuest,getDictionary } from "../../api/api"
	export default {
		data(){
			return {
				filters:{
					userAccountNo: "",
					userName: "",
					superiorUserId: [],
				},
				tableData: [],//表格数据
				listLoading: false,//表格加载中标识
				listLoading2: false,//表格加载中标识
				curPage: 1,
				tableDataTotal: 1,
				cascade: [],
				options: [{
					label: "直属",
					value: "straight"
				}],
			}
		},
		created(){
			this.selectTradeAccount(1)
			getAgentOptions(this);
		},
		methods:{
			formatter(type,value){
				return formatters(type,value)
			},
			buildOption(type){
				return buildOptions(type)
			},
			// 获取市场列表
			selectTradeAccount(pageNo){
				this.listLoading = true;
				this.curPage = pageNo;
				accountQuest.selectTradeAccount({
					"userAccountNo":this.filters.userAccountNo,
					"userName":this.filters.userName,
					"superiorUserId":this.filters.superiorUserId.length > 0 ? (this.filters.superiorUserId[this.filters.superiorUserId.length - 1] === "straight" ? this.filters.superiorUserId[this.filters.superiorUserId.length - 2] : this.filters.superiorUserId[this.filters.superiorUserId.length - 1]) : "",
					"cascadeType":this.filters.superiorUserId.length > 0 ? (this.filters.superiorUserId[this.filters.superiorUserId.length - 1] === "straight" ? 1 : 2) : ""//1是直属 2是级联
				}).then(res => {
					this.tableData = res.content.dataList;
					this.tableDataTotal = res.content.count;
					this.listLoading = false;
				}).catch(err=>{this.listLoading = false;});
			},
			//动态生成代理下拉框
			makeCascader(value){
				getAgentOptions(this,value[value.length - 1],value)
			},
			resetPassword(row){
				accountQuest.resetTradePassword({
					id: row.id
				}).then(res => {
					console.log("重置密码成功")
				}).catch(err => {
					console.error("重置密码失败")
				})
			},
		}
	}
</script>