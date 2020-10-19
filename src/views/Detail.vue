<template>
  <div class="detail">
    <!-- 头部 -->
    <div class="header">
      <div class="left" @click="$router.back()">
        <i class="iconfont iconjiantou2"></i>
      </div>
      <div class="center">
        <i class="iconfont iconnew"></i>
      </div>
      <div class="right">
        <div v-if="detail.has_follow" class="follow" @click="unfollow">
          已关注
        </div>
        <div v-else class="follow" @click="follow">关注</div>
      </div>
    </div>
    <!-- 内容部分 -->
    <div class="container">
      <div class="title line2">
        {{ detail.title }}
      </div>
      <div class="user">
        <span>{{ detail.user.nickname }}</span>
        <span>{{ detail.create_date | date }}</span>
      </div>
      <!-- 内容 -->
      <div
        v-if="detail.type == 1"
        class="content"
        v-html="detail.content"
      ></div>
      <video v-else :src="detail.content" controls></video>
      <!-- 点赞 -->
      <div class="bottom">
        <div class="like" @click="like" :class="{ active: detail.has_like }">
          <i class="iconfont icondianzan"></i>
          <i>{{ detail.like_length }}</i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      detail: {
        user: {},
      },
    }
  },
  created() {
    this.getDetail()
  },
  methods: {
    async getDetail() {
      let res = await this.$axios.get(`/post/${this.$route.params.id}`)
      if (res.data.statusCode === 200) {
        console.log('详情页', res.data.data)
        this.detail = res.data.data
      }
    },
    async unfollow() {
      let res = await this.$axios.get(`/user_unfollow/${this.detail.user.id}`)
      if (res.data.statusCode === 200) {
        this.$toast.success(res.data.message)
        this.getDetail()
      }
    },
    async follow() {
      // 判断token
      let token = localStorage.getItem('token')
      if (!token) {
        this.$toast('请先登录')
        this.$router.push({
          name: 'login',
          params: {
            back: true,
          },
        })
        return
      }
      let res = await this.$axios.get(`/user_follows/${this.detail.user.id}`)
      if (res.data.statusCode === 200) {
        this.$toast.success(res.data.message)
        this.getDetail()
      }
    },
    async like() {
      let token = localStorage.getItem('token')
      if (!token) {
        this.$toast('请先登录')
        this.$router.push({
          name: 'login',
          params: {
            back: true,
          },
        })
        return
      }
      let res = await this.$axios.get(`/post_like/${this.detail.id}`)
      if(res.data.statusCode === 200) {
        this.$toast.success(res.data.message)
        this.getDetail()
      }
    },
  },
}
</script>

<style lang="less" scoped>
.header {
  height: 40px;
  line-height: 40px;
  display: flex;
  border-bottom: 1px solid #ccc;
  padding: 0 20px;
  align-items: center;
  .left {
    width: 20px;
    // background: red;
  }
  .center {
    flex: 1;
    // background: pink;
    display: flex;
    align-items: center;
    .iconfont {
      font-size: 50px;
    }
  }
  .right {
    width: 60px;
    // padding: 0 10px;
    height: 20px;
    border: 1px solid #999;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
.container {
  padding: 0 20px;
  .user {
    color: #999;
    height: 40px;
    line-height: 40px;
    display: flex;
    div {
      margin-right: 10px;
    }
  }

  /deep/ img {
    width: 100%;
    margin-top: 10px;
  }
  video {
    width: 100%;
  }
  .title {
    font-weight: 700;
    font-size: 14px;
    padding: 20px 0;
  }
}
.bottom {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;
  .like {
    width: 50px;
    height: 30px;
    line-height: 30px;
    border: 1px solid #000;
    padding: 0 15px;
    border-radius: 15px;
    text-align: center;
    i {
      margin-left: 10px;
    }
    &.active {
      color: red;
      border: 1px solid red;
    }
  }
}
</style>
