<template>
  <div>
    <!-- 递归组件 -->
    <hm-floor :parent="parent.parent" v-if="parent.parent" :count="count-1" ></hm-floor>
    <div class="hm-floor" :class="{ top: !parent.parent }">
      <div class="header">
        <div class="left">{{ count }}楼 {{ parent.user.nickname }}</div>
        <div class="center">
          {{ parent.create_date | date('YYYY-MM-DD hh:mm:ss') }}
        </div>
        <div class="right" @click="reply">回复</div>
      </div>
      <div class="content">{{ parent.content }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['parent', 'count'],
  name: 'hm-floor',
  methods: {
    reply() {
      this.$bus.$emit('reply', this.parent.id, this.parent.user.nickname)
    }
  }
}
</script>

<style lang="less" scoped>
.hm-floor {
  padding: 10px;
  border: 1px solid #ccc;
  border-top: none;
  background: #eee;
  &.top{
    border-top: 1px solid #ccc;
  }
  .header {
    display: flex;
    justify-content: space-between;
    .left {
      flex: 1;
    }
    .center {
      flex: 2;
      text-align: left;
      color: #999;
    }
    .right {
      width: 50px;
      text-align: center;
    }
  }

  .content {
    margin-top: 10px;
  }
}
</style>
