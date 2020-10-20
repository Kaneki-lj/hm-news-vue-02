<template>
  <div>
    <keep-alive include="home, login">
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {}
</script>

<style>
.one {
  width: 200px;
  height: 200px;
  background-color: cadetblue;
}
</style>
