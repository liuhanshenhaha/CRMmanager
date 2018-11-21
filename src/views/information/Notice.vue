<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.title" placeholder="标题"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.type" placeholder="类型">
						<el-option v-for="item in buildOption('NoticeType',true)" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
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
			<el-table-column prop="type" label="类型" sortable width="120" :formatter="typeFormat">
			</el-table-column>
			<el-table-column prop="title" label="标题" sortable width="150">
			</el-table-column>		
			<el-table-column prop="beginDate" label="开始时间" width="150">
			</el-table-column>
			<el-table-column prop="endDate" label="结束时间" width="150">
			</el-table-column>
			<el-table-column prop="status" label="状态" sortable width="90" :formatter="statusFormat">
			</el-table-column>
			<el-table-column prop="content" label="内容" sortable width="400">
			</el-table-column>				
			<el-table-column prop="remark" label="备注" sortable >
			</el-table-column>
			<el-table-column label="操作" align="center" fixed="right" width="150">
				<template slot-scope="scope">
					<el-button type="primary" size="small" @click="modify(scope.row)">编辑</el-button>
					<el-button type="danger" size="small" v-if="scope.row.status==1" @click="modifyStatus(scope.row)">作废</el-button>
					<el-button type="success" size="small" v-if="scope.row.status==0" @click="modifyStatus(scope.row)">激活</el-button>
				</template>
			</el-table-column>
		</el-table>

		<div class="block" style="text-align:right">
		  <el-pagination background layout="prev, pager, next" :total="tableDataTotal" :page-size="10" @current-change="(currentPage)=>select(currentPage)"></el-pagination>
		</div>

		<!--新增/更新界面-->
		<el-dialog  :title="operateName"  v-model="addFormVisible" :close-on-click-modal="false">		
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-row>
					<el-col :span="12" :xs="24">
						<el-form-item label="标题" prop="title">
							<el-input v-model="addForm.title" auto-complete="off" ></el-input>
						</el-form-item>
					</el-col>
						<el-col :span="12" :xs="24">
						<el-form-item label="类型" prop="type">
							<el-select v-model="addForm.type" placeholder="类型">
								<el-option v-for="item in buildOption('NoticeType',false)" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12" :xs="24">
						<el-form-item label="开始时间" prop="beginDate">
							<el-date-picker v-model="addForm.beginDate" type="datetime" placeholder="选择开始日期时间" @change="changeEnd"></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="结束时间" prop="endDate">
							<el-date-picker :picker-options="pickerOptionsEnd" v-model="addForm.endDate" type="datetime" placeholder="选择结束日期时间"></el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>				
				<el-row>				
					<el-col :span="24">
						<el-form-item label="内容" prop="content">
							<el-input type="textarea" v-model="addForm.content"></el-input>
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
	import { noticeQuest } from "../../api/api"
	export default {
		data(){
			return {
				filters:{//查询表单数据
					title: null,
					type: 2,
					status: 1,
					beginDate:null,
					endDate:null
				},
				statusOptions: buildOptions("NoticeStatus",true),
				tableData: [],//表格数据
				listLoading: false,//表格加载中标识
				addLoading: false,//增改加载中标识
				addFormVisible: false,//新增弹窗显示标识
				tableDataTotal: 1,
				pickerOptionsEnd: {},
				addForm: {//新增弹窗表单数据
					type: "",
					title: "",
					beginDate: "",
					endDate: "",
					content:"",
					remark: ""
				},
				addFormRules:{
					type: [{required: true, message: '请选择类型'}],
					title: [{required: true, message: '请输入名称'}],
					beginDate: [{required: true, message: '请输入开始日期'}],
					endDate: [{required: true, message: '请输入结束日期'}],
					content: [{required: true, message: '请输入内容'}],
				},
				isModify: false,//是否是编辑通道操作
				operateName:"新增"				
			}
		},
		created(){
			this.select(1)
		},
		methods:{
			// 表格数据格式化 状态
			statusFormat(row, col, cellValue){
				return formatters("NoticeStatus",cellValue)
			},
			typeFormat(row, col, cellValue){
				return formatters("NoticeType",cellValue)
			},			
			buildOption(type,all){
				return buildOptions(type,all)
			},
			changeEnd(){
				this.pickerOptionsEnd = Object.assign({},this.pickerOptionsEnd,{
					disabledDate: (time) => {
						return time.getTime() < this.addForm.beginDate.getTime()
					}
				})
			},				
			// 获取列表
			select(pageNo){
				this.listLoading = true;
				this.curPage = pageNo;	
				noticeQuest.select({
					pageSize: 10,
					pageNo: pageNo,
					title: this.filters.title,
					type: this.filters.type,
					beginDate:this.filters.beginDate,
					endDate:this.filters.endDate,
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
				noticeQuest.modifyStatus({
					id: row.id,
					status: row.status ? 0 : 1
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
					title: "",
					type: "",
					content: "",
					beginDate: "",	
					endDate:"",				
					remark: ""
				}
			},
			// 弹出编辑弹窗
			modify(row){
				this.addFormVisible = true;
				this.operateName = "编辑";
				this.isModify = true;
				this.addForm = {
					type: row.type,
					title: row.title,
					beginDate: row.beginDate,
					endDate: row.endDate,
					content: row.content,
					remark: row.remark,
					id: row.id
				}
			},
			// 新增/更新
			updateDb(){
				this.$refs.addForm.validate(valid => {
					if(valid){
						this.addLoading = true;
						if(!this.isModify){
							noticeQuest.add(this.addForm).then(res => {
								this.addLoading = false;
								this.addFormVisible = false;
								this.select(this.curPage);
							}).catch(err=>{this.addLoading = false;});
						}else{
							noticeQuest.modify(this.addForm).then(res => {
								this.addLoading = false;
								this.addFormVisible = false;
								this.select(this.curPage);
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