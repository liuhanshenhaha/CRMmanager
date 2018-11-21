<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.userAccountNo" placeholder="用户名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.customerStatus" placeholder="状态">
						<el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="select">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="add">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table stripe border fixed :data="tableData" highlight-current-row v-loading="listLoading" @selection-change="" style="width: 100%;">
			<el-table-column prop="userAccountNo" label="用户名" sortable width="120">
			</el-table-column>
			<el-table-column prop="name" label="姓名" sortable width="120">
			</el-table-column>
			<el-table-column prop="roleId" label="角色" sortable width="120" :formatter="roleFormat">
			</el-table-column>		
			<el-table-column prop="idCard" label="身份证号" sortable width="180">
			</el-table-column>			
			<el-table-column prop="phoneNo" label="手机号码" sortable width="150">
			</el-table-column>	
			<el-table-column prop="email" label="邮箱" sortable width="200">
			</el-table-column>				
			<el-table-column prop="customerStatus" label="状态" sortable width="100" :formatter="statusFormat">
			</el-table-column>
			<el-table-column prop="remark" label="备注" sortable>
			</el-table-column>
			<el-table-column label="操作" align="center" fixed="right" width="150">
				<template slot-scope="scope">
					<el-button type="primary" size="small" @click="modify(scope.row)">编辑</el-button>
					<el-button type="danger" size="small" v-if="scope.row.customerStatus===1" @click="modifyStatus(scope.row)">作废</el-button>
					<el-button type="success" size="small" v-if="scope.row.customerStatus!=1" @click="modifyStatus(scope.row)">激活</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--新增/更新界面-->
		<el-dialog  :title="operateName"  v-model="addFormVisible" :close-on-click-modal="false">		
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-row>
					<el-col :span="12" :xs="24">
						<el-form-item label="用户名" prop="userAccountNo">
							<el-input v-model="addForm.userAccountNo" auto-complete="off"  :disabled="isModify"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="姓名" prop="name">
							<el-input v-model="addForm.name" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12" :xs="24">
						<el-form-item label="角色" prop="roleId">
							<el-select v-model="addForm.roleId" placeholder="角色">
								<el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>	
					</el-col>				
					<el-col :span="12" :xs="24">
						<el-form-item label="身份证号" prop="idCard">
							<el-input v-model="addForm.idCard" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>						
					<el-col :span="12" :xs="24">
						<el-form-item label="手机号码" prop="phoneNo">
							<el-input v-model="addForm.phoneNo" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>		
					<el-col :span="12" :xs="50">
						<el-form-item label="邮箱" prop="email">
							<el-input v-model="addForm.email" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>
				</el-row>		
				<el-row>				
					<el-col :span="12" :xs="24" v-if="!isModify">
						<el-form-item label="密码" prop="password">
							<el-input type="password" v-model="addForm.password" auto-complete="off"></el-input>
						</el-form-item>
					</el-col>		
					<el-col :span="12" :xs="24">
						<el-form-item label="重复密码" prop="rePassword" v-if="!isModify">
							<el-input type="password" v-model="addForm.rePassword" auto-complete="off"></el-input>
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
	import { systemUserQuest } from "../../api/api"
	export default {
		data(){
			 let same = (rule,value,callback) => {
			        if(value != this.addForm.password){
			          return callback(new Error("两次密码不一致！"));
			        }
			        callback();
			      }			
			return {
				statusOptions: buildOptions("UserStatus",true),
				filters:{//查询表单数据
					userAccountNo: "",
					name: "",
					customerStatus: "",
				},				
				tableData: [],//表格数据
				listLoading: false,//表格加载中标识
				addLoading: false,//增改加载中标识
				addFormVisible: false,//新增弹窗显示标识
				roleOptions: [],//角色列表
				addForm: {//新增弹窗表单数据
					userAccountNo: "",
					name: "",
					roleId: "",
					idCard: "",	
					phoneNo: "",	
					email: "",	
					password: "",	
					rePassword:"",				
					remark: ""
				},
				addFormRules:{
					userAccountNo: [{required: true, message: '请输入用户名',}],
					name: [{required: true, message: '请输入姓名'}],
					roleId: [{required: true, message: '请选择角色'}],
					password: [{required: true, message: '请输入密码'}],		
					rePassword: [{required: true, message: '请输入重复密码'},{validator:same}],				
				},
				isModify: false,//是否是编辑通道操作
				operateName:"新增"	//编辑窗体标题			
			}
		},
		created(){
			this.getRole();
			this.select();			
		},
		methods:{
			// 表格数据格式化 状态
			statusFormat(row, col, cellValue){
				return formatters("UserStatus",cellValue)
			},
			roleFormat(row, col, cellValue){
				for (var k = 0, length = this.roleOptions.length; k < length; k++) {
					var item = this.roleOptions[k];
	 				if(cellValue == item.value){	            		
	            		return item.label;
	            	}
				}
			},
			// 获取角色
			getRole(){				
				systemUserQuest.getRole().then(res => {					
					this.roleOptions = res.content.map(item => {
						return {
							value: item.id,
							label: item.name
						}
					})					
				}).catch(err=>console.error("获取角色失败！"));				
			},

			// 获取列表
			select(){
				this.listLoading = true;
				systemUserQuest.select({
					userAccountNo: this.filters.userAccountNo,
					name: this.filters.name,
					customerStatus: this.filters.customerStatus
				}).then(res => {
					this.tableData = res.content;
					// console.log(this.tableData)
					this.listLoading = false;
				}).catch(err=>{this.listLoading = false;});
			},
			// 操作按钮方法
			modifyStatus(row){
				this.listLoading = true;
				if(row.customerStatus!=1 && row.customerStatus!=5)
				{
					console.error("用户状态不正确，无法进行操作！")
					return;
				}

				systemUserQuest.modifyStatus({
					id: row.id,
					customerStatus: row.customerStatus===1 ? 5 :  row.customerStatus===5 ? 1 : 0
				}).then(res => {
					this.listLoading = false;
					this.select();
				}).catch(err=>{this.listLoading = false;});
			},
			// 弹出新增弹窗
			add(){
				this.addFormVisible = true;
				this.operateName = "新增";
				this.isModify = false;
				this.addForm = {
					userAccountNo: "",
					name: "",
					roleId: "",
					idCard: "",	
					phoneNo: "",	
					email: "",	
					password: "",
					rePassword:"",					
					remark: ""
				}
			},
			// 弹出编辑弹窗
			modify(row){
				this.addFormVisible = true;
				this.operateName = "编辑";
				this.isModify = true;
				this.addForm = {
					userAccountNo: row.userAccountNo,
					name: row.name,
					roleId: row.roleId,
					idCard: row.idCard,
					phoneNo: row.phoneNo,
					email: row.email,
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
							systemUserQuest.add(this.addForm).then(res => {
								this.addLoading = false;
								this.addFormVisible = false;
								this.select();
							}).catch(err=>{this.listLoading = false;});
						}else{
							systemUserQuest.modify(this.addForm).then(res => {
								this.addLoading = false;
								this.addFormVisible = false;
								this.select();
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