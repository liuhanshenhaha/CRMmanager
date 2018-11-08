<template>
  <el-row class="container">
    <el-col :span="24" class="header">
      <el-col :span="4" class="logo logo-width">
        <h1 class="logo-text">{{sysName}}</h1>
      </el-col>
      <el-col :span="20">
        <p class="top-title" style="text-align:left;padding-left:1em;">客户开户</p>
      </el-col>
    </el-col>
    <el-col :span="24">
      <el-card class="register-card">
        <h3 style="margin-top:0;">客户开户</h3>
        <el-form label-position="right" label-width="80px" :model="registerForm" ref="registerForm" :rules="rules">
          <el-row :gutter="20">
            <el-col :span="12" :xs="24">
              <el-form-item label="账号" prop="userAccountNo">
                <el-input v-model="registerForm.userAccountNo"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :xs="24">
              <el-form-item label="姓名" prop="name">
                <el-input v-model="registerForm.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :xs="24">
              <el-form-item label="身份证号" prop="idCard">
                <el-input v-model="registerForm.idCard"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :xs="24">
              <el-form-item label="电话" prop="phoneNo">
                <el-input v-model="registerForm.phoneNo"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :xs="24">
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="registerForm.email"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :xs="24">
              <el-form-item label="银行" prop="bankCode">
                <el-select v-model.number="registerForm.bankCode" placeholder="请选择银行">
                  <el-option v-for="item in bankOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" :xs="24">
              <el-form-item label="支行" prop="bankBranch">
                <el-input v-model="registerForm.bankBranch"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :xs="24">
              <el-form-item label="银行卡" prop="bankCardNo">
                <el-input v-model="registerForm.bankCardNo"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :xs="24">
              <el-form-item label="密码" prop="password">
                <el-input v-model="registerForm.password"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :xs="24">
              <el-form-item label="省/市" prop="provinceAndCity">
                <el-cascader placeholder="省/市" :options="provinceOptions" v-model="registerForm.provinceAndCity" filterable></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="上传银行卡照片" prop="bankPic">
                <el-upload action="./" :http-request="submit" :on-change="(file,fileList)=>uploadPic(file,fileList,'bankPic')" list-type="picture-card" :file-list="bankPicList">
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="上传身份证正面照片" prop="idFrontPic">
                <el-upload action="./" :http-request="submit" :on-change="(file,fileList)=>uploadPic(file,fileList,'idFrontPic')" list-type="picture-card" :file-list="idFrontPicList">
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item label="上传身份证背面照片" prop="idBackPic">
                <el-upload action="./" :http-request="submit" :on-change="(file,fileList)=>uploadPic(file,fileList,'idBackPic')" list-type="picture-card" :file-list="idBackPicList">
                  <el-button size="small" type="primary">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="12" :xs="24">
              <el-form-item label="邀请码" prop="inviteCode">
                <el-input v-model="registerForm.inviteCode" :disabled="hasInvited"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item>
                <a href="./static/TradeGuidelines.pdf" class="agreements">《交易须知》</a> | <a href="./static/RiskStatement.pdf" class="agreements">《期货交易风险揭示书》</a> | <a href="./static/CooperativeAgreements.pdf" class="agreements">《投资合作协议书》</a>
                <el-checkbox v-model="readFlag">我声明：我已阅读并完全理解，接受以及认同以上全部文件。</el-checkbox>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item>
                <el-button type="primary" @click="register" :loading="loading">立即创建</el-button>
                <el-button @click="resetForm('registerForm')">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
  import { getDictionary,accountQuest } from '../api/api';
  export default {
    data() {
      return {
        loading: false,
        dictionary: {},
        sysName:'LEBUT+',
        registerForm: {
          inviteCode: Boolean(window.location.href.split("?")[1]) ? window.location.href.split("?")[1] : ""
        },
        provinceOptions: [],
        bankOptions: [],
        bankPicList: [],
        bankPic: "",
        idFrontPicList: [],
        idFrontPic: "",
        idBackPicList: [],
        idBackPic: "",
        rules: {
          userAccountNo: [{required:true,message:"请填写账号"}],
          name: [{required:true,message:"请填写姓名"}],
          idCard: [{required:true,message:"请填写身份证号"}],
          phoneNo: [{required:true,message:"请填写手机号"}],
          email: [{required:true,message:"请填写邮箱"}],
          bankCode: [{required:true,message:"请填写银行"}],
          bankBranch: [{required:true,message:"请填写银行支行"}],
          bankCardNo: [{required:true,message:"请填写银行卡号"}],
          provinceAndCity: [{required:true,message:"请选择省/市"}],
          inviteCode: [{required:true,message:"请填写邀请码"}],
          password: [{required:true,message:"请填写密码"}],
        },
        hasInvited: Boolean(window.location.href && window.location.href !== "?"),
        readFlag: false
      }
    },
    created(){
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
    methods: {
      uploadPic(file,fileList,type){
        this[type+'List'] = fileList.slice(-1)
        let r = new FileReader();  //本地预览
        r.onload = () => {
            // console.log(r.result)
            accountQuest.uploadPic({
              content: r.result.split("base64,")[1],
              ext: file.name.split(".")[file.name.split(".").length - 1]
            }).then(res => {
              this[type] = res.content.filePath;
            }).catch(error => console.error("上传图片失败！"))
        }
        r.readAsDataURL(file.raw);
      },
      submit(file){
        console.log("上传图片ING...")
      },
      resetForm(formName){
        this.$refs[formName].resetFields();
        this.bankPicList = [];
        this.idFrontPicList = [];
        this.idBackPicList = [];
      },
      register(){
        this.$refs.registerForm.validate(valid => {
          if(valid){
            if(this.bankPic && this.idFrontPic && this.idBackPic){
              if(this.readFlag){
                this.loading = true;
                let submitData = {...this.registerForm};
                submitData.idCardFrontPicture = this.idFrontPic;
                submitData.idCardBackPicture = this.idBackPic;
                submitData.bankCardPicture = this.bankPic;
                submitData.province = this.registerForm.provinceAndCity[0];
                submitData.city = this.registerForm.provinceAndCity[1];
                accountQuest.customerRegister(submitData).then(res => {
                  this.loading = false;
                }).catch(error => {console.error("客户开户失败！");this.loading = false;})
              }else{
                this.$message.error("请勾选阅读并同意选项！")
              }
            }else{
              let text = (()=>{
                let temp = [];
                if(!this.bankPic){
                  temp.push("银行卡");
                }
                if(!this.idFrontPic){
                  temp.push("身份证正面");
                }
                if(!this.idBackPic){
                  temp.push("身份证背面");
                }
                return temp.join("、")
              })()
              this.$message.error("请上传" + text + "照片！")
            }
          }
        })
      }
    }
  }

</script>

<style scoped lang="scss">
  @import '~scss_vars';
  
  .container {
    position: absolute;
    top: 0px;
    bottom: 0px;
    width: 100%;
    .header {
      height: 60px;
      line-height: 60px;
      background: $color-primary;
      color:#fff;
      .logo {
        //width:230px;
        height:60px;
        font-size: 22px;
        padding-left:20px;
        padding-right:20px;
        border-color: rgba(238,241,146,0.3);
        border-right-width: 1px;
        border-right-style: solid;
        img {
          width: 40px;
          float: left;
          margin: 10px 10px 10px 18px;
        }
        .txt {
          color:#fff;
        }
      }
      .logo-width{
        width:230px;
      }
    }
    .agreements{
      text-decoration:none;
      color:#20a0ff;
      &:hover{
        text-decoration:underline;
      }
    }
  }
</style>