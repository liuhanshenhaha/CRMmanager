<template>
	<section>
		<!--列表-->
		<el-table stripe border fixed :data="tableData" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" label="序号" width="80">
			</el-table-column>
			<el-table-column prop="name" label="姓名" min-width="150">
			</el-table-column>
			<el-table-column prop="sex" label="性别" width="100" :formatter="(row, col, cellValue) => format('UserSex',cellValue)">
			</el-table-column>
			<el-table-column prop="level" label="层级">
			</el-table-column>
			<el-table-column prop="superiorUserName" label="归属" width="150">
			</el-table-column>
			<el-table-column prop="phoneNo" label="电话" width="150">
			</el-table-column>
			<el-table-column prop="email" label="邮箱" width="200">
			</el-table-column>
			<el-table-column prop="idCard" label="身份证信息" width="200">
			</el-table-column>
			<el-table-column label="住址" width="150">
				<template slot-scope="scope">
					{{(format('ProvinceEnu',scope.row.addressProvince) || "") + " " + (format('CityEnu',scope.row.addressCity)||"") + " " + (scope.row.addressDetail||"")}}
				</template>
			</el-table-column>
			<el-table-column prop="bankCode" label="银行" width="160" :formatter="(row, col, cellValue) => format('Bank',cellValue)">
			</el-table-column>
			<el-table-column prop="bankCardNo" label="银行卡号" width="200">
			</el-table-column>
			<el-table-column label="开户行地址" width="150">
				<template slot-scope="scope">
					{{(format('ProvinceEnu',scope.row.province) || "") + " " + (format('CityEnu',scope.row.city)||"") + " " + (scope.row.bankBranch||"")}}
				</template>
			</el-table-column>
			<el-table-column prop="applyTime" label="申请时间" width="200">
			</el-table-column>
			<el-table-column label="操作" align="center" fixed="right" width="100">
				<template slot-scope="scope">
					<el-button type="primary" size="small" @click="()=>pass(scope.row)">审核</el-button>
				</template>
			</el-table-column>
		</el-table>
		
		<div class="block" style="text-align:right">
		  <el-pagination background layout="prev, pager, next" :total="tableDataTotal" @current-change="(currentPage)=>getList(currentPage)"></el-pagination>
		</div>

		<el-dialog title="查看附件" v-model="attachmentVisible" :close-on-click-modal="false">
			<el-row>
				<el-col :span="24">
					<label>银行卡照片</label>
					<br/>
					<img :src="attachments[0]" style="width:50%;border: 2px solid #000;"/>
				</el-col>
				<el-col :span="24">
					<label>身份证正面照片</label>
					<br/>
					<img :src="attachments[1]" style="width:50%;border: 2px solid #000;"/>
				</el-col>
				<el-col :span="24">
					<label>身份证背面照片</label>
					<br/>
					<img :src="attachments[2]" style="width:50%;border: 2px solid #000;"/>
				</el-col>
			</el-row>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="attachmentVisible = false">关闭</el-button>
			</div>
		</el-dialog>

		<el-dialog title="审核通过" v-model="settingVisible" :close-on-click-modal="false">
			<el-form :model="settingForm" :rules="settingFormRules" label-width="80px" ref="settingForm">
				<el-row :gutter="20">
					<el-col :span="12" :xs="24">
						<el-form-item label="平仓线" prop="forceLine">
							<el-input v-model.number="settingForm.forceLine" placeholder="平仓线"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="告警线" prop="warningLine">
							<el-input v-model.number="settingForm.warningLine" placeholder="告警线"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12" :xs="24">
						<el-form-item label="交易通道" prop="tradeChannelId">
							<el-select v-model="settingForm.tradeChannelId" placeholder="交易通道">
								<el-option v-for="item in tradeChannelIdOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="角色" prop="roleId">
							<el-select v-model="settingForm.roleId" placeholder="角色">
								<el-option v-for="item in roleIdOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12" :xs="24">
						<el-form-item label="返佣类型" prop="commissionType">
							<el-select v-model="settingForm.commissionType" placeholder="返佣类型">
								<el-option v-for="item in buildOption('UserCommissionTypeEnu')" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="汇率" prop="rate">
							<el-input v-model="settingForm.rate" placeholder="若此项为空，则按实时汇率计算"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="24">
						<el-form-item label="备注" prop="remark">
							<el-input type="textarea" resize="none" v-model="settingForm.remark" placeholder="备注"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="settingVisible = false">关闭</el-button>
				<el-button type="primary" :loading="loading" @click.native="passSubmit">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import { formatters, buildOptions } from "../../utils/utils"
	import { accountQuest } from "../../api/api"
	export default {
		data(){
			return {
				statusOptions: [],
				tableData: [],//表格数据
				listLoading: false,//表格加载中标识
				tableDataTotal: 0,//总页数
				attachmentVisible: false,//附件弹窗
				attachments: [],//附件
				curPage: 1,//当前页
				loading: false,//提交loading标识
				settingVisible: false,//审核通过弹窗
				settingForm: {},
				settingFormRules: {
					forceLine: [{required: true, message: "请输入平仓线"},{type:"number",message: "平仓线只能是数字",trigger: "blur"}],
					warningLine: [{required: true, message: "请输入告警线"},{type:"number",message: "告警线只能是数字",trigger: "blur"}],
					tradeChannelId: [{required: true, message: "请选择交易通道"}],
					roleId: [{required: true, message: "请选择角色"}],
					commissionType: [{required: true, message: "请选择返佣类型"}],
				},
				tradeChannelIdOptions: [],
				roleIdOptions: [],
			}
		},
		created(){
			this.getList(1);
			this.getTradeChannelId();
			this.getRoleId();
		},
		methods:{
			format(type,value){
				return formatters(type,value)
			},
			buildOption(type){
				return buildOptions(type)
			},
			// 获取市场列表
			getList(pageNo){
				this.listLoading = true;
				this.curPage = pageNo;
				accountQuest.auditList({
					pageNo: pageNo,
					pageSize: "10",
					customerType: "3"
				}).then(res => {
					this.tableData = res.content.dataList;
					this.tableDataTotal = res.content.pageCount;
					this.listLoading = false;
				}).catch(err=>{this.listLoading = false;});
			},
			// 获取交易通道
			getTradeChannelId(){
				accountQuest.getTradeChannelId().then(res => {
					this.tradeChannelIdOptions = res.content.map(item => {
						return {
							value: item.id,
							label: item.tradeChannelName
						}
					})
				}).catch(err=>console.error("获取交易通道失败！"));
			},
			// 获取角色
			getRoleId(){
				accountQuest.getRoleId().then(res => {
					this.roleIdOptions = res.content.map(item => {
						return {
							value: item.id,
							label: item.name
						}
					})
				}).catch(err=>console.error("获取角色失败！"));
			},
			// 查看附件
			viewPics(id){
				accountQuest.getAuditInfo({id:id}).then(res => {
					this.attachmentVisible = true;
					this.attachments.push("data:image/png;base64,"+res.content.bankCardPicture);
					this.attachments.push("data:image/png;base64,"+res.content.idCardFrontPicture);
					this.attachments.push("data:image/png;base64,"+res.content.idCardBackPicture);
				})
			},
			// 审核通过配置客户
			pass(row){
				this.settingVisible = true;
				this.settingForm = {
					id: row.id,
					customerStatus: 1,//1通过3拒绝
					forceLine: "",
					warningLine: "",
					tradeChannelId: "",
					roleId: "",
					rate: "",
					commissionType: "",
					remark: ""
				};
			},
			passSubmit(){
				this.$refs.settingForm.validate(valid => {
					if(valid){
						this.loading = true;
						accountQuest.customerAudit(this.settingForm).then(res => {
							this.loading = false;
							this.settingVisible = false;
							this.getList(this.curPage);
						}).catch(error => this.loading = false)
					}
				})
			},
			rejectSubmit(row){
				this.$refs.rejectForm.validate(valid => {
					if(valid){
						this.loading = true;
						accountQuest.customerAudit(this.rejectForm).then(res => {
							this.loading = false;
							this.rejectVisible = false;
							this.getList(this.curPage);
						}).catch(error => this.loading = false)
					}
				})
			}
		}
	}
</script>