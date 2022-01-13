<template>
  <div>
    <BaseHeading><h1>Mein Studienplan</h1></BaseHeading>
    <pulse-loader :loading="pending" :color="color"></pulse-loader>

    <BaseStudyPlan
      v-show="!pending"
      :courses-in-semester="studyPlan.semesterPlans"
    />

    <div class="explanation">
      <button
        class="explanation explanation-button"
        @click="showingExplanations = !showingExplanations"
      >
        <p v-if="showingExplanations">Hinweise verbergen</p>
        <p v-else>Hinweise anzeigen</p>
      </button>
      <transition name="fade">
        <div
          v-if="showingExplanations"
          class="explanation explanation-container"
        >
          <div class="explanatin explanation-questions">
            <div class="explanation explanation-question">
              <h4 class="explanation explanation-question--question">
                Wie benutze ich den StudyPlan?
              </h4>
              <div class="explanation explanation-question--answers">
                <p>
                  Du kannst ganz einfach per Drag & Drop die Kurse zwischen den
                  Semestern hin- und herziehen. Mit Klick auf einen Kurs kommst
                  du zur Detailansicht. Du kannst einen Kurse als "belegt" und
                  "bestanden" makieren. Manche Kurse müssen durch andere Kurse
                  bestanden werden – du kannst dann nur dort "belegt" oder
                  "bestanden" angeben.
                </p>
              </div>
            </div>

            <div class="explanation explanation-question">
              <h4 class="explanation explanation-question--question">
                Was bedeuten die Farben?
              </h4>
              <div class="explanation explanation-question--answers">
                <p class="notBooked">noch nicht belegt</p>
                <p class="booked">belegt</p>
                <p class="passed">bestanden</p>
              </div>
            </div>
            <div class="explanation explanation-question">
              <h4 class="explanation explanation-question--question">
                Disclaimer
              </h4>
              <div class="explanation explanation-question--answers">
                <p>
                  Das Tool dient deiner persönlichen Planung. Es überprüft
                  (noch) nicht die Sinnhaftigkeit und Richtigkeit deiner
                  Belegungspläne. Alle Angaben sind mit bestem Gewissen erstellt
                  worden, was jedoch keine 100% Garantie für die Richtigkeit der
                  Infos darstellt.
                </p>
              </div>
            </div>
          </div>
        </div>
      </transition>
      <button class="downLoadButton" @click="downloadStudyPlan">
        Plan herunterladen
      </button>
      <pulse-loader :loading="downloading" :color="color"></pulse-loader>
    </div>
  </div>
</template>

<script>
const YAML = require("yaml");

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
    ...mapState("program", ["program"]),
    ...mapState("studyplan", ["studyPlan"]),
    ...mapState("user", ["user"]),
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
    async downloadStudyPlan() {
      this.downloading = true;
      const studyPlan = this.$store.state.studyplan.studyPlan;
      let semesterPlans = [];
      for (let semester in studyPlan.semesterPlans) {
        let courses = [];
        for (let i in studyPlan.semesterPlans[semester].plannedCourses) {
          await this.$store.dispatch("course/fetchCourse", {
            program: studyPlan.program.code.toLowerCase(),
            version: studyPlan.program.version,
            code: studyPlan.semesterPlans[semester].plannedCourses[i].code,
            semester: studyPlan.semesterPlans[semester].semester.name,
          });
          let fetchedCourse = this.$store.state.course.course;

          let course = {
            Code: fetchedCourse.course.code,
            Name: fetchedCourse.course.name,
            ECTS: fetchedCourse.course.ects,
            Inhalte: fetchedCourse.course.contents,
          };
          if (
            studyPlan.semesterPlans[semester].plannedCourses[i].passedThrough
              .length != 0
          ) {
            let passedThroughCourses = [];
            for (let y in studyPlan.semesterPlans[semester].plannedCourses[i]
              .passedThrough) {
              await this.$store.dispatch("course/fetchCourse", {
                program: studyPlan.program.code.toLowerCase(),
                version: studyPlan.program.version,
                code: studyPlan.semesterPlans[semester].plannedCourses[i]
                  .passedThrough[y],
                semester: studyPlan.semesterPlans[semester].semester.name,
              });
              let course = this.$store.state.course.course;
              let pC = {
                Code: course.course.code,
                Name: course.course.name,
                Inhalte: course.course.contents,
              };
              passedThroughCourses.push(pC);
            }
            course["Bestanden durch"] = passedThroughCourses;
          }
          courses.push(course);
        }
        let semesterPlan = {
          Semesteranzahl:
            studyPlan.semesterPlans[semester].currentSemesterCount,
          Semester: studyPlan.semesterPlans[semester].semester.name,
          Kurse: courses,
        };
        semesterPlans.push(semesterPlan);
      }

      let plan = {
        Studiengang: studyPlan.program.name,
        Belegungen: semesterPlans,
      };

      const doc = new YAML.Document();
      doc.contents = plan;
      const date = new Date(Date.now());
      const fileName = `studyplan_${
        this.$store.state.user.user.username
      }_${date.toLocaleDateString("de-DE")}`;
      var dataStr = "data:text/yaml;charset=utf-8," + encodeURIComponent(doc);
      var downloadAnchorNode = document.createElement("a");
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", fileName + ".yaml");
      document.body.appendChild(downloadAnchorNode);
      downloadAnchorNode.click();
      downloadAnchorNode.remove();
      this.downloading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
$htwGruen: #76b900;

p {
  font-weight: 700;
}

.explanation {
  margin-top: 30px;

  .fade-enter-active {
    transition: all 0.6s;
  }
  .fade-enter {
    opacity: 0;
  }

  &-button {
    background: none;
    color: rgb(127, 127, 127);
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    outline: inherit;
    text-decoration: underline;
    font-weight: bold;
    font-size: 18px;
  }
  &-container {
    max-width: 1550px;
    margin: 0 auto;
    background: rgba(118, 185, 0, 0.12);
    border: 1px solid rgba(118, 185, 0, 0.36);
    border-radius: 12px;

    @media screen and (max-width: 1600px) {
      max-width: 90% !important;
    }
    @media screen and (max-width: 1600px) {
      max-width: 90% !important;
    }
  }

  &-questions {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    margin: auto;

    @media screen and (max-width: 650px) {
      flex-direction: column;
    }
  }
  &-question {
    margin: 40px auto 40px;
    width: 25%;

    @media screen and (max-width: 650px) {
      width: 90%;
    }

    &--question {
      margin: auto;
    }
    &--answers {
      p {
        display: inline;
        font-weight: 500;
        font-size: 14px;
        line-height: 20px;
      }

      .passed {
        color: $htwGruen;
        display: block;
      }
      .booked {
        color: rgba(253, 177, 62, 1);
        display: block;
      }
      .notBooked {
        color: rgb(127, 127, 127);
        display: block;
      }
    }
  }
}

.downLoadButton {
  display: block;
  margin: 20px auto;
  margin-bottom: 20px;
  background: none;
  color: rgb(127, 127, 127);
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  text-decoration: underline;
  font-weight: bold;
  font-size: 18px;
}
</style>
