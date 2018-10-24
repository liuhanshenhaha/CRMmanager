<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.contractCode" placeholder="合约代码"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.contractName" placeholder="合约名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.goodsId" placeholder="商品ID"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.marketId" placeholder="市场ID"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.status" placeholder="状态">
						<el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getContract">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="() => modifyContract('add')">新增</el-button>
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
			<el-table-column prop="lastContractId" label="上一个合约ID" sortable width="150">
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
			<el-form :model="modifyForm" label-width="100px" :rules="modifyFormRules" ref="modifyForm">
				<el-row :gutter="20">
					<el-col :span="8" :xs="24">
						<el-form-item label="商品ID" prop="type">
							<el-input v-model="modifyForm.goodsId" :disabled="modifyForm.disabled"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="8" :xs="24">
						<el-form-item label="合约代码" prop="type">
							<el-input v-model="modifyForm.contractCode" :disabled="modifyForm.disabled"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8" :xs="24">
						<el-form-item label="合约名称" prop="type">
							<el-input v-model="modifyForm.contractName" :disabled="modifyForm.disabled"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="8" :xs="24">
						<el-form-item label="状态" prop="status">
							<el-select v-model="modifyForm.status" placeholder="状态" :disabled="modifyForm.disabled">
								<el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="8" :xs="24">
						<el-form-item label="首次交易日" prop="firstTradeDate">
							<el-date-picker :editable="false" v-model="modifyForm.firstTradeDate" type="date" placeholder="首次交易日" :disabled="modifyForm.disabled&&!(modifyForm.disabled === 'firstDate')"></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="8" :xs="24">
						<el-form-item label="最后交易日" prop="lastTradeDate">
							<el-date-picker :editable="false" v-model="modifyForm.lastTradeDate" type="date" placeholder="最后交易日" :disabled="modifyForm.disabled&&!(modifyForm.disabled === 'lastDate')"></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="8" :xs="24">
						<el-form-item prop="allowOvernight">
							<el-checkbox v-model="modifyForm.allowOvernight" :disabled="modifyForm.disabled">是否允许隔夜</el-checkbox>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20" v-for="(dayCloseItem,index) in modifyForm.tempDayClose" :key="index">
					<el-col :span="8" :xs="24">
						<el-form-item :label="index === 0 ? '每日强平时间': ''">
							<el-time-picker :editable="false" v-model="dayCloseItem.tempDayCloseTime" @change="updateDayClose" placeholder="每日强平时间" :disabled="modifyForm.disabled"></el-time-picker>
						</el-form-item>
					</el-col>
					<el-col :span="8" :xs="24">
						<el-form-item>
							<el-checkbox v-model="dayCloseItem.tempDayCloseOvernight" @change="updateDayClose" :disabled="modifyForm.disabled">每日强平时间是否跨天</el-checkbox>
						</el-form-item>
					</el-col>
					<el-col :span="8" :xs="24" v-if="index === modifyForm.tempDayClose.length - 1">
						<el-form-item>
							<el-button type="primary" @click.native="addDailyClose" :disabled="modifyForm.disabled">新增每日强平时间</el-button>
						</el-form-item>
					</el-col>
					<el-col :span="8" :xs="24" v-if="index !== modifyForm.tempDayClose.length - 1">
						<el-form-item>
							<el-button type="danger" @click.native="()=>removeDailyClose(index)" :disabled="modifyForm.disabled">删除每日强平时间</el-button>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :xs="24">
						<el-form-item>
							<div>
								
							</div>
						</el-form-item>
					</el-col>
					<!-- <el-col :span="12" :xs="24">
						<el-form-item label="类别" prop="type">
							<el-input v-model="modifyForm.type"></el-input>
						</el-form-item>
					</el-col> -->
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
					goodsId: "",
					marketId: "",
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
					goodsId: "",
					contractCode: "",
					contractName: "",
					status: "",
					firstTradeDate: "",
					lastTradeDate: "",
					allowOvernight: "",
					dayClose: "",
					tempDayClose: [],
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
				this.listLoading = true;
				contractQuest.getContract({
					marketCode: this.filters.contractCode,
				}).then(res => {
					this.tableData = JSON.parse(res.content);
					// console.log(this.tableData)
					this.listLoading = false;
				});
			},
			// 表格记录操作switch
			tableOptions(command,row){
				switch(command){
					case "add": this.modifyContract('add',row);break;
					case "edit": this.modifyContract('update',row);break;
					case "updateFirstDate": this.modifyContract('update',row,'firstDate');break;
					case "updateLastDate": this.modifyContract('update',row,'lastDate');break;
					case "delete": ;break;
				}
			},
			/* 弹出新增/更新合约窗体
			 * params
			 * type string 'add' 'update'
			 * row 根据此参数是否为undefined判断是否是独立新增
			 * dateType 根据此字段是否为undefined判断是否需要对字段做disabled 'firstDate' 除firstDate外全部disabled 'lastDate'除lastDate外全部disabled
			 */ 
			modifyContract(type,row,dateType){
				this.modifyFormVisible = true;
				switch(type){
					case "add": 
						this.modifyForm = {
							goodsId: "",
							contractCode: "",
							contractName: "",
							status: "",
							firstTradeDate: "",
							lastTradeDate: "",
							allowOvernight: "",
							dayClose: "",
							tempDayClose: [{
								tempDayCloseTime: new Date().setSeconds(0),
								tempDayCloseOvernight: false,
							}]
						}
						break;
					case "update": 
						this.modifyForm = {
							goodsId: row.goodsId,
							contractCode: row.contractCode,
							contractName: row.contractName,
							status: row.status,
							firstTradeDate: row.firstTradeDate,
							lastTradeDate: row.lastTradeDate,
							allowOvernight: row.allowOvernight === "Y",
							dayClose: row.dayClose,
							tempDayClose: row.dayClose.split(";").map((item,index) => {
								let tempDate = new Date();
								tempDate.setHours(item.split("-")[0].split(":")[0])
								tempDate.setMinutes(item.split("-")[0].split(":")[1])
								tempDate.setSeconds(0)
								return {
									tempDayCloseTime: tempDate,
									tempDayCloseOvernight: item.split("-")[1] === "Y",
								}
							})
						}
						if(dateType){
							this.modifyForm.disabled = dateType;
						}
						break;
				}
			},
			addDailyClose(){
				this.modifyForm.tempDayClose.push({
					tempDayCloseTime: new Date().setSeconds(0),
					tempDayCloseOvernight: false,
				})
			},
			removeDailyClose(index){
				this.modifyForm.tempDayClose.splice(index,1)
			},
			updateDayClose(){
				this.modifyForm.dayClose = (()=>{
					let temp = "";
					this.modifyForm.tempDayClose.map((item, index) => {
						let tempDayCloseTime = new Date(item.tempDayCloseTime)
						temp += tempDayCloseTime.getHours() + ":" + (tempDayCloseTime.getMinutes() < 10 ? "0" + tempDayCloseTime.getMinutes() : tempDayCloseTime.getMinutes()) + ":00" + "-" + (item.tempDayCloseOvernight ? "Y" : "N") + ";"
					})
					return temp;
				})()
			},
			// 新增/更新市场
			updateContract(type,row){
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