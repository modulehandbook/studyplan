<template>
  <div v-if="!pending">
    <div v-if="stage.currentStage === 'COURSE-SELECTION'">
      <div
        v-if="courseSelection != null && courseSelection.semesterPlans != null"
      >
        <baseCourseSelection
          v-show="!pending"
          :courses="courseSelection.semesterPlans[0].unbookedCourses"
          :booked-courses="courseSelection.semesterPlans[0].bookedCourses"
        />
      </div>
      <div>Verbleibende Zeit: {{ time }}</div>
      <div v-if="courseSelection == null">
        <button
          @click="addCourseSelection"
        >
          <font-awesome-icon :icon="['fas', 'plus-circle']" size="3x" />
        </button>
        <p>Kurswahl hinzufuegen</p>
      </div>
    </div>
    <div v-if="stage.currentStage !== 'COURSE-SELECTION'">
      <p>Die Belegungsphase ist geschlossen</p>
    </div>
  </div>
</template>

<script>
import { mapState, useStore } from "vuex";
import { computed } from "vue";
import moment from "moment";

export default {
  setup() {
    const store = useStore();
    return {
      stage: computed(() => store.state.stage),
    };
  },
  data() {
    return {
      pending: true,
    };
  },

  computed: {
    console: () => console,
    ...mapState("program", ["program"]),
    ...mapState("courseselection", ["courseSelection"]),
    ...mapState("user", ["user"]),

    time() {
      const deadline = new Date(this.stage.nextDates.evaluation.date);
      //return deadline.getTime() - Date.now()
      const gap = moment.duration(moment(deadline).diff(moment(Date.now())));
      return gap.locale("de").humanize();
    },
  },

  async mounted() {
    if (!this.$store.state.user.user.startOfStudy) {
      this.$router.push("/select-program");
    } else {
      this.pending = true;
      await this.$store.dispatch("semester/fetchSemesters");
      await this.$store.dispatch("stage/fetchStage");
      await this.$store.dispatch("courseselection/fetchCourseSelection", {
        userId: this.user.id || this.user._id,
      });
      await this.$store.dispatch("modalcourse/fetchCourses");
      console.log(this.modalCourses);
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

<style lang="scss">

</style>
