<template>
  <div class="home">
    <!-- 头部 -->
    <div class="header">
      <div class="left">
        <i class="iconfont iconnew"></i>
      </div>
      <div class="center">
        <i class="iconfont iconsearch"></i>
        <span>搜索新闻</span>
      </div>
      <div class="right" @click="$router.push('/login')">
        <i class="iconfont iconwode"></i>
      </div>
    </div>
    <!-- tab栏 -->
    <van-tabs v-model="active">
      <van-tab :title="tab.name" v-for="tab in tabList" :key="tab.id">
        <van-pull-refresh
          v-model="isLoading"
          @refresh="onRefresh"
          success-text="刷新成功"
        >
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <hm-post
              :post="post"
              v-for="(post, index) in postList"
              :key="index"
            ></hm-post>
          </van-list>
        </van-pull-refresh>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      active: 1,
      tabList: [],
      postList: [],
      pageIndex: 1,
      pageSize: 5,
      loading: false,
      finished: false,
      isLoading: false,
    }
  },
  watch: {
    // 监听active变化 只要active发送改变 就说明切换 tab栏
    active(val) {
      // 1 改变数据
      this.pageIndex = 1
      this.postList = []
      // 2 修改加载问题
      this.loading = true
      this.finished = false
      this.getPostList(this.tabList[val].id)
    },
  },
  created() {
    this.getTabList()
  },
  methods: {
    async getTabList() {
      let res = await this.$axios.get('category')
      if (res.data.statusCode === 200) {
        this.tabList = res.data.data
        this.getPostList(this.tabList[this.active].id)
      }
    },
    async getPostList(id) {
      let res = await this.$axios.get('/post', {
        params: {
          category: id,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize,
        },
      })
      console.log('数据列表', res.data.data)
      if (res.data.statusCode === 200) {
        // this.postList = res.data.data
        this.postList = [...this.postList, ...res.data.data]
        this.loading = false
        this.isLoading = false
        if (res.data.data.length < this.pageSize) {
          this.finished = true
        }
      }
    },
    onLoad() {
      this.pageIndex++
      this.getPostList(this.tabList[this.active].id)
    },
    onRefresh() {
      setTimeout(() => {
        this.pageIndex = 1
        this.postList = []
        this.loading = true
        this.finished = false
        this.getPostList(this.tabList[this.active].id)
      }, 2000)
    },
  },
}
</script>

<style scoped lang="less">
/deep/ .van-tabs__nav {
  background-color: #eee;
}
.header {
  height: 40px;
  background-color: #f00;
  color: #fff;

  display: flex;
  align-items: center;
  .left,
  .right {
    width: 60px;
    height: 40px;
    line-height: 40px;
    text-align: center;
  }
  .iconnew {
    font-size: 50px;
  }
  .iconwode {
    font-size: 24px;
  }

  .center {
    flex: 1;
    height: 30px;
    line-height: 27px;
    text-align: center;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 15px;
    span {
      margin-left: 5px;
    }
  }
}
</style>
