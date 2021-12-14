<template>
  <div>
    <div class="container">
      <div class="shadowBox">
        <div
          class="semesterRow"
          v-for="semester in coursesInSemester"
          :key="semester.id"
        >
          <div class="sidebar">
            <p class="semesterCount">{{ semester[0].semester }}. Semester</p>
            <p>{{ ects(semester) }} ECTS</p>
          </div>

          <div class="courses">
            <div
              class="course"
              :style="{ width: `${courseWidth(course)}px` }"
              v-for="course in semester"
              :key="course.id"
            >
              <router-link
                class="course-content-container"
                :to="{
                  name: 'exampleStudyplanBaseModalParentCourse',
                  params: {
                    program: studyplan.program.code,
                    version: studyplan.program.version,
                    code: course.code,
                  },
                }"
              >
                <div class="course-content-container-content">
                  <div class="course-content-container-content-text">
                    <p class="course-content-container-content-text--code">
                      {{ course.code }}
                    </p>
                    <p
                      :style="{
                        fontSize: courseWidth(course) < 50 ? '9px' : '12px',
                      }"
                    >
                      {{ course.name }}
                    </p>
                  </div>
                </div>
              </router-link>
            </div>
          </div>
        </div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    coursesInSemester: Object,
  },
  methods: {
    ects(semester) {
      var ects = 0;
      for (let i in semester) {
        ects += semester[i].ects;
      }
      return ects;
    },
    courseWidth(course) {
      return course.ects * 30 + (course.ects / 5 - 1) * 25;
    },
  },
  computed: {
    studyplan () {
      return this.$store.state.user.user.studyPlan;
    },
    ...mapState(["course"]),
    //Julia's version below:  //Don't know why its not working -Ben
    //...mapState("course", ["course"]),
    //...mapState("studyplan", ["studyPlan"]),
  },
};
</script>

<style lang="scss" scoped>
$htwGruen: #76b900;

.container {
  display: grid;
  margin: 0 auto;
  max-width: 1350px;
  border-radius: 20px;

  @media screen and (max-width: 1400px) {
    max-width: 90% !important;
  }

  .shadowBox {
    box-shadow: 0px 7px 4px rgba(0, 0, 0, 0.23);
    border-radius: 20px;
  }

  .semesterRow {
    max-width: 100%;
    display: grid;
    grid-template-columns: 0.2fr 0.8fr;
    background: white;
    row-gap: 0px;

    &:nth-child(odd) {
      background: rgba(118, 185, 0, 0.1);
    }
    &:first-of-type {
      border-radius: 20px 20px 0 0;
    }
    &:last-of-type {
      border-radius: 0 0 20px 20px;
    }

    .sidebar {
      min-height: 87px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      margin: 14px;
      .semesterCount {
        font-size: 18px;
        padding: 10px;
        font-weight: bold;
        color: $htwGruen;
      }
      p {
        margin: 0;
        font-weight: bold;
      }
    }

    .courses {
      min-width: 0;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;

      .course {
        padding: 20px 25px 20px 0;
        display: flex;
        align-items: center;

        a {
          text-decoration: none;
          color: inherit;
        }

        &-content-container {
          border-radius: 14px;
          position: relative;
          background: rgba(190, 235, 174, 1);
          min-height: 87px;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          transition: 0.2s;

          &:hover {
            background: rgba(190, 235, 174, 0.75);
          }

          &-content {
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 auto;
            width: 100%;
            min-height: 87px;

            &-text {
              max-width: 100%;
              height: 100%;
              overflow: hidden;

              p {
                font-size: 12px;
                font-weight: 700;
                padding: 3px 5px;
                margin: 0;
                max-width: 95%;
                word-wrap: break-word;
                border-radius: 14px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
