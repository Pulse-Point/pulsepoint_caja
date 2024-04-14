<template>
  <div id="app">
    <SideBar />
    <div class="view-contents" :style="{ 'margin-left': sidebarWidth }">
        <router-view />
    </div>
  </div>    
</template>

<script>
  import SideBar from './components/sidebar/SideBar'
  import { sidebarWidth } from './components/sidebar/state'

  export default {
    components: { 
        SideBar 
    },
    setup() {
        return { sidebarWidth }
    }
  }
</script>

<style>
  html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      background-color: rgb(255, 255, 255);
  }

  #app {
      font-family: Avenir, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-align: center;
      color: #2c3e50;
      width: 100%;
      height: 100%;
  }    

  #nav {
      padding: 30px;
  }

  #nav a {
      font-weight: bold;
      color: #2c3e50;
  }

  #nav a.router-link-exact-active {
      color: #42b983;
  }

  .view-contents {
      transition: margin-left 0.5s ease-in-out;
      height: 100%;
  }
</style>
