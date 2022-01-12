<template>
  <div class="course-details">
    <h1 class="course-details-code">{{ course.course.code }}</h1>
    <h2 class="course-details-name">{{ course.course.name }}</h2>
    <h2 v-if="semester" class="course-details-semestername">
      {{ semester.name }}
    </h2>
    <p class="course-details-ects">{{ course.course.ects }} ECTS</p>

    <div v-if="course.course_program.semester != 0">
      <h3>Empfohlenes Semester</h3>
      <p>
        {{ course.course_program.semester }}
      </p>
    </div>

    <div v-if="!isExampleStudyPlan">
      <BaseBookedAndPassedCourseDetails
        :course="course"
        :is-child-course="isChildCourse"
        :parent-course-code="parentCourseCode"
        :semester="semester"
      />
    </div>

    <div v-else>
      <div v-if="course.child_courses.length > 0 && !isChildCourse">
        <h3 v-if="requiredCourses.length == 0">
          Muss belegt werden durch einer dieser Kurse
        </h3>
        <h3 v-else>Muss durch folgende Kurse belegt werden</h3>

        <div class="childCourses">
          <div
            v-for="childCourse in course.child_courses"
            :key="childCourse.id"
            class="childCourses-course"
          >
            <router-link
              class="course-content-container"
              :to="{
                name: 'exampleStudyplanBaseModalChildCourse',
                params: {
                  parentCode: course.course.code,
                  code: childCourse.course.code,
                  requiredParentCourses: requiredCourses,
                },
              }"
            >
              <div class="childCourses-course-content-text">
                <p class="childCourses-course-content-text--code">
                  {{ childCourse.course.code }}
                </p>
                <p v-if="!mobileView">{{ childCourse.course.name }}</p>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <!-- Allgemeine Informationen -->

    <div>
      <h3>Unterrichtsform</h3>
      <p>{{ course.course.methods }}</p>
    </div>

    <div v-if="course.course.cresponsible_person">
      <h3>Zuständige Person</h3>
      <p>{{ course.course.responsible_person }}</p>
    </div>

    <div>
      <h3>Häufigkeit</h3>
      <p v-if="course.course.frequency == 'WiSe'">im Wintersemester</p>
      <p v-if="course.course.frequency == 'SoSe'">im Sommersemester</p>
      <p else>jedes Semester</p>
    </div>

    <div v-if="course.course.lectureHrs">
      <h3>Vorlesungsstunden pro Woche</h3>
      <p>{{ course.course.lectureHrs }}</p>
    </div>

    <div v-if="course.course.labHrs">
      <h3>Übungsstunden pro Woche</h3>
      <p>{{ course.course.labHrs }}</p>
    </div>

    <div v-if="course.course.tutorialhrs">
      <h3>Tutorienstunden pro Woche</h3>
      <p>{{ course.course.tutorialhrs }}</p>
    </div>

    <div v-if="course.course.room">
      <h3>Raum</h3>
      <p>{{ course.course.room }}</p>
    </div>

    <div v-if="course.course.equipment">
      <h3>Benötigte Ausstattung</h3>
      <p>{{ course.course.equipment }}</p>
    </div>

    <div v-if="course.course.contents">
      <h3>Inhalte</h3>
      <p>{{ course.course.contents }}</p>
    </div>

    <div v-if="course.course.mission">
      <h3>Gewünschte Ergebnisse</h3>
      <p>{{ course.course.mission }}</p>
    </div>

    <div v-if="course.course.examination">
      <h3>Prüfungsform</h3>
      <p>{{ course.course.examination }}</p>
    </div>

    <div v-if="course.course.objective">
      <h3>Zielsetzung</h3>
      <p>{{ course.course.objective }}</p>
    </div>

    <div v-if="course.course.prerequisites">
      <h3>Voraussetzungen</h3>
      <p>{{ course.course.prerequisites }}</p>
    </div>

    <div v-if="course.course.literature">
      <h3>Literatur</h3>
      <p>{{ course.course.literature }}</p>
    </div>

    <div v-if="course.course.skills_knowledge_understanding">
      <h3>Fähigkeiten – Wissen</h3>
      <p>{{ course.course.skills_knowledge_understanding }}</p>
    </div>

    <div v-if="course.course.skills_intellectual">
      <h3>Fähigkeiten – Intellektuell</h3>
      <p>{{ course.course.skills_intellectual }}</p>
    </div>

    <div v-if="course.course.skills_practical">
      <h3>Fähigkeiten – Praktisch</h3>
      <p>{{ course.course.skills_practical }}</p>
    </div>

    <div v-if="course.course.skills_general">
      <h3>Fähigkeiten – Allgemein</h3>
      <p>{{ course.course.skills_general }}</p>
    </div>

    <div v-if="course.course.updated_at">
      <h4>Zuletzt geupdated</h4>
      <p>
        {{ new Date(course.course.updated_at).toLocaleDateString("de-DE") }}
      </p>
    </div>

    <router-view></router-view>
  </div>
</template>

<script>
export default {
  props: {
    course: {
      type: Object,
      required: true,
    },
    semester: {
      type: Object,
      required: false,
      default() {
        return null;
      },
    },
    isChildCourse: {
      type: Boolean,
      required: true,
    },
    parentCourseCode: {
      type: String,
      required: false,
      default: "",
    },
    isExampleStudyPlan: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  data() {
    return {
      requiredCourses: [],
      mobileView: false,
    };
  },
  created() {
    this.getRequiredCourses();
    this.mobileView = window.innerWidth <= 600;
    window.addEventListener("resize", this.isMobileView);
  },

  methods: {
    isMobileView() {
      this.mobileView = window.innerWidth <= 600;
    },
    getRequiredCourses() {
      if (this.isChildCourse) {
        this.requiredParentCourses = this.$route.params.requiredParentCourses;
      }
      if (!this.course.child_courses || this.course.child_courses.length == 0)
        return [];
      for (let i in this.course.child_courses) {
        if (
          this.course.child_courses[i].course_connection.required == "required"
        ) {
          this.requiredCourses.push(this.course.child_courses[i]);
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$htwGruen: #76b900;
$belegtFont: rgba(253, 177, 62, 1);
$belegtBackground: rgba(253, 177, 62, 0.55);

h3 {
  font-size: 18px;
}

h4 {
  color: $htwGruen;
}

.course-details {
  &-code {
    margin-top: 0;
    margin-bottom: 15px;
    font-size: 25px;
    color: $htwGruen;
  }

  &-name {
    margin: 0;
    font-size: 25px;
    color: $htwGruen;
  }

  &-semestername {
    font-size: 20px;
    color: $htwGruen;
  }

  &-ects {
    margin-top: 15px;
    font-size: 16px;
    font-weight: 700;
  }
  .course-content-container {
    padding-top: 10px;
  }

  .childCourses {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: center;

    a {
      text-decoration: none;
      color: inherit;
    }

    &-course {
      background: rgba(193, 193, 193, 0.55);
      border: 1px solid #c1c1c1;
      max-height: 87px;
      min-height: 87px;
      overflow: hidden;
      width: 10vw;
      border-radius: 14px;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      margin: 9px;
      transition: max-height 0.3s ease-in-out;

      @media screen and (max-width: 600px) {
        align-items: center;
      }

      &:hover {
        max-height: 20000px;
        min-height: 87px;
        height: auto;
        transition: max-height 1s ease-in-out;
      }

      &-content {
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto;
        width: 100%;

        &-text {
          max-width: 100%;
          height: 100%;
          border-radius: 14px;

          &--code {
            font-weight: 700;
          }

          p {
            padding: 0px;
            font-size: 12px;
            padding: 3px;
            margin: 0 auto;
            max-width: 100%;
            word-wrap: break-word;
            border-radius: 14px;

            @media screen and (max-width: 1000px) {
              max-width: 75% !important;
            }

            @media screen and (max-width: 800px) {
              max-width: 65% !important;
            }
          }
        }
      }
    }
  }
}

.download-button {
  background: none;
  color: $htwGruen;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  text-decoration: underline;
  font-weight: bold;
  font-size: 15px;
  margin-top: 30px;
}
</style>
