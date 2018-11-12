<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-row>
					<el-col :span="4" :xs="24">
						<el-form-item>
							<el-input v-model="filters.contractCode" placeholder="合约代码"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="4" :xs="24">
						<el-form-item>
							<el-input v-model="filters.contractName" placeholder="合约名称"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="4" :xs="24">
						<el-form-item>
							<el-input v-model="filters.goodsName" placeholder="商品名称"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="4" :xs="24">
						<el-form-item>
							<el-input v-model="filters.marketName" placeholder="市场名称"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="4" :xs="24">
						<el-form-item>
							<el-select v-model="filters.status" placeholder="状态">
								<el-option v-for="item in filterStatusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="4" :xs="24">
						<el-form-item>
							<el-button type="primary" v-on:click="() => getContract(1)">查询</el-button>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" v-on:click="() => modifyContract('add')">新增</el-button>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table stripe border fixed :data="tableData" highlight-current-row v-loading="listLoading" @selection-change="" style="width: 100%;">
			<el-table-column prop="marketName" label="市场名称" width="150">
			</el-table-column>
			<el-table-column prop="goodsName" label="商品名称" min-width="100">
			</el-table-column>
			<el-table-column prop="contractCode" label="合约代码" sortable width="150">
			</el-table-column>
			<el-table-column prop="contractName" label="合约名称" width="100">
			</el-table-column>
			<el-table-column prop="firstTradeDate" label="首次交易时间" sortable width="200">
			</el-table-column>
			<el-table-column prop="lastTradeDate" label="最后交易时间" sortable width="200">
			</el-table-column>
			<el-table-column prop="lastOpenDate" label="最后开仓日期" sortable width="200">
			</el-table-column>
			<el-table-column prop="status" label="状态" sortable width="150" :formatter="statusFormat">
			</el-table-column>
			<el-table-column prop="remark" label="备注" width="150">
			</el-table-column>
			<el-table-column label="操作" align="center" fixed="right" width="150">
				<template slot-scope="scope">
					<el-dropdown size="small" split-button type="primary" trigger="click" @command="(command)=>tableOptions(command,scope.row)">
						操作
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item command="add">新增</el-dropdown-item>
							<el-dropdown-item command="edit">编辑</el-dropdown-item>
							<el-dropdown-item command="modifyStatus">修改状态</el-dropdown-item>
							<!-- <el-dropdown-item command="settings1">配置交易时间</el-dropdown-item> -->
							<el-dropdown-item command="settings2">配置休市时间</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</template>
			</el-table-column>
		</el-table>
		<div class="block" style="text-align:right">
		  <el-pagination background layout="prev, pager, next" :total="tableDataTotal" @current-change="(currentPage)=>getContract(currentPage)"></el-pagination>
		</div>

		<!--新增/更新界面-->
		<el-dialog customClass="w70p" :title="modifyType == 'add' ? '新增' : '设置'" v-model="modifyFormVisible" :close-on-click-modal="false" >
			<el-form :model="modifyForm" label-width="120px" :rules="modifyFormRules" ref="modifyForm" size="medium">
				<el-row :gutter="20">
					<el-col :span="12" :xs="24">
						<el-form-item label="商品代码" prop="goodsId">
							<el-select :disabled="modifyType==='update'" v-model.number="modifyForm.goodsId" placeholder="商品代码" @change="(value) => this.getContractByGoodsId(value)">
								<el-option v-for="item in goodListOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="上一个合约代码" prop="contractId">
							<el-select :disabled="modifyType==='update'" v-model.number="modifyForm.contractId" placeholder="上一个合约代码">
								<el-option v-for="item in contractListOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12" :xs="24">
						<el-form-item label="合约代码" prop="contractCode">
							<el-input v-model="modifyForm.contractCode"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="合约名称" prop="contractName">
							<el-input v-model="modifyForm.contractName"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12" :xs="24">
						<el-form-item label="首次交易时间" prop="firstTradeDate">
							<el-date-picker :editable="false" v-model="modifyForm.firstTradeDate" type="datetime" placeholder="首次交易时间"></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="最后交易时间" prop="lastTradeDate">
							<el-date-picker :editable="false" v-model="modifyForm.lastTradeDate" type="datetime" placeholder="最后交易时间"></el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12" :xs="24">
						<el-form-item label="最后开仓日期" prop="lastOpenDate">
							<el-date-picker :editable="false" v-model="modifyForm.lastOpenDate" type="datetime" placeholder="最后开仓日期"></el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20" v-for="(dayCloseItem,index) in modifyForm.tempDayClose" :key="'dayClose'+ index">
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
		<el-dialog customClass="w70p" title="修改状态" v-model="modifyFormVisible3" :close-on-click-modal="false" >
			<el-table stripe border fixed :data="modifyStatusData" highlight-current-row style="width: 100%;">
				<el-table-column prop="marketName" label="市场名称"></el-table-column>
				<el-table-column prop="goodsName" label="商品名称"></el-table-column>
				<el-table-column prop="contractCode" label="合约代码"></el-table-column>
				<el-table-column prop="contractName" label="合约名称"></el-table-column>
				<el-table-column label="操作" align="center" fixed="right" width="150">
					<template slot-scope="scope">
						<el-select v-model="scope.row.status" placeholder="状态">
							<el-option v-for="item in ContractStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</template>
				</el-table-column>
			</el-table>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="modifyFormVisible3 = false">取消</el-button>
				<el-button type="primary" @click.native="()=>modifyStatus(modifyStatusData[0])" :loading="modifyLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增/配置界面-->
		<el-dialog customClass="w80p" title="设置" v-model="modifyFormVisible2" :close-on-click-modal="false" >
			<el-col :span="24" class="toolbar">
				<el-button type="primary" v-on:click="() => modifyContract('subAdd')">新增</el-button>
			</el-col>
			<el-table stripe border fixed :data="tableData2" highlight-current-row v-loading="listLoading2" @selection-change="" style="width: 100%;">
				<el-table-column prop="startTime" label="开始时间">
				</el-table-column>
				<el-table-column prop="overTime" label="结束时间">
				</el-table-column>
				<el-table-column prop="overTimeNextDay" label="结束时间是否跨天" :formatter="(row, col, cellValue) => formatters('YesOrNoEnum',cellValue)">
				</el-table-column>
				<el-table-column prop="type" label="类别" :formatter="(row, col, cellValue) => formatters('TradeTimeType',cellValue)">
				</el-table-column>
				<el-table-column prop="status" label="状态" :formatter="(row, col, cellValue) => formatters('CommonStatus',cellValue)">
				</el-table-column>
				<el-table-column prop="remark" label="备注">
				</el-table-column>
				<el-table-column label="操作" align="center" fixed="right" width="140">
					<template slot-scope="scope">
						<el-dropdown size="small" split-button type="primary" trigger="click" @command="(command)=>tableOptions(command,scope.row)">
							操作
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item command="subEdit">编辑</el-dropdown-item>
								<el-dropdown-item command="subModifyStatus" v-if="!Boolean(scope.row.status)">激活</el-dropdown-item>
								<el-dropdown-item command="subModifyStatus" v-if="Boolean(scope.row.status)">作废</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</template>
				</el-table-column>
			</el-table>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="modifyFormVisible2 = false">关闭</el-button>
			</div>
		</el-dialog>

		<!--新增/更新界面-->
		<el-dialog :title="subModifyType == 'subAdd' ? '新增' : '设置'" v-model="modifyFormVisible4" :close-on-click-modal="false" append-to-body>
			<el-form :model="subModifyForm" :rules="subModifyFormRules" label-width="100px" ref="subModifyForm" size="medium">
				<el-row :gutter="20">
					<el-col :span="12" :xs="24">
						<el-form-item label="开始时间" prop="startTime">
							<el-time-picker :editable="false" v-model="subModifyForm.subStartTime" placeholder="开始时间"></el-time-picker>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="结束时间" prop="subOverTime">
							<el-time-picker :editable="false" :picker-options="{minTime: subModifyForm.subStartTime}" v-model="subModifyForm.subOverTime" placeholder="结束时间"></el-time-picker>
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
		</el-dialog>

		<!--新增/配置界面-->
		<el-dialog customClass="w80p" title="设置" v-model="modifyFormVisible5" :close-on-click-modal="false" >
			<el-col :span="24" class="toolbar">
				<el-button type="primary" v-on:click="() => modifyContract('subAdd2')">新增</el-button>
			</el-col>
			<el-table stripe border fixed :data="tableData3" highlight-current-row v-loading="listLoading3" @selection-change="" style="width: 100%;">
				<el-table-column prop="beginDate" label="开始时间">
				</el-table-column>
				<el-table-column prop="endDate" label="结束时间">
				</el-table-column>
				<el-table-column prop="can_trade" label="是否可交易">
				</el-table-column>
				<el-table-column prop="status" label="状态" :formatter="(row, col, cellValue) => formatters('CommonStatus',cellValue)">
				</el-table-column>
				<el-table-column prop="remark" label="备注">
				</el-table-column>
				<el-table-column label="操作" align="center" fixed="right" width="140">
					<template slot-scope="scope">
						<el-dropdown size="small" split-button type="primary" trigger="click" @command="(command)=>tableOptions(command,scope.row)">
							操作
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item command="subEdit2">编辑</el-dropdown-item>
								<el-dropdown-item command="subModifyStatus2" v-if="!Boolean(scope.row.status)">激活</el-dropdown-item>
								<el-dropdown-item command="subModifyStatus2" v-if="Boolean(scope.row.status)">作废</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</template>
				</el-table-column>
			</el-table>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="modifyFormVisible5 = false">关闭</el-button>
			</div>
		</el-dialog>

		<!--新增/更新界面-->
		<el-dialog :title="subModifyType2 == 'subAdd' ? '新增' : '设置'" v-model="modifyFormVisible6" :close-on-click-modal="false" append-to-body>
			<el-form :model="subModifyForm2" :rules="subModifyFormRules2" label-width="100px" ref="subModifyForm2" size="medium">
				<el-row :gutter="20">
					<el-col :span="24">
						<el-form-item label="开始时间" prop="beginDate">
							<el-date-picker :editable="false" type="datetime" v-model="subModifyForm2.beginDate" placeholder="开始时间"></el-date-picker>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="结束时间" prop="endDate">
							<el-date-picker :editable="false" type="datetime" v-model="subModifyForm2.endDate" placeholder="结束时间"></el-date-picker>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="24">
						<el-form-item>
							<el-checkbox v-model="subModifyForm2.can_trade">是否可交易</el-checkbox>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="24">
						<el-form-item label="备注" prop="remark">
							<el-input type="textarea" resize="none" v-model="subModifyForm2.remark"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="modifyFormVisible6 = false">取消</el-button>
				<el-button type="primary" @click.native="subUpdate2" :loading="modifyLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import { dateFormat,formatters,buildOptions } from "../../utils/utils"
	import { contractQuest,goodsQuest } from "../../api/api"
	export default {
		data(){
			let startOver = (rule, value, callback) => {
				if(!value){
					return callback(new Error("请设置结束时间！"))
				}
				if(value < this.subModifyForm.subStartTime){
					callback(new Error("结束日期不能早于开始时间！"))
				}else{
					callback();
				}
			}
			let beginEnd = (rule, value, callback) => {
				if(!value){
					return callback(new Error("请设置结束时间！"))
				}
				if(value < this.subModifyForm2.beginDate){
					callback(new Error("结束日期不能早于开始时间！"))
				}else{
					callback();
				}
			}
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
				filterStatusOptions: buildOptions("ContractStatus",true),
				ContractStatus: buildOptions("ContractStatus"),
				typeOptions: (() => {
					let temp = [];
					for(let key in JSON.parse(localStorage.dictionary).TradeTimeType){
						temp.push({
							value: key,
							label: JSON.parse(localStorage.dictionary).TradeTimeType[key]
						})
					}
					return temp;
				})(),
				goodListOptions: [],//商品列表
				contractListOptions: [],//商品对应的有效合约列表
				tableData: [],//表格数据
				tableDataTotal: 0,//表格总页数
				tableData2: [],//表格数据
				tableData3: [],//表格数据
				listLoading: false,//表格加载中标识
				listLoading2: false,//表格加载中标识
				listLoading3: false,//表格加载中标识
				modifyLoading: false,//增改加载中标识
				modifyFormVisible: false,//设置弹窗显示标识
				modifyFormVisible2: false,//设置弹窗显示标识
				modifyFormVisible3: false,//修改状态弹窗显示标识
				modifyFormVisible4: false,//修改状态弹窗显示标识
				/* ============ */
				modifyFormVisible5: false,//设置弹窗显示标识
				modifyFormVisible6: false,//修改状态弹窗显示标识
				modifyFormVisible7: false,//修改状态弹窗显示标识
				/* ============ */
				modifyForm: {//设置弹窗表单数据
					goodsId: undefined,
					marketId: "",
					contractId: "",
					contractCode: "",
					contractName: "",
					firstTradeDate: "",
					lastTradeDate: "",
					lastOpenDate: "",
					dayClose: "",
					dayOpen: "",
					tempDayOpen: [],
					tempDayClose: [],
				},
				modifyType: "add",
				modifyFormRules:{
					goodsId: [{type:'number',required: true, message: '请选择商品', trigger: 'blur'}],
					contractCode: [{required: true, message: '请输入合约代码', trigger: 'blur'}],
					contractName: [{required: true, message: '请输入合约名称', trigger: 'blur'}],
					firstTradeDate: [{type:'date',required: true, message: '请设置首次交易时间', trigger: 'blur'}],
					lastTradeDate: [{type:'date',required: true, message: '请设置最后交易时间', trigger: 'blur'}],
					lastOpenDate: [{type:'date',required: true, message: '请设置最后开仓时间', trigger: 'blur'}],
				},
				modifyStatusData: [],//修改状态弹窗数据
				settingContractId: "",//配置中的合约ID
				subModifyType: "subAdd",
				subModifyType2: "subAdd2",
				subModifyForm: {
					subStartTime: "",
					subOverTime: "",
					subOverTimeNextDay: "",
					subType: "",
					subRemark: ""
				},
				subModifyForm2: {
					beginDate: "",
					endDate: "",
					can_trade: "",
					remark: ""
				},
				subModifyFormRules:{
					subType: [{type:'number',required: true, message: '请选择类型', trigger: 'blur'}],
					subStartTime: [{type:'date',required: true, message: '请设置开始时间', trigger: 'blur'}],
					subOverTime: [{type:'date',validator:startOver, required: true, trigger: 'blur'}]
				},
				subModifyFormRules2:{
					beginDate: [{type:'date',required: true, message: '请设置开始时间', trigger: 'blur'}],
					endDate: [{type:'date', required: true,validator:beginEnd, trigger: 'blur'}],
				}
			}
		},
		created(){
			this.getContract(1);
			this.getGoods();
		},
		methods:{
			// 表格数据格式化 状态
			statusFormat(row, col, cellValue){
				return formatters("ContractStatus",cellValue)
			},
			// 获取商品列表
			getGoods(){
				goodsQuest.getAllGoods({}).then(res=>{
					this.goodListOptions = res.content.map((item,index) => {
						return {
							value: Number(item.id),
							label: item.goodsCode
						}
					})
				}).catch(err=>console.error(err))
			},
			// 获取合约列表
			getContract(pageNo){
				this.listLoading = true;
				this.filters.pageNo = pageNo;
				contractQuest.getContract(this.filters).then(res => {
					this.tableData = res.content.dataList;
					this.tableDataTotal = res.content.pageCount;
					// console.log(this.tableData)
					this.listLoading = false;
				}).catch(err=>{this.listLoading = false;});
			},
			// 根据goodsid查询有效合约
			getContractByGoodsId(goodsId){
				goodsId ? contractQuest.getContractByGoodsId({goodsId:goodsId}).then(res => {
					this.contractListOptions = res.content.map((item, index) => {
						return {
							value: item.id,
							label: item.contractCode
						}
					})
				}) : this.contractListOptions = [];
				this.modifyForm.contractId = "";
			},
			// 获取配置列表
			getSettings(contractId){
				this.listLoading2 = true;
				this.settingContractId = contractId;
				contractQuest.getSetting({
					contractId: contractId
				}).then(res => {
					this.tableData2 = res.content;
					this.listLoading2 = false;
				}).catch(err => this.listLoading2 = false)
			},
			// 获取休市时间列表
			getDate(contractId){
				this.listLoading3 = true;
				this.settingContractId = contractId;
				contractQuest.getDate({
					contractId: contractId
				}).then(res => {
					this.tableData3 = res.content;
					this.listLoading3 = false;
				}).catch(err => this.listLoading3 = false)
			},
			// 表格记录操作switch
			tableOptions(command,row){
				switch(command){
					case "add": this.modifyContract('add',row);break;
					case "edit": this.modifyContract('update',row);break;
					case "modifyStatus": this.modifyContract('modifyStatus',row);break;
					case "settings1": this.modifyContract('settings',row);break;
					case "settings2": this.modifyContract('settingDate',row);break;
					case "subEdit": this.modifyContract('subEdit',row);break;
					case "subModifyStatus": 
						contractQuest.modifyContractTimeStatus({
							id: row.id,
							status: row.status ? 0 : 1
						}).then(res => this.getSettings(row.contractId)).catch(err => console.log(err))
						break;
					case "subEdit2": this.modifyContract('subEdit2',row);break;
					case "subModifyStatus2": 
						contractQuest.modifyDateStatus({
							id: row.id,
							status: row.status ? 0 : 1
						}).then(res => this.getDate(row.contractId)).catch(err => console.log(err))
						break;
				}
			},
			/* 弹出新增/更新合约窗体
			 * params
			 * type string 'add' 'update'
			 * row 根据此参数是否为undefined判断是否是独立新增
			 * dateType 根据此字段是否为undefined判断是否需要对字段做disabled 'firstDate' 除firstDate外全部disabled 'lastDate'除lastDate外全部disabled
			 */ 
			modifyContract(type,row){
				switch(type){
					case "add":
						row && this.getContractByGoodsId(row.goodsId); 
						this.modifyForm = {
							goodsId: row ? row.goodsId : "",
							contractId: "",
							contractCode: "",
							contractName: "",
							firstTradeDate: "",
							lastTradeDate: "",
							lastOpenDate: "",
							dayClose: "",
							dayOpen: "",
							tempDayOpen: [{
								tempDayOpenTime: ""
							}],
							tempDayClose: [{
								tempDayCloseTime: "",
								tempDayCloseOvernight: false,
							}]
						}
						this.modifyFormVisible = true;
						this.modifyType = type;
						break;
					case "update": 
						row && this.getContractByGoodsId(row.goodsId); 
						this.modifyForm = {
							id: row.id,
							goodsId: row.goodsId,
							contractId: row.lastContractId,
							contractCode: row.contractCode,
							contractName: row.contractName,
							firstTradeDate: new Date(row.firstTradeDate),
							lastTradeDate: new Date(row.lastTradeDate),
							lastOpenDate: new Date(row.lastOpenDate),
							dayClose: row.dayClose,
							dayOpen: row.dayOpen,
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
									tempDayCloseOvernight: item.split("-")[1] === 1,
								}
							})
						}
						this.modifyFormVisible = true;
						this.modifyType = type;
						break;
					case "modifyStatus": 
						this.modifyStatusData = new Array({...row});
						this.modifyFormVisible3 = true;
						break;
					case "settings":
						this.modifyFormVisible2 = true; 
						this.getSettings(row.id);
						break;
					case "subAdd":
						this.modifyFormVisible4 = true;
						this.subModifyType = type;
						this.subModifyForm = {
							subStartTime: "",
							subOverTime: "",
							subOverTimeNextDay: "",
							subType: "",
							subRemark: ""
						}
						break;
					case "subEdit":
						this.modifyFormVisible4 = true;
						this.subModifyType = type;
						this.subModifyForm = {
							contractId: row.contractId,
							subStartTime: (() => {
								let tempDate = new Date();
								tempDate.setHours(row.startTime.split(":")[0])
								tempDate.setMinutes(row.startTime.split(":")[1])
								tempDate.setSeconds(row.startTime.split(":")[2])
								return tempDate
							})(),
							subOverTime: (() => {
								let tempDate = new Date();
								tempDate.setHours(row.overTime.split(":")[0])
								tempDate.setMinutes(row.overTime.split(":")[1])
								tempDate.setSeconds(row.overTime.split(":")[2])
								return tempDate
							})(),
							subOverTimeNextDay: row.overTimeNextDay === 1,
							subType: row.type,
							subRemark: row.remark
						}
						break;
					case "subModifyStatus":
						this.modifyFormVisible4 = true;
						this.subModifyType = type;
						break;
					case "settingDate":
						this.modifyFormVisible5 = true; 
						this.getDate(row.id);
						break;
					case "subAdd2":
						this.modifyFormVisible6 = true;
						this.subModifyType2 = type;
						this.subModifyForm2 = {
							beginDate: "",
							endDate: "",
							can_trade: "",
							remark: ""
						}
						break;
					case "subEdit2":
						this.modifyFormVisible6 = true;
						this.subModifyType2 = type;
						this.subModifyForm2 = {
							contractId: row.contractId,
							beginDate: row.beginDate,
							endDate: row.endDate,
							can_trade: row.can_trade,
							remark: row.remark
						}
						break;
					case "subModifyStatus2":
						this.modifyFormVisible4 = true;
						this.subModifyType2 = type;
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
			rebuildTime(time){
				return time.getHours() + ":" + (time.getMinutes() < 10 ? "0" + time.getMinutes() : time.getMinutes()) + ":" + (time.getSeconds() < 10 ? "0" + time.getSeconds() : time.getSeconds())
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
			// 新增/更新合约
			update(){
				this.$refs.modifyForm.validate(valid => {
					if(valid){
						this.updateDayOpen();
						this.updateDayClose();
						this.modifyLoading = true;
						switch(this.modifyType){
							case "add":contractQuest.addContract(this.modifyForm).then(res=>{
								this.modifyLoading=false;
								this.getContract(this.filters.pageNo)
							}).catch(err=>this.modifyLoading=false);break;
							case "update":contractQuest.modifyContract(this.modifyForm).then(res=>{
								this.modifyLoading=false;
								this.getContract(this.filters.pageNo)
							}).catch(err=>this.modifyLoading=false);break;
						}
					}else{
						return false;
					}
				})
			},
			// 修改合约状态
			modifyStatus(row){
				this.modifyLoading = true;
				contractQuest.modifyStatus({
					id: row.id,
					status: row.status
				}).then(res => {
					this.modifyFormVisible3 = false;
					this.getContract(this.filters.pageNo);
				}).catch(err=>this.modifyLoading=false)
			},
			subUpdate(){
				this.$refs.subModifyForm.validate(valid => {
					if(valid){
						let submitData = {};
						this.modifyLoading = true;
						submitData.startTime = this.rebuildTime(this.subModifyForm.subStartTime);
						submitData.overTime = this.rebuildTime(this.subModifyForm.subOverTime);
						submitData.overTimeNextDay = this.subModifyForm.subOverTimeNextDay ? 1 : 0;
						submitData.type = this.subModifyForm.subType;
						submitData.remark = this.subModifyForm.subRemark;
						switch(this.subModifyType){
							case "subAdd": 
								contractQuest.addContractTime(submitData).then(res => {
									this.getSettings(this.settingContractId)
									this.modifyLoading = false;
									this.modifyFormVisible4 = false;
								}).catch(err => this.modifyLoading = false);
								break;
							case "subEdit": 
								submitData.contractId = this.subModifyForm.contractId;
								submitData.id = this.subModifyForm.contractId;
								contractQuest.modifyContractTime(submitData).then(res => {
									this.getSettings(this.settingContractId)
									this.modifyLoading = false;
									this.modifyFormVisible4 = false;
								}).catch(err => this.modifyLoading = false);
								break;
						}
					}
				})
			},
			subUpdate2(){
				this.$refs.subModifyForm2.validate(valid => {
					if(valid){
						let submitData = {...this.subModifyForm2};
						this.modifyLoading = true;
						submitData.can_trade = submitData.can_trade ? 1 : 0;
						submitData.contractId = this.settingContractId;
						submitData.beginDate = dateFormat(submitData.beginDate,"yyyy-MM-dd hh:mm:ss");
						submitData.endDate = dateFormat(submitData.endDate,"yyyy-MM-dd hh:mm:ss");
						switch(this.subModifyType2){
							case "subAdd2": 
								contractQuest.addDate(submitData).then(res => {
									this.getDate(this.settingContractId)
									this.modifyLoading = false;
									this.modifyFormVisible6 = false;
								}).catch(err => this.modifyLoading = false);
								break;
							case "subEdit2": 
								submitData.contractId = this.subModifyForm2.contractId;
								submitData.id = this.subModifyForm2.contractId;
								contractQuest.modifyDate(submitData).then(res => {
									this.getDate(this.settingContractId)
									this.modifyLoading = false;
									this.modifyFormVisible6 = false;
								}).catch(err => this.modifyLoading = false);
								break;
						}
					}
				})
			}
		}
	}
</script>