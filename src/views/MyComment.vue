<template>
  <div class="my-comment">
    <hm-header>我的跟帖</hm-header>
    <!-- 列表页 -->
    <van-list
      class="list"
      v-model="loading"
      :finished="finished"
      @load="onLoad"
      :immediate-check="false"
      offset="50"
      finished-text="我是有底线的"
    >
      <div class="item" v-for="item in list" :key="item.id">
        <div class="date">
          {{ item.create_date | date('YYYY-MM-DD hh:mm') }}
        </div>
        <div class="parent" v-if="item.parent">
          <div class="parent-nickname">
            回复： {{ item.parent.user.nickname }}
          </div>
          <div class="parent-content">
            {{ item.parent.content }}
          </div>
        </div>
        <div class="content">{{ item.content }}</div>
        <div class="post">
          <div class="post-title line1">{{ item.post.title }}</div>
          <i class="iconfont iconjiantou1"></i>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [],
      // 当前页数
      pageIndex: 1,
      // 数据条数
      pageSize: 5,
      loading: false,
      finished: false,
    }
  },
  created() {
    this.getCommentList()
  },
  methods: {
    async getCommentList() {
      let res = await this.$axios.get('/user_comments', {
        params: {
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
        },
      })
      if (res.data.statusCode === 200) {
        // this.list = res.data.data
        this.list = [...this.list,...res.data.data]
        this.loading = false
        if(res.data.data.length < this.pageSize) {
          this.finished = true
        }
      }
      // console.log(this.list)
    },
    onLoad() {
      this.pageIndex++
      this.getCommentList()
    },
  },
}
</script>

<style lang="less" scoped>
.list {
  .item {
    border-bottom: 1px solid #ccc;
    padding: 10px;
    .date {
      color: #999;
      height: 30px;
      line-height: 30px;
    }
    .parent {
      padding: 10px;
      background: #eee;
      color: #666;
      line-height: 20px;
      .parent-nickname {
        height: 25px;
        line-height: 25px;
      }
    }
    .content {
      font-size: 14px;
      padding: 10px 0;
    }
    .post {
      display: flex;
      color: #999;
      margin-top: 5px;
      .post-title {
        flex: 1;
      }
      .iconfont {
        width: 50px;
        text-align: right;
      }
    }
  }
}
</style>
