<!--source https://www.digitalocean.com/community/tutorials/vuejs-vue-modal-component -->
<template>
  <div>
    <BaseModal :route="'/courseselection'">
      <template #header>
        <button
          type="button"
          class="btn-close"
          @click="$router.push('/courseselection')"
        >
          x
        </button>
      </template>

      <template #body>
        <pulse-loader :loading="pending" :color="color"></pulse-loader>
        <BaseCourseSelectionWindowContent
          v-if="!pending"
          :course="modalCourse"
          :semester="semester"
        />
      </template>
    </BaseModal>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  emits: ["close"],
  data() {
    return {
        semester: {
        type: Object,
      },
      pending: false,
      color: "#76b900",
    };
  },
  computed: {
    ...mapState("modalcourse", ["modalCourse"]),
    ...mapGetters("semester", ["getSemesterByName"]),
  },
  async created() {
    this.pending = true;
    document.documentElement.style.overflow = "hidden";
    this.semester = this.getSemesterByName(this.$route.params.semester);

    await this.$store.dispatch("modalcourse/fetchCourse", {
      code: this.$route.params.code,
      semester: this.semester ? this.semester.name : undefined,
    });
    console.log(this.modalCourse);
    this.pending = false;
    console.log(this.$route.params.code);
    console.log(this.semester);
  },
  async beforeUnmount() {
    document.documentElement.style.overflow = "auto";
  },
  methods: {
    close() {
      this.$emit("close");
    },
  },
};
</script>

<style lang="scss" scoped>
$htwGruen: #76b900;

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

.btn-back {
  position: absolute;
  top: 0;
  left: 0;
  margin-left: 30px;
  margin-top: 30px;
  border: none;
  font-size: 30px;
  padding: 10px;
  cursor: pointer;
  color: $htwGruen;
  background: transparent;
}
</style>
