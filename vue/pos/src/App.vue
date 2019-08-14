<template>
  <div id="app">
    <!-- 左侧导航 -->
    <leftNav></leftNav>
    <!-- 操作区域 -->
    <div class="main">
      <router-view/>
    </div>
  </div>
</template>

<style>
#app {
  font-family: 'Microsoft YaHei', 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  /* margin-top: 60px; */
}
.main {
  float: left;
  width: 95%;
  height: 100%;
  background-color: #EFF2F7;
  overflow: auto;
}
</style>
<script>
import leftNav from '@/components/common/leftNav.vue'
export default {
  name: 'app',
  components: {
    leftNav
  }
}
</script>
