<template>
	<section>
		<!--工具条-->
		<!-- <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-select v-model="filters.commType" placeholder="佣金周期" >
						<el-option v-for="item in buildOption('CommissionTypeEnu',true)" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.status" placeholder="状态" >
						<el-option v-for="item in buildOption('CommissionStatusEnu',true)" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.userAccount" placeholder="管理账号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.taName" placeholder="用户名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-cascader v-model="filters.superiorUserId" :options="options" @active-item-change="makeCascader"></el-cascader>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="()=>getList(1)">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col> -->

		<!--列表-->
		<el-table stripe border fixed :data="tableData" highlight-current-row v-loading="listLoading" @selection-change="" style="width: 100%;">
			<el-table-column prop="name" label="姓名">
			</el-table-column>
			<el-table-column prop="level" label="层级">
			</el-table-column>
			<el-table-column prop="superiorUserName" label="归属">
			</el-table-column>
			<el-table-column prop="oldBankCode" label="原开户银行" width="140" :formatter="(row,col,cellValue) => formatter('Bank',cellValue)">
			</el-table-column>
			<el-table-column prop="oldBankBranch" label="原开户支行" width="140">
			</el-table-column>
			<el-table-column prop="oldBankCardNo" label="原银行卡号" width="140">
			</el-table-column>
			<el-table-column prop="bankCode" label="新开户银行" width="140" :formatter="(row,col,cellValue) => formatter('Bank',cellValue)">
			</el-table-column>
			<el-table-column prop="bankBranch" label="新开户支行" width="140"> 
			</el-table-column>
			<el-table-column prop="bankCardNo" label="新银行卡号" width="140">
			</el-table-column>
			<el-table-column prop="applyTime" label="提交时间" width="180">
			</el-table-column>
			<el-table-column prop="auditPassTime" label="审核时间" width="180">
			</el-table-column>
			<el-table-column prop="auditStatus" label="审核状态" width="140" :formatter="(row,col,cellValue) => formatter('ApplyStatus',cellValue)">
			</el-table-column>
			<el-table-column prop="remark" label="备注">
			</el-table-column>
			<el-table-column label="操作" align="center" width="160" fixed="right">
				<template slot-scope="scope">
					<el-button type="primary" size="small" @click.native="()=>aduit('pass',scope.row)">通过</el-button>
					<el-button type="primary" size="small" @click.native="()=>aduit('reject',scope.row)">拒绝</el-button>
				</template>
			</el-table-column>
		</el-table>

		<el-dialog title="佣金详细" customClass="w70p" v-model="detailVisible" :close-on-click-modal="false">
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="detailVisible = false;">关闭</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import { formatters } from "../../utils/utils"
	import { accountQuest } from "../../api/api"
	export default {
		data(){
			return {
				tableData: [],//表格数据
				listLoading: false,//表格加载中标识
				customerType: (()=>{
					switch(JSON.parse(localStorage.userInfo).customerType){
				        case 3: return "agent";break;
				        case 4: return "customer";break;
				        default: return "admin";
				    }
				})(),
				detailVisible: false,
				curId: "",
				status: ""
			}
		},
		created(){
			this.getList(1);
		},
		methods:{
			formatter(type,value){
				return formatters(type,value)
			},
			buildOption(type,all){
				return buildOptions(type,all)
			},
			// 获取持仓订单列表
			getList(pageNo){
				this.listLoading = true;
				accountQuest.switchBankCard({}).then(res => {
					this.tableData = res.content;
					this.listLoading = false;
				}).catch(err=>{this.listLoading = false;});
			},
			aduit(type,row){
				let status;
				switch(type){
					case "pass": status = 2;
					case "reject": status = 3;
				}
				accountQuest.auditSwitchBankCard({id:row.id,status:status}).then(res => {
					console.log("审核成功");
				}).catch(err => console.error("审核失败"))
			},
		}
	}
</script>