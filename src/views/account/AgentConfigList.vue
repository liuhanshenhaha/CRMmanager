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
			<el-table-column label="操作" align="center" fixed="right" width="300">
				<template slot-scope="scope">
					<el-button type="primary" size="small" @click="()=>editAgent(scope.row)">编辑</el-button>
					<el-button type="primary" size="small" @click="()=>modify(scope.row)">配置</el-button>
					<el-button type="success" v-if="scope.row.customerStatus == 4" size="small" @click="()=>agentActivated(scope.row)">激活</el-button>
					<el-button type="danger" v-if="scope.row.customerStatus == 1" size="small" @click="()=>agentFreezing(scope.row)">冻结</el-button>
					<el-button type="danger" size="small" @click="()=>resetPassword(scope.row)">重置密码</el-button>
				</template>
			</el-table-column>
		</el-table>

		<div class="block" style="text-align:right">
		  <el-pagination background layout="prev, pager, next" :total="tableDataTotal" :page-size="20" @current-change="(currentPage)=>getAgents(currentPage)"></el-pagination>
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
						<el-button type="danger" size="small" @click.native="() => resetTradePassword(scope.row)" :loading="addLoading">重置密码</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="modifyVisible = false;">关闭</el-button>
			</div>
		</el-dialog>

		<el-dialog title="编辑" v-model="settingVisible" :close-on-click-modal="false">
			<el-form label-position="right" label-width="80px" :model="registerForm" ref="registerForm" :rules="rules">
				<el-row :gutter="20">
					<el-col :span="12" :xs="24">
						<el-form-item label="姓名" prop="name">
							<el-input v-model="registerForm.name" placeholder="姓名"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="电话" prop="phoneNo">
							<el-input v-model="registerForm.phoneNo" placeholder="电话"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12" :xs="24">
						<el-form-item label="邮箱" prop="email">
							<el-input v-model="registerForm.email" placeholder="邮箱"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="身份证号" prop="idCard">
							<el-input v-model="registerForm.idCard" placeholder="身份证号"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12" :xs="24">
						<el-form-item label="住址省市" prop="provinceAndCity">
							<el-cascader placeholder="省/市" :options="provinceOptions" v-model="registerForm.provinceAndCity" filterable></el-cascader>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item prop="addressDetail" label="详细地址">
							<el-input v-model="registerForm.addressDetail" placeholder="详细地址"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12" :xs="24">
						<el-form-item label="银行" prop="bankCode">
							<el-select v-model.number="registerForm.bankCode" placeholder="请选择银行">
								<el-option v-for="item in bankOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="银行卡" prop="bankCardNo">
							<el-input v-model="registerForm.bankCardNo" placeholder="银行卡"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12" :xs="24">
						<el-form-item label="支行省市" prop="bankProvinceAndCity">
							<el-cascader placeholder="省/市" :options="provinceOptions" v-model="registerForm.bankProvinceAndCity" filterable></el-cascader>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="支行名称" prop="bankBranch">
							<el-input v-model="registerForm.bankBranch" placeholder="支行名称"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12" :xs="24">
						<el-form-item label="角色" prop="roleId">
							<el-select v-model="registerForm.roleId" placeholder="角色">
								<el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="下级推荐" prop="allowNextInvite">
							<el-select v-model="registerForm.allowNextInvite" placeholder="允许下级推荐">
								<el-option v-for="item in buildOption('YesOrNoEnum')" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12" :xs="24">
						<el-form-item label="返佣类型" prop="commissionType">
							<el-select v-model="registerForm.commissionType" placeholder="返佣类型">
								<el-option v-for="item in buildOption('UserCommissionTypeEnu')" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="允许交易" prop="isAllowTrade">
							<el-select v-model="registerForm.isAllowTrade" placeholder="允许交易">
								<el-option v-for="item in buildOption('YesOrNoEnum')" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="24">
						<el-form-item label="备注" prop="remark">
							<el-input type="textarea" resize="none" v-model="registerForm.remark" placeholder="备注"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="settingVisible = false">取消</el-button>
				<el-button type="primary" :loading="loading" @click.native="editAgentSubmit">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import { buildOptions,formatters,getAgentOptions } from "../../utils/utils"
	import { accountQuest, getDictionary } from "../../api/api"
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
				loading: false,
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
				registerForm: {},
        		provinceOptions: [],
        		bankOptions: [],
        		roleOptions: [],
        		settingVisible: false,
        		rules: {
        			name: [{required: true,message: "请输入姓名"}],
        			phoneNo: [{required: true,message: "请输入电话"}],
        			email: [{required: true,message: "请输入邮箱"}],
        			idCard: [{required: true,message: "请输入身份证号"}],
        			provinceAndCity: [{required: true,message: "请选择省市"}],
        			addressDetail: [{required: true,message: "请输入详细地址"}],
        			bankCode: [{required: true,message: "请选择银行"}],
        			bankCardNo: [{required: true,message: "请输入银行卡"}],
        			bankProvinceAndCity: [{required: true,message: "请选择省市"}],
        			bankBranch: [{required: true,message: "请输入支行名称"}],
        			roleId: [{required: true,message: "请选择角色"}],
        			allowNextInvite: [{required: true}],
        			commissionType: [{required: true}],
        			isAllowTrade: [{required: true}],
        		}
			}
		},
		created(){
			this.getAgents(1)
			this.getGroups();
			getAgentOptions(this);
			this.getRole();
			getDictionary().then((res) => {
		        this.dictionary = res.content;
		        this.provinceOptions = (()=>{
		          let tempOptions = [];
		          Object.keys(this.dictionary.ProvinceEnu).map(key => {
		            tempOptions.push({
		              value: key,
		              label: this.dictionary.ProvinceEnu[key],
		              children: (()=>{
		                let tempChildren = [];
		                Object.keys(this.dictionary.CityEnu).map(item => {
		                  if(item.indexOf(key) === 0){
		                    tempChildren.push({
		                      value: item,
		                      label: this.dictionary.CityEnu[item],
		                    })
		                  }
		                })
		                return tempChildren;
		              })()
		            })
		          })
		          return tempOptions;
		        })()
		        this.bankOptions = (()=>{
		          let tempOptions = [];
		          Object.keys(this.dictionary.Bank).map(bank => {
		            tempOptions.push({
		              value: bank,
		              label: this.dictionary.Bank[bank]
		            })
		          })
		          return tempOptions;
		        })()
		      })
		},
		methods:{
			formatter(type,value){
				return formatters(type,value)
			},
			buildOption(type){
				return buildOptions(type)
			},
			// 获取交易通道
			getRole(){
				accountQuest.getRoleId().then(res => {
					this.roleOptions = res.content.map(item => {
						return {
							value: item.id,
							label: item.name
						}
					})
				}).catch(err=>console.error("获取角色失败！"));
			},
			// 获取市场列表
			getAgents(pageNo){
				this.listLoading = true;
				this.curPage = pageNo;
				accountQuest.selectAgentByParent({
					"pageSize": 20,
					"pageNo": pageNo,
					"userAccountNo":this.filters.userAccountNo,
					"userName":this.filters.userName,
					"superiorUserId":this.filters.superiorUserId.length > 0 ? (this.filters.superiorUserId[this.filters.superiorUserId.length - 1] === "straight" ? this.filters.superiorUserId[this.filters.superiorUserId.length - 2] : this.filters.superiorUserId[this.filters.superiorUserId.length - 1]) : "",
					"cascadeType":this.filters.superiorUserId.length > 0 ? (this.filters.superiorUserId[this.filters.superiorUserId.length - 1] === "straight" ? 1 : 2) : ""//1是直属 2是级联
				}).then(res => {
					this.tableData = res.content.dataList;
					this.tableDataTotal = res.content.count;
					this.listLoading = false;
				}).catch(err=>{this.listLoading = false;});
			},
			getGroups(){
				accountQuest.selectValidByOwner({}).then(res => {
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
			// 配置
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
			// 编辑
			editAgent(row){
				this.settingVisible = true; 
				this.curId = row.id;
				accountQuest.getAuditInfo({id:row.id}).then(res => {
					this.registerForm = res.content;
					this.registerForm.provinceAndCity = [this.registerForm.addressProvince,this.registerForm.addressCity];
					this.registerForm.bankProvinceAndCity = [this.registerForm.province,this.registerForm.city];
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
				getAgentOptions(this,value[value.length - 1],value)
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
			resetTradePassword(row){
				accountQuest.resetTradePassword({
					id: row.id
				}).then(res => {
					console.log("重置密码成功")
				}).catch(err => {
					console.error("重置密码失败")
				})
			},
			addNewAgent(){
				this.$router.push({ path: '/account/agent-register' });
			},
			editAgentSubmit(){
				this.loading = true;
				accountQuest.agentModify(Object.assign(this.registerForm,{
					id: this.curId,
					addressProvince: this.registerForm.provinceAndCity[0],
					addressCity: this.registerForm.provinceAndCity[1],
					province: this.registerForm.bankProvinceAndCity[0],
					city: this.registerForm.bankProvinceAndCity[1],
					idCardFrontPictureImage: "",
					idCardBackPictureImage: "",
					bankCardPictureImage: "",
					agreeRiskPictureImage: "",
				})).then(res => {
					this.loading = false;
					this.settingVisible = false;
				}).catch(error => {
					this.loading = false;
					console.error("修改代理信息失败")
				})
			},
			agentFreezing(row){
				accountQuest.agentFreezing({id:row.id}).then(res => {
					this.getAgents(this.curPage)
				}).catch(error => console.error("冻结代理失败"))
			},
			agentActivated(row){
				accountQuest.agentActivated({id:row.id}).then(res => {
					this.getAgents(this.curPage)
				}).catch(error => console.error("激活代理失败"))
			},
		}
	}
</script>