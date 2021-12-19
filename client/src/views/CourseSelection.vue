<template>
  <div>
    <BaseHeading><h1>Hier ist Die Seite zum Belegen</h1></BaseHeading>
    <div> <p> hier ist der inhalt der seite</p></div>
    <div v-show="!pending"> <li v-for="course in courseSelection.semesterPlans[0].unbookedCourses"
    :key="course.name">
    {{course.name}}
    </li>
    </div>
    <div class="addSemester">
      <button class="addSemester addSemester__button" @click="addCourseSelection">
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

    async mounted() {

      if (!this.$store.state.user.user.startOfStudy) {
        this.$router.push("/select-program");
      } else {

        this.pending = true;
        await this.$store.dispatch("semester/fetchSemesters");
        await this.$store.dispatch("courseselection/fetchCourseSelection", {
          userId: this.user.id || this.user._id,
        });
        console.log(this.courseSelection);
      }
      this.pending = false;
    },
    methods: {
      addCourseSelection(){
        this.$store.dispatch("courseselection/createCourseSelection", {
          userId: this.user.id || this.user._id,
        });
        console.log(this.$store);
      }
    },

    computed: {
    console: () => console,
      ...mapState("program", ["program"]),
      ...mapState("courseselection", ["courseSelection"]),
      ...mapState("user", ["user"]),
    },
  };
  </script>
