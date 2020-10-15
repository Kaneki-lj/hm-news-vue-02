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
      <div class="right">
        <i class="iconfont iconwode"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {}
</script>

<style scoped lang="less">
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
