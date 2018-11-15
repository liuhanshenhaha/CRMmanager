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
					<el-button type="primary" v-on:click="()=>getAgents(1)">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="addNewAgent">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table stripe border fixed :data="tableData" highlight-current-row v-loading="listLoading" @selection-change="" style="width: 100%;">
			<el-table-column prop="name" label="姓名" min-width="150">
			</el-table-column>
			<el-table-column prop="sex" label="性别" min-width="80" :formatter="(row,col,value)=>formatter('UserSex',value)">
			</el-table-column>
			<el-table-column prop="level" label="层级" width="100">
			</el-table-column>
			<el-table-column prop="superiorUserName" label="归属" width="100">
			</el-table-column>
			<el-table-column prop="isConfig" label="配置状态" width="150" :formatter="(row,col,value)=>formatter('GoodsGroupConfigStatus',value)">
			</el-table-column>
			<el-table-column prop="customerStatus" label="状态" width="100" :formatter="(row,col,value)=>formatter('UserStatus',value)">
			</el-table-column>
			<el-table-column prop="applyTime" label="注册时间" width="150">
			</el-table-column>
			<el-table-column label="地区" width="150">
				<template slot-scope="scope">
					{{(formatter('ProvinceEnu',scope.row.addressProvince) || "") + " " + (formatter('CityEnu',scope.row.addressCity)||"") + " " + (scope.row.addressDetail||"")}}
				</template>
			</el-table-column>
			<el-table-column prop="bankCode" label="银行" width="150" :formatter="(row,col,value)=>formatter('Bank',value)">
			</el-table-column>
			<el-table-column label="操作" align="center" fixed="right" width="200">
				<template slot-scope="scope">
					<el-button type="primary" size="small" @click="()=>modify(scope.row)">配置</el-button>
					<el-button type="danger" size="small" @click="()=>resetPassword(scope.row)">重置密码</el-button>
				</template>
			</el-table-column>
		</el-table>

		<div class="block" style="text-align:right">
		  <el-pagination background layout="prev, pager, next" :total="tableDataTotal" @current-change="(currentPage)=>getContract(currentPage)"></el-pagination>
		</div>

		<!--新增/更新界面-->
		<el-dialog title="配置账户" customClass="w70p" v-model="modifyVisible" :close-on-click-modal="false">
			<el-table stripe border fixed :data="subTableData" highlight-current-row v-loading="listLoading2" @selection-change="" style="width: 100%;">
				<el-table-column prop="tradeAccountNo" label="交易账户" min-width="150">
				</el-table-column>
				<el-table-column prop="accountType" label="类型" min-width="100" :formatter="(row,col,value)=>formatter('TradeAccountType',value)">
				</el-table-column>
				<el-table-column prop="tradeStatus" label="状态" width="200" :formatter="(row,col,value)=>formatter('TradeStatus',value)">
				</el-table-column>
				<el-table-column label="选择商品组" align="center" width="150">
					<template slot-scope="scope">
						<el-select v-model="scope.row.goodsGroupId" placeholder="选择商品组" :disabled="editRow !== scope.$index">
							<el-option v-for="item in groupOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" fixed="right" width="200">
					<template slot-scope="scope">
						<el-button type="primary" v-if="editRow !== scope.$index" size="small" @click.native="() => edit(scope.$index)" :loading="addLoading">修改商品组</el-button>
						<el-button type="primary" v-if="editRow === scope.$index" size="small" @click.native="() => modifySubmit(scope.row)" :loading="addLoading">保存</el-button>
						<el-button type="danger" size="small" @click.native="() => resetPassword(scope.row)" :loading="addLoading">重置密码</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="modifyVisible = false;">关闭</el-button>
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
				filters:{
					userAccountNo: "",
					userName: "",
					superiorUserId: [],
				},
				tableData: [],//表格数据
				listLoading: false,//表格加载中标识
				listLoading2: false,//表格加载中标识
				curPage: 1,
				tableDataTotal: 1,
				cascade: [],
				options: [{
					label: "直属",
					value: "straight"
				}],
				modifyForm: [],
				addLoading: false,
				modifyVisible: false,
				groupId: "",
				groupOptions: [],
				subTableData: [],
				editRow: -1,
			}
		},
		created(){
			this.getAgents(1)
			this.getGroups();
			this.getAgentOptions(2);
		},
		methods:{
			formatter(type,value){
				return formatters(type,value)
			},
			// 获取市场列表
			getAgents(pageNo){
				this.listLoading = true;
				this.curPage = pageNo;
				accountQuest.selectAgentByParent({
					"userAccountNo":this.filters.userAccountNo,
					"userName":this.filters.userName,
					"superiorUserId":this.filters.superiorUserId.length > 0 ? (this.filters.superiorUserId[this.filters.superiorUserId.length - 1] === "straight" ? this.filters.superiorUserId[this.filters.superiorUserId.length - 2] : this.filters.superiorUserId[this.filters.superiorUserId.length - 1]) : "",
					"cascadeType":this.filters.superiorUserId.length > 0 ? (this.filters.superiorUserId[this.filters.superiorUserId.length - 1] === "straight" ? 1 : 2) : ""//1是直属 2是级联
				}).then(res => {
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
							value: Number(item.id)
						})
					})
					this.groupOptions = temp;
				})
			},
			getAgentOptions(id,value){
				id = id ? id : id === 0 ? id : ""
				value = value || []
				value.map((item,index) => {
					this.options.map((itm,idx) => {
						if(item === itm.value){
							this.cascade[index] = idx;
						}
					})
				})
				let pushChild = (oldOptions,newOptions) => {
					for(let i = 0;i < oldOptions.length;i++){
						if(value[value.length - 1] === oldOptions[i].value){
							oldOptions[i].children = newOptions;
							break;
						}
						if(oldOptions[i].children && oldOptions[i].children.length > 1){
							pushChild(newOptions)
						}
					}
				}
				accountQuest.selectAgentOptionByParent({
					superiorUserId: id
				}).then(res => {
					let tempOptions = [];
					tempOptions = res.content.map(item => {
						return {
							label: item.name,
							value: item.id,
							children: [{
								label: "直属",
								value: "straight"
							}]
						}
					})
					tempOptions.unshift({
						label: "直属",
						value: "straight"
					})
					if(this.cascade.length === 0){
						this.options = tempOptions
					}else{
						pushChild(this.options,tempOptions)
					}
				}).catch(error => 
					console.error("获取代理级联信息失败",error)
				)
			},
			modify(row){
				this.modifyVisible = true; 
				this.curId = row.id;
				this.listLoading2 = true;
				this.editRow = -1;
				accountQuest.selectTradeAccountByUserId({userId:row.id}).then(res => {
					this.subTableData = res.content;
					this.listLoading2 = false;
				}).catch(err => this.listLoading2 = false)
			},
			modifySubmit(row){
				accountQuest.configureGoodsGroup({
					id: row.id,
					goodsGroupId: row.goodsGroupId
				}).then(res => {
					this.editRow = -1;
				}).catch(err => console.error("配置商品组失败"))
			},
			//动态生成代理下拉框
			makeCascader(value){
				this.getAgentOptions(value[value.length - 1],value)
			},
			edit(rowNo){
				if(this.editRow !== -1){
					this.$message.warning("请先完成当前修改")
				}else{
					this.editRow = rowNo;
				}
			},
			resetPassword(row){
				accountQuest.resetPassword({
					id: row.id
				}).then(res => {
					console.log("重置密码成功")
				}).catch(err => {
					console.error("重置密码失败")
				})
			},
			addNewAgent(){
				this.$router.push({ path: '/account/agent-register' });
			}
		}
	}
</script>