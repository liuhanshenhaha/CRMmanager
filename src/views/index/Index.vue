<template>
	<section>
		<div class="el-loading-mask" v-if="showLoading">
			<div class="el-loading-spinner">
				<svg viewBox="25 25 50 50" class="circular">
					<circle cx="50" cy="50" r="20" fill="none" class="path"></circle>
				</svg>
			</div>
		</div>
		<!-- 管理员 -->
		<el-card class="index-card" v-if="customerType === 'admin'">
			<el-row :gutter="20">
				<el-col :span="4" :xs="24">
					<label>姓名：</label> {{ user.name }}
				</el-col>
				<el-col :span="4" :xs="24">
					<label>类型：</label> {{ formatter("UserType",user.customerType) }}
				</el-col>
				<el-col :span="4" :xs="24">
					<label>角色：</label> {{ formatter("roleTypeEnu",user.roleId) }}
				</el-col>
			</el-row>
			<el-row :gutter="20">
				<el-col>
					<el-button class="buttons" type="primary">转入</el-button>
					<el-button class="buttons" type="primary">转出</el-button>
					<el-button class="buttons" type="primary">修改后台密码</el-button>
				</el-col>
			</el-row>
		</el-card>
		<br/>
		<!-- 代理/客户 -->
		<el-card class="index-card" v-if="customerType !== 'admin'">
			<el-row :gutter="20">
				<el-col :span="4" :xs="24">
					<label>姓名：</label> {{ user.name }}
				</el-col>
				<el-col :span="4" :xs="24">
					<label>类型：</label> {{ formatter("UserType",user.customerType) }}
				</el-col>
				<el-col :span="4" :xs="24">
					<label>电话：</label> {{ user.phoneNo }}
				</el-col>
			</el-row>
			<el-row v-if="customerType === 'agent'">
				<el-col>
					<el-badge :value="informations.noConfigCount" class="item"><el-button class="buttons" type="primary" @click.native="$router.push({path:'/account/costgroup'})">未配置佣金组</el-button></el-badge>&nbsp;&nbsp;
					<el-badge :value="informations.noReadNotifyCount" class="item"><el-button class="buttons" type="primary" @click.native="">未读消息</el-button></el-badge>
				</el-col>
			</el-row>
			<br/>
			<el-row :gutter="20">
				<el-col>
					<el-button class="buttons" type="primary" @click.native="$router.push({path:'/audit/change-bank-card-history'})">换绑银行卡</el-button>
					<el-button class="buttons" type="primary">申请交易账号</el-button>
					<el-button class="buttons" type="primary">修改后台密码</el-button>
				</el-col>
			</el-row>
		</el-card>
		<br/>
		<!-- 管理员 -->
		<el-card class="index-card" v-if="customerType === 'admin'">
			<ul class="pending-list">
				<li><el-badge :value="informations.auditAgentCount" class="item"><el-button type="primary" @click.native="$router.push({path:'/audit/agent'})">代理开户审核</el-button></el-badge></li>
				<li><el-badge :value="informations.auditCustomerCount" class="item"><el-button type="primary" @click.native="$router.push({path:'/audit/customer'})">客户开户审核</el-button></el-badge></li>
				<li><el-badge :value="informations.auditAccountApplyCount" class="item"><el-button type="primary" @click.native="">交易账号审核</el-button></el-badge></li>
				<li><el-badge :value="informations.auditSwitchBankNoCount" class="item"><el-button type="primary" @click.native="$router.push({path:'/audit/change-bank-card'})">换绑银行卡审核</el-button></el-badge></li>
				<li><el-badge :value="informations.account" class="item"><el-button type="primary" @click.native="">切换IB关系审核</el-button></el-badge></li>
				<li><el-badge :value="informations.auditDrawCount" class="item"><el-button type="primary" @click.native="">出金审核</el-button></el-badge></li>
			</ul>
		</el-card>
		<!-- 代理/客户 -->
		<el-card class="index-card" v-if="customerType !== 'admin'">
			<el-tabs v-model="activeName">
				<el-tab-pane :label="formatter('TradeAccountType',account.accountType) + ' ' + account.tradeAccountNo" :name="'account' + index" v-for="(account,index) in accounts" :key="index">
					<el-row :gutter="20" v-if="account.accountType === 1">
						<el-col :span="4" :xs="24">
							<label>账号：</label> {{ account.tradeAccountNo }}
						</el-col>
						<el-col :span="4" :xs="24">
							<label>类型：</label> {{ formatter('TradeAccountType',account.accountType) }}
						</el-col>
						<el-col :span="4" :xs="24">
							<label>跟单号：</label> {{ account.followOrderNo }}
						</el-col>
						<el-col :span="4" :xs="24">
							<label>交易状态：</label> {{ formatter('TradeStatus',account.tradeStatus) }}
						</el-col>
						<el-col :span="4" :xs="24">
							<label>预警线：</label> {{ account.warningLine }}
						</el-col>
						<el-col :span="4" :xs="24">
							<label>平仓线：</label> {{ account.forceLine }}
						</el-col>
						<el-col :span="4" :xs="24">
							<label>锁屏时间：</label> {{ account.lockScreenTime }} 分钟
						</el-col>
						<el-col :span="4" :xs="24">
							<label>可提现金额：</label> {{ account.lockScreenTime }}
						</el-col>
						<el-col :span="4" :xs="24">
							<label>余额：</label> {{ account.lockScreenTime }}
						</el-col>
						<el-col :span="4" :xs="24">
							<label>冻结金额：</label> {{ account.lockScreenTime }}
						</el-col>
						<el-col :span="4" :xs="24">
							<label>当日入金：</label> {{ account.lockScreenTime }}
						</el-col>
						<el-col :span="4" :xs="24">
							<label>总入金：</label> {{ account.lockScreenTime }}
						</el-col>
						<el-col :span="4" :xs="24">
							<label>当日出金：</label> {{ account.lockScreenTime }}
						</el-col>
						<el-col :span="4" :xs="24">
							<label>总出金：</label> {{ account.lockScreenTime }}
						</el-col>
					</el-row>
					<el-row :gutter="20" v-if="account.accountType === 1">&nbsp;&nbsp;
						<el-button class="buttons" type="primary">入金</el-button>
						<el-button class="buttons" type="primary">出金</el-button>
						<el-button class="buttons" type="primary">修改交易密码</el-button>
						<el-button class="buttons" type="primary">设置转账关系</el-button>
						<el-button class="buttons" type="primary">转账</el-button>
						<el-button class="buttons" type="primary">设置锁屏时间</el-button>
					</el-row>
					<el-row :gutter="20" v-if="account.accountType === 2">
						<el-col :span="4" :xs="24">
							<label>账号：</label> {{ account.tradeAccountNo }}
						</el-col>
						<el-col :span="4" :xs="24">
							<label>类型：</label> {{ formatter('TradeAccountType',account.accountType) }}
						</el-col>
						<el-col :span="4" :xs="24">
							<label>可提现金额：</label> {{ account.lockScreenTime }}
						</el-col>
						<el-col :span="4" :xs="24">
							<label>余额：</label> {{ account.lockScreenTime }}
						</el-col>
						<el-col :span="4" :xs="24">
							<label>当日出金：</label> {{ account.lockScreenTime }}
						</el-col>
						<el-col :span="4" :xs="24">
							<label>总出金：</label> {{ account.lockScreenTime }}
						</el-col>
					</el-row>
					<el-row :gutter="20" v-if="account.accountType === 2">&nbsp;&nbsp;
						<el-button class="buttons" type="primary">出金</el-button>
						<el-button class="buttons" type="primary">设置转账关系</el-button>
						<el-button class="buttons" type="primary">转账</el-button>
					</el-row>
				</el-tab-pane>
			</el-tabs>
		</el-card>
	</section>
</template>

<script type="text/javascript">
	import { accountQuest } from "../../api/api"
	import { formatters  } from "../../utils/utils"
	export default {
		data(){
			return {
				customerType: (()=>{
					switch(JSON.parse(localStorage.userInfo).customerType){
				        case 3: return "agent";break;
				        case 4: return "customer";break;
				        default: return "admin";
				    }
				})(),
				informations: {},
				user: {},
				showLoading: false,
				accounts: [],//账号
				activeName: 'account0'
			}
		},
		created(){
			this.getUserInformation();
		},
		methods:{
			formatter(type,value){
				return formatters(type,value)
			},
			getUserInformation(){
				this.showLoading = true;
				switch(this.customerType){
					case "admin": accountQuest.manageInformations().then(res => {
						this.informations = res.content;
						this.user = res.content.user;
						this.showLoading = false;
					}).catch(error => {
						console.error("获取用户信息失败！")
					});break;
					case "agent": accountQuest.agentInformations().then(res => {
						this.informations = res.content;
						this.user = res.content.user;
						this.showLoading = false;
					}).catch(error => {
						console.error("获取用户信息失败！")
					});break;
					case "customer": accountQuest.customerInformations().then(res => {
						this.informations = res.content;
						this.user = res.content.user;
						this.accounts = res.content.accounts;
						this.showLoading = false;
					}).catch(error => {
						console.error("获取用户信息失败！")
					});break;
				}
			}
		}
	}
</script>