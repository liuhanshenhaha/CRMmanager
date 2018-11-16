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
			<el-table-column prop="name" label="订单号" min-width="150">
			</el-table-column>
			<el-table-column prop="sex" label="账户" min-width="80" :formatter="(row,col,value)=>formatter('UserSex',value)">
			</el-table-column>
			<el-table-column prop="level" label="姓名" width="100">
			</el-table-column>
			<el-table-column prop="superiorUserName" label="层级" width="100">
			</el-table-column>
			<el-table-column prop="isConfig" label="归属" width="150">
			</el-table-column>
			<el-table-column prop="customerStatus" label="交易品种" width="100" :formatter="(row,col,value)=>formatter('UserStatus',value)">
			</el-table-column>
			<el-table-column prop="applyTime" label="买卖" width="150">
			</el-table-column>
			<el-table-column prop="bankCode" label="持仓手数" width="150">
			</el-table-column>
			<el-table-column prop="bankCode" label="可平手数" width="150">
			</el-table-column>
			<el-table-column prop="bankCode" label="开仓价格" width="150">
			</el-table-column>
			<el-table-column prop="bankCode" label="止盈" width="150">
			</el-table-column>
			<el-table-column prop="bankCode" label="止损" width="150">
			</el-table-column>
			<el-table-column prop="bankCode" label="货币类型" width="150">
			</el-table-column>
			<el-table-column prop="bankCode" label="交易盈亏" width="150">
			</el-table-column>
			<el-table-column label="操作" align="center" fixed="right" width="200">
				<template slot-scope="scope">
					<el-button type="primary" size="small" @click="()=>modify(scope.row)">配置</el-button>
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
	import { buildOptions,formatters } from "../../utils/utils"
	import { tradeQuest } from "../../api/api"
	export default {
		data(){
			return {
				filters:{
					tradeAccountNo: "",
					userName: "",
					goodsName: "",
					superiorUserId: "",
				},
				tableData: [],//表格数据
				listLoading: false,//表格加载中标识
				curPage: 1,
				tableDataTotal: 1,
			}
		},
		created(){
			this.getList(1)
		},
		methods:{
			formatter(type,value){
				return formatters(type,value)
			},
			// 获取持仓订单列表
			getList(pageNo){
				this.listLoading = true;
				this.curPage = pageNo;
				tradeQuest.getHoldingList(this.filters).then(res => {
					this.tableData = res.content.dataList;
					this.tableDataTotal = res.content.count;
					this.listLoading = false;
				}).catch(err=>{this.listLoading = false;});
			},
		}
	}
</script>