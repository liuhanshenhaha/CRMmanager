<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-select v-model="filters.bankCode" placeholder="银行" >
						<el-option v-for="item in buildOption('Bank',true)" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.bankBranch" placeholder="银行支行"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.bankCardNo" placeholder="银行卡号"></el-input>
				</el-form-item>
				<el-form-item>
					<el-cascader placeholder="省/市" :options="provinceOptions" v-model="filters.bankProvinceAndCity" filterable></el-cascader>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.auditStatus" placeholder="状态" >
						<el-option v-for="item in buildOption('ApplyStatus',true)" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="()=>getList()">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="detailVisible = true;">申请换绑银行卡</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table stripe border fixed :data="tableData" highlight-current-row v-loading="listLoading" @selection-change="" style="width: 100%;">
			<el-table-column prop="name" label="姓名">
			</el-table-column>
			<el-table-column prop="level" label="层级">
			</el-table-column>
			<el-table-column prop="superiorUserName" label="归属">
			</el-table-column>
			<el-table-column prop="oldBankCode" label="原开户银行" width="140" :formatter="(row,col,cellValue) => formatter('Bank',cellValue)">
			</el-table-column>
			<el-table-column prop="oldBankBranch" label="原开户支行" width="140">
			</el-table-column>
			<el-table-column prop="oldBankCardNo" label="原银行卡号" width="140">
			</el-table-column>
			<el-table-column prop="bankCode" label="新开户银行" width="140" :formatter="(row,col,cellValue) => formatter('Bank',cellValue)">
			</el-table-column>
			<el-table-column prop="bankBranch" label="新开户支行" width="140"> 
			</el-table-column>
			<el-table-column prop="bankCardNo" label="新银行卡号" width="140">
			</el-table-column>
			<el-table-column prop="applyTime" label="提交时间" width="180">
			</el-table-column>
			<el-table-column prop="auditPassTime" label="审核时间" width="180">
			</el-table-column>
			<el-table-column prop="auditStatus" label="审核状态" width="140" :formatter="(row,col,cellValue) => formatter('ApplyStatus',cellValue)">
			</el-table-column>
			<el-table-column prop="remark" label="备注">
			</el-table-column>
		</el-table>

		<el-dialog title="申请换绑银行卡" customClass="w70p" v-model="detailVisible" :close-on-click-modal="false" @close="resetForm">
			<el-form label-position="right" label-width="80px" :model="applicationForm" ref="applicationForm" :rules="rules">
				<el-row :gutter="20">
					<el-col :span="12" :xs="24">
						<el-form-item label="银行" prop="bankCode">
							<el-select v-model="applicationForm.bankCode" placeholder="银行" >
								<el-option v-for="item in buildOption('Bank',true)" :key="item.value" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="银行支行" prop="bankBranch">
							<el-input v-model="applicationForm.bankBranch" placeholder="银行支行"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row :gutter="20">
					<el-col :span="12" :xs="24">
						<el-form-item label="银行卡号" prop="bankCardNo">
							<el-input v-model="applicationForm.bankCardNo" placeholder="银行卡号"></el-input>
						</el-form-item>
					</el-col>
					<el-col :span="12" :xs="24">
						<el-form-item label="省/市" prop="bankProvinceAndCity">
							<el-cascader placeholder="省/市" :options="provinceOptions" v-model="applicationForm.bankProvinceAndCity" filterable></el-cascader>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="detailVisible = false;">关闭</el-button>
				<el-button type="primary" @click.native="detailVisible = false;" :loading="loading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import { formatters, buildOptions } from "../../utils/utils"
	import { accountQuest,getDictionary } from "../../api/api"
	export default {
		data(){
			return {
				filters: {},
				tableData: [],//表格数据
				listLoading: false,//表格加载中标识
				customerType: (()=>{
					switch(JSON.parse(localStorage.userInfo).customerType){
				        case 3: return "agent";break;
				        case 4: return "customer";break;
				        default: return "admin";
				    }
				})(),
				detailVisible: false,
				curId: "",
				status: "",
        		provinceOptions: [],
        		applicationForm: {},
        		loading: false,
        		rules: {
        			bankCode: [{required: true,message: "请选择银行"}],
        			bankBranch: [{required: true,message: "请输入银行支行"}],
        			bankCardNo: [{required: true,message: "请输入银行卡号"}],
        			bankProvinceAndCity: [{required: true,message: "请选择省/市"}],
        		}
			}
		},
		created(){
		  this.getList(1);
	      getDictionary().then((res) => {
	        this.provinceOptions = (()=>{
	          let tempOptions = [];
	          Object.keys(res.content.ProvinceEnu).map(key => {
	            tempOptions.push({
	              value: key,
	              label: res.content.ProvinceEnu[key],
	              children: (()=>{
	                let tempChildren = [];
	                Object.keys(res.content.CityEnu).map(item => {
	                  if(item.indexOf(key) === 0){
	                    tempChildren.push({
	                      value: item,
	                      label: res.content.CityEnu[item],
	                    })
	                  }
	                })
	                return tempChildren;
	              })()
	            })
	          })
	          return tempOptions;
	        })()
	      })
		},
		methods:{
			resetForm() {
                this.$nextTick(()=>{
                    if(this.$refs["applicationForm"]){
					    this.$refs["applicationForm"].resetFields();
					}
                })                
            },
			formatter(type,value){
				return formatters(type,value)
			},
			buildOption(type,all){
				return buildOptions(type,all)
			},
			// 获取持仓订单列表
			getList(){
				this.listLoading = true;
				let submitData = {
					"bankCardNo":this.filters.bankCardNo,
					"bankBranch":this.filters.bankBranch,
					"province":this.filters.bankProvinceAndCity?this.filters.bankProvinceAndCity[0]:"",
					"city":this.filters.bankProvinceAndCity?this.filters.bankProvinceAndCity[1]:"",
					"bankCode":this.filters.bankCode,
					"auditStatus":this.filters.auditStatus
				}
				accountQuest.switchBankCardHistory(submitData).then(res => {
					this.tableData = res.content;
					this.listLoading = false;
				}).catch(err=>{this.listLoading = false;});
			},
			submitApplication(){
				this.loading = true;
				let submitData = {
					"bankCardNo":this.filters.bankCardNo,
					"bankBranch":this.filters.bankBranch,
					"province":this.filters.bankProvinceAndCity?this.filters.bankProvinceAndCity[0]:"",
					"city":this.filters.bankProvinceAndCity?this.filters.bankProvinceAndCity[1]:"",
					"bankCode":this.filters.bankCode
				}
				accountQuest.switchBankCardApplication(submitData).then(res => {
					this.detailVisible = false;
					this.loading = false;
				}).catch(err=>{this.listLoading = false;});
			}
		}
	}
</script>