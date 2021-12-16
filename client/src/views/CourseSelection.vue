<template>
  <div>
    <BaseHeading><h1>Hier ist Die Seite zum Belegen</h1></BaseHeading>
    <div> <p> hier ist der inhalt der seite</p></div>
    <BaseCourseSelection
      v-show="!pending"
      :coursesInSemester="this.studyPlan.semesterPlans"
    />
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
        await this.$store.dispatch("studyplan/fetchStudyPlan", {
          userId: this.user.id || this.user._id,
        });
      }
      this.pending = false;
    },
    methods: {

    },

    computed: {
      ...mapState("program", ["program"]),
      ...mapState("studyplan", ["studyPlan"]),
      ...mapState("user", ["user"]),
    },
  };
  </script>
