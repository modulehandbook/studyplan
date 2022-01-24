<template>
  <div v-if="!pending">
    <div v-if="this.hasTakenSurvey" class="no-course-wrapper">
      <BaseHeading>
        <h2 class="no-course-headline">
          Danke für die Teilnahme an der Umfrage!
        </h2></BaseHeading
      >
      <span class="no-course-text">
        Mit der Teilnahme an der Umfrage machst du zukünftige Belegphasen
        besser! Wenn du deine Kurswahl nochmal änderst kannst du auch die
        Umfrage neu machen.
      </span>
    </div>
    <div
      v-else-if="stage.currentStage !== 'COURSE-SELECTION'"
      class="no-course-wrapper"
    >
      <BaseHeading>
        <h2 class="no-course-headline">
          Aktuell ist keine Belegphase.
        </h2></BaseHeading
      >
      <span class="no-course-text">
        Die nächste Belegphase startet {{ time("courseSelection", true) }}.
      </span>
    </div>
    <form
      v-else-if="
        courseSelection != null &&
        courseSelection.semesterPlans != null &&
        courseSelection.semesterPlans[0].bookedCourses.length > 0
      "
      name="form"
      @submit.prevent="updateCourses"
    >
      <BaseHeading><h1>Wieso hast du den Kurs gewählt?</h1></BaseHeading>
      <div
        v-for="(course, index) in courseSelection.semesterPlans[0]
          .bookedCourses"
        :key="course.key"
        class="survey-wrapper"
      >
        <input :name="'course' + index" :value="course.name" hidden />
        <div class="survey-left-content">
          <div class="block">
            <p>{{ course.key }}</p>
            <p>{{ course.name }}</p>
          </div>
        </div>
        <div class="survey-right-content">
          <div class="survey-form">
            <div class="survey-column-wrapper">
              <div class="survey-radio left">
                <input
                  v-if="courseReasons[course.code]"
                  :id="surveys[0].key + index"
                  v-model="courseReasons[course.code].reasons"
                  type="checkbox"
                  :name="'survey' + index"
                  :value="surveys[0].value"
                />
                <label :for="surveys[0].key + index">{{
                  surveys[0].name
                }}</label>
              </div>
              <div class="survey-radio right">
                <input
                  v-if="courseReasons[course.code]"
                  :id="surveys[1].key + index"
                  v-model="courseReasons[course.code].reasons"
                  type="checkbox"
                  :name="'checkbox' + index"
                  :value="surveys[1].value"
                />
                <label :for="surveys[1].key + index">{{
                  surveys[1].name
                }}</label>
              </div>
            </div>
            <div class="survey-column-wrapper">
              <div class="survey-radio left">
                <input
                  v-if="courseReasons[course.code]"
                  :id="surveys[2].key + index"
                  v-model="courseReasons[course.code].reasons"
                  type="checkbox"
                  :name="'survey' + index"
                  :value="surveys[2].value"
                />
                <label :for="surveys[2].key + index">{{
                  surveys[2].name
                }}</label>
              </div>

              <div class="survey-radio right">
                <input
                  v-if="courseReasons[course.code]"
                  :id="surveys[3].key + index"
                  v-model="courseReasons[course.code].reasons"
                  type="checkbox"
                  :name="'survey' + index"
                  :value="surveys[3].value"
                />
                <label :for="surveys[3].key + index">{{
                  surveys[3].name
                }}</label>
              </div>
            </div>
            <div class="survey-column-wrapper">
              <div class="survey-radio left">
                <input
                  v-if="courseReasons[course.code]"
                  :id="surveys[4].key + index"
                  v-model="courseReasons[course.code].reasons"
                  type="checkbox"
                  :name="'survey' + index"
                  :value="surveys[4].value"
                />
                <label :for="surveys[4].key + index">{{
                  surveys[4].name
                }}</label>
              </div>

              <div class="survey-radio right">
                <input
                  v-if="courseReasons[course.code]"
                  @change="toggleTextBox($event, course.code, index)"
                  :id="surveys[4].key + index"
                  type="checkbox"
                  :name="'survey' + index"
                  :value="surveys[5].value"
                />
                <label :for="surveys[5].key + index">{{
                  surveys[5].name
                }}</label>
                <input
                  v-if="courseReasons[course.code]"
                  v-model="courseReasons[course.code].other"
                  :disabled="!textEnabled[index]"
                  class="input-text"
                  type="text"
                  name=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="button-wrapper">
        <button class="survey-button" type="submit">Submit</button>
        <p class="survey-time">Umfrageschluss {{ time("evaluation",true) }}.</p>
      </div>
    </form>
    <div v-else class="no-course-wrapper">
      <BaseHeading>
        <h2 class="no-course-headline">
          Noch keine Kurse gewählt.
        </h2></BaseHeading
      >
      <span class="no-course-text">
        Bitte wähle zuerst welche unter „Kursbelegung“.
      </span>
    </div>
  </div>
</template>

export default { },

<script>
import { mapState, useStore, mapGetters } from "vuex";
import { computed } from "vue";
import moment from "moment";
import BaseHeading from "../components/BaseHeading.vue";
export default {
  setup() {
    const store = useStore();
    return {
      stage: computed(() => store.state.stage),
    };
  },
  components: { BaseHeading },
  computed: {
    ...mapState("courseselection", ["courseSelection"]),
    ...mapState("user", ["user"]),
    ...mapGetters({
      hasTakenSurvey: "courseselection/getSurveyState",
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
    this.pending = true;
    this.courseReasons = {};
    console.log("mounted ist called");
    console.log(this.courseReasons);
    await this.$store
      .dispatch("courseselection/fetchCourseSelection", {
        userId: this.user.id || this.user._id,
      })
      .then(() => {
        console.log("did user take survey");
        console.log(this.hasTakenSurvey);
        this.courseSelection.semesterPlans[0].bookedCourses.forEach(
          (course) => {
            this.courseReasons[course.code] = { reasons: [], other: "" };
          }
        );
        this.pending = false;
      })
      .catch((e) => {
        console.log(e);
      });
  },
  data() {
    /*
      reasonsForSelecton: {
        teacher: Number,
        time: Number,
        interest: Number,
        easy: Number,
        careerRelevant: Number,
      },
    */
    return {
      pending: false,
      surveyTaken: false,
      courseReasons: {},
      textEnabled: [],
      surveys: [
        { key: "lb", name: "Lehrer bedingt", value: "teacher" },
        { key: "zb", name: "zeitlich bedingt", value: "time" },
        {
          key: "ki",
          name: "Kurs ist interessant",
          value: "interest",
        },
        {
          key: "rb",
          name: "relevant für Berufslaufbahn",
          value: "careerRelevant",
        },
        { key: "ke", name: "Kurs ist einfach", value: "easy" },
        { key: "so", name: "sonstiges", value: "" },
      ],
      // array of the enabled status for the text input field
    };
  },
  methods: {
    toggleTextBox(event, courseCode, index) {
      this.textEnabled[index] =
        this.textEnabled[index] == undefined ? true : !this.textEnabled[index];
      this.courseReasons[courseCode].other = "";
    },
    async updateCourses() {
      await this.$store.dispatch(
        "courseselection/updateCourseSelectionReasons",
        {
          courseReasons: this.courseReasons,
        }
      );
    },
  },
};
</script>

<style>
.survey-time {
  font-size: x-small;
  text-align: right;
}

.button-wrapper {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  margin: 0 auto;
  align-items: left;
  padding: 25px 0;
  max-width: 870px;
}

.survey-wrapper {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  align-items: center;
  padding: 35px 0;
  max-width: 870px;
}

.block {
  position: relative;
  width: 150px;
  border-radius: 20px;
  background: #c4c4c4;
  color: black;
  text-align: center;
  padding: 10px 10px;
  margin: 40px auto;
}

.survey-form {
  display: flex;
  flex-direction: column;
}

.survey-column-wrapper {
  display: flex;
  text-align: left;
}

.survey-column-wrapper div {
  padding: 20px 40px;
}
.survey-radio label {
  padding-left: 20px;
}

.survey-radio.right {
  min-width: 280px;
}

.survey-radio.left {
  min-width: 200px;
}

.survey-button {
  margin-left: auto;
  -webkit-border-radius: 10;
  -moz-border-radius: 10;
  border-radius: 10px;
  font-family: Arial;
  color: #ffffff;
  font-size: 20px;
  background: #76b900;
  padding: 5px 80px;
  text-decoration: none;
  border: 0;
}

.survey-button:hover {
  background: #8ddf00;
  text-decoration: none;
  cursor: pointer;
}

.input-text {
  margin-left: 10px;
}

.no-course-wrapper {
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
