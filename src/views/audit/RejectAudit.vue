<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.userName" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.customerType" placeholder="选择类型">
						<el-option v-for="item in buildOption('UserType',true)" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="()=>getList(1)">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table stripe border fixed :data="tableData" highlight-current-row v-loading="listLoading" style="width: 100%;">
			<el-table-column type="index" label="序号" width="80">
			</el-table-column>
			<el-table-column prop="userAccountNo" label="账户" width="100">
			</el-table-column>
			<el-table-column prop="name" label="姓名" min-width="150">
			</el-table-column>
			<el-table-column prop="sex" label="性别" width="100" :formatter="(row, col, cellValue) => format('UserSex',cellValue)">
			</el-table-column>
			<el-table-column prop="level" label="层级">
			</el-table-column>
			<el-table-column prop="superiorUserName" label="归属" width="150">
			</el-table-column>
			<el-table-column prop="inviteCode" label="邀请码" width="150">
			</el-table-column>
			<el-table-column prop="phoneNo" label="电话" width="150">
			</el-table-column>
			<el-table-column prop="email" label="邮箱" width="200">
			</el-table-column>
			<el-table-column prop="idCard" label="身份证信息" width="200">
			</el-table-column>
			<el-table-column prop="bankCode" label="银行" width="160" :formatter="(row, col, cellValue) => format('Bank',cellValue)">
			</el-table-column>
			<el-table-column prop="bankCardNo" label="银行卡号" width="200">
			</el-table-column>
			<el-table-column prop="bankBranch" label="开户行地址" width="150">
			</el-table-column>
			<el-table-column prop="applyTime" label="申请时间" width="200">
			</el-table-column>
			<el-table-column label="操作" align="center" fixed="right" >
				<template slot-scope="scope">
					<el-button type="primary" size="small" @click="()=>open(scope.row)">查看</el-button>
				</template>
			</el-table-column>
		</el-table>
		
		<div class="block" style="text-align:right">
		  <el-pagination background layout="prev, pager, next" :total="tableDataTotal" @current-change="(currentPage)=>getList(currentPage)"></el-pagination>
		</div>

		<el-dialog title="审核" v-model="settingVisible" :close-on-click-modal="false">
			<el-form label-position="right" label-width="80px" :model="registerForm" ref="registerForm">
	          <el-row :gutter="20">
	            <el-col :span="12" :xs="24">
	              <el-form-item label="姓名" prop="name">
	                <el-input v-model="registerForm.name" disabled></el-input>
	              </el-form-item>
	            </el-col>
	            <el-col :span="12" :xs="24">
	              <el-form-item label="电话" prop="phoneNo">
	                <el-input v-model="registerForm.phoneNo" disabled></el-input>
	              </el-form-item>
	            </el-col>
	           </el-row>
	           <el-row :gutter="20">
	            <el-col :span="12" :xs="24">
	              <el-form-item label="邮箱" prop="email">
	                <el-input v-model="registerForm.email" disabled></el-input>
	              </el-form-item>
	            </el-col>
	            <el-col :span="12" :xs="24">
	              <el-form-item label="身份证号" prop="idCard">
	                <el-input v-model="registerForm.idCard" disabled></el-input>
	              </el-form-item>
	            </el-col>
	           </el-row>
	           <el-row :gutter="20">
	            <el-col :span="12" :xs="24">
	              <el-form-item label="住址省市" prop="provinceAndCity">
	                <el-cascader placeholder="省/市" :options="provinceOptions" v-model="registerForm.provinceAndCity" filterable disabled></el-cascader>
	              </el-form-item>
	            </el-col>
	            <el-col :span="12" :xs="24">
	              <el-form-item prop="addressDetail" label="详细地址">
	                <el-input v-model="registerForm.addressDetail" placeholder="详细地址" disabled></el-input>
	              </el-form-item>
	            </el-col>
	           </el-row>
	           <el-row :gutter="20">
	            <el-col :span="12" :xs="24">
	              <el-form-item label="银行" prop="bankCode">
	                <el-select v-model.number="registerForm.bankCode" placeholder="请选择银行" disabled>
	                  <el-option v-for="item in bankOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
	                </el-select>
	              </el-form-item>
	            </el-col>
	            <el-col :span="12" :xs="24">
	              <el-form-item label="银行卡" prop="bankCardNo">
	                <el-input v-model="registerForm.bankCardNo" disabled></el-input>
	              </el-form-item>
	            </el-col>
	           </el-row>
	           <el-row :gutter="20">
	            <el-col :span="12" :xs="24">
	              <el-form-item label="支行省市" prop="bankProvinceAndCity">
	                <el-cascader placeholder="省/市" :options="provinceOptions" v-model="registerForm.bankProvinceAndCity" filterable disabled></el-cascader>
	              </el-form-item>
	            </el-col>
	            <el-col :span="12" :xs="24">
	              <el-form-item label="支行名称" prop="bankBranch">
	                <el-input v-model="registerForm.bankBranch" placeholder="支行名称" disabled></el-input>
	              </el-form-item>
	            </el-col>
	          </el-row>
	        </el-form>
			<br/>
			<el-row>
				<el-col :span="24">
					<label>身份证正面照片</label>
					<br/>
					<img :src="attachments[0]" style="width:50%;border: 2px solid #000;"/>
				</el-col>
				<el-col :span="24">
					<label>身份证背面照片</label>
					<br/>
					<img :src="attachments[1]" style="width:50%;border: 2px solid #000;"/>
				</el-col>
				<el-col :span="24">
					<label>银行卡照片</label>
					<br/>
					<img :src="attachments[2]" style="width:50%;border: 2px solid #000;"/>
				</el-col>
				<el-col :span="24">
					<label>风险确认书照片</label>
					<br/>
					<img :src="attachments[3]" style="width:50%;border: 2px solid #000;"/>
				</el-col>
			</el-row>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="settingVisible = false">关闭</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import { formatters, buildOptions } from "../../utils/utils"
	import { accountQuest, getDictionary } from "../../api/api"
	export default {
		data(){
			return {
				filters: {
					userName: "",
					pageSize: "10",
					customerType: ""
				},
				tableData: [],//表格数据
				listLoading: false,//表格加载中标识
				tableDataTotal: 0,//总页数
				attachmentVisible: false,//附件弹窗
				attachments: [],//附件
				curPage: 1,//当前页
				settingVisible: false,//查看详细弹窗
				registerForm: {},
				provinceOptions:[],
				bankOptions: []
			}
		},
		created(){
			this.getList(1);
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
			buildOption(type,all){
				return buildOptions(type,all)
			},
			format(type,value){
				return formatters(type,value)
			},
			// 获取市场列表
			getList(pageNo){
				this.listLoading = true;
				this.curPage = pageNo;
				accountQuest.selectFailList(Object.assign({
					pageNo: pageNo,
				},this.filters)).then(res => {
					this.tableData = res.content.dataList;
					this.tableDataTotal = res.content.count;
					this.listLoading = false;
				}).catch(err=>{this.listLoading = false;});
			},
			// 审核通过配置客户
			open(row){
				this.listLoading2 = true;
				this.settingVisible = true;
				accountQuest.getAuditInfo({id:row.id}).then(res => {
					this.listLoading2 = false;
					this.registerForm = {
						name: res.content.name,
						phoneNo: res.content.phoneNo,
						email: res.content.email,
						idCard: res.content.idCard,
						provinceAndCity: [res.content.addressProvince,res.content.addressCity],
						addressDetail: res.content.addressDetail,
						bankCode: res.content.bankCode,
						bankCardNo: res.content.bankCardNo,
						bankProvinceAndCity: [res.content.province, res.content.city],
						bankBranch: res.content.bankBranch
					};
					this.attachments = [];
					this.attachments.push("data:image/png;base64,"+res.content.idCardFrontPicture);
					this.attachments.push("data:image/png;base64,"+res.content.idCardBackPicture);
					this.attachments.push("data:image/png;base64,"+res.content.bankCardPicture);
					this.attachments.push("data:image/png;base64,"+res.content.agreeRiskPicture);
					this.settingForm = {
						id: row.id
					};
				}).catch(err => console.error("获取详细信息失败"))
			}
		}
	}
</script>