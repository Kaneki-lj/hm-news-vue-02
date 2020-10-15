<template>
  <div>
    <!-- 头部 -->
    <hm-header>编辑资料</hm-header>
    <!-- 头像 -->
    <div class="avatar">
      <img :src="$axios.defaults.baseURL + info.head_img" alt="" />
      <van-uploader class="uploader" :after-read="afterRead" />
    </div>
    <!-- 列表 -->
    <van-cell-group>
      <van-cell
        title="昵称"
        :value="info.nickname"
        is-link
        @click="showNickname"
      />
      <van-cell title="密码" value="****" is-link />
      <van-cell
        title="性别"
        :value="info.gender === 1 ? '男' : '女'"
        is-link
        @click="showGender"
      />
    </van-cell-group>

    <!-- 修改昵称弹框 -->
    <van-dialog
      v-model="isShowNickname"
      title="修改昵称"
      show-cancel-button
      @confirm="confirmNickname"
    >
      <van-field v-model="nickname" />
    </van-dialog>

    <!-- 修改性别弹框 -->

    <van-dialog
      v-model="isShowGender"
      title="修改性别"
      show-cancel-button
      @confirm="confirmGender"
    >
      <van-radio-group v-model="gender">
        <van-cell-group>
          <van-cell title="男" clickable @click="gender = 1">
            <van-radio slot="right-icon" :name="1" />
          </van-cell>
          <van-cell title="女" clickable @click="gender = 0">
            <van-radio slot="right-icon" :name="0" />
          </van-cell>
        </van-cell-group>
      </van-radio-group>
    </van-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      info: {},
      isShowNickname: false,
      nickname: '',
      isShowGender: false,
      gender: '',
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    async getInfo() {
      const user_id = localStorage.getItem('user_id')
      let res = await this.$axios.get(`/user/${user_id}`)
      // console.log(res.data)
      if (res.data.statusCode === 200) {
        this.info = res.data.data
      }
    },
    showNickname() {
      this.isShowNickname = true
      this.nickname = this.info.nickname
    },
    confirmNickname() {
      // console.log(123)
      if (this.nickname === this.info.nickname) {
        this.$toast('亲 修改前后昵称不能一样喔')
        return
      }
      this.editUser({
        nickname: this.nickname,
      })
    },
    showGender() {
      this.isShowGender = true
      this.gender = this.info.gender
    },
    confirmGender() {
      // console.log(123)
      this.editUser({
        gender: this.gender,
      })
    },
    // 封装
    editUser(data) {
      let user_id = localStorage.getItem('user_id')
      this.$axios.post(`/user_update/${user_id}`, data).then(res => {
        // console.log(res.data)
        if (res.data.statusCode === 200) {
          this.getInfo()
          this.$toast.success(res.data.message)
        }
      })
    },
    async afterRead(data) {
      // console.log(data.file)
      // 使用formdata
      let formdata = new FormData()
      formdata.append('file', data.file)
      let res = await this.$axios.post('/upload', formdata)
      // console.log(res.data)
      if (res.data.statusCode === 200) {
        this.editUser({
          head_img: res.data.data.url,
        })
      }
    },
  },
}
</script>

<style lang="less" scoped>
.avatar {
  text-align: center;
  margin: 20px 0;
  position: relative;
  img {
    width: 70px;
    height: 70px;
    object-fit: cover;
    border-radius: 50%;
  }
  .uploader {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    opacity: 0;
  }
}
</style>
