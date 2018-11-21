<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.tradeChannelCode" placeholder="通道代码"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.tradeChannelName" placeholder="通道名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.status" placeholder="状态">
						<el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getChannel">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="addChannel">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table stripe border fixed :data="tableData" highlight-current-row v-loading="listLoading" @selection-change="" style="width: 100%;">
			<el-table-column prop="tradeChannelCode" label="通道代码" sortable width="120">
			</el-table-column>
			<el-table-column prop="tradeChannelName" label="通道名称" sortable width="150">
			</el-table-column>
			<el-table-column prop="accountNo" label="账号" sortable width="120">
			</el-table-column>			
			<el-table-column prop="status" label="状态" sortable width="100" :formatter="statusFormat">
			</el-table-column>
			<el-table-column prop="remark" label="备注" sortable >
			</el-table-column>
			<el-table-column label="操作" align="center" fixed="right" width="150">
				<template slot-scope="scope">
					<el-button type="primary" size="small" @click="modifyChannel(scope.row)">编辑</el-button>
					<el-button type="danger" size="small" v-if="Boolean(scope.row.status)" @click="modifyStatus(scope.row)">作废</el-button>
					<el-button type="success" size="small" v-if="!Boolean(scope.row.status)" @click="modifyStatus(scope.row)">激活</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--新增/更新界面-->
		<el-dialog  :title="operateName"  v-model="addFormVisible" :close-on-click-modal="false">		
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-row>
					<el-col :span="12" :xs="24">
						<el-form-item label="代码" prop="tradeChannelCode">
							<el-input v-model="addForm.tradeChannelCode" auto-complete="off"  :disabled="isModify"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="名称" prop="tradeChannelName">
							<el-input v-model="addForm.tradeChannelName" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12" :xs="24">
						<el-form-item label="账号" prop="accountNo">
							<el-input v-model="addForm.accountNo" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="密码" prop="password">
							<el-input type="password" v-model="addForm.password" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>	
				<el-row>				
					<el-col :span="24">
						<el-form-item label="备注" prop="remark">
							<el-input type="textarea" v-model="addForm.remark"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="updateChannel" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import { formatters,buildOptions } from "../../utils/utils"
	import { channelQuest } from "../../api/api"
	export default {
		data(){
			return {
				filters:{//查询表单数据
					tradeChannelCode: "",
					tradeChannelName: "",
					status: "",
				},
				statusOptions: buildOptions("CommonStatus",true),
				tableData: [],//表格数据
				listLoading: false,//表格加载中标识
				addLoading: false,//增改加载中标识
				addFormVisible: false,//新增弹窗显示标识
				addForm: {//新增弹窗表单数据
					tradeChannelCode: "",
					tradeChannelName: "",
					accountNo: "",
					password: "",
					remark: ""
				},
				addFormRules:{
					tradeChannelCode: [{required: true, message: '请输入代码', trigger: 'blur'}],
					tradeChannelName: [{required: true, message: '请输入名称', trigger: 'blur'}],
				},
				isModify: false,//是否是编辑通道操作
				operateName:"新增"				
			}
		},
		created(){
			this.getChannel()
		},
		methods:{
			// 表格数据格式化 状态
			statusFormat(row, col, cellValue){
				return formatters("CommonStatus",cellValue)
			},
			// 获取市场列表
			getChannel(){
				this.listLoading = true;
				channelQuest.getChannel({
					tradeChannelCode: this.filters.tradeChannelCode,
					tradeChannelName: this.filters.tradeChannelName,
					status: this.filters.status
				}).then(res => {
					this.tableData = res.content;
					// console.log(this.tableData)
					this.listLoading = false;
				}).catch(err=>{this.listLoading = false;});
			},
			// 操作按钮方法
			modifyStatus(row){
				this.listLoading = true;
				channelQuest.modifyStatus({
					id: row.id,
					status: row.status ? 0 : 1
				}).then(res => {
					this.listLoading = false;
					this.getChannel();
				}).catch(err=>{this.listLoading = false;});
			},
			// 弹出新增弹窗
			addChannel(){
				this.addFormVisible = true;
				this.operateName = "新增";
				this.isModify = false;
				this.addForm = {
					tradeChannelCode: "",
					tradeChannelName: "",
					accountNo: "",
					password: "",					
					remark: ""
				}
			},
			// 弹出编辑弹窗
			modifyChannel(row){
				this.addFormVisible = true;
				this.operateName = "编辑";
				this.isModify = true;
				this.addForm = {
					tradeChannelCode: row.tradeChannelCode,
					tradeChannelName: row.tradeChannelName,
					accountNo: row.accountNo,
					password: row.password,
					remark: row.remark,
					id: row.id
				}
			},
			// 新增/更新市场
			updateChannel(){
				this.$refs.addForm.validate(valid => {
					if(valid){
						this.addLoading = true;
						if(!this.isModify){
							channelQuest.addChannel(this.addForm).then(res => {
								this.addLoading = false;
								this.addFormVisible = false;
								this.getChannel();
							}).catch(err=>{this.listLoading = false;});
						}else{
							channelQuest.modifyChannel(this.addForm).then(res => {
								this.addLoading = false;
								this.addFormVisible = false;
								this.getChannel();
							}).catch(err=>{this.listLoading = false;});
						}
					}else{
						return false;
					}
				})
			},
		}
	}
</script>