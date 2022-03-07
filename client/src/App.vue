<template>
  <div id="app">
    <div class="content-wrap">
      <div id="nav">
        <BaseNavigation />
      </div>
      <router-view />
    </div>
    <BaseFooter />
  </div>
</template>
<script>


export default({
  setup() {
    document.title = 'StudyPlan';
    //const favicon = document.getElementById("favicon");      
    //favicon.href = "https://www.google.com/favicon.ico";
  },
  mounted(){
    const favicon = document.getElementById("favicon");
    console.log(favicon);
  },
})
</script>

<style lang="scss">
html,
body {
  max-height: 100vh;
  max-width: 100vw;
  margin: -0px !important;
  overflow-x: hidden;
}
#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #3d3d3d;
  position: relative;
  min-height: 100vh;
  width: 100vw;
}

.content-wrap {
  padding-bottom: 100px;
}

#nav {
  padding: 30px 20px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
