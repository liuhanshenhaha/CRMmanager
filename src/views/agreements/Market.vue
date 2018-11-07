<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.marketCode" placeholder="市场代码"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.marketName" placeholder="市场名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.status" placeholder="状态">
						<el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getMarket">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="addMarket">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table stripe border fixed :data="tableData" highlight-current-row v-loading="listLoading" @selection-change="" style="width: 100%;">
			<el-table-column prop="marketCode" label="市场代码" sortable width="120">
			</el-table-column>
			<el-table-column prop="marketName" label="市场名称" sortable min-width="150">
			</el-table-column>
			<el-table-column prop="status" label="状态" sortable width="100" :formatter="statusFormat">
			</el-table-column>
			<el-table-column prop="remark" label="备注" sortable width="200">
			</el-table-column>
			<el-table-column label="操作" align="center" fixed="right" width="150">
				<template slot-scope="scope">
					<el-button type="primary" size="small" @click="modifyMarket(scope.row)">编辑</el-button>
					<el-button type="danger" size="small" v-if="Boolean(scope.row.status)" @click="modifyStatus(scope.row)">作废</el-button>
					<el-button type="success" size="small" v-if="!Boolean(scope.row.status)" @click="modifyStatus(scope.row)">激活</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--新增/更新界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-row>
					<el-col :span="12" :xs="24">
						<el-form-item label="代码" prop="marketCode">
							<el-input v-model="addForm.marketCode" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="名称" prop="marketName">
							<el-input v-model="addForm.marketName" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="备注" prop="remark">
							<el-input type="textarea" v-model="addForm.remark"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="updateMarket" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import { formatters,buildOptions } from "../../utils/utils"
	import { marketQuest } from "../../api/api"
	export default {
		data(){
			return {
				filters:{//查询表单数据
					marketCode: "",
					marketName: "",
					status: "",
				},
				statusOptions: buildOptions("CommonStatus",true),
				tableData: [],//表格数据
				listLoading: false,//表格加载中标识
				addLoading: false,//增改加载中标识
				addFormVisible: false,//新增弹窗显示标识
				addForm: {//新增弹窗表单数据
					marketCode: "",
					marketName: "",
					remark: ""
				},
				addFormRules:{
					marketCode: [{required: true, message: '请输入代码', trigger: 'blur'}],
					marketName: [{required: true, message: '请输入名称', trigger: 'blur'}],
				},
				isModify: false//是否是编辑市场操作
			}
		},
		created(){
			this.getMarket()
		},
		methods:{
			// 表格数据格式化 状态
			statusFormat(row, col, cellValue){
				return formatters("CommonStatus",cellValue)
			},
			// 获取市场列表
			getMarket(){
				this.listLoading = true;
				marketQuest.getMarket({
					marketCode: this.filters.marketCode,
					marketName: this.filters.marketName,
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
				marketQuest.modifyStatus({
					id: row.id,
					status: row.status ? 0 : 1
				}).then(res => {
					this.listLoading = false;
					this.$message({
						message: '修改市场状态成功！',
						type: 'success'
					});
					this.getMarket();
				}).catch(err=>{this.listLoading = false;});
			},
			// 弹出新增弹窗
			addMarket(){
				this.addFormVisible = true;
				this.isModify = false;
				this.addForm = {
					marketCode: "",
					marketName: "",
					remark: ""
				}
			},
			// 弹出编辑弹窗
			modifyMarket(row){
				this.addFormVisible = true;
				this.isModify = true;
				this.addForm = {
					marketCode: row.marketCode,
					marketName: row.marketName,
					remark: row.remark,
					id: row.id
				}
			},
			// 新增/更新市场
			updateMarket(){
				this.$refs.addForm.validate(valid => {
					if(valid){
						this.addLoading = true;
						if(!this.isModify){
							marketQuest.addMarket(this.addForm).then(res => {
								this.addLoading = false;
								this.addFormVisible = false;
								this.getMarket();
							}).catch(err=>{this.listLoading = false;});
						}else{
							marketQuest.modifyMarket(this.addForm).then(res => {
								this.addLoading = false;
								this.addFormVisible = false;
								this.getMarket();
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