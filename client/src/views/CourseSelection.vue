<template>
  <div>
    <div
      v-if="
        this.courseSelection != null &&
        this.courseSelection.semesterPlans != null
      "
    >
      <baseCourseSelection
        v-show="!pending"
        :courses="courseSelection.semesterPlans[0].unbookedCourses"
        :booked-courses="courseSelection.semesterPlans[0].bookedCourses"
      />
    </div>
    <div v-if="this.courseSelection == null">
      <button @click="addCourseSelection">
        <font-awesome-icon :icon="['fas', 'plus-circle']" size="3x" />
      </button>
      <p>Kurswahl hinzufuegen</p>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      pending: false,
      color: "#76b900",
      showingExplanations: false,
      downloading: false,
    };
  },

  async mounted() {
    if (!this.$store.state.user.user.startOfStudy) {
      this.$router.push("/select-program");
    } else {
      this.pending = true;
      await this.$store.dispatch("semester/fetchSemesters");
      await this.$store.dispatch("modalcourse/fetchCourses");
      await this.$store.dispatch("courseselection/fetchCourseSelection", {
        userId: this.user.id || this.user._id,
      });
      //console.log(this.courseSelection.semesterPlans[0].unbookedCourses);
      //onsole.log(this.courseSelection.semesterPlans[0].bookedCourses);
    }
    this.pending = false;
  },
  methods: {
    addCourseSelection() {
      this.$store.dispatch("courseselection/createCourseSelection", {
        userId: this.user.id || this.user._id,
      });
    },
  },

  computed: {
    console: () => console,
    ...mapState("program", ["program"]),
    ...mapState("courseselection", ["courseSelection"]),
    ...mapState("user", ["user"]),
  },
};
</script>

<style lang="scss">

</style>
