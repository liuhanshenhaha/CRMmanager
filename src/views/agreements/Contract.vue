<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.contractCode" placeholder="合约代码"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getContract">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table stripe border fixed :data="tableData" highlight-current-row v-loading="listLoading" @selection-change="" style="width: 100%;">
			<el-table-column prop="marketId" label="市场ID" sortable width="100">
			</el-table-column>
			<el-table-column prop="goodsId" label="商品ID" sortable min-width="150">
			</el-table-column>
			<el-table-column prop="contractCode" label="合约代码" sortable width="150">
			</el-table-column>
			<el-table-column prop="contractName" label="合约名称" sortable width="200">
			</el-table-column>
			<el-table-column prop="firstTradeDate" label="首次交易日" sortable width="150" :formatter="dateFormat">
			</el-table-column>
			<el-table-column prop="lastTradeDate" label="最后交易日" sortable width="150" :formatter="dateFormat">
			</el-table-column>
			<el-table-column prop="dayClose" label="每日强平时间" sortable width="150">
			</el-table-column>
			<el-table-column prop="dayOpen" label="每日开盘时间" sortable width="150">
			</el-table-column>
			<el-table-column prop="allowOvernight" label="是否允许隔夜" sortable width="150">
			</el-table-column>
			<el-table-column prop="status" label="状态" sortable width="150" :formatter="statusFormat">
			</el-table-column>
			<el-table-column prop="remark" label="备注" sortable width="150">
			</el-table-column>
			<el-table-column prop="createBy" label="创建人" sortable width="150">
			</el-table-column>
			<el-table-column prop="createTime" label="创建时间" sortable width="150" :formatter="dateFormat">
			</el-table-column>
			<el-table-column prop="modifyBy" label="更新人" sortable width="150">
			</el-table-column>
			<el-table-column prop="modifyTime" label="更新时间" sortable width="150" :formatter="dateFormat">
			</el-table-column>
			<el-table-column label="操作" align="center" fixed="right" width="150">
				<template slot-scope="scope">
					<!-- <el-button type="primary" size="small" @click="">新增</el-button>
					<el-button type="primary" size="small" @click="">编辑</el-button>
					<el-button type="primary" size="small" @click="modifyContract(scope.row)">设置</el-button>
					<el-button type="primary" size="small" @click="">修改首次交易时间</el-button>
					<el-button type="primary" size="small" @click="">修改最后交易时间</el-button>
					<el-button type="danger" size="small" @click="">删除</el-button> -->
					<el-dropdown size="small" split-button type="primary" trigger="click" @command="(command)=>tableOptions(command,scope.row)">
						操作
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="add">新增</el-dropdown-item>
							<el-dropdown-item command="edit">编辑</el-dropdown-item>
							<el-dropdown-item command="settings">设置</el-dropdown-item>
							<el-dropdown-item command="updateFirstDate">修改首次交易时间</el-dropdown-item>
							<el-dropdown-item command="updateLastDate">修改最后交易时间</el-dropdown-item>
							<el-dropdown-item command="delete">删除</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>
		</el-table>

		<!--新增/更新界面-->
		<el-dialog title="设置" v-model="modifyFormVisible" :close-on-click-modal="false">
			<el-form :model="modifyForm" label-width="80px" :rules="modifyFormRules" ref="modifyForm">
				<el-row>
					<el-col :span="12" :xs="24">
						<el-form-item label="开始时间" prop="startTime">
							<el-time-picker :editable="false" v-model="modifyForm.startTime" placeholder="开始时间"></el-time-picker>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="结束时间" prop="startTime">
							<el-time-picker :editable="false" v-model="modifyForm.overTime" placeholder="结束时间"></el-time-picker>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="" prop="overTimeNextDay">
							<el-checkbox v-model="modifyForm.overTimeNextDay">结束时间是否跨天</el-checkbox>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="类别" prop="type">
							<el-input v-model="modifyForm.type"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="状态" prop="status">
							<el-input v-model="modifyForm.status"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="备注" prop="remark">
							<el-input type="textarea" resize="none" v-model="modifyForm.remark"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="modifyFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="updateMarket" :loading="modifyLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import { dateFormat } from "../../utils/utils"
	import { contractQuest } from "../../api/api"
	export default {
		data(){
			return {
				filters:{//查询表单数据
					contractCode: "",
					contractName: "",
					status: "",
				},
				statusOptions: [{
						value: "A",
						label: "已激活"
					},{
						value: "C",
						label: "已作废"
					}],
				tableData: [],//表格数据
				listLoading: false,//表格加载中标识
				modifyLoading: false,//增改加载中标识
				modifyFormVisible: false,//设置弹窗显示标识
				modifyForm: {//设置弹窗表单数据
					startTime: "",
					overTime: "",
					overTimeNextDay: "",
					type: "",
					status: "",
					remark: "",
				},
				modifyFormRules:{
					contractCode: [{required: true, message: '请输入代码', trigger: 'blur'}],
					contractName: [{required: true, message: '请输入名称', trigger: 'blur'}],
				}
			}
		},
		created(){
			this.getContract()
		},
		methods:{
			// 表格数据格式化 日期
			dateFormat(row, col, cellValue){
				return dateFormat(new Date(cellValue))
			},
			// 表格数据格式化 状态
			statusFormat(row, col, cellValue){
				switch(cellValue){
					case "A": return "已激活";
					case "C": return "已作废";
				}
			},
			// 获取合约列表
			getContract(){
				// this.listLoading = true;
				// contractQuest.getContract({
				// 	marketCode: this.filters.contractCode,
				// }).then(res => {
				// 	this.tableData = JSON.parse(res.content);
				// 	// console.log(this.tableData)
				// 	this.listLoading = false;
				// });
				this.tableData = [{
					"marketId": "1",
					"goodsId": "1",
					"contractCode": "XG",
					"contractName": "张三李四公司",
					"firstTradeDate": "2018-01-09",
					"lastTradeDate": "2018-10-18",
					"dayClose": "15:00",
					"dayOpen": "09:00",
					"allowOvernight": "Y",
					"status": "A",
					"remark": "12312321312",
					"createBy": "管理员",
					"createTime": "2018-01-09",
					"modifyBy": "管理员",
					"modifyTime": "2018-01-09",
				}]
			},
			// 表格记录操作switch
			tableOptions(command,row){
				switch(command){
					case "add": ;break;
					case "edit": ;break;
					case "settings": ;break;
					case "updateFirstDate": ;break;
					case "updateLastDate": ;break;
					case "delete": ;break;
				}
			},
			// 弹出设置弹窗
			modifyContract(row){
				this.modifyFormVisible = true;
				this.modifyForm = {
					startTime: row.createTime,
					overTime: row.modifyTime,
					overTimeNextDay: row.overTimeNextDay,
					type: "",
					status: row.status,
					remark: row.remark,
				}
			},
			// 新增/更新市场
			updateContract(){
				this.$refs.modifyForm.validate(valid => {
					if(valid){
						this.modifyLoading = true;
						contractQuest.modifyContract(this.modifyForm).then(res => {
							this.modifyLoading = false;
							this.modifyFormVisible = false;
							this.getContract();
						});
					}else{
						return false;
					}
				})
			},
		}
	}
</script>

<style scoped lang="scss">
	.el-select-dropdown{
		z-index: 10001;
	}
</style>