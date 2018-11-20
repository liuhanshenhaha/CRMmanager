<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;" v-if="!id">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.agentName" placeholder="代理名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.agentAccount" placeholder="代理账号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.userName" placeholder="用户名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.tradeAccount" placeholder="用户交易账号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-cascader v-model="filters.superiorUserId" :options="options" @active-item-change="makeCascader"></el-cascader>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.status" placeholder="状态" >
						<el-option v-for="item in buildOption('CommissionStatusEnu',true)" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="()=>getList(1)">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table stripe border fixed :data="tableData" highlight-current-row v-loading="listLoading" @selection-change="" style="width: 100%;">
			<el-table-column prop="contractCode" label="合约编号" >
			</el-table-column>
			<el-table-column prop="commMoney" label="返佣金额">
			</el-table-column>
			<el-table-column prop="costMoney" label="归属成本">
			</el-table-column>
			<el-table-column prop="tradeNum" label="交易手数">
			</el-table-column>
			<el-table-column prop="lowerCostMoney" label="下级成本">
			</el-table-column>
			<el-table-column prop="status" label="状态" :formatter="(row,col,cellValue) => formatter('CommissionDetailStatusEnu',cellValue)" width="100">
			</el-table-column>
			<el-table-column prop="createTime" label="创建时间">
			</el-table-column>
			<el-table-column prop="tradeTime" label="交易时间">
			</el-table-column>
			<el-table-column prop="ownerName" label="用户名">
			</el-table-column>
			<el-table-column prop="tradeUserName" label="交易用户名">
			</el-table-column>
			<el-table-column prop="tradeAgentName" label="交易用户归属代理">
			</el-table-column>
			<el-table-column prop="tradeAccountNo" label="交易账户号">
			</el-table-column>
			<el-table-column label="操作" align="center" width="100" v-if="!id">
				<template slot-scope="scope">
					<el-button type="primary" size="small" @click.native="()=>aduit(scope.row)">审核</el-button>
				</template>
			</el-table-column>
		</el-table>

		<div class="block" style="text-align:right">
		  <el-pagination background layout="prev, pager, next" :total="tableDataTotal" :page-size="20" @current-change="(currentPage)=>getList(currentPage)"></el-pagination>
		</div>
	</section>
</template>

<script>
	import { formatters, buildOptions, getAgentOptions } from "../../utils/utils"
	import { commQuest } from "../../api/api"
	export default {
		data(){
			return {
				filters:{
					agentName: "",
					agentAccount: "",
					userName: "",
					superiorUserId: [],
					tradeAccount: "",
					status: "",
					commId: "",
					pageSize: 20
				},
				tableData: [],//表格数据
				listLoading: false,//表格加载中标识
				curPage: 1,
				tableDataTotal: 1,
				options: [],
				cascade: [],
				customerType: (()=>{
					switch(JSON.parse(localStorage.userInfo).customerType){
				        case 3: return "agent";break;
				        case 4: return "customer";break;
				        default: return "admin";
				    }
				})()
			}
		},
		props: ['id'],
		created(){
			this.getList(1);
			getAgentOptions(this);
		},
		methods:{
			formatter(type,value){
				return formatters(type,value)
			},
			buildOption(type,all){
				return buildOptions(type,all)
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
				submitData.pageNo = pageNo;
				submitData.commId = this.id ? this.id : "";
				submitData.superiorUserId = this.filters.superiorUserId.length > 0 ? (this.filters.superiorUserId[this.filters.superiorUserId.length - 1] === "straight" ? this.filters.superiorUserId[this.filters.superiorUserId.length - 2] : this.filters.superiorUserId[this.filters.superiorUserId.length - 1]) : "";
				submitData.cascadeType = this.filters.superiorUserId.length > 0 ? (this.filters.superiorUserId[this.filters.superiorUserId.length - 1] === "straight" ? 1 : 2) : "";
				commQuest.getCommDetails(submitData).then(res => {
					this.tableData = res.content.dataList;
					this.tableDataTotal = res.content.count;
					this.listLoading = false;
				}).catch(err=>{this.listLoading = false;});
			},
			aduit(row){
				commQuest.examineComms({id:row.id}).then(res => {
					console.log("审核成功");
				}).catch(err => console.error("审核失败"))
			}
		}
	}
</script>