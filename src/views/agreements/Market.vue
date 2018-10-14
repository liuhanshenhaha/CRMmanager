<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.marketCode" placeholder="代码"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.marketName" placeholder="名称"></el-input>
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
			<el-table-column prop="marketCode" label="代码" sortable width="100">
			</el-table-column>
			<el-table-column prop="marketName" label="名称" sortable min-width="150">
			</el-table-column>
			<el-table-column prop="status" label="状态" sortable width="100" :formatter="statusFormat">
			</el-table-column>
			<el-table-column prop="remark" label="备注" sortable width="200">
			</el-table-column>
			<el-table-column prop="createBy" label="创建人" sortable width="100">
			</el-table-column>
			<el-table-column prop="createTime" label="创建时间" sortable width="150" :formatter="dateFormat">
			</el-table-column>
			<el-table-column prop="modifyBy" label="更新人" sortable width="100">
			</el-table-column>
			<el-table-column prop="modifyTime" label="更新时间" sortable width="150" :formatter="dateFormat">
			</el-table-column>
			<el-table-column prop="status" label="操作" align="center" fixed="right" width="150">
				<template slot-scope="scope">
					<el-button type="primary" size="small" @click="modifyMarket(scope.row)">编辑</el-button>
					<el-button type="danger" size="small" v-if="scope.row.status === 'A'" @click="modifyStatus(scope.row)">作废</el-button>
					<el-button type="success" size="small" v-if="scope.row.status === 'C'" @click="modifyStatus(scope.row)">激活</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--新增/更新界面-->
		<el-dialog title="新增" v-model="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-row>
					<el-col :span="12">
						<el-form-item label="代码" prop="marketCode">
							<el-input v-model="addForm.marketCode" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12">
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
	import { dateFormat } from "../../utils/utils"
	import { agreementsQuest } from "../../api/api"
	export default {
		data(){
			return {
				filters:{//查询表单数据
					marketCode: "",
					marketName: "",
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
			// 获取市场列表
			getMarket(){
				this.listLoading = true;
				agreementsQuest.getMarket({
					marketCode: this.filters.marketCode,
					marketName: this.filters.marketName,
					status: this.filters.status
				}).then(res => {
					this.tableData = JSON.parse(res.content);
					// console.log(this.tableData)
					this.listLoading = false;
				});
			},
			// 操作按钮方法
			modifyStatus(row){
				this.listLoading = true;
				agreementsQuest.modifyStatus({
					id: row.id,
					status: row.status === "A" ? "C" : "A"
				}).then(res => {
					this.listLoading = false;
					this.getMarket();
				});
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
							agreementsQuest.addMarket(this.addForm).then(res => {
								this.addLoading = false;
								this.addFormVisible = false;
								this.getMarket();
							});
						}else{
							agreementsQuest.modifyMarket(this.addForm).then(res => {
								this.addLoading = false;
								this.addFormVisible = false;
								this.getMarket();
							}).catch(err => this.addLoading = false);
						}
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