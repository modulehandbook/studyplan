<!--source https://www.digitalocean.com/community/tutorials/vuejs-vue-modal-component -->

<template>
  <div>
    <BaseModal :route="'/profile'">
      <template #header>
        <button
          type="button"
          class="btn-close"
          @click="$router.push('/profile')"
        >
          x
        </button>
        <h1>ACHTUNG</h1>
      </template>

      <template #body>
        <p class="text">
          Wenn du Angaben zu deinem Studium änderst, verlierst du deinen
          StudyPlan, den du für den jetzigen Studiengang mit der ausgewählten
          StuPo erstellt hast.
        </p>
        <p class="text">Die Daten können nicht wiederhergestellt werden.</p>
        <button
          type="button"
          class="button button-back"
          @click="$router.push('/profile')"
        >
          Nicht ändern
        </button>
      </template>

      <template #footer>
        <button
          type="button"
          class="button button-danger"
          @click="deleteStudyPlan"
        >
          Trotzdem ändern
        </button>
      </template>
    </BaseModal>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  computed: {
    ...mapState("user", ["user"]),
    ...mapState("studyplan", ["studyplan"]),
  },

  created() {
    document.documentElement.style.overflow = "hidden";
  },

  unmounted() {
    document.documentElement.style.overflow = "auto";
  },
  methods: {
    ...mapMutations("user", ["SET_USER"]),
    ...mapMutations("studplan", ["SET_STUDYPLAN"]),
    async deleteStudyPlan() {
      await this.$store.dispatch(
        "studyplan/deleteStudyPlan",
        {},
        { root: true }
      );
      this.$router.push("/select-program");
    },
  },
};
</script>

<style lang="scss" scoped>
$htwGruen: #76b900;
$errorRed: #f8153d;

.text {
  width: 90%;
  margin: 0 auto;
  font-size: 20px;
  color: #f8153d;
  font-weight: 700;
  line-height: 30px;

  &:nth-of-type(2) {
    margin-top: 30px;
  }
}

:deep(.modal) {
  border: 4px solid $errorRed !important;
}

:deep(.btn-close) {
  color: $errorRed !important;
}

.button {
  display: block;
  margin: 0 auto;
  background: none;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  text-decoration: underline;
  font-weight: bold;
  font-size: 18px;

  &-back {
    margin-top: 90px;
    font-size: 23px;
    color: $htwGruen;
  }
  &-danger {
    color: $errorRed;
  }
}
</style>
