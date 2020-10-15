<template>
  <div>
    <!-- 头部 -->
    <hm-header>个人中心</hm-header>
    <!-- 信息部分 -->
    <div class="info">
      <div class="left">
        <img :src="$axios.defaults.baseURL + info.head_img" alt="" />
      </div>
      <div class="center">
        <i v-if="info.gender === 1" class="iconfont iconxingbienan"></i>
        <i v-else class="iconfont iconxingbienv"></i>
        {{ info.nickname }}
        <div class="date">{{ info.create_date | date }}</div>
      </div>
    </div>
    <!-- 列表部分 -->
    <van-cell-group>
      <van-cell title="我的关注" is-link value="关注的用户" @click="$router.push('/my-follow')" />
      <van-cell title="我的跟帖" is-link value="跟帖/回复" @click="$router.push('/my-comment')" />
      <van-cell title="我是收藏" is-link value="文档/视频" @click="$router.push('/my-star')" />
      <van-cell title="设置" is-link @click="$router.push('/edit')" />
      <van-cell title="退出" @click="logout" is-link />
    </van-cell-group>
  </div>
</template>

<script>
export default {
  data() {
    return {
      info: {},
    }
  },
  async created() {
    let token = localStorage.getItem('token')
    let user_id = localStorage.getItem('user_id')

    let res = await this.$axios.get(`/user/${user_id}`)
    // console.log(res.data)
    const { statusCode, data } = res.data
    if (statusCode === 200) {
      this.info = data
    }
  },
  methods: {
    async logout() {
      try {
        await this.$dialog.confirm({
          title: '温馨提示',
          message: '您确定是要退出系统吗',
        })
        // 删除token 和 id
        localStorage.removeItem('token')
        localStorage.removeItem('user_id')

        // 提示信息
        this.$toast('退出成功')

        // 跳转login
        this.$router.push('/login')
      } catch (error) {
        this.$toast('取消操作')
      }
    },
  },
}
</script>

<style scoped lang="less">
.info {
  height: 130px;
  border-bottom: 2px solid #ccc;
  padding: 0 40px;
  display: flex;
  align-items: center;

  .left {
    img {
      width: 70px;
      height: 70px;
      border-radius: 50%;
      object-fit: cover;
    }
  }
  .center {
    flex: 1;
    height: 50px;
    line-height: 25px;
    padding-left: 20px;
  }
}
</style>
