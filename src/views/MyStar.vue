<template>
  <div class="my-star">
    <hm-header>我的收藏</hm-header>
    <hm-post :post="post" v-for="post in list" :key="post.id"></hm-post>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: []
    }
  },
  async created() {
    let res = await this.$axios.get('/user_star')
    if(res.data.statusCode === 200) {
      this.list = res.data.data
    }
  }
}
</script>

<style>

</style>