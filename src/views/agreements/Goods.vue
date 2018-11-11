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
					<el-input v-model="filters.goodsName" placeholder="商品名称"></el-input>
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
					<el-button type="primary" v-on:click="getGoods">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="()=>updateGoods('add')">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table stripe border fixed :data="tableData" highlight-current-row v-loading="listLoading" @selection-change="" style="width: 100%;">
			<el-table-column prop="marketId" label="交易市场ID" width="150">
			</el-table-column>
			<el-table-column prop="goodsCode" label="商品代码" min-width="100">
			</el-table-column>
			<el-table-column prop="goodsName" label="商品名称" min-width="100">
			</el-table-column>
			<el-table-column prop="goodsType" label="商品类型" min-width="100">
			</el-table-column>
			<el-table-column prop="currency" label="币种" :formatter="currencyFormat">
			</el-table-column>
			<el-table-column prop="contractMultiplier" label="合约乘数" width="100">
			</el-table-column>
			<el-table-column prop="minChange" label="最小变动单位" width="150">
			</el-table-column>
			<el-table-column prop="priceUnit" label="每价位值" width="100">
			</el-table-column>
			<el-table-column prop="priceUnitBase" label="每价位基币值" width="150">
			</el-table-column>
			<el-table-column prop="maxOneBuy" label="单手最大可买" width="140">
			</el-table-column>
			<el-table-column prop="maxHold" label="最大持仓量" width="150">
			</el-table-column>
			<el-table-column prop="depositType" label="保证金类型" width="150" :formatter="commissionTypeFormat">
			</el-table-column>
			<el-table-column prop="depositValue" label="保证金额度" width="150">
			</el-table-column>
			<el-table-column prop="keepDeposit" label="维持保证金" width="150">
			</el-table-column>
			<el-table-column prop="overnightDeposit" label="隔夜保证金" width="150">
			</el-table-column>
			<el-table-column prop="dayClose" label="每日强平时间" width="150" :formatter="dayCloseFormat">
			</el-table-column>
			<el-table-column prop="dayOpen" label="每日开盘时间" width="150">
			</el-table-column>
			<el-table-column prop="commissionType" label="手续费类型" width="120" :formatter="commissionTypeFormat">
			</el-table-column>
			<el-table-column prop="commissionCurrency" label="手续费币种" width="120" :formatter="currencyFormat">
			</el-table-column>
			<el-table-column prop="customerCommissionStart" label="客户佣金区间1" width="150">
			</el-table-column>
			<el-table-column prop="customerCommissionOver" label="客户佣金区间2" width="150">
			</el-table-column>
			<el-table-column prop="agentCommissionStart" label="代理佣金区间1" width="150">
			</el-table-column>
			<el-table-column prop="agentCommissionOver" label="代理佣金区间2" width="150">
			</el-table-column>
			<el-table-column prop="isForceSend" label="是否强制报单" width="150" :formatter="YNFormatter">
			</el-table-column>
			<el-table-column prop="status" label="状态" width="150" :formatter="statusFormat">
			</el-table-column>
			<el-table-column prop="remark" label="备注" width="150">
			</el-table-column>
			<el-table-column label="操作" align="center" fixed="right" width="150">
				<template slot-scope="scope">
					<el-dropdown size="small" split-button type="primary" trigger="click" @command="(command)=>tableOptions(command,scope.row)">
						操作
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="edit">编辑</el-dropdown-item>
							<el-dropdown-item command="modifyStatus">修改状态</el-dropdown-item>
							<el-dropdown-item command="settings">配置</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>
		</el-table>

		<!--新增/更新界面-->
		<el-dialog customClass="w70p" :title="modifyType == 'add' ? '新增' : '设置'" v-model="modifyFormVisible" :close-on-click-modal="false" >
			<el-form :model="modifyForm" label-width="120px" :rules="modifyFormRules" ref="modifyForm" size="medium">
				<el-row :gutter="20">
					<el-col :span="12" :xs="24">
						<el-form-item label="商品代码" prop="goodsCode">
							<el-input v-model="modifyForm.goodsCode"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="商品名称" prop="goodsName">
							<el-input v-model="modifyForm.goodsName"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12" :xs="24">
						<el-form-item label="合约乘数" prop="contractMultiplier">
							<el-input v-model="modifyForm.contractMultiplier"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="最小变动单位" prop="minChange">
							<el-input v-model="modifyForm.minChange"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12" :xs="24">
						<el-form-item label="每价位值" prop="priceUnit">
							<el-input v-model="modifyForm.priceUnit"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="每价位基币值" prop="priceUnitBase">
							<el-input v-model="modifyForm.priceUnitBase"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12" :xs="24">
						<el-form-item label="单手最大可买" prop="maxOneBuy">
							<el-input v-model="modifyForm.maxOneBuy"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="最大持仓量" prop="maxHold">
							<el-input v-model="modifyForm.maxHold"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12" :xs="24">
						<el-form-item label="币种" prop="currency">
							<el-select v-model="modifyForm.currency" placeholder="币种">
								<el-option v-for="item in currencyOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12" :xs="24">
						<el-form-item label="保证金类型" prop="depositType">
							<el-select v-model="modifyForm.depositType" placeholder="保证金类型">
								<el-option v-for="item in depositTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="保证金额度" prop="depositValue">
							<el-input v-model="modifyForm.depositValue"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12" :xs="24">
						<el-form-item label="手续费类型" prop="commissionType">
							<el-select v-model="modifyForm.commissionType" placeholder="手续费类型">
								<el-option v-for="item in depositTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="手续费额度" prop="commissionValue">
							<el-input v-model="modifyForm.commissionValue"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12" :xs="24">
						<el-form-item label="维持保证金" prop="keepDeposit">
							<el-input v-model="modifyForm.keepDeposit"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="隔夜保证金" prop="overnightDeposit">
							<el-input v-model="modifyForm.overnightDeposit"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20"  v-for="(dayCloseItem,index) in modifyForm.tempDayClose" :key="'dayClose'+ index">
					<el-col :span="12" :xs="24">
						<el-form-item :label="index === 0 ? '每日强平时间': ''" :prop="'tempDayClose.'+index+'.tempDayCloseTime'" :rules="{type:'date',required: index === 0, message: '请设置至少一个每日强平时间', trigger: 'blur'}">
							<el-time-picker :editable="false" v-model="dayCloseItem.tempDayCloseTime" placeholder="每日强平时间"></el-time-picker>
						</el-form-item>
					</el-col>
					<el-col :span="4" :xs="24">
						<el-form-item>
							<el-checkbox v-model="dayCloseItem.tempDayCloseOvernight">是否允许隔夜</el-checkbox>
						</el-form-item>
					</el-col>
					<el-col :span="8" :xs="24" v-if="index === modifyForm.tempDayClose.length - 1">
						<el-form-item>
							<el-button type="primary" @click.native="()=>addDaily('dayClose')">新增每日强平时间</el-button>
						</el-form-item>
					</el-col>
					<el-col :span="8" :xs="24" v-if="index !== modifyForm.tempDayClose.length - 1">
						<el-form-item>
							<el-button type="danger" @click.native="()=>removeDaily('dayClose',index)">删除每日强平时间</el-button>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20" v-for="(dayOpenItem,index) in modifyForm.tempDayOpen" :key="'dayOpen' + index">
					<el-col :span="12" :xs="24">
						<el-form-item :label="index === 0 ? '每日开盘时间': ''" :prop="'tempDayOpen.'+index+'.tempDayOpenTime'" :rules="{type:'date',required: index === 0, message: '请设置至少一个每日开盘时间', trigger: 'blur'}">
							<el-time-picker :editable="false" v-model="dayOpenItem.tempDayOpenTime" placeholder="每日开盘时间"></el-time-picker>
						</el-form-item>
					</el-col>
					<el-col :offset="4" :span="8" :xs="24" v-if="index === modifyForm.tempDayOpen.length - 1">
						<el-form-item>
							<el-button type="primary" @click.native="()=>addDaily('dayOpen')">新增每日开盘时间</el-button>
						</el-form-item>
					</el-col>
					<el-col :offset="4" :span="8" :xs="24" v-if="index !== modifyForm.tempDayOpen.length - 1">
						<el-form-item>
							<el-button type="danger" @click.native="()=>removeDaily('dayOpen',index)">删除每日开盘时间</el-button>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12" :xs="24">
						<el-form-item label=客户佣金区间1 prop="customerCommissionStart">
							<el-input v-model="modifyForm.customerCommissionStart"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="客户佣金区间2" prop="customerCommissionOver">
							<el-input v-model="modifyForm.customerCommissionOver"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12" :xs="24">
						<el-form-item label="代理佣金区间1" prop="agentCommissionStart">
							<el-input v-model="modifyForm.agentCommissionStart"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="代理佣金区间2" prop="agentCommissionOver">
							<el-input v-model="modifyForm.agentCommissionOver"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="4" :xs="24">
						<el-form-item>
							<el-checkbox v-model="modifyForm.tempIsForceSend">是否强制报单</el-checkbox>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="24">
						<el-form-item label="备注" prop="remark">
							<el-input type="textarea" resize="none" v-model="modifyForm.remark"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="modifyFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="update" :loading="modifyLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--修改状态界面-->
		<!-- <el-dialog customClass="w70p" title="修改状态" v-model="modifyFormVisible3" :close-on-click-modal="false" >
			<el-table stripe border fixed :data="modifyStatusData" highlight-current-row style="width: 100%;">
				<el-table-column prop="marketId" label="市场名称"></el-table-column>
				<el-table-column prop="goodsId" label="商品名称"></el-table-column>
				<el-table-column prop="contractCode" label="合约代码"></el-table-column>
				<el-table-column prop="contractName" label="合约名称"></el-table-column>
				<el-table-column label="操作" align="center" fixed="right" width="150">
					<template slot-scope="scope">
						<el-select v-model="scope.row.status" placeholder="状态">
							<el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</template>
				</el-table-column>
			</el-table>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="modifyFormVisible3 = false">取消</el-button>
				<el-button type="primary" @click.native="()=>modifyStatus(modifyStatusData[0])" :loading="modifyLoading">提交</el-button>
			</div>
		</el-dialog> -->

		<!--新增/配置界面-->
		<!-- <el-dialog customClass="w80p" title="设置" v-model="modifyFormVisible2" :close-on-click-modal="false" >
			<el-col :span="24" class="toolbar">
				<el-button type="primary" v-on:click="() => modifyContract('subAdd')">新增</el-button>
			</el-col>
			<el-table stripe border fixed :data="tableData2" highlight-current-row v-loading="listLoading2" @selection-change="" style="width: 100%;">
				<el-table-column prop="startTime" label="开始时间">
				</el-table-column>
				<el-table-column prop="overTime" label="结束时间">
				</el-table-column>
				<el-table-column prop="overTimeNextDay" label="结束时间是否跨天">
				</el-table-column>
				<el-table-column prop="type" label="类别">
				</el-table-column>
				<el-table-column prop="status" label="状态">
				</el-table-column>
				<el-table-column prop="remark" label="备注">
				</el-table-column>
				<el-table-column label="操作" align="center" fixed="right" width="140">
					<template slot-scope="scope">
						<el-dropdown size="small" split-button type="primary" trigger="click" @command="(command)=>tableOptions(command,scope.row)">
							操作
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item command="subEdit">编辑</el-dropdown-item>
								<el-dropdown-item command="subModifyStatus" v-if="scope.row.status !== 'A'">激活</el-dropdown-item>
								<el-dropdown-item command="subModifyStatus" v-if="scope.row.status === 'A'">作废</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</template>
				</el-table-column>
			</el-table>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="modifyFormVisible2 = false">取消</el-button>
				<el-button type="primary" @click.native="update" :loading="modifyLoading">提交</el-button>
			</div>
		</el-dialog> -->

		<!--新增/更新界面-->
		<!-- <el-dialog :title="subModifyType == 'subAdd' ? '新增' : '设置'" v-model="modifyFormVisible4" :close-on-click-modal="false" append-to-body>
			<el-form :model="subModifyForm" :rules="subModifyFormRules" label-width="100px" ref="subModifyForm" size="medium">
				<el-row :gutter="20">
					<el-col :span="12" :xs="24">
						<el-form-item label="开始时间" prop="startTime">
							<el-time-picker :editable="false" v-model="subModifyForm.subStartTime" placeholder="开始时间"></el-time-picker>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="结束时间" prop="subOverTime">
							<el-time-picker :editable="false" v-model="subModifyForm.subOverTime" placeholder="结束时间"></el-time-picker>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12" :xs="24">
						<el-form-item>
							<el-checkbox v-model="subModifyForm.subOverTimeNextDay">结束时间是否跨天</el-checkbox>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="类别" prop="subType">
							<el-select v-model="subModifyForm.subType" placeholder="类别">
								<el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="24">
						<el-form-item label="备注" prop="subRemark">
							<el-input type="textarea" resize="none" v-model="subModifyForm.subRemark"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="modifyFormVisible4 = false">取消</el-button>
				<el-button type="primary" @click.native="subUpdate" :loading="modifyLoading">提交</el-button>
			</div>
		</el-dialog> -->
	</section>
</template>

<script>
	import { goodsQuest } from "../../api/api"
	export default {
		data(){
			return {
				dictionary: JSON.parse(localStorage.dictionary),
				filters:{//查询表单数据
					contractCode: "",
					contractName: "",
					goodsName: "",
					marketName: "",
					status: "",
					pageSize: 10,//默认查询每页记录数
					pageNo: ""
				},
				statusOptions: [{
					value: "",
					label: "全部"
				},{
					value: "A",
					label: "激活"
				},{
					value: "C",
					label: "作废"
				}],
				currencyOptions: (()=>{
					let temp = [];
					for(let key in JSON.parse(localStorage.dictionary).CurrencyTypeEnu){
						temp.push({
							value: key,
							label: JSON.parse(localStorage.dictionary).CurrencyTypeEnu[key]
						})
					}
					return temp;
				})(),
				depositTypeOptions: (()=>{
					let temp = [];
					for(let key in JSON.parse(localStorage.dictionary).DepositType){
						temp.push({
							value: key,
							label: JSON.parse(localStorage.dictionary).DepositType[key]
						})
					}
					return temp;
				})(),
				tableData: [],//表格数据
				listLoading: false,//表格加载中标识
				modifyLoading: false,//增改加载中标识
				modifyFormVisible: false,//设置弹窗显示标识
				modifyForm: {//设置弹窗表单数据
					goodsCode: "",
					goodsName: "",
					marketId: "1",
					contractMultiplier: "",
					minChange: "",
					priceUnit: "",
					priceUnitBase: "",
					maxOneBuy: "",
					maxHold: "",
					currency: "",
					depositType: "",
					depositValue: "",
					commissionType: "",
					keepDeposit: "",
					overnightDeposit: "",
					dayClose: "",
					dayOpen: "",
					customerCommissionStart: "",
					customerCommissionOver: "",
					agentCommissionStart: "",
					agentCommissionOver: "",
					isForceSend: "",
					tempDayOpen: [],
					tempDayClose: [],
				},
				modifyType: "add",
				modifyFormRules:{
				},
			}
		},
		created(){
			this.getGoods()
		},
		methods:{
			// 表格数据格式化 状态
			statusFormat(row, col, cellValue){
				return this.dictionary.CommonStatus[cellValue]
			},
			YNFormatter(row, col, cellValue){
				return this.dictionary.YesOrNoEnum[cellValue]
			},
			currencyFormat(row, col, cellValue){
				return this.dictionary.CurrencyTypeEnu[cellValue]
			},
			dayCloseFormat(row, col, cellValue){
				return cellValue.replace(/\Y/g,"允许隔夜").replace(/\N/g,"不允许隔夜")
			},
			commissionTypeFormat(row,col, cellValue){
				return this.dictionary.DepositType[cellValue]
			},
			// 获取商品列表
			getGoods(){
				goodsQuest.getGoods({}).then(res=>{
					this.tableData = res.content;
				}).catch(err=>console.error(err))
			},
			// 新增商品 type add/modify
			updateGoods(type,row){
				this.modifyFormVisible = true;
				this.modifyType = type;
				switch(type){
					case 'add':
						this.modifyForm = {
							goodsCode: "",
							goodsName: "",
							marketId: "1",
							contractMultiplier: "",
							minChange: "",
							priceUnit: "",
							priceUnitBase: "",
							maxOneBuy: "",
							maxHold: "",
							currency: "",
							depositType: "",
							depositValue: "",
							commissionType: "",
							keepDeposit: "",
							overnightDeposit: "",
							dayClose: "",
							dayOpen: "",
							customerCommissionStart: "",
							customerCommissionOver: "",
							agentCommissionStart: "",
							agentCommissionOver: "",
							tempIsForceSend: "",
							tempDayOpen: [{
								tempDayOpenTime: ""
							}],
							tempDayClose: [{
								tempDayCloseTime: "",
								tempDayCloseOvernight: false,
							}]
						};
						break;
					case 'modify':
						this.modifyForm = {
							id: row.id,
							goodsCode: row.goodsCode,
							goodsName: row.goodsName,
							marketId: row.marketId,
							contractMultiplier: row.contractMultiplier,
							minChange: row.minChange,
							priceUnit: row.priceUnit,
							priceUnitBase: row.priceUnitBase,
							maxOneBuy: row.maxOneBuy,
							maxHold: row.maxHold,
							currency: row.currency,
							depositType: row.depositType,
							depositValue: row.depositValue,
							commissionType: row.commissionType,
							keepDeposit: row.keepDeposit,
							overnightDeposit: row.overnightDeposit,
							dayClose: row.dayClose,
							dayOpen: row.dayOpen,
							customerCommissionStart: row.customerCommissionStart,
							customerCommissionOver: row.customerCommissionOver,
							agentCommissionStart: row.agentCommissionStart,
							agentCommissionOver: row.agentCommissionOver,
							tempIsForceSend: row.isForceSend,
							tempDayOpen: row.dayOpen.split(";").map((item,index) => {
								let tempDate = new Date();
								tempDate.setHours(item.split(":")[0])
								tempDate.setMinutes(item.split(":")[1])
								tempDate.setSeconds(item.split(":")[2])
								return {
									tempDayOpenTime: tempDate
								}
							}),
							tempDayClose: row.dayClose.split(";").map((item,index) => {
								let tempDate = new Date();
								tempDate.setHours(item.split("-")[0].split(":")[0])
								tempDate.setMinutes(item.split("-")[0].split(":")[1])
								tempDate.setSeconds(item.split("-")[0].split(":")[2])
								return {
									tempDayCloseTime: tempDate,
									tempDayCloseOvernight: item.split("-")[1] === "Y",
								}
							})
						};
						break;
				}
			},
			/*
			 *@title 增加每日开盘/强平时间
			 *@params "dayOpen"/"dayClose"
			 */
			addDaily(type){
				if(type === "dayOpen"){
					this.modifyForm.tempDayOpen.push({
						tempDayOpenTime: new Date()
					})
				}else if(type === "dayClose"){
					this.modifyForm.tempDayClose.push({
						tempDayCloseTime: new Date().setSeconds(0),
						tempDayCloseOvernight: false,
					})
				}
			},
			/*
			 *@title 删除每日开盘/强平时间
			 *@params "dayOpen"/"dayClose"
			 */
			removeDaily(type,index){
				if(type === "dayOpen"){
					this.modifyForm.tempDayOpen.splice(index,1)
				}else if(type === "dayClose"){
					this.modifyForm.tempDayClose.splice(index,1)
				}
			},
			updateDayClose(){
				this.modifyForm.dayClose = (()=>{
					let temp = "";
					this.modifyForm.tempDayClose.map((item, index) => {
						let tempDayCloseTime = new Date(item.tempDayCloseTime)
						temp += tempDayCloseTime.getHours() + ":" + (tempDayCloseTime.getMinutes() < 10 ? "0" + tempDayCloseTime.getMinutes() : tempDayCloseTime.getMinutes()) + ":" + (tempDayCloseTime.getSeconds() < 10 ? "0" + tempDayCloseTime.getSeconds() : tempDayCloseTime.getSeconds()) + "-" + (item.tempDayCloseOvernight ? "Y" : "N") + ";"
					})
					return temp;
				})()
			},
			updateDayOpen(){
				this.modifyForm.dayOpen = (()=>{
					let temp = "";
					this.modifyForm.tempDayOpen.map((item, index) => {
						let tempDayOpenTime = new Date(item.tempDayOpenTime)
						temp += tempDayOpenTime.getHours() + ":" + (tempDayOpenTime.getMinutes() < 10 ? "0" + tempDayOpenTime.getMinutes() : tempDayOpenTime.getMinutes()) + ":" + (tempDayOpenTime.getSeconds() < 10 ? "0" + tempDayOpenTime.getSeconds() : tempDayOpenTime.getSeconds()) + ";"
					})
					return temp;
				})()
			},
			tableOptions(type,row){
				switch(type){
					case "edit": this.updateGoods("modify",row);break;
				}
			},
			update(){
				this.modifyLoading = true;
				this.updateDayOpen();
				this.updateDayClose();
				this.modifyForm.isForceSend = this.modifyForm.tempIsForceSend ? "Y" : "N";
				switch(this.modifyType){
					case "add":
						goodsQuest.addGoods(this.modifyForm).then(res => {
							this.modifyLoading = false;
							this.modifyFormVisible = false;
							this.$message({
								message: res.msg,
								type: 'success'
							});
							this.getGoods();
						});
						break;
					case "modify": 
				}
			}
		}
	}
</script>