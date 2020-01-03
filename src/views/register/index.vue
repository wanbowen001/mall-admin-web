<template>
  <div>
    <el-card class="login-form-layout">
      <el-form autoComplete="on"
               :model="registerForm"
               :rules="registerRules" 
               ref="registerForm"
               label-position="left">
        <div style="text-align: center">
          <svg-icon icon-class="login-mall" style="width: 56px;height: 56px;color: #409EFF"></svg-icon>
        </div>
        <h2 class="login-title color-main">Register·注册</h2>
        <el-form-item prop="username">
          <el-input name="username"
                    type="text"
                    v-model="registerForm.username"
                    autoComplete="on"
                    placeholder="请输入用户名">
          <span slot="prefix">
            <svg-icon icon-class="user" class="color-main"></svg-icon>
          </span>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input name="password"
                    :type="pwdType"
                    v-model="registerForm.password"
                    autoComplete="on"
                    placeholder="请输入密码">
          <span slot="prefix">
            <svg-icon icon-class="password" class="color-main"></svg-icon>
          </span>
            <span slot="suffix" @click="showPwd">
            <svg-icon icon-class="eye" class="color-main"></svg-icon>
          </span>
          </el-input>
        </el-form-item>
        <el-form-item prop="checkPassword">
          <el-input name="checkPassword"
                    :type="pwdType"
                    @keyup.enter.native="handleRegister"
                    v-model="registerForm.checkPassword"
                    autoComplete="on"
                    placeholder="确认密码">
          <span slot="prefix">
            <svg-icon icon-class="password" class="color-main"></svg-icon>
          </span>
            <span slot="suffix" @click="showPwd">
            <svg-icon icon-class="eye" class="color-main"></svg-icon>
          </span>
          </el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 60px;text-align: center">
          <el-button style="width: 45%" type="primary" :loading="loading" @click.native.prevent="handleRegister">
            注册
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <img :src="login_center_bg" class="login-center-layout">
    <el-dialog
      title="注册提示"
      :visible.sync="dialogVisible"
      :show-close="false"
      :center="true"
      width="30%">
      <div style="text-align: center">
        {{registerRes}}
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="dialogConfirm">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {isvalidUsername} from '@/utils/validate';
  import {setSupport,getSupport,setCookie,getCookie} from '@/utils/support';
  import login_center_bg from '@/assets/images/login_center_bg.png'

  export default {
    name: 'login',
    data() {
      const validateUsername = (rule, value, callback) => {
        if (!value) {
          callback(new Error('用户名不能为空'))
        } else {
          callback()
        }
      };
      const validatePass = (rule, value, callback) => {
        if (value.length < 3) {
          callback(new Error('密码不能小于3位'))
        } else {
          callback()
        }
      };
      const validateCheckPass = (rule, value, callback) => {
        if (value != this.registerForm.password) {
          callback(new Error('密码不一致'))
        } else {
          callback()
        }
      };
      return {
        registerRes: '',
        registerForm: {
          username: '',
          password: '',
          checkPassword: '',
          icon: '',
          email: '',
          nickName: '',
          note: ''
        },
        registerRules: {
          username: [{required: true, trigger: 'blur', validator: validateUsername}],
          password: [{required: true, trigger: 'blur', validator: validatePass}],
          checkPassword: [{required: true, trigger: 'blur', validator: validateCheckPass}],
        },
        loading: false,
        pwdType: 'password',
        login_center_bg,
        dialogVisible:false,
        supportDialogVisible:false
      }
    },
    created() {
      this.registerForm.username = getCookie("username");
    //   this.registerForm.password = getCookie("password");
    //   if(this.registerForm.username === undefined||this.registerForm.username==null||this.registerForm.username===''){
    //     this.registerForm.username = 'admin';
    //   }
    //   if(this.registerForm.password === undefined||this.registerForm.password==null){
    //     this.registerForm.password = '';
    //   }
    },
    methods: {
      showPwd() {
        if (this.pwdType === 'password') {
          this.pwdType = ''
        } else {
          this.pwdType = 'password'
        }
      },
        
      // 注册
      handleRegister () {
        
        this.$refs.registerForm.validate(valid => {
          if (valid) {
            // debugger
            this.loading = true;
            this.$store.dispatch('Register', this.registerForm).then((response) => {
                // debugger
                this.loading = false;
                console.log("response>>>", response);
                if (response) {
                    setCookie("username",this.registerForm.username,15);
                    setCookie("password",this.registerForm.password,15);
                    this.registerRes = '注册成功';
                } else {
                    this.registerRes = '账号已存在';
                }
                this.loading = false;
            }).catch((error) => {
              alert(error)
            })
          } else {
            console.log('参数验证不合法！');
            return false
          }
        })
        this.dialogVisible =true;
      },

      handleTry(){
        this.dialogVisible =true;
      },
      dialogConfirm(){
        this.dialogVisible =false;
        if (this.registerRes === '注册成功') {
            this.$router.push({path:'/login'})
            setSupport(true);
        }
      },
      dialogCancel(){
        this.dialogVisible = false;
        setSupport(false);
      }
    }
  }
</script>

<style scoped>
  .login-form-layout {
    position: absolute;
    left: 0;
    right: 0;
    width: 360px;
    margin: 140px auto;
    border-top: 10px solid #409EFF;
  }

  .login-title {
    text-align: center;
  }

  .login-center-layout {
    background: #409EFF;
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    margin-top: 200px;
  }
</style>
