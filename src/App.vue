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
    created() {
      
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
      scroll-behavior: smooth;
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
  }

  .table-section {
        width: 96%;
        margin-left: 2%;
        margin-bottom: 25px;
    }

  .content-table {
      border-collapse: collapse;
      font-size: 0.9em;
      width: 100%;
      border-radius: 5px 5px 0 0;        
      overflow: hidden;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);        
  }

  .content-table thead tr {
      background-color: #fe3030;
      color: #ffffff;
      text-align: left;
      font-weight: bold;
      text-align: center;
  }

  .content-table thead th, td {
      border-right: thing solid #fe3030;;
  }

  .content-table th,
  .content-table td {
      padding: 12px 15px;
      border-right: thin solid rgb(180, 180, 180);
  }

  .content-table tbody tr {        
      border-right: thin solid rgb(180, 180, 180);
  }

  .content-table tbody tr:nth-of-type(even) {
      background-color: #f3f3f3;
  }

  .content-table tbody tr:last-of-type {
      border-bottom: 2px solid #fe3030;
  }

  .content-table tbody tr:hover {
      font-weight: bold;
      transform: translateY(-5px);
      transition: ease 0.3s;
      color: #ffffff;
      background-color: #414141;
  }
  
  ::-webkit-scrollbar-track
  {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);
    border-radius: 10px;
    background-color: #F5F5F5;
  }

  ::-webkit-scrollbar
  {
    width: 8px; /* Reduced from 12px to 8px */
    background-color: #F5F5F5;
  }

  ::-webkit-scrollbar-thumb
  {
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
    background-color: #393939;
  }
</style>
