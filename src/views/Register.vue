<template>
  <div>
    <!-- 头部 -->
    <hm-header>注册</hm-header>
    <!-- logo部分 -->
    <hm-logo></hm-logo>
    <!-- 输入框 -->
    <van-field
      v-model="username"
      clearable
      required
      label="用户名"
      placeholder="请输入用户名"
      :error-message="usernameErrMsg"
      @input="checkUsername"
      @clear="clearUsername"
    />
    <van-field
      v-model="nickname"
      clearable
      required
      label="昵称"
      placeholder="请输入昵称"
      :error-message="nicknameErrMsg"
      @input="checkNickname"
      @clear="clearNickname"
    />
    <van-field
      v-model="password"
      required
      clearable
      label="密码"
      placeholder="请输入密码"
      :error-message="passwordErrMsg"
      @input="checkPassword"
      @clear="clearPassword"
    />
    <!-- 按钮 -->
    <hm-button @click.native="startRegister">注册</hm-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 用户名
      username: '',
      usernameErrMsg: '',
      // 昵称
      nickname: '',
      nicknameErrMsg: '',
      // 密码
      password: '',
      passwordErrMsg: '',
    }
  },
  methods: {
    // 校验用户名
    checkUsername() {
      const reg = /^1\d{3,5}$/
      if (reg.test(this.username)) {
        this.usernameErrMsg = ''
      } else {
        this.usernameErrMsg = '用户名格式错误'
      }
    },
    clearUsername() {
      this.usernameErrMsg = ''
    },
    // 校验昵称
    checkNickname() {
      const reg = /^[\u4e00-\u9fa5]{3,7}$/
      if (reg.test(this.nickname)) {
        this.nicknameErrMsg = ''
      } else {
        this.nicknameErrMsg = '昵称格式错误'
      }
    },
    clearNickname() {
      this.nicknameErrMsg = ''
    },
    // 校验密码
    checkPassword() {
      const reg = /^\d{3,12}$/
      if (reg.test(this.password)) {
        this.passwordErrMsg = ''
      } else {
        this.passwordErrMsg = '密码格式错误'
      }
    },
    clearPassword() {
      this.passwordErrMsg = ''
    },
    // 注册按钮功能
    async startRegister() {
      if (
        this.username !== '' &&
        this.nickname !== '' &&
        this.password !== '' &&
        this.usernameErrMsg == '' &&
        this.nicknameErrMsg == '' &&
        this.passwordErrMsg == ''
      ) {
        // console.log('注册成功')
        let res = await this.$axios.post('/register', {
          username: this.username,
          nickname: this.nickname,
          password: this.password,
        })

        // console.log(res.data)
        const { statusCode, message } = res.data
        if (statusCode === 200) {
          this.$toast.success(message)
          // 跳转 /user
          this.$router.push({
            name: 'login',
            params: {
              username: this.username,
              password: this.password,
            },
          })
        } else {
          this.$toast.fail(message)
        }
      } else {
        console.log('注册失败')
      }
    },
  },
}
</script>

<style></style>
