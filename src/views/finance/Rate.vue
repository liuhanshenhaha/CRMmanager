<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.type" placeholder="类型">
						<el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>				
				<el-form-item>
					<el-select v-model="filters.status" placeholder="状态">
						<el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="select">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-if="false" @click="add">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table stripe border fixed :data="tableData" highlight-current-row v-loading="listLoading" @selection-change="" style="width: 100%;">
			<el-table-column prop="name" label="名称" sortable width="150">
			</el-table-column>
			<el-table-column prop="currencyBefore" label="兑换前币种" sortable width="130" :formatter="currencyFormat">
			</el-table-column>
			<el-table-column prop="currencyAfter" label="兑换后币种" sortable width="130" :formatter="currencyFormat">
			</el-table-column>
			<el-table-column prop="startDate" label="开始日期" sortable width="170">
			</el-table-column>	
			<el-table-column prop="overDate" label="结束日期" sortable width="170">
			</el-table-column>	
			<el-table-column prop="value" label="汇率值" sortable width="120">
			</el-table-column>	
			<el-table-column prop="type" label="类型" sortable width="150" :formatter="typeFormat">
			</el-table-column>						
			<el-table-column prop="status" label="状态" sortable width="100" :formatter="statusFormat">
			</el-table-column>
			<el-table-column prop="remark" label="备注" sortable >
			</el-table-column>
			<el-table-column label="操作" align="center" fixed="right" width="150">
				<template slot-scope="scope">
					<el-button type="primary" size="small" @click="modify(scope.row)">编辑</el-button>
					<el-button type="danger" size="small" v-if="false && Boolean(scope.row.status)" @click="modifyStatus(scope.row)">作废</el-button>
					<el-button type="success" size="small" v-if="false && !Boolean(scope.row.status)" @click="modifyStatus(scope.row)">激活</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--新增/更新界面-->
		<el-dialog  :title="operateName"  v-model="addFormVisible" :close-on-click-modal="false">		
			<el-form :model="addForm" label-width="80px" :rules="addFormRules" ref="addForm">
				<el-row>
					<el-col :span="12" :xs="24">
						<el-form-item label="类型" prop="type">
							<el-select v-model="addForm.type" placeholder="类型">
								<el-option v-for="item in buildOption('ExchangeRateTypeEnu')" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
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
						<el-form-item label="前币种" prop="currencyBefore">							
							<el-select v-model="addForm.currencyBefore" placeholder="前币种">
								<el-option v-for="item in currencyOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="后币种" prop="currencyAfter">
							<el-select v-model="addForm.currencyAfter" placeholder="后币种">
								<el-option v-for="item in currencyOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>	
				<el-row>
					<el-col :span="12" :xs="24">
						<el-form-item label="开始时间" prop="startDate">
							<el-date-picker v-model="addForm.startDate" type="datetime" placeholder="选择开始日期时间" @change="changeEnd"></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="结束时间" prop="overDate">
							<el-date-picker :picker-options="pickerOptionsEnd" v-model="addForm.overDate" type="datetime" placeholder="选择结束日期时间"></el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>				
					<el-col :span="24">
						<el-form-item label="汇率值" prop="value">
							<el-input  type="number" step="0.0001" v-model="addForm.value"></el-input>
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
	import { buildOptions, formatters } from "../../utils/utils"
	import { rateQuest } from "../../api/api"
	export default {
		data(){
			return {
				filters:{//查询表单数据
					type: "",
					name: "",
					status: 1,
				},
				statusOptions: buildOptions("CommonStatus",true),
				typeOptions: buildOptions("ExchangeRateTypeEnu",true),
				currencyOptions:buildOptions("CurrencyTypeEnu"),
				tableData: [],//表格数据
				listLoading: false,//表格加载中标识
				addLoading: false,//增改加载中标识
				addFormVisible: false,//新增弹窗显示标识
				pickerOptionsEnd: {},
				addForm: {//新增弹窗表单数据
					type: "",
					name: "",
					currencyBefore: "",
					currencyAfter: "",
					startDate: "",
					overDate: "",
					value: "",
					remark: ""
				},
				addFormRules:{
					type: [{required: true, message: '请输入代码'}],
					name: [{required: true, message: '请输入名称'}],
					currencyBefore: [{required: true, message: '请输入前币种'}],
					currencyAfter: [{required: true, message: '请输入后币种'}],
					startDate: [{required: true, message: '请输入开始时间'}],
					overDate: [{required: true, message: '请输入结束时间'}],
					value: [{required: true, message: '请输入汇率值'}],													
				},
				isModify: false,//是否是编辑通道操作
				operateName:"新增"				
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
			typeFormat(row, col, cellValue){
				return formatters("ExchangeRateTypeEnu",cellValue)
			},		
			currencyFormat(row, col, cellValue){
				return formatters("CurrencyTypeEnu",cellValue)
			},	
			buildOption(type){
				return buildOptions(type)
			},
			changeEnd(){
				this.pickerOptionsEnd = Object.assign({},this.pickerOptionsEnd,{
					disabledDate: (time) => {
						return time.getTime() < this.addForm.startDate.getTime()
					}
				})
			},	
			// 获取市场列表
			select(){
				this.listLoading = true;
				rateQuest.select({
					type: this.filters.type,
					name: this.filters.name,
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
				rateQuest.modifyStatus({
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
					type: "",
					name: "",
					currencyBefore: "",
					currencyAfter: "",
					startDate: "",
					overDate: "",
					value: "",
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
					name: row.name,
					currencyBefore: row.currencyBefore,
					currencyAfter: row.currencyAfter,
					startDate: row.startDate,
					overDate: row.overDate,
					value: row.value,
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
							rateQuest.add(this.addForm).then(res => {
								this.addLoading = false;
								this.addFormVisible = false;
								this.select();
							}).catch(err=>{this.addLoading = false;});
						}else{
							rateQuest.modify(this.addForm).then(res => {
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