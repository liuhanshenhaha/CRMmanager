<template>
    <section>
    	<vue-q-art :config="config" :downloadButton="downloadButton"></vue-q-art>
	    <div>
	    	<el-form label-position="right" label-width="80px" :model="referral">
	    		<el-row :gutter="20">
	    			<el-col :span="12" :x="24">
			            <el-form-item label="推广链接">
							<el-input v-model="referral.url" disabled></el-input>
			            </el-form-item>
		            </el-col>
	    			<el-col :span="12" :x="24">
						<el-popover placement="top-start" width="100" trigger="click" content="复制成功">
    						<el-button slot="reference" v-clipboard:copy="referral.url">复制</el-button>
						</el-popover>
	    			</el-col>
		        </el-row>
	    		<el-row :gutter="20">
	    			<el-col :span="12" :x="24">
			            <el-form-item label="邀请码">
							<el-input v-model="referral.inviteCode" disabled></el-input>
			            </el-form-item>
		            </el-col>
	    			<el-col :span="12" :x="24">
						<el-popover placement="top-start" width="100" trigger="click" content="复制成功">
    						<el-button slot="reference" v-clipboard:copy="referral.inviteCode">复制</el-button>
						</el-popover>
	    			</el-col>
		        </el-row>
	        </el-form>
	    </div>
    </section>
</template>

<script>
	import VueQArt from 'vue-qart'
	import {getReferralLink} from '../api/api';
	export default {
		data(){
			return {
				referral:{
					url: "",
					inviteCode: ""
				},
				config: {
				   value: '',
				   imagePath: '/static/1.png',
				   filter: 'color'
				},
				downloadButton: true
			}
		},
		components: {VueQArt},
		created(){
			getReferralLink({}).then(res => {
				this.referral = {
					url: res.content.url,
					inviteCode: res.content.inviteCode
				}
				this.config.value = res.content.url
			})
		},
	}
</script>