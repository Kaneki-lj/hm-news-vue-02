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
    <div ref="box"></div>
    <!-- 评论部分 -->
    <div class="comments">
      <hm-comment
        v-for="comment in commentsList"
        :key="comment.id"
        :comment="comment"
      ></hm-comment>
    </div>
    <!-- 底部 -->
    <div class="footer">
      <!-- 输入框 -->
      <div class="input" v-if="!isShow">
        <input type="text" placeholder="写跟帖" @focus="handleFocus" />
        <van-icon name="chat-o" :badge="detail.comment_length" />
        <van-icon
          name="star-o"
          @click="star"
          :class="{ active: detail.has_star }"
        />
      </div>
      <!-- 文本框 -->
      <div class="textarea" v-else>
        <textarea
          :placeholder="replyName ? '回复:' + replyName : '请输入内容'"
          ref="textarea"
          @blur="handleBlur"
          v-model="content"
        ></textarea>
        <div class="send" @touchstart="send">发送</div>
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
      commentsList: [],
      isShow: false,
      replyId: '',
      replyName: '',
      content: '',
    }
  },
  created() {
    this.getDetail()
    this.getCommentsList()
    // 注册事件 接收数据
    this.$bus.$on('reply', async (replyId, replyName) => {
      // console.log('datail --走了')
      // 保存传的数据
      this.replyId = replyId
      this.replyName = replyName

      // 文本域显示 聚焦
      this.isShow = true
      await this.$nextTick()
      this.$refs.textarea && this.$refs.textarea.focus()
    })
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
      if (res.data.statusCode === 200) {
        this.$toast.success(res.data.message)
        this.getDetail()
      }
    },
    async getCommentsList() {
      let res = await this.$axios.get(`/post_comment/${this.$route.params.id}`)
      if (res.data.statusCode === 200) {
        console.log('评论列表', res.data.data)
        this.commentsList = res.data.data
      }
    },
    // 给input注册聚焦事件
    async handleFocus() {
      this.isShow = true
      // 聚焦
      await this.$nextTick()
      this.$refs.textarea.focus()
    },
    // 给 textarea 注册失焦事件
    handleBlur() {
      // 文本域隐藏
      this.isShow = false
      // 根据内容判断 没有内容 失焦就清空
      if (!this.content) {
        this.replyId = ''
        this.replyName = ''
      }
    },
    // 发表评论回复
    async send() {
      // console.log('点击发送')
      if (this.content === '') {
        this.$toast('回复内容不能为空')
        return
      }
      let res = await this.$axios.post(
        `/post_comment/${this.$route.params.id}`,
        {
          content: this.content,
          parent_id: this.replyId,
        }
      )

      console.log('评论列表', res.data)
      if (res.data.statusCode === 200) {
        this.$toast.success('评论成功')
        // 重新请求评论
        this.getCommentsList()
        // 清空
        this.content = ''
        this.replyId = ''
        this.replyName = ''
        // 隐藏文本域
        this.isShow = false
        // 滚动到某位置
        this.$refs.box.scrollIntoView()
      }
    },
    // 收藏
    async star() {
      let res = await this.$axios.get(`/post_star/${this.$route.params.id}`)
      if (res.data.statusCode === 200) {
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
  border-bottom: 3px solid #ccc;
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
  margin-bottom: 20px;
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
.comments {
  padding-bottom: 40px;
}
.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  background: #fff;
  .input {
    border-top: 1px solid #000;
    height: 50px;
    background: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    input {
      height: 30px;
      width: 180px;
      background: #ddd;
      padding-left: 10px;
      // outline: none;
      border: none;
      border-radius: 15px;
    }
    .van-icon-chat-o {
      font-size: 20px;
    }
    .van-icon-star-o {
      font-size: 20px;
    }
  }
  .textarea {
    height: 100px;
    // background: pink;
    border-top: 1px solid #000;
    display: flex;
    padding: 20px;
    align-items: flex-end;
    textarea {
      background: #eee;
      border-radius: 5px;
      padding: 5px 10px;
      flex: 1;
      margin-right: 20px;
      height: 100%;
      resize: none;
    }
    .send {
      width: 50px;
      height: 30px;
      line-height: 30px;
      border-radius: 15px;
      background: red;
      color: #fff;
      text-align: center;
    }
  }
}
.active {
  color: #f00;
}
</style>
