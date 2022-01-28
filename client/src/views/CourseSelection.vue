<template>
  <div v-if="!pending">
    <div v-if="(stage.debugStage === 'none' && stage.currentStage === 'COURSE-SELECTION') || stage.debugStage === 'COURSE-SELECTION'">
      <BaseHeading>
        <h1>Kursbelegung</h1>
      </BaseHeading>
      <div
        v-if="courseSelection != null && courseSelection.semesterPlans != null"
      >
        <baseCourseSelection
          v-show="!pending"
          :courses="courseSelection.semesterPlans[0].unbookedCourses"
          :booked-courses="courseSelection.semesterPlans[0].bookedCourses"
          :semester="currSemester"
          :maxCourses="courseSelection.semesterPlans[0].maxCourses"
        />
      </div>
      <router-view></router-view>
      <!-- <div>Verbleibende Zeit: {{ time("evaluation",false) }}</div> -->
      <div v-if="courseSelection == null">
        <button @click="addCourseSelection">
          <font-awesome-icon :icon="['fas', 'plus-circle']" size="3x" />
        </button>
        <p>Kurswahl hinzufuegen</p>
      </div>
    </div>
    <div v-else class="wrong-stage-wrapper">
      <BaseHeading>
        <h2 class="wrong-stage-headline">
          Aktuell ist keine Belegphase.
        </h2></BaseHeading
      >
      <span class="wrong-stage-text">
        Die nächste Belegphase startet {{ time("courseSelection", true) }}.
      </span>
    </div>
  </div>
</template>

<script>
import { mapState, useStore, mapGetters } from "vuex";
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
    ...mapGetters({
      currSemester: "semester/getCurrentSemester",
    }),

    time() {
      return (stage, withPrefix) => {
        const deadline = new Date(this.stage.nextDates[stage].date);
        const gap = moment.duration(moment(deadline).diff(moment(Date.now())));
        return gap.locale("de").humanize(withPrefix);
      };
    },
  },

  async mounted() {
    if (!this.$store.state.user.user.startOfStudy) {
      this.$router.push("/select-program");
    } else {
      this.pending = true;
      await this.$store.dispatch("stage/fetchStage");
      await this.$store.dispatch("semester/fetchSemesters");
      await this.$store.dispatch("courseselection/fetchCourseSelection", {
        userId: this.user.id || this.user._id,
      });
      await this.$store.dispatch("modalcourse/fetchCourses");
      console.log(this.modalCourses);
    }
    this.pending = false;
    console.log(this.currSemester);
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
.wrong-stage-wrapper {
  width: 700px;
  border-radius: 20px;
  color: black;
  text-align: center;
  padding: 10px 10px;
  margin: 40px auto;
  display: flex;
  flex-direction: column;
  height: 200px;
  background: #ffffff;
  border: 5px solid #7eb726;
  box-sizing: border-box;
  box-shadow: 6px 6px 18px 1px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
}
</style>
