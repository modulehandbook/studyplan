<template>
  <div>
    <BaseHeading><h1>Hier ist Die Seite zum Belegen</h1></BaseHeading>
    <div
      v-if="courseSelection != null && courseSelection.semesterPlans != null"
    >
      <p>hier ist der inhalt der seite</p>
      <baseCourseSelection
        v-show="!pending"
        :courses="courseSelection.semesterPlans[0].unbookedCourses"
        :booked-courses="courseSelection.semesterPlans[0].bookedCourses"
      />
    </div>
    <div v-if="courseSelection == null" class="addSemester">
      <button
        class="addSemester addSemester__button"
        @click="addCourseSelection"
      >
        <font-awesome-icon :icon="['fas', 'plus-circle']" size="3x" />
      </button>
      <p class="addSemester addSemester__text">Kurswahl hinzufuegen</p>
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

  computed: {
    console: () => console,
    ...mapState("program", ["program"]),
    ...mapState("courseselection", ["courseSelection"]),
    ...mapState("user", ["user"]),
  },

  async mounted() {
    if (!this.$store.state.user.user.startOfStudy) {
      this.$router.push("/select-program");
    } else {
      this.pending = true;
      await this.$store.dispatch("semester/fetchSemesters");
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
};
</script>
