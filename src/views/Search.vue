<template>
  <div class="search">
    <!-- 头部 -->
    <div class="header">
      <div class="left" @click="$router.back()">
        <i class="iconfont iconjiantou2"></i>
      </div>
      <div class="center">
        <i class="iconfont iconsearch"></i>
        <input
          type="text"
          placeholder="请输入搜索内容"
          v-model="keyword"
          @keyup.enter="search"
          @input="search_recommend"
        />
      </div>
      <div class="right" @click="search">
        搜索
      </div>
    </div>
    <!-- 搜索推荐 -->
    <div class="recommend" v-if="recommendList.length">
      <div v-for="item in recommendList" :key="item.id">{{ item.title }}</div>
    </div>
    <!-- 列表 -->
    <div class="content" v-else-if="postList.length">
      <hm-post v-for="post in postList" :post="post" :key="post.id"></hm-post>
    </div>
    <!-- 历史记录 热门搜索 -->
    <div class="history" v-else>
      <!-- 历史记录 -->
      <h3>历史记录</h3>
      <div class="list">
        <div
          class="item"
          v-for="item in historyList"
          :key="item"
          @click="click_history(item)"
        >
          {{ item }}
        </div>
      </div>

      <!-- 热门搜索 -->
      <h3>热门搜索</h3>
      <div class="list">
        <div
          class="item"
          v-for="hot in hotList"
          :key="hot"
          @click="click_history(hot)"
        >
          {{ hot }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data() {
    return {
      keyword: '',
      postList: [], // 文章搜索列表
      historyList: [], // 历史记录
      hotList: ['关晓彤', '情火', '1', '新闻'],
      recommendList: [],
    }
  },
  created() {
    // 页面一进来 查看本地是否有数据
    let historyList = JSON.parse(localStorage.getItem('history_list'))
    if (historyList) {
      this.historyList = historyList
    }
    // 防抖函数
    this.search_recommend = _.debounce(this.search_recommend, 500)
  },
  watch: {
    // 监听 keyword变化
    keyword(newVal) {
      if (!newVal) {
        this.postList = []
        this.recommendList = []
      }
    },
  },
  methods: {
    async search() {
      if (!this.keyword.trim()) return

      // 把关键字添加到历史记录中
      this.historyList.unshift(this.keyword)
      // 去重
      this.historyList = [...new Set(this.historyList)]
      // 保存到本地
      localStorage.setItem('history_list', JSON.stringify(this.historyList))

      let res = await this.$axios.get('/post_search', {
        params: {
          keyword: this.keyword,
        },
      })
      console.log('文章搜索', res.data.data)
      if (res.data.statusCode === 200) {
        this.postList = res.data.data
      }
    },
    // 历史记录
    click_history(item) {
      this.keyword = item
      this.search()
    },
    // 搜索推荐
    async search_recommend() {
      if (!this.keyword.trim()) return
      let res = await this.$axios.get('/post_search_recommend', {
        params: {
          keyword: this.keyword,
        },
      })
      // console.log('搜索推荐', res.data.data)
      if (res.data.statusCode === 200) {
        this.recommendList = res.data.data
      }
    },
  },
}
</script>

<style lang="less" scoped>
.header {
  height: 40px;
  line-height: 40px;
  background: #eee;
  border-bottom: 1px solid #ccc;
  display: flex;
  padding: 0 10px;
  .left,
  .right {
    width: 50px;
  }
  .right {
    text-align: center;
  }
  .center {
    flex: 1;
    // background: red;
    position: relative;
    input {
      height: 30px;
      width: 100%;
      border: none;
      outline: none;
      border: 1px solid #ccc;
      border-radius: 15px;
      text-indent: 30px;
    }
    .iconfont {
      position: absolute;
      left: 10px;
      top: 0px;
    }
  }
}

.history {
  padding: 20px;
  h3 {
    height: 30px;
    line-height: 30px;
  }
  .list {
    display: flex;
    flex-wrap: wrap;
    .item {
      height: 30px;
      // width: 40px;
      padding: 0 10px;
      background: #ddd;
      text-align: center;
      line-height: 30px;
      margin-bottom: 10px;
      margin-right: 10px;
      color: #000;
    }
  }
}
.recommend {
  padding: 0 20px;
  div {
    height: 30px;
    line-height: 30px;
    border-bottom: 1px solid #ccc;
  }
}
</style>
