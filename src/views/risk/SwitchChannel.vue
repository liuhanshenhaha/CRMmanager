<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.tradeAccountNo" placeholder="交易账户"></el-input>
				</el-form-item>
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-cascader v-model="filters.superiorUserId" :options="options" @active-item-change="makeCascader"></el-cascader>
				</el-form-item>
				<el-form-item>
					<el-select v-model="filters.customerType" placeholder="用户类型">
						<el-option v-for="item in customerOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>				
				<el-form-item>
					<el-select v-model="filters.tradeChannelId" placeholder="交易通道">
						<el-option v-for="item in channelOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>				
				<el-form-item>
					<el-button type="primary" v-on:click="()=>select(1)">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table stripe border fixed :data="tableData" highlight-current-row v-loading="listLoading" @selection-change="" style="width: 100%;">
			<el-table-column prop="name" label="姓名" width="120">
			</el-table-column>
			<el-table-column prop="sex" label="性别" width="80" :formatter="(row,col,value)=>formatter('UserSex',value)">
			</el-table-column>
			<el-table-column prop="level" label="层级" width="80">
			</el-table-column>
			<el-table-column prop="superiorUserName" label="归属" width="140">
			</el-table-column>
			<el-table-column prop="phoneNo" label="手机号码" width="150">
			</el-table-column>
			<el-table-column prop="email" label="邮箱" width="200">
			</el-table-column>						
			<el-table-column prop="tradeChannelName" label="通道" width="120">
			</el-table-column>
			<el-table-column prop="customerStatus" label="状态" width="100" :formatter="(row,col,value)=>formatter('UserStatus',value)">
			</el-table-column>
			<el-table-column prop="applyTime" label="注册时间" width="170">
			</el-table-column>
			<el-table-column label="地区" width="250">
				<template slot-scope="scope">
					{{(formatter('ProvinceEnu',scope.row.addressProvince) || "") + " " + (formatter('CityEnu',scope.row.addressCity)||"") + " " + (scope.row.addressDetail||"")}}
				</template>
			</el-table-column>
			<el-table-column prop="bankCode" label="银行" width="120" :formatter="(row,col,value)=>formatter('Bank',value)">
			</el-table-column>
			<el-table-column label="操作" align="center" fixed="right" width="100">
				<template slot-scope="scope">
					<el-button type="primary" size="small" @click="()=>modify(scope.row)">切换通道</el-button>
				</template>
			</el-table-column>
		</el-table>

		<div class="block" style="text-align:right">
		  <el-pagination background layout="prev, pager, next" :total="tableDataTotal" :page-size="10" @current-change="(currentPage)=>select(currentPage)"></el-pagination>
		</div>

		<!--新增/更新界面-->
		<el-dialog title="切换通道" customClass="w70p" v-model="modifyVisible" :close-on-click-modal="false">
			<el-table stripe border fixed :data="subTableData" highlight-current-row v-loading="listLoading2" @selection-change="" style="width: 100%;">
				<el-table-column prop="tradeAccountNo" label="交易账户" min-width="150">
				</el-table-column>
				<el-table-column prop="accountType" label="类型" min-width="100" :formatter="(row,col,value)=>formatter('TradeAccountType',value)">
				</el-table-column>
				<el-table-column prop="tradeStatus" label="状态" width="200" :formatter="(row,col,value)=>formatter('TradeStatus',value)">
				</el-table-column>
				<el-table-column label="选择通道" align="center" width="150">
					<template slot-scope="scope">
						<el-select v-model="scope.row.tradeChannelId" placeholder="选择通道" :disabled="editRow !== scope.$index">
							<el-option v-for="item in channelOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column label="操作" align="center" fixed="right" width="200">
					<template slot-scope="scope">
						<el-button type="primary" v-if="editRow !== scope.$index" size="small" @click.native="() => edit(scope.$index)" :loading="addLoading">修改通道</el-button>
						<el-button type="primary" v-if="editRow === scope.$index" size="small" @click.native="() => modifySubmit(scope.row)" :loading="addLoading">保存</el-button>
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
	import { buildOptions,formatters,getAgentOptions } from "../../utils/utils"
	import { channelQuest, accountQuest, getDictionary } from "../../api/api"
	export default {
		data(){
			return {
				filters:{
					tradeAccountNo: "",
					name: "",
					customerType: "",
					tradeChannelId: "",
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
				customerOptions:[{value:"",label:"全部"},{value:3,label:"代理"},{value:4,label:"客户"}],
				channelOptions:[],
				subTableData: [],
				editRow: -1,
        		provinceOptions: [],
        		bankOptions: [],
        		settingVisible: false,
			}
		},
		created(){			
			this.getChannel()
			getAgentOptions(this);
			
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
		      });
			this.select(1);
		},
		methods:{
			formatter(type,value){
				return formatters(type,value)
			},
			buildOption(type){
				return buildOptions(type)
			},
			// 获取交易通道
			getChannel(){
				channelQuest.selectValid().then(res => {
					this.channelOptions = res.content.map(item => {
						return {
							value: item.id,
							label: item.tradeChannelName
						}
					})
				}).catch(err=>console.error("获取交易通道失败！"));
			},
			// 获取列表
			select(pageNo){
				this.listLoading = true;
				this.curPage = pageNo;				
				channelQuest.selectCustomerByChannel({
					"pageSize": 10,
					"pageNo": pageNo,
					"tradeAccountNo":this.filters.tradeAccountNo,
					"tradeChannelId":this.filters.tradeChannelId,
					"customerType":this.filters.customerType,
					"name":this.filters.name,
					"superiorUserId":this.filters.superiorUserId.length > 0 ? (this.filters.superiorUserId[this.filters.superiorUserId.length - 1] === "straight" ? this.filters.superiorUserId[this.filters.superiorUserId.length - 2] : this.filters.superiorUserId[this.filters.superiorUserId.length - 1]) : "",
					"cascadeType":this.filters.superiorUserId.length > 0 ? (this.filters.superiorUserId[this.filters.superiorUserId.length - 1] === "straight" ? 1 : 2) : ""//1是直属 2是级联
				}).then(res => {
					this.tableData = res.content.dataList;
					this.tableDataTotal = res.content.count;
					this.listLoading = false;
				}).catch(err=>{this.listLoading = false;});
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

			modifySubmit(row){
				channelQuest.switchChannel({
					id: row.id,
					tradeChannelId: row.tradeChannelId
				}).then(res => {
					this.editRow = -1;
				}).catch(err => console.error("切换通道失败"));				
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
		}
	}
</script>