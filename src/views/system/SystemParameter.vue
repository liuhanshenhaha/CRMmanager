<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.code" placeholder="代码"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.name" placeholder="名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.status" placeholder="状态">
						<el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="select">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table stripe border fixed :data="tableData" highlight-current-row v-loading="listLoading" @selection-change="" style="width: 100%;">
			<el-table-column prop="code" label="代码" sortable width="120">
			</el-table-column>
			<el-table-column prop="name" label="姓名" sortable width="120">
			</el-table-column>
			<el-table-column prop="orderBy" label="序号" sortable width="120">
			</el-table-column>				
			<el-table-column prop="seqValue" label="数字参数" sortable width="120">
			</el-table-column>				
			<el-table-column prop="value1" label="参数(50)" sortable width="120">
			</el-table-column>		
			<el-table-column prop="value2" label="参数(100)" sortable width="150">
			</el-table-column>			
			<el-table-column prop="value3" label="参数(255)" sortable width="250">
			</el-table-column>										
			<el-table-column prop="status" label="状态" sortable width="100" :formatter="statusFormat">
			</el-table-column>
			<el-table-column prop="remark" label="备注" sortable>
			</el-table-column>
			<el-table-column label="操作" align="center" fixed="right" width="150">
				<template slot-scope="scope">
					<el-button type="primary" size="small" @click="modify(scope.row)">编辑</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--新增/更新界面-->
		<el-dialog  :title="operateName"  v-model="addFormVisible" :close-on-click-modal="false">		
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-row>
					<el-col :span="12" :xs="24">
						<el-form-item label="代码" prop="code">
							<el-input v-model="addForm.code" auto-complete="off"  :disabled="isModify"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="名称" prop="name">
							<el-input v-model="addForm.name" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>	
				<el-row>					
					<el-col :span="12" :xs="24">
						<el-form-item label="序号" prop="orderBy">
							<el-input v-model="addForm.orderBy" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="数字参数" prop="seqValue">
							<el-input v-model="addForm.seqValue" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>	
				<el-row>					
					<el-col :span="12" :xs="24">
						<el-form-item label="参数(50)" prop="value1">
							<el-input v-model="addForm.value1" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>		
					<el-col :span="12" :xs="24">
						<el-form-item label="参数(100)" prop="value2">
							<el-input v-model="addForm.value2" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>					
				<el-row>					
					<el-col :span="24">
						<el-form-item label="参数(255)" prop="value3">
							<el-input type="textarea" v-model="addForm.value3"></el-input>
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
				<el-button type="primary" @click.native="updateDb" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import { formatters,buildOptions } from "../../utils/utils"
	import { systemParameterQuest } from "../../api/api"
	export default {
		data(){		
			return {
				statusOptions: buildOptions("CommonStatus",true),
				filters:{//查询表单数据
					code: "",
					name: "",
					status: 1,
				},				
				tableData: [],//表格数据
				listLoading: false,//表格加载中标识
				addLoading: false,//增改加载中标识
				addFormVisible: false,//新增弹窗显示标识
				addForm: {//新增弹窗表单数据
					code: "",
					name: "",
					value1: "",
					value2: "",	
					value3: "",	
					seqValue: "",	
					orderBy: "",						
					remark: ""
				},
				addFormRules:{
					code: [{required: true, message: '请输入代码',}],
					name: [{required: true, message: '请输入名称'}],			
				},
				isModify: false,//是否是编辑通道操作
				operateName:"新增"	//编辑窗体标题			
			}
		},
		created(){
			this.select();			
		},
		methods:{
			// 表格数据格式化 状态
			statusFormat(row, col, cellValue){
				return formatters("CommonStatus",cellValue)
			},

			// 获取列表
			select(){
				this.listLoading = true;
				systemParameterQuest.select({
					code: this.filters.code,
					name: this.filters.name,
					status: this.filters.status
				}).then(res => {
					this.tableData = res.content;
					// console.log(this.tableData)
					this.listLoading = false;
				}).catch(err=>{this.listLoading = false;});
			},
			
			// 弹出编辑弹窗
			modify(row){
				this.addFormVisible = true;
				this.operateName = "编辑";
				this.isModify = true;
				this.addForm = {
					code: row.code,
					name: row.name,
					value1: row.value1,
					value2: row.value2,
					value3: row.value3,
					seqValue: row.seqValue,
					orderBy: row.orderBy,
					remark: row.remark,
					id: row.id
				}
			},
			// 新增/更新市场
			updateDb(){
				this.$refs.addForm.validate(valid => {
					if(valid){
						this.addLoading = true;
						if(!this.isModify){
							systemParameterQuest.add(this.addForm).then(res => {
								this.addLoading = false;
								this.addFormVisible = false;
								this.select();
							}).catch(err=>{this.addLoading = false;});
						}else{
							systemParameterQuest.modify(this.addForm).then(res => {
								this.addLoading = false;
								this.addFormVisible = false;
								this.select();
							}).catch(err=>{this.addLoading = false;});
						}
					}else{
						return false;
					}
				})
			},
		}
	}
</script>