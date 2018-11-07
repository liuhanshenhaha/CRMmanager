<template>
	<section>
		<el-row :gutter="20">
			<el-col :span="11" :xs="24" class="goodsGroupTable">
				<el-button class="goodsGroupAddBtn" type="primary" size="small" @click="()=>showGoodsGroup('add')">添加商品组</el-button>
				<!--成本组列表-->
				<el-table stripe border fixed :data="groupData" highlight-current-row @current-change="(currentRow)=>getGoods(currentRow.id)" v-loading="listLoading1">
					<el-table-column label="成本组">
						<el-table-column prop="goodsGroupName" label="商品组名称">
						</el-table-column>
						<el-table-column prop="status" label="状态" :formatter="statusFormat">
						</el-table-column>
						<el-table-column prop="userType" label="用户类型" :formatter="userTypeFormat">
						</el-table-column>
						<el-table-column label="操作" align="center" fixed="right" width="140">
							<template slot-scope="scope">
								<el-button type="primary" size="small" @click="()=>showGoodsGroup('modify',scope.row)">编辑</el-button>
								<el-button type="success" v-if="!Boolean(scope.row.status)" size="small" @click="()=>modifyStatusGoodsGroup(scope.row)">激活</el-button>
								<el-button type="danger" v-if="Boolean(scope.row.status)" size="small" @click="()=>modifyStatusGoodsGroup(scope.row)">作废</el-button>
							</template>
						</el-table-column>
					</el-table-column>
				</el-table>				
			</el-col>
			<el-col :span="13" :xs="24" class="goodsGroupTable" v-if="showGoodsTable">
				<el-button class="goodsGroupAddGoodBtn" type="primary" size="small" @click="showNotAddedGoodsTable">添加商品</el-button>
				<!--成本组商品列表-->
				<el-table stripe border fixed :data="goodsData" v-loading="listLoading2" :row-class-name="tableRowClassName">
					<el-table-column label="成本组商品">
						<el-table-column prop="goodsCode" label="商品代码">
						</el-table-column>
						<el-table-column prop="goodsName" label="商品名称">
						</el-table-column>
						<el-table-column prop="myCost" label="我的成本" :formatter="myCostFormatter">
						</el-table-column>
						<el-table-column label="客户成本" class-name="goodsGroupTableInputArea">
							<template slot-scope="scope">
								<span>{{dictionary.CommissionTypeEnu[scope.row.commissionType]}}</span>
								<span v-if="editingRow !== scope.$index">{{scope.row.commissionValue}}</span>
								<input type="text" v-if="editingRow === scope.$index" v-model="scope.row.commissionValue" :ref="'input'+scope.$index"></input>
							</template>
						</el-table-column>
						<el-table-column label="操作" align="center" fixed="right" width="100">
							<template slot-scope="scope">
								<el-button v-if="editingRow !== scope.$index" type="primary" size="small" @click="editCurrentRow(scope.$index)">编辑</el-button>
								<el-button v-if="editingRow === scope.$index" type="primary" size="small" @click="saveRow()">保存</el-button>
							</template>
						</el-table-column>
					</el-table-column>
				</el-table>		
			</el-col>
		</el-row>

		<!--新增商品界面-->
		<el-dialog title="新增商品" customClass="w80p" v-model="addGoodsVisible" :close-on-click-modal="false">
			<!--待添加商品列表-->
			<el-table stripe border fixed :data="notAddedGoodsData" highlight-current-row v-loading="listLoading3" max-height="400" @selection-change="handleSelectionChange">
				<el-table-column type="selection" width="55">
    			</el-table-column>
				<el-table-column prop="goodsCode" label="商品代码">
				</el-table-column>
				<el-table-column prop="goodsName" label="商品名称">
				</el-table-column>
				<el-table-column prop="myCost" label="我的成本" :formatter="myCostFormatter">
				</el-table-column>
			</el-table>
			<br/>
			<el-form :model="commissionForm" ref="commissionForm" label-width="100px">
				<el-row>
					<el-col :span="10" :xs="24">
						<el-form-item label="客户成本" prop="commissionValue" :rules="commissionRules"				>
							<el-input type="text" v-model.number="commissionForm.commissionValue">
								<template slot="append">{{dictionary.CommissionTypeEnu[commissionType]}}</template>
							</el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addGoodsVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addGoods" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增成本组界面-->
		<el-dialog :title="type === 'add' ? '新增成本组' : '编辑成本组'" v-model="addGoodsGroupVisible" :close-on-click-modal="false">
			<el-form :model="addGoodsGroupForm" ref="addGoodsGroupForm" label-width="100px">
				<el-row :gutter="20">
					<el-col :span="12" :xs="24">
						<el-form-item label="成本组名称" prop="goodsGroupName" :rules="[{required:true,message:'请输入成本组名称'}]">
							<el-input type="text" v-model.number="addGoodsGroupForm.goodsGroupName">
							</el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="用户类型" prop="userType" :rules="[{required:true,message:'请选择用户类型'}]">
							<el-select v-model="addGoodsGroupForm.userType" placeholder="用户类型">
								<el-option v-for="item in userTypeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addGoodsGroupVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addGoodsGroup" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import { formatters,buildOptions } from "../../utils/utils"
	import { accountQuest } from "../../api/api"
	export default {
		data(){
			let commissionCondition = (rule, value, callback)=>{
				let maxValue = (() => {
					let temp = 0;
					this.notAddedGoodsData.map(item => {
						if(Number(item.commissionValue) > temp){
							temp = item.commissionValue;
						}
					})
					return temp;
				})()
				if(value < maxValue){
					return callback(new Error("设置的客户成本应大于我的成本！"))
				}
				callback()
			}
			return {
				dictionary: JSON.parse(localStorage.dictionary),
				groupData: [],//成本组列表
				goodsData: [],//已添加的商品列表
				notAddedGoodsData: [],//未添加的商品列表
				currentGroupId: null,//当前操作的成本组id
				showGoodsTable: false,//默认不显示商品列表
				listLoading1: false,//成本组表格加载标识
				listLoading2: false,//商品表格加载标识
				listLoading3: false,//商品表格加载标识
				editingRow: -1,//当前编辑的行号
				errorRow: -1,//失败的行号
				addGoodsVisible: false,//新增商品弹窗
				addLoading: false,//添加商品加载标识
				commissionForm: {
					commissionValue: ""
				},
				commissionRules: [
					{required:true, message:'请输入客户成本'},
					{type:'number', message: '客户成本必须为数字值'},
					{validator: commissionCondition,trigger: 'blur'}
				],
				commissionType: "",//客户成本类型
				batchAddData: "",//批量添加的ids
				addGoodsGroupVisible: false,
				type: "add",
				addGoodsGroupForm:{
					goodsGroupName: "",
					userType: ""
				},
				userTypeOptions: buildOptions("UserType")
			}
		},
		created(){
			this.getGroup()
		},
		methods:{
			statusFormat(row, col, cellValue){
				return formatters('CommonStatus',cellValue)
			},
			userTypeFormat(row, col, cellValue){
				return formatters('UserType',cellValue)
			},
			commissionTypeFormat(cellValue){
				return formatters('CommissionTypeEnu',cellValue)
			},
			myCostFormatter(row, col, cellValue){
				return Boolean(cellValue) ? cellValue : 0;
			},
			// 获取成本组列表
			getGroup(){
				this.listLoading1 = true;
				accountQuest.getGroup().then(res => {
					this.groupData = res.content;
					this.listLoading1 = false;
				}).catch(err=>{this.listLoading1 = false;});
			},
			// 获取成本组对应的商品列表
			getGoods(id){
				this.showGoodsTable = true;
				this.listLoading2 = true;
				this.currentGroupId = id;
				accountQuest.getGoods({goodsGroupId:id}).then(res => {
					this.goodsData = res.content;
					this.listLoading2 = false;
					this.editingRow = -1;
					this.commissionType = res.content[0].commissionType;
				}).catch(err=>{this.listLoading2 = false;});
			},
			// 获取未添加的商品列表
			showNotAddedGoodsTable(){
				this.addGoodsVisible = true;
				this.listLoading3 = true;
				accountQuest.getNotAddedGoods({goodsGroupId:this.currentGroupId}).then(res => {
					this.notAddedGoodsData = res.content;
					this.listLoading3 = false;
				}).catch(err=>{this.listLoading3 = false;});
			},
			editCurrentRow(index){
				if(this.editingRow !== -1){
					return this.$message.error("请先保存当前的修改！")
				}
				this.editingRow = index;
			},
			saveRow(){
				accountQuest.modifyGoods({
					id: this.goodsData[this.editingRow].id,
					commissionValue: Number(this.goodsData[this.editingRow].commissionValue)
				}).then(res => {
					this.editingRow = -1;
				}).catch(err => {
					this.errorRow = this.editingRow;
					console.error("修改客户成本失败！");
				})
			},
			tableRowClassName(row,rowIndex){
				if(rowIndex === this.errorRow){
					return "warning-row";
				}
			},
			handleSelectionChange(val){
				this.batchAddData = (val.map(item => item.goodsId)).join(",");
			},
			addGoods(){
				this.$refs.commissionForm.validate(valid => {
					if(valid){
						if(this.batchAddData){
							this.addLoading = true;
							accountQuest.addBatch({
								goodsGroupId: this.currentGroupId,
								goodsId: this.batchAddData,
								commissionValue: this.commissionForm.commissionValue
							}).then(res => {
								this.addLoading = false;
								this.addGoodsVisible = false;
								this.commissionForm.commissionValue = "";
								this.getGoods(this.currentGroupId);
							}).catch(err=>{this.addLoading = false;});
						}else{
							this.$message.error("请选择商品！")
						}
					}
				})
			},
			showGoodsGroup(type,row){
				switch(type){
					case 'add':
						this.addGoodsGroupVisible = true;
						this.type = 'add';
						this.addGoodsGroupForm = {
							goodsGroupName: "",
							userType: ""
						};
						break;
					case 'modify':
						this.addGoodsGroupVisible = true;
						this.type = 'modify';
						this.addGoodsGroupForm = {
							goodsGroupName: row.goodsGroupName,
							userType: row.userType,
							id: row.id
						};
						break;
				}
			},
			addGoodsGroup(row){
				this.$refs.addGoodsGroupForm.validate(valid => {
					if(valid){
						this.addLoading = true;
						if(this.type === "add"){
							accountQuest.addGroup(this.addGoodsGroupForm).then(res => {
								this.addLoading = false;
								this.addGoodsGroupVisible = false;
								this.getGroup();
							}).catch(error => this.addLoading = false);
						}else{
							accountQuest.modifyGroup(this.addGoodsGroupForm).then(res => {
								this.addLoading = false;
								this.addGoodsGroupVisible = false;
								this.getGroup();
							}).catch(error => this.addLoading = false);
						}
					}
				})
			},
			modifyStatusGoodsGroup(row){
				accountQuest.modifyStatusGroup({
					id: row.id,
					status: row.status ? 0 : 1
				}).then(res => {
					this.addLoading = false;
					this.addGoodsGroupVisible = false;
					this.getGroup();
				})
			}
		}
	}
</script>