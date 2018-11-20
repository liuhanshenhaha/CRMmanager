<template>
	<section>
		<!--工具条-->
		<!-- 非客户账号登陆 -->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;" v-if="customerType !== 'customer'">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.tradeAccount" placeholder="交易账号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.userName" placeholder="用户名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-cascader v-model="filters.superiorUserId" :options="options" @active-item-change="makeCascader"></el-cascader>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.type" placeholder="类型" >
						<el-option v-for="item in buildOption('MoneyInOutTypeEnu',true)" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.status" placeholder="类型" >
						<el-option v-for="item in buildOption('MoneyInOutStatusEnu',true)" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="()=>getList(1)">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>
		<!-- 客户账号登陆 -->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;" v-if="customerType === 'customer'">
			<el-form :inline="true" :model="filters">
				<el-col :span="3" :xs="24">
					<el-form-item>
						<el-input v-model="filters.tradeAccount" placeholder="交易账号"></el-input>
					</el-form-item>
				</el-col>
				<el-col :span="3" :xs="24">
					<el-form-item>
						<el-select v-model="filters.type" placeholder="类型" >
							<el-option v-for="item in buildOption('MoneyInOutTypeEnu',true)" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="3" :xs="24">
					<el-form-item>
						<el-select v-model="filters.status" placeholder="类型" >
							<el-option v-for="item in buildOption('MoneyInOutStatusEnu',true)" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
				</el-col>
				<el-col :span="3" :xs="24">
					<el-form-item>
						<el-button type="primary" v-on:click="()=>getList(1)">查询</el-button>
					</el-form-item>
				</el-col>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table stripe border fixed :data="tableData" highlight-current-row v-loading="listLoading" @selection-change="" style="width: 100%;">
			<el-table-column prop="userName" label="用户名" v-if="customerType !== 'customer'">
			</el-table-column>
			<el-table-column prop="tradeAccountNo" label="交易账号">
			</el-table-column>
			<el-table-column prop="userAgentName" label="交易用户归属代理" v-if="customerType !== 'customer'">
			</el-table-column>
			<el-table-column prop="type" label="资金流水类型" width="120" :formatter="(row,col,cellValue) => formatter('MoneyFlowTypeEnu',cellValue)">
			</el-table-column>
			<el-table-column prop="moneyFlowNo" label="现金流水号">
			</el-table-column>
			<el-table-column prop="sourceCurrency" label="原币种" :formatter="(row,col,cellValue) => formatter('CurrencyTypeEnu',cellValue)">
			</el-table-column>
			<el-table-column prop="sourceMoney" label="原金额">
			</el-table-column>
			<el-table-column prop="targetCurrency" label="目标币种" :formatter="(row,col,cellValue) => formatter('CurrencyTypeEnu',cellValue)">
			</el-table-column>
			<el-table-column prop="targetMoney" label="目标金额">
			</el-table-column>
			<el-table-column prop="bankCode" label="银行代码">
			</el-table-column>
			<el-table-column prop="bankCardNo" label="银行卡号">
			</el-table-column>
			<el-table-column prop="status" label="状态" :formatter="(row,col,cellValue) => formatter('MoneyInOutStatusEnu',cellValue)">
			</el-table-column>
			<el-table-column prop="remark" label="备注">
			</el-table-column>
			<el-table-column prop="createTime" label="创建时间">
			</el-table-column>
			<el-table-column prop="auditTime" label="审批时间">
			</el-table-column>
			<el-table-column prop="auditUserName" label="审批用户名" v-if="customerType !== 'customer'">
			</el-table-column>
			<el-table-column label="操作" align="center" width="100" fixed="right">
				<template slot-scope="scope">
					<el-button type="primary" v-if="scope.row.type === 4" size="small" @click.native="()=>openDetail(scope.row,'out')">出金</el-button>
					<!-- <el-button type="primary" size="small" @click.native="()=>drawalPay(scope.row)">打款</el-button> -->
					<el-button type="primary" v-if="[1,2].indexOf(scope.row.type) > -1" size="small" @click.native="()=>openDetail(scope.row,'move')">资金划转</el-button>
				</template>
			</el-table-column>
		</el-table>

		<div class="block" style="text-align:right">
		  <el-pagination background layout="prev, pager, next" :total="tableDataTotal" :page-size="20" @current-change="(currentPage)=>getList(currentPage)"></el-pagination>
		</div>

		<el-dialog title="审批" v-model="detailVisible" customClass="w40p" :close-on-click-modal="false" @close="()=>resetForm('auditForm')">
			<el-form label-width="100px" :model="auditForm" ref="auditForm">
				<el-row>
					<el-col :span="12" :xs="24">
						<el-form-item label="类型" prop="status">
							<el-select v-model="auditForm.status" placeholder="类型" >
								<el-option v-for="item in auditFormStatusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="18" :xs="24">
						<el-form-item label="备注" prop="tradeAccount">
							<el-input type="textarea" resize="none" v-model="auditForm.tradeAccount" placeholder="备注"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="detailVisible = false;">关闭</el-button>
				<el-button type="primary" v-if="openType === 'out'" @click.native="drawalExamine" :loading="loading">提交</el-button>
				<el-button type="primary" v-if="openType === 'move'" @click.native="examineMoveMoney" :loading="loading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import { formatters, buildOptions, getAgentOptions } from "../../utils/utils"
	import { moneyQuest } from "../../api/api"
	export default {
		data(){
			return {
				filters:{
					type: "",
					status: "",
					userName: "",
					superiorUserId: [],
					cascadeType: "",
					tradeAccount: "",
					pageSize: 20
				},
				tableData: [],//表格数据
				listLoading: false,//表格加载中标识
				loading: false,
				curPage: 1,
				tableDataTotal: 1,
				options: [],
				cascade: [],
				customerType: (()=>{
					switch(JSON.parse(localStorage.userInfo).customerType){
				        case 3: return "agent";break;
				        case 4: return "customer";break;
				        default: return "admin";
				    }
				})(),
				detailVisible: false,
				curId: "",
				auditForm: {
					status: 2
				},
				auditFormStatusOptions: [{
					label: "通过",
					value: 2
				},{
					label: "不通过",
					value: 3
				}],
				openType: ""
			}
		},
		created(){
			this.getList(1);
			getAgentOptions(this);
		},
		methods:{
			formatter(type,value){
				return formatters(type,value)
			},
			buildOption(type,all){
				return buildOptions(type,all)
			},
			resetForm(formname) {
                this.$nextTick(()=>{
                    if(this.$refs[formname]){
					    this.$refs[formname].resetFields();
					}
                })                
            },
			//动态生成代理下拉框
			makeCascader(value){
				getAgentOptions(this,value[value.length - 1],value)
			},
			// 获取持仓订单列表
			getList(pageNo){
				this.listLoading = true;
				this.curPage = pageNo;
				let submitData = {...this.filters};
				submitData.pageNo = pageNo;
				if(this.customerType !== "customer"){
					submitData.superiorUserId = this.filters.superiorUserId.length > 0 ? (this.filters.superiorUserId[this.filters.superiorUserId.length - 1] === "straight" ? this.filters.superiorUserId[this.filters.superiorUserId.length - 2] : this.filters.superiorUserId[this.filters.superiorUserId.length - 1]) : "";
					submitData.cascadeType = this.filters.superiorUserId.length > 0 ? (this.filters.superiorUserId[this.filters.superiorUserId.length - 1] === "straight" ? 1 : 2) : "";
					moneyQuest.getCashFlow(submitData).then(res => {
						this.tableData = res.content.dataList;
						this.tableDataTotal = res.content.count;
						this.listLoading = false;
					}).catch(err=>{this.listLoading = false;});
				}else{
					moneyQuest.getUserCashFlow(submitData).then(res => {
						this.tableData = res.content.dataList;
						this.tableDataTotal = res.content.count;
						this.listLoading = false;
					}).catch(err=>{this.listLoading = false;});
				}
			},
			openDetail(row,openType){
				this.detailVisible = true;
				this.openType = openType;
				this.auditForm.flowId = row.id;
			},
			drawalExamine(row){
				this.loading = true;
				moneyQuest.drawalExamine({id:row.id}).then(res => {
					this.loading = false;
					console.log("出金审核成功");
				}).catch(err => {
					this.loading = false;
					console.error("出金审核失败");
				})
			},
			drawalPay(){
				this.loading = true;
				moneyQuest.drawalPay(this.auditForm).then(res => {
					this.loading = false;
					console.log("打款审批成功");
				}).catch(err => {
					this.loading = false;
					console.error("打款审批失败");
				})
			},
			examineMoveMoney(){
				this.loading = true;
				moneyQuest.examineMoveMoney(this.auditForm).then(res => {
					this.loading = false;
					console.log("资金划转审核成功");
				}).catch(err => {
					this.loading = false;
					console.error("资金划转审核失败");
				})
			}
		}
	}
</script>