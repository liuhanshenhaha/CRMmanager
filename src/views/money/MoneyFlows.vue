<template>
	<section>
		<!--工具条-->
		<!-- 非客户账号登陆 -->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;" v-if="customerType !== 'customer'">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.tradeAccount" placeholder="交易账号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.userName" placeholder="用户名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-cascader v-model="filters.superiorUserId" :options="options" @active-item-change="makeCascader"></el-cascader>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.type" placeholder="类型" >
						<el-option v-for="item in buildOption('MoneyInOutTypeEnu',true)" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.status" placeholder="状态" >
						<el-option v-for="item in buildOption('MoneyInOutStatusEnu',true)" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="()=>getList(1)">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!-- 客户账号登陆 -->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;" v-if="customerType === 'customer'">
			<el-form :inline="true" :model="filters">
				<el-col :span="3" :xs="24">
					<el-form-item>
						<el-input v-model="filters.tradeAccount" placeholder="交易账号"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="3" :xs="24">
					<el-form-item>
						<el-select v-model="filters.type" placeholder="类型" >
							<el-option v-for="item in buildOption('MoneyFlowTypeEnu',true)" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="3" :xs="24">
					<el-form-item>
						<el-select v-model="filters.status" placeholder="状态" >
							<el-option v-for="item in buildOption('MoneyInOutStatusEnu',true)" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="3" :xs="24">
					<el-form-item>
						<el-button type="primary" v-on:click="()=>getList(1)">查询</el-button>
					</el-form-item>
				</el-col>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table stripe border fixed :data="tableData" highlight-current-row v-loading="listLoading" @selection-change="" style="width: 100%;">
			<el-table-column prop="tradeAccountNo" label="交易账号">
			</el-table-column>
			<el-table-column prop="userName" label="用户名">
			</el-table-column>
			<el-table-column prop="userAgentName" label="归属代理">
			</el-table-column>
			<el-table-column prop="type" label="资金流水类型" width="120" :formatter="(row,col,cellValue) => formatter('MoneyFlowTypeEnu',cellValue)">
			</el-table-column>
			<el-table-column prop="sourceAmount" label="金额变动前">
			</el-table-column>
			<el-table-column prop="targetAmount" label="金额变动后">
			</el-table-column>
			<el-table-column prop="remark" label="备注">
			</el-table-column>
			<el-table-column prop="createTime" label="创建时间">
			</el-table-column>
		</el-table>

		<div class="block" style="text-align:right">
		  <el-pagination background layout="prev, pager, next" :total="tableDataTotal" :page-size="20" @current-change="(currentPage)=>getList(currentPage)"></el-pagination>
		</div>
	</section>
</template>

<script>
	import { formatters, buildOptions, getAgentOptions } from "../../utils/utils"
	import { moneyQuest } from "../../api/api"
	export default {
		data(){
			return {
				filters:{
					type: "",
					status: "",
					userName: "",
					superiorUserId: [],
					cascadeType: "",
					tradeAccount: "",
					pageSize: 20
				},
				tableData: [],//表格数据
				listLoading: false,//表格加载中标识
				loading: false,
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
				})(),
			}
		},
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
			resetForm(formname) {
                this.$nextTick(()=>{
                    if(this.$refs[formname]){
					    this.$refs[formname].resetFields();
					}
                })                
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
				submitData.superiorUserId = this.filters.superiorUserId.length > 0 ? (this.filters.superiorUserId[this.filters.superiorUserId.length - 1] === "straight" ? this.filters.superiorUserId[this.filters.superiorUserId.length - 2] : this.filters.superiorUserId[this.filters.superiorUserId.length - 1]) : "";
				submitData.cascadeType = this.filters.superiorUserId.length > 0 ? (this.filters.superiorUserId[this.filters.superiorUserId.length - 1] === "straight" ? 1 : 2) : "";
				moneyQuest.getMoneyFlows(submitData).then(res => {
					this.tableData = res.content.dataList;
					this.tableDataTotal = res.content.count;
					this.listLoading = false;
				}).catch(err=>{this.listLoading = false;});
			},
		}
	}
</script>