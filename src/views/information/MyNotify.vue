<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="标题"></el-input>
				</el-form-item>			
				<el-form-item>
					<el-select v-model="filters.status" placeholder="状态">
						<el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item class="w90p">
					<el-date-picker v-model="filters.beginDate" type="datetime" placeholder="选择开始日期时间"></el-date-picker>
				</el-form-item>
				<el-form-item class="w90p">
					<el-date-picker v-model="filters.endDate" type="datetime" placeholder="选择结束日期时间"></el-date-picker>
				</el-form-item>				
				<el-form-item>
					<el-button type="primary" v-on:click="select(1)">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="add">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table stripe border fixed :data="tableData" highlight-current-row v-loading="listLoading" @selection-change="" style="width: 100%;">
			<el-table-column prop="name" label="标题" sortable width="150">
			</el-table-column>		
			<el-table-column prop="beginDate" label="开始时间" width="150">
			</el-table-column>
			<el-table-column prop="linkStatus" label="状态" sortable width="90" :formatter="statusFormat">
			</el-table-column>
			<el-table-column prop="content" label="内容" sortable width="400">
			</el-table-column>				
			<el-table-column prop="remark" label="备注" sortable >
			</el-table-column>
			<el-table-column label="操作" align="center" fixed="right" width="150">
				<template slot-scope="scope">
					<el-button type="primary" size="small" @click="view(scope.row)">查看</el-button>
					<el-button type="danger" size="small" v-if="scope.row.linkStatus==1" @click="modifyStatus(scope.row)">已读</el-button>
					<el-button type="success" size="small" v-if="scope.row.linkStatus==2" @click="modifyStatus(scope.row)">未读</el-button>
				</template>
			</el-table-column>
		</el-table>

		<div class="block" style="text-align:right">
		  <el-pagination background layout="prev, pager, next" :total="tableDataTotal" :page-size="10" @current-change="(currentPage)=>select(currentPage)"></el-pagination>
		</div>

		<!--新增/更新界面-->
		<el-dialog  :title="查看"  v-model="addFormVisible" :close-on-click-modal="false">		
			<el-form :model="addForm" label-width="80px" ref="addForm">
				<el-row>
					<el-col>
						<el-form-item label="标题" prop="name">
							<el-input v-model="addForm.name" auto-complete="off" :readonly="true"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="开始时间" prop="beginDate" >
							<el-date-picker v-model="addForm.beginDate" type="datetime" placeholder="选择开始日期时间" :readonly="true"></el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>				
				<el-row>				
					<el-col :span="24">
						<el-form-item label="内容" prop="content" >
							<el-input type="textarea" v-model="addForm.content" :readonly="true"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>				
					<el-col :span="24">
						<el-form-item label="备注" prop="remark">
							<el-input type="textarea" v-model="addForm.remark"  :readonly="true"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">关闭</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import { formatters,buildOptions } from "../../utils/utils"
	import { notifyQuest } from "../../api/api"
	export default {
		data(){
			return {
				filters:{//查询表单数据
					name: null,
					type: 2,
					status: 1,
					beginDate:null
				},
				statusOptions: buildOptions("NotifyStatus",true),
				tableData: [],//表格数据
				listLoading: false,//表格加载中标识
				addLoading: false,//增改加载中标识
				addFormVisible: false,//新增弹窗显示标识
				tableDataTotal: 1,
				pickerOptionsEnd: {},
				addForm: {//新增弹窗表单数据
					name: "",
					beginDate: "",
					content:"",
					remark: ""
				},		
			}
		},
		created(){
			this.select(1)
		},
		methods:{
			// 表格数据格式化 状态
			statusFormat(row, col, cellValue){
				return formatters("NotifyStatus",cellValue)
			},		
			buildOption(type,all){
				return buildOptions(type,all)
			},			
			// 获取列表
			select(pageNo){
				this.listLoading = true;
				this.curPage = pageNo;	
				notifyQuest.selectMyByRecord({
					pageSize: 10,
					pageNo: pageNo,
					name: this.filters.name,
					beginDate:this.filters.beginDate,
					status: this.filters.status
				}).then(res => {
					this.tableData = res.content.dataList;					
					this.tableDataTotal = res.content.count;
					this.listLoading = false;
				}).catch(err=>{this.listLoading = false;});
			},
			// 操作按钮方法
			modifyStatus(row){
				this.listLoading = true;
				notifyQuest.modifyStatusMy({
					id: row.linkId,
					status: row.linkStatus==1 ? 2 : 1
				}).then(res => {
					this.listLoading = false;
					this.select();
				}).catch(err=>{this.listLoading = false;})
			},

			// 弹出编辑弹窗
			view(row){
				this.addFormVisible = true;
				this.isModify = true;
				this.addForm = {
					name: row.name,
					beginDate: row.beginDate,
					content: row.content,
					remark: row.remark,
					id: row.linkId
				};
				if(row.linkStatus == 1)
				{
					notifyQuest.modifyStatusMy({
						id: row.linkId,
						status: 2
					}).then(res => {
						this.select();
					}).catch(err=>{});
				}
			},
		}
	}
</script>