<template>
  <div>

    <div
      class="semesterRow"
      @drop.stop="moveCourse($event, course)"
      @dragover.prevent
      @dragenter.prevent
    >
      <BaseCourseSelectionRowSidebar
        :priority="1"
        :isUnbookedCourses="isUnbookedCourses"
      />

      <div class="courses">
        <div
          class="course"
          v-for="(course, $courseIndex) in courses"
          :key="$courseIndex"
          draggable="true"
          @dragstart="pickupCourse($event, course, $courseIndex)"
          @drop.stop="moveCourse($event, courses, $courseIndex)"
          :style="{
            width: `${courseWidth(course)}px`,
          }"
        >
          <div
            class="course-content-container" 
            :class="{
                'course-content-container-content--booked': true,
                'course-content-container-content--passed': false,
              }"
          >
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
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    courses: {
      type: Array,
      default: () => [],
    },
    coursePriority: {
      type: Number,
    },
    isUnbookedCourses: {
      type: Boolean,
      required: true,
    },
  },

  computed: {
    ...mapState("course", ["course"]),
    ...mapState("courseselection", ["courseSelection"]),
  },
  methods: {
    courseWidth(course) {
      return course.ects * 30 + (course.ects / 5 - 1) * 30;
    },

    pickupCourse(e, fromCourseIndex, fromCoursePriority) {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.dropEffect = "move";
      e.dataTransfer.setData("from-course-index", fromCourseIndex);
      e.dataTransfer.setData("from-course-priority", fromCoursePriority);
      console.log(fromCourseIndex);
    },

    moveCourse(e, toCourses, toCourseIndex) {
      e.preventDefault();
      console.log(toCourses);
      console.log(toCourseIndex)
      //const fromSemesterIndex = e.dataTransfer.getData("from-semester-index");
    //  const fromCourses =
      //  this.coursesInSemester[fromSemesterIndex].plannedCourses;
    //  const fromCourseIndex = e.dataTransfer.getData("from-course-index");

    //  this.$store.dispatch("studyplan/moveCourse", {
    //    fromCourses,
    //    fromCourseIndex,
      //  toCourses,
    //    toCourseIndex,
    //  });
    },
  },
};
</script>

<style lang="scss" scoped>
$htwGruen: #76b900;
$belegtBackground: rgba(253, 177, 62, 0.55);

.semesterRow {
  max-width: 100%;
  display: grid;
  grid-template-columns: 0.2fr 0.8fr;
  row-gap: 0px;

  .courses {
    min-width: 0;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;

    .course {
      margin: 20px 25px 20px 0;
      display: flex;
      align-items: center;
      min-height: 87px;
      transform: translate(0, 0);

      a {
        text-decoration: none;
        color: inherit;
      }

      &-content-container {
        transform: translate(0, 0);
        min-height: 87px;
        border-radius: 14px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: 0.2s;

        &-content {
          display: flex;
          justify-content: center;
          align-items: center;
          margin: 0 auto;
          width: 100%;
          min-height: 87px;
          background: rgba(193, 193, 193, 0.55);
          background-size: 100px 100px;
          border: 1px solid rgba(193, 193, 193, 0.3);
          border-radius: 14px;
          &:hover {
            background: rgba(193, 193, 193, 0.7);
          }

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
</style>
