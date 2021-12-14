<template>
  <div class="footer">
    <div class="links">
      <router-link class="link" to="/datenschutz">Datenschutz</router-link>
      <router-link class="link" to="/impressum">Impressum</router-link>
    </div>
    <!--<cookie-law theme="base"></cookie-law>-->
  </div>
</template>

<script>
/*
import CookieLaw from "vue-cookie-law";

export default {
  components: { CookieLaw },
};*/
</script>

<style lang="scss" scoped>
.footer {
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 50px;
  margin: 0;
  background-color: rgba(118, 185, 0, 0.46);
  display: flex;
  align-items: center;
}

.links {
  position: absolute;
  right: 30px;

  .link {
    margin: 10px;
    color: white;
    text-decoration: none;
  }
}
</style>
