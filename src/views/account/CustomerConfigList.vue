<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.userAccountNo" placeholder="账户"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.userName" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-cascader v-model="filters.superiorUserId" :options="options" @active-item-change="makeCascader"></el-cascader>
				</el-form-item>
				<el-form-item>
					<el-checkbox v-model="filters.cascadeType">备选项</el-checkbox>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="()=>getCustomers(1)">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table stripe border fixed :data="tableData" highlight-current-row v-loading="listLoading" @selection-change="" style="width: 100%;">
			<el-table-column prop="userAccountNo" label="账户" width="100">
			</el-table-column>
			<el-table-column prop="name" label="姓名" min-width="150">
			</el-table-column>
			<el-table-column prop="level" label="层级" width="200">
			</el-table-column>
			<el-table-column prop="userShowOwner" label="归属" width="100">
			</el-table-column>
			<el-table-column prop="allowNextInvite" label=余额 width="100">
			</el-table-column>
			<el-table-column prop="customerStatus" label="状态" width="150" :formatter="(row,col,value)=>formatter('CommonStatus',value)">
			</el-table-column>
			<el-table-column prop="isAllowTrade" label="交易状态" width="100" :formatter="(row,col,value)=>formatter('TradeStatus',value)">
			</el-table-column>
			<el-table-column prop="applyTime" label="注册时间" width="150">
			</el-table-column>
			<el-table-column label="地区" width="150">
				<template slot-scope="scope">
					{{(formatter('ProvinceEnu',scope.row.province) || "") + " " + (formatter('CityEnu',scope.row.city)||"")}}
				</template>
			</el-table-column>
			<el-table-column prop="bankCode" label="银行" width="150" :formatter="(row,col,value)=>formatter('Bank',value)">
			</el-table-column>
			<el-table-column prop="bankCardNo" label="手续费组" width="150">
			</el-table-column>
			<el-table-column prop="isConfig" label="配置状态" width="150" :formatter="(row,col,value)=>formatter('GoodsGroupConfigStatus',value)">
			</el-table-column>
			<el-table-column label="操作" align="center" fixed="right" width="200">
				<template slot-scope="scope">
					<el-button type="primary" size="small" @click="modify(scope.row)">配置</el-button>
					<el-button type="success" size="small" @click="">重置密码</el-button>
				</template>
			</el-table-column>
		</el-table>

		<div class="block" style="text-align:right">
		  <el-pagination background layout="prev, pager, next" :total="tableDataTotal" @current-change="(currentPage)=>getContract(currentPage)"></el-pagination>
		</div>

		<!--新增/更新界面-->
		<el-dialog title="配置" v-model="modifyVisible" :close-on-click-modal="false">
			<el-form label-width="80px" ref="modifyForm">
				<el-row>
					<el-col :span="12" :xs="24" lable="手续费组">
						<el-form-item label="手续费组" prop="groupId" :rules="{required: true, message: '请选择手续费组',trigger: 'blur'}">
							<el-select v-model="groupId" placeholder="手续费组">
								<el-option v-for="item in groupOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="modifyVisible = false">取消</el-button>
				<el-button type="primary" @click.native="modifySubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import { buildOptions,formatters } from "../../utils/utils"
	import { accountQuest } from "../../api/api"
	export default {
		data(){
			return {
				filters:{},
				tableData: [],//表格数据
				listLoading: false,//表格加载中标识
				curPage: 1,
				tableDataTotal: 1,
				options: [{
					label: "哈哈",
					value: 1,
					children: [{
						label: "呵呵",
						value: 2,
						children: [{
							label: "嘿嘿",
							value: 3
						}]
					}]
				}],
				addLoading: false,
				modifyVisible: false,
				groupId: "",
				groupOptions: []
			}
		},
		created(){
			this.getCustomers(1)
			this.getGroups();
		},
		methods:{
			formatter(type,value){
				return formatters(type,value)
			},
			// 获取市场列表
			getCustomers(pageNo){
				this.listLoading = true;
				this.curPage = pageNo;
				accountQuest.selectCustomerByParent({"userAccountNo":"","userName":"","superiorUserId":2,"cascadeType":2}).then(res => {
					this.tableData = res.content.dataList;
					this.tableDataTotal = res.content.pageCount;
					this.listLoading = false;
				}).catch(err=>{this.listLoading = false;});
			},
			getGroups(){
				accountQuest.getGroup({}).then(res => {
					let temp = [];
					res.content.map(item => {
						temp.push({
							label: item.goodsGroupName,
							value: item.id
						})
					})
					this.groupOptions = temp;
				})
			},
			modify(row){
				this.modifyVisible = true; 
				this.curId = row.id;
				this.groupId = row.groupId;
			},
			modifySubmit(){
				this.$refs.modifyForm.validate(valid => {
					if (valid) {
						this.addLoading = true;
						accountQuest.configureGoodsGroup({
							id: this.curId,
							GoodsGroupId: this.groupId
						}).then(res => {
							this.getCustomers(this.curPage)
							this.addLoading = false;
						})
					}
				})
			},
			//动态生成代理下拉框
			makeCascader(value){}
		}
	}
</script>