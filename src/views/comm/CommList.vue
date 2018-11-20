<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
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
		</el-col>

		<!--列表-->
		<el-table stripe border fixed :data="tableData" highlight-current-row v-loading="listLoading" @selection-change="" style="width: 100%;">
			<el-table-column prop="commMoney" label="返佣金额" >
			</el-table-column>
			<el-table-column prop="status" label="返佣类型" :formatter="(row,col,cellValue) => formatter('CommissionTypeEnu',cellValue)">
			</el-table-column>
			<el-table-column prop="tradeNum" label="交易手数">
			</el-table-column>
			<el-table-column prop="status" label="状态" :formatter="(row,col,cellValue) => formatter('CommissionStatusEnu',cellValue)">
			</el-table-column>
			<el-table-column prop="createTime" label="生成时间">
			</el-table-column>
			<el-table-column prop="beginTime" label="明细开始时间">
			</el-table-column>
			<el-table-column prop="endTime" label="明细结束时间">
			</el-table-column>
			<el-table-column prop="userName" label="用户名">
			</el-table-column>
			<el-table-column prop="userAgentName" label="直属代理">
			</el-table-column>
			<el-table-column prop="userAgentName" label="直属代理">
			</el-table-column>
			<el-table-column label="操作" align="center" width="200">
				<template slot-scope="scope">
					<el-button type="primary" size="small" @click.native="()=>openDetail(scope.row)">查看详细</el-button>
					<el-button type="primary" size="small" @click.native="()=>aduit(scope.row)">审核</el-button>
				</template>
			</el-table-column>
		</el-table>

		<div class="block" style="text-align:right">
		  <el-pagination background layout="prev, pager, next" :total="tableDataTotal" :page-size="20" @current-change="(currentPage)=>getList(currentPage)"></el-pagination>
		</div>

		<el-dialog title="佣金详细" customClass="w70p" v-model="detailVisible" :close-on-click-modal="false">
			<CommDetail :id="curId"/>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="detailVisible = false;">关闭</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import { formatters, buildOptions, getAgentOptions } from "../../utils/utils"
	import { commQuest } from "../../api/api"
	import CommDetail from "./CommDetail"
	export default {
		data(){
			return {
				filters:{
					commType: "",
					status: "",
					userAccount: "",
					superiorUserId: [],
					taName: "",
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
				})(),
				detailVisible: false,
				curId: ""
			}
		},
		components:{CommDetail},
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
				submitData.superiorUserId = this.filters.superiorUserId.length > 0 ? (this.filters.superiorUserId[this.filters.superiorUserId.length - 1] === "straight" ? this.filters.superiorUserId[this.filters.superiorUserId.length - 2] : this.filters.superiorUserId[this.filters.superiorUserId.length - 1]) : "";
				submitData.cascadeType = this.filters.superiorUserId.length > 0 ? (this.filters.superiorUserId[this.filters.superiorUserId.length - 1] === "straight" ? 1 : 2) : "";
				commQuest.getComms(submitData).then(res => {
					this.tableData = res.content.dataList;
					this.tableDataTotal = res.content.count;
					this.listLoading = false;
				}).catch(err=>{this.listLoading = false;});
			},
			aduit(row){
				commQuest.examineComms({id:row.id}).then(res => {
					console.log("审核成功");
				}).catch(err => console.error("审核失败"))
			},
			openDetail(row){
				this.detailVisible = true;
				this.curId = row.id;
			}
		}
	}
</script>