<template>
  <div v-if="isOpen" class="cookie" :class="containerPosition">
    <div class="cookie__content">
      <slot name="message">
        {{ message }}
      </slot>
    </div>
    <div class="cookie__button accept" @click="accept">
      {{ buttonTextAccept }}
    </div>
    <div class="cookie__button deny" @click="deny">
      {{ buttonTextDeny }}
    </div>
  </div>
</template>

<script>
export default {
  name: "CookieMessage",
  props: {
    buttonTextAccept: {
      type: String,
      default: "Akzeptieren",
    },
    buttonTextDeny: {
      type: String,
      default: "Ablehnen",
    },
    message: {
      type: String,
      default:
        "Wir benutzen Cookies um personalisierte Daten von Dir zu speichern. Diese Informationen werden auf unserem Server \
        und lokal bei Dir gespeichert. Wir geben Deine Informationen nicht an Dritte weiter, sondern nutzen Sie nur um Dein \
        Nutzererlebnis zu verbessern.",
    },
    position: {
      type: String,
      default: "top",
    },
  },
  data() {
    return {
      isOpen: false,
    };
  },
  computed: {
    containerPosition() {
      return `cookie--${this.position}`;
    },
  },
  created() {
    if (!this.getDSGVO() === true) {
      this.isOpen = true;
    }
  },
  methods: {
    getDSGVO() {
      return localStorage.getItem("DSGVO:accepted", true);
    },
    accept() {
      this.isOpen = false;
      localStorage.setItem("DSGVO:accepted", true);
    },
    deny() {
      this.isOpen = false;
      localStorage.setItem("DSGVO:accepted", false);
    },
  },
};
</script>

<style>
.cookie {
  position: fixed;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
  grid-gap: 12px;
  padding: 10px;
  background: #f2f2f2;
}

.cookie__content {
  grid-column: auto / span 5;
  padding: 5px;
  text-align: left;
}

.cookie__button {
  margin: 15px 0;
  grid-column: auto / span 1;
}

.cookie__button.accept {
  padding: 5px;
  background: #76b900;
  color: #ffffff;
  cursor: pointer;
}

.cookie__button.accept:hover {
  background: #70a900;
}

.cookie__button.deny {
  padding: 5px;
  background: #aaaaaa;
  color: #ffffff;
  cursor: pointer;
}

.cookie__button.deny:hover {
  background: #999999;
}

.cookie--top {
  top: 0;
  left: 0;
  right: 0;
}

.cookie--bottom {
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
