<template>
  <el-form :model="loginForm" :rules="rules" status-icon ref="loginForm" label-position="left" label-width="0px" class="login-container">
    <h3 class="title">系统登录</h3>
    <el-form-item>
      <el-input type="text" v-model="loginForm.account" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item>
      <el-input type="password" v-model="loginForm.checkPass" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item :error="loginForm.captchaError">
      <el-input type="text" v-model="loginForm.captcha" auto-complete="off" placeholder="验证码" class="custome-captcha">
        <template slot="prepend"><img src="http://97498cc2.ngrok.io/xtjichu/login/getAuthImage?deviceId=gyk" alt=""></template>
      </el-input>
    </el-form-item>
    <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox>
    <el-form-item style="width:100%;">
      <el-button type="primary" style="width:100%;" @click.native.prevent="loginSubmit" :loading="logining">登录</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import { requestLogin } from '../api/api';
  import { setCookie } from '../utils/utils';
  //import NProgress from 'nprogress'
  export default {
    data() {
      return {
        logining: false,
        loginForm: {
          account: 'admin',
          accountError: '',
          checkPass: '8888',
          checkPassError: '',
          captcha: '',
          captchaError: '',
        },
        rules: {
          account: [
            { required: true, message: '请输入账号', trigger: 'blur' },
          ],
          checkPass: [
            { required: true, message: '请输入密码', trigger: 'blur' },
          ],
          captcha: [
            { required: true, message: '请输入验证码', trigger: 'blur' },
          ]
        },
        checked: true
      };
    },
    methods: {
      loginSubmit(ev) {
        var _this = this;
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            //_this.$router.replace('/table');
            this.logining = true;
            //NProgress.start();
            var loginParams = {
              "source":"backend",
              "content":{
                "userAccountNo":this.loginForm.account, 
                "userPassword":this.loginForm.checkPass,
                "code":this.loginForm.captcha,
                "deviceId":"gyk"
              }
            };
            requestLogin(loginParams).then(res => {
              this.logining = false;
              switch(res.code){
                case "000000": {
                  setCookie('token',res.token,1)
                  this.$router.push({ path: '/form' });
                }break;
                case "100001": this.loginForm.captchaError = res.msg;break;
              }
            }).catch(error => console.log(error));
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      }
    }
  }

</script>

<style lang="scss" scoped>
  .login-container {
    /*box-shadow: 0 0px 8px 0 rgba(0, 0, 0, 0.06), 0 1px 0px 0 rgba(0, 0, 0, 0.02);*/
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 180px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 40px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>