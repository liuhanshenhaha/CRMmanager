<template>
	<section>
		<!--工具条-->
		<!-- 非客户账号登陆 -->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;" v-if="customerType !== 'customer'">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.userAccountNo" placeholder="账户"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.userName" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.contractCode" placeholder="合约代码"></el-input>
				</el-form-item>
				<el-form-item>
					<el-cascader v-model="filters.superiorUserId" :options="options" @active-item-change="makeCascader"></el-cascader>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="()=>getList(1)">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!-- 客户账号登陆 -->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;" v-if="customerType === 'customer'">
			<el-form :inline="true" :model="filters">
				<el-col :span="5" :xs="24">
					<el-form-item>
						<el-input v-model="filters.contractCode" placeholder="合约代码"></el-input>
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
			<el-table-column prop="tradeAccountNo" label="账户" min-width="150">
			</el-table-column>
			<el-table-column prop="userName" label="姓名" width="100">
			</el-table-column>
			<el-table-column prop="futureName" label="交易品种" width="200">
			</el-table-column>
			<el-table-column prop="side" label="买卖" width="100" :formatter="(row,col,cellValue)=>formatter('SideEnu',cellValue)">
			</el-table-column>
			<el-table-column prop="futureNum" label="持仓手数" width="100">
			</el-table-column>
			<el-table-column prop="frozenNum" label="锁定手数" width="100">
			</el-table-column>
			<el-table-column prop="futurePrice" label="开仓价格" width="100">
			</el-table-column>
			<el-table-column prop="jyyk" label="交易盈亏" width="100">
			</el-table-column>
			<el-table-column label="操作" align="center" fixed="right" width="150">
				<template slot-scope="scope">
					<el-button type="primary" size="small" @click="()=>detail(scope.row.id)">查看明细</el-button>
				</template>
			</el-table-column>
		</el-table>

		<div class="block" style="text-align:right">
		  <el-pagination background layout="prev, pager, next" :total="tableDataTotal" :page-size="20" @current-change="(currentPage)=>getList(currentPage)"></el-pagination>
		</div>

		<el-dialog title="持仓明细" customClass="w80p" v-model="subTableVisible" :close-on-click-modal="false">
			<el-table stripe border fixed :data="subTableData" highlight-current-row v-loading="subListLoading" @selection-change="" style="width: 100%;" max-height="400">
				<el-table-column prop="idName" label="订单号" min-width="100">
				</el-table-column>
				<el-table-column prop="futureName" label="交易品种" width="200">
				</el-table-column>
				<el-table-column prop="side" label="买卖" width="100" :formatter="(row,col,cellValue)=>formatter('SideEnu',cellValue)">
				</el-table-column>
				<el-table-column prop="futureNum" label="持仓手数" width="100">
				</el-table-column>
				<el-table-column prop="frozenNum" label="锁定手数" width="100">
				</el-table-column>
				<el-table-column prop="futurePrice" label="开仓价格" width="100">
				</el-table-column>
				<el-table-column prop="jyyk" label="交易盈亏" width="100">
				</el-table-column>
				<el-table-column prop="updateTime" label="更新时间" width="100">
				</el-table-column>
			</el-table>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="subTableVisible = false">关闭</el-button>
			</div>
		</el-dialog>
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
					pageSize: 20
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
				})(),
				subTableData: [],
				subListLoading: false,
				subTableVisible: false,

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
				submitData.pageNo = pageNo;
				submitData.startDate = this.filters.startDate ? dateFormat(this.filters.startDate,"yyyy-MM-dd hh:mm:ss") : "";
				submitData.endDate = this.filters.endDate ? dateFormat(this.filters.endDate,"yyyy-MM-dd hh:mm:ss") : "";
				submitData.superiorUserId = this.filters.superiorUserId.length > 0 ? (this.filters.superiorUserId[this.filters.superiorUserId.length - 1] === "straight" ? this.filters.superiorUserId[this.filters.superiorUserId.length - 2] : this.filters.superiorUserId[this.filters.superiorUserId.length - 1]) : "";
				submitData.cascadeType = this.filters.superiorUserId.length > 0 ? (this.filters.superiorUserId[this.filters.superiorUserId.length - 1] === "straight" ? 1 : 2) : "";
				if(this.customerType !== "customer"){
					tradeQuest.queryHolding(submitData).then(res => {
						this.tableData = res.content.dataList;
						this.tableDataSummary = res.content.statisticsData;
						this.tableDataTotal = res.content.count;
						this.listLoading = false;
					}).catch(err=>{this.listLoading = false;});
				}else{
					tradeQuest.queryUserHolding(submitData).then(res => {
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
			},
			detail(id){
				this.subTableVisible = true;
				this.subListLoading = true;
				tradeQuest.queryHoldingDetail({id:id}).then(res => {
					this.subTableData = res.content;
					this.subListLoading = false;
				}).catch(error => {
					this.subListLoading = false;
					console.error("查询详细失败")
				})
			}
		}
	}
</script>