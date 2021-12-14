<!--source https://www.digitalocean.com/community/tutorials/vuejs-vue-modal-component -->

<template>
  <div class="overlay" @click.self="$router.push(route)">
    <div class="modal">
      <header class="modal-header">
        <slot name="header"></slot>
      </header>

      <section class="modal-body">
        <slot name="body"></slot>
      </section>

      <section class="modal-footer">
        <slot name="footer"></slot>
      </section>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    route: {
      type: String,
      required: true,
    },
  },
  mounted() {
    document.documentElement.style.overflow = "hidden";
  },
  beforeUnmount() {
    document.documentElement.style.overflow = "auto";
  },
};
</script>

<style lang="scss" scoped>
$htwGruen: #76b900;

.overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(2px);
}

.modal {
  z-index: 500;
  position: relative;
  background: #ffffff;
  width: 40vw;
  height: 80vh;
  border: 4px solid #76b900;
  border-radius: 12px;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  overflow-y: auto;

  @media screen and (max-width: 1400px) {
    width: 60vw;
  }

  @media screen and (max-width: 1200px) {
    width: 60vw;
  }

  @media screen and (max-width: 1000px) {
    width: 70vw;
  }

  @media screen and (max-width: 800px) {
    width: 80vw;
  }

  .modal-header {
    padding: 15px;
    display: flex;
    position: relative;
    flex-direction: column;
  }

  .modal-body {
    padding: 20px 10px;
  }

  .modal-footer {
    position: absolute;
    bottom: 20px;
    margin: 0 auto;
    width: 100%;

    @media screen and (max-width: 400px) {
      position: relative;
      bottom: 0px;
    }
  }

  .btn-close {
    position: absolute;
    top: 0;
    right: 0;
    margin-right: 5px;
    border: none;
    font-size: 20px;
    padding: 10px;
    cursor: pointer;
    font-weight: bold;
    color: $htwGruen;
    background: transparent;
  }
}
</style>
