<template>
  <div>
    <!-- Bestanden/Belegt wenn keine Child Courses -->
    <div
      v-if="course.child_courses.length == 0"
      class="checkbox"
      :class="{ booked: booked, passed: passed }"
    >
      <Checkbox
        id="mycheck1"
        v-model="booked"
        :value="booked"
        color="rgba(253, 177, 62, 1)"
        @change="toggleBooked(course.course.code, semester)"
        :disabled="passed"
        >Belegt
      </Checkbox>

      <Checkbox
        id="mycheck2"
        v-model="passed"
        :value="passed"
        color="#76b900"
        @change="togglePassed(course.course.code, semester)"
        :disabled="!booked"
        >Bestanden
      </Checkbox>
    </div>

    <!--Belegt/Bestanden mit Child Courses -->
    <div v-if="course.child_courses.length > 0 && !isChildCourse">
      <!-- wenn nicht belegt -->
      <div v-if="!booked">
        <h3 v-if="requiredCourses.length == 0">
          Kann belegt werden durch einer dieser Kurse
        </h3>
        <h3 v-else>Muss durch folgende Kurse belegt werden</h3>

        <div class="childCourses">
          <div
            class="childCourses-course"
            v-for="childCourse in unbookedChildCourses"
            :key="childCourse.id"
          >
            <router-link
              class="childCourses-course-content-container"
              :to="{
                name: 'baseModalChildCourse',
                params: {
                  parentCode: course.course.code,
                  code: childCourse.code,
                  semester: semester.name,
                  requiredParentCourses: requiredCourses,
                },
              }"
            >
              <div class="childCourses-course-content-text">
                <p class="childCourses-course-content-text--code">
                  {{ childCourse.code }}
                </p>
                <p v-if="!mobileView">{{ childCourse.name }}</p>
              </div>
            </router-link>
          </div>
        </div>
      </div>

      <!-- wenn 1 bis n Kurse belegt -->
      <div v-if="booked">
        <!-- wenn belegt ohne required Kurse-->
        <div v-if="!requiredCourses || requiredCourses.length == 0">
          <h3 v-if="!passed" class="bookedThrough">Belegt durch</h3>
          <h3 v-else class="passedThrough">Bestanden durch</h3>
          <div class="childCourses">
            <div
              class="childCourses-course"
              :class="{
                'childCourses-course--booked': booked,
                'childCourses-course--passed': passed,
              }"
              v-for="childCourse in bookedOrPassedThroughCourses.bookedThrough"
              :key="childCourse.id"
            >
              <router-link
                class="childCourses-course-content-container"
                :to="{
                  name: 'baseModalChildCourse',
                  params: {
                    parentCode: course.course.code,
                    code: childCourse,
                    semester: semester.name,
                    requiredParentCourses: requiredCourses,
                  },
                }"
              >
                <div class="childCourses-course-content-text">
                  <p class="childCourses-course-content-text--code">
                    {{ childCourse }}
                  </p>
                  <p v-if="!mobileView">
                    {{ getNameOfChildCourse(childCourse) }}
                  </p>
                </div>
              </router-link>
            </div>
          </div>
        </div>

        <!-- wenn belegt und required Kurse -->
        <div v-if="requiredCourses.length != 0">
          <!-- wenn alle required Kurse belegt, aber nicht bestanden wurden -->
          <h3
            v-if="
              bookedOrPassedThroughCourses.bookedThrough.length ==
                requiredCourses.length &&
              bookedOrPassedThroughCourses.passedThrough.length !=
                requiredCourses.length
            "
            class="bookedThrough"
          >
            Belegt durch
          </h3>

          <!-- wenn noch nicht alle required Kurse belegt wurden -->
          <h3
            v-if="
              bookedOrPassedThroughCourses.bookedThrough.length !=
              requiredCourses.length
            "
          >
            Noch nicht vollständig belegt, belege noch nicht belegte Kurse
          </h3>
          <!-- wenn alle required Kurse bestanden wurden -->
          <h3
            v-if="
              bookedOrPassedThroughCourses.passedThrough.length ==
              requiredCourses.length
            "
            class="passedThrough"
          >
            Bestanden durch
          </h3>
          <div class="childCourses">
            <div
              class="childCourses-course"
              :class="{
                'childCourses-course--booked':
                  bookedOrPassedThroughCourses.bookedThrough
                    ? bookedOrPassedThroughCourses.bookedThrough.indexOf(
                        childCourse.course.code
                      ) != -1
                    : false,
                'childCourses-course--passed':
                  bookedOrPassedThroughCourses.passedThrough
                    ? bookedOrPassedThroughCourses.passedThrough.indexOf(
                        childCourse.course.code
                      ) != -1
                    : false,
              }"
              v-for="childCourse in course.child_courses"
              :key="childCourse.id"
            >
              <router-link
                class="childCourses-course-content-container"
                :to="{
                  name: 'baseModalChildCourse',
                  params: {
                    parentCode: course.course.code,
                    code: childCourse.course.code,
                    semester: semester.name,
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
    </div>
  </div>
</template>

<script>
import Checkbox from "vue-material-checkbox";
import { mapGetters } from "vuex";
export default {
  components: { Checkbox },
  props: {
    course: {
      type: Object,
      required: true,
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
    semester: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      booked: false,
      passed: false,
      requiredCourses: [],
      requiredParentCourses: [],
      mobileView: false,
    };
  },
  created() {
    let states = this.$store.getters["studyplan/getStateOfCourse"](
      this.course.course.code,
      this.parentCourseCode,
      this.semester
    );
    this.booked = states.booked;
    this.passed = states.passed;
    this.getRequiredCourses();
    this.mobileView = window.innerWidth <= 600;
    window.addEventListener("resize", this.isMobileView);
  },
  computed: {
    ...mapGetters("studyplan", [
      "getBookedAndPassedThroughCourses",
      "getIsChildCourseBookedYet",
    ]),
    bookedOrPassedThroughCourses() {
      if (this.course.child_courses || this.course.child_courses.length != 0) {
        let bookedAndPassedThroughCourses =
          this.getBookedAndPassedThroughCourses(
            this.course.course.code,
            this.semester
          );
        return {
          bookedThrough: bookedAndPassedThroughCourses.bookedThrough,
          passedThrough: bookedAndPassedThroughCourses.passedThrough,
        };
      }
      return {};
    },
    unbookedChildCourses() {
      const array = [];
      for (let i in this.course.child_courses) {
        if (
          !this.getIsChildCourseBookedYet(
            this.course.child_courses[i].course.code
          )
        ) {
          array.push(this.course.child_courses[i].course);
        }
      }

      return array;
    },
  },
  methods: {
    isMobileView() {
      this.mobileView = window.innerWidth <= 600;
    },
    toggleBooked(courseCode, semester) {
      this.$store.dispatch("studyplan/toggleBookedStateOfCourseInSemester", {
        courseCode: courseCode,
        parentCourseCode: this.parentCourseCode,
        semester: semester,
        requiredCourses: this.requiredParentCourses,
      });
    },

    togglePassed(courseCode, semester) {
      this.$store.dispatch("studyplan/togglePassedStateOfCourseInSemester", {
        courseCode: courseCode,
        parentCourseCode: this.parentCourseCode,
        semester: semester,
        requiredCourses: this.requiredParentCourses,
      });
    },

    getNameOfChildCourse(childCourseCode) {
      for (let i in this.course.child_courses) {
        if (this.course.child_courses[i].course.code == childCourseCode)
          return this.course.child_courses[i].course.name;
      }
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

.checkbox {
  margin: 0 auto;
  width: 40%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

::v-deep .booked > label:first-of-type {
  color: rgba(253, 177, 62, 1);
}

::v-deep .passed > label:first-of-type {
  color: #76b900;
}

::v-deep .m-chckbox--group {
  transition: all 0.1s ease;
}

::v-deep .m-chckbox--ripple {
  width: 0;
  height: 0;
  transform: translate(0) !important;
}

h3 {
  font-size: 18px;
}
h4 {
  color: $htwGruen;
}
.bookedThrough {
  color: $belegtFont;
}
.passedThrough {
  color: $htwGruen;
}

.course-content-container {
  padding-top: 10px;
}

.childCourses-course:hover {
  max-height: 20000px;
  min-height: 87px;
  height: auto;
  transition: max-height 1s ease-in-out;

  @media screen and (max-width: 600px) {
    max-height: 87px;
  }
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
    width: 100%;
  }

  &-course {
    background: rgba(193, 193, 193, 0.55);
    overflow: hidden;
    resize: none;
    border: 1px solid #c1c1c1;
    max-height: 87px;
    min-height: 87px;
    width: 20%;
    border-radius: 14px;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    margin: 9px;
    transition: max-height 0.3s ease-in-out;
    &:hover {
      background: rgba(193, 193, 193, 0.7);
    }

    @media screen and (max-width: 600px) {
      align-items: center;
    }

    &--booked {
      background: $belegtBackground;
      border: 1px solid $belegtFont;
      &:hover {
        background-color: rgba(253, 177, 62, 0.7) !important;
      }
    }

    &--passed {
      background: rgba(118, 185, 0, 0.45);
      border: 1px solid $htwGruen;
      &:hover {
        background-color: rgba(118, 185, 0, 0.7) !important;
      }
    }

    &-content {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 0 auto;
      width: 100%;

      &-container {
        min-height: 67px;
        padding-top: 20px;

        @media screen and (max-width: 600px) {
          min-height: 0px;
          padding-top: 0px;
        }
      }

      &-text {
        max-width: 100%;
        height: 100%;
        border-radius: 14px;

        &--code {
          font-weight: 700;
        }

        p {
          font-size: 12px;
          padding: 3px;
          margin: 0 auto;
          max-width: 100%;
          word-wrap: break-word;
          border-radius: 14px;

          @media screen and (max-width: 1000px) {
            max-width: 85% !important;
          }

          @media screen and (max-width: 800px) {
            max-width: 75% !important;
          }
        }
      }
    }
  }
}
</style>
