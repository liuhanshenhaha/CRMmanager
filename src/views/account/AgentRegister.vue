<template>
	<section>
		<el-row>
			<el-col :span="18">
				<el-form label-position="right" label-width="80px" :model="registerForm" ref="registerForm" :rules="rules">
          <el-row :gutter="20">
            <el-col :span="12" :xs="24">
              <el-form-item label="姓名" prop="name">
                <el-input v-model="registerForm.name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :xs="24">
              <el-form-item label="电话" prop="phoneNo">
                <el-input v-model="registerForm.phoneNo"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12" :xs="24">
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="registerForm.email"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :xs="24">
              <el-form-item label="身份证号" prop="idCard">
                <el-input v-model="registerForm.idCard"></el-input>
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
                <el-input v-model="registerForm.bankCardNo"></el-input>
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
            <el-col :span="12">
              <el-form-item prop="idFrontPic">
                <el-upload action="./" :http-request="submit" :on-change="(file,fileList)=>uploadPic(file,fileList,'idFrontPic')" list-type="picture-card" :file-list="idFrontPicList" accept="jpg">
                  <el-button size="small" type="primary">上传身份证正面照片</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="idBackPic">
                <el-upload action="./" :http-request="submit" :on-change="(file,fileList)=>uploadPic(file,fileList,'idBackPic')" list-type="picture-card" :file-list="idBackPicList" accept="jpg">
                  <el-button size="small" type="primary">上传身份证背面照片</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item prop="bankPic">
                <el-upload action="./" :http-request="submit" :on-change="(file,fileList)=>uploadPic(file,fileList,'bankPic')" list-type="picture-card" :file-list="bankPicList" accept="jpg">
                  <el-button size="small" type="primary">上传银行卡照片</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="riskPic">
                <el-upload action="./" :http-request="submit" :on-change="(file,fileList)=>uploadPic(file,fileList,'riskPic')" list-type="picture-card" :file-list="riskPicList" accept="jpg">
                  <el-button size="small" type="primary">上传风险确认书照片</el-button>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12" :xs="24">
              <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="registerForm.password"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12" :xs="24">
              <el-form-item label="重复密码" prop="repeatPassword">
                <el-input type="password" v-model="registerForm.repeatPassword"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8" :offset="7">
              <el-form-item>
                <el-button type="primary" @click="register" :loading="loading">提交</el-button>
                <el-button @click="resetForm('registerForm')">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
			</el-col>
		</el-row>
	</section>
</template>

<script>
  import { getDictionary,accountQuest } from '../../api/api';
  export default {
    data() {
      let same = (rule,value,callback) => {
        if(value != this.registerForm.password){
          return callback(new Error("两次密码不一致！"));
        }
        callback();
      }
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
        riskPic: "",
        riskPicList: [],
        rules: {
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
          repeatPassword: [{required:true,message:"请填写密码"},{validator:same,trigger: "blur"}],
        },
        hasInvited: Boolean(window.location.href && window.location.href.indexOf("?") > 0),
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
        if(["jpg","jpeg","png"].indexOf(file.raw.type.split("/")[1]) < 0){
          this.$message.error("图片仅接受jpg/jpeg/png格式")
          fileList.splice(fileList.length - 1,1)
          this[type+'List'] = fileList;
        }else if(file.raw.size > 500000){
          this.$message.error("图片仅接受小于500kb大小")
          fileList.splice(fileList.length - 1,1)
          this[type+'List'] = fileList;
        }else{
          let r = new FileReader();  //本地预览
          r.onload = () => {
              // console.log(r.result)
              accountQuest.uploadPic({
                content: r.result.split("base64,")[1],
                ext: file.name.split(".")[file.name.split(".").length - 1]
              }).then(res => {
                this[type+'List'] = fileList.slice(-1)
                this[type] = res.content.filePath;
              }).catch(error => console.error("上传图片失败！"))
          }
          r.readAsDataURL(file.raw);
        }
        // console.log("change",file,fileList)
      },
      submit(file,fileList){
        // console.log("submit",file,fileList)
        console.log("上传图片ING...")
      },
      resetForm(formName){
        this.$refs[formName].resetFields();
        this.bankPicList = [];
        this.riskPicList = [];
        this.idFrontPicList = [];
        this.idBackPicList = [];
      },
      register(){
        this.$refs.registerForm.validate(valid => {
          if(valid){
            if(this.bankPic && this.idFrontPic && this.idBackPic && this.riskPic){
              this.loading = true;
              let submitData = {...this.registerForm};
              submitData.idCardFrontPicture = this.idFrontPic;
              submitData.idCardBackPicture = this.idBackPic;
              submitData.bankCardPicture = this.bankPic;
              submitData.agreeRiskPicture = this.riskPic;
              submitData.addressProvince = this.registerForm.provinceAndCity[0];
              submitData.addressCity = this.registerForm.provinceAndCity[1];
              submitData.province = this.registerForm.bankProvinceAndCity[0];
              submitData.city = this.registerForm.bankProvinceAndCity[1];
              accountQuest.agentRegister(submitData).then(res => {
                this.loading = false;
                this.resetForm('registerForm');
              }).catch(error => {console.error("客户开户失败！");this.loading = false;})
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
                if(!this.riskPic){
                  temp.push("风险确认书");
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