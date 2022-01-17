<template>
  <div @drop.stop="moveCourse($event, 0)" @dragover.prevent @dragenter.prevent>
    <div class="gridContainer">
      <BaseCourseSelectionRowSidebar
        :priority="coursePriority"
        :is-unbooked-courses="isUnbookedCourses"
        class="gridItem1"
      />

      <div
        :class="{
          'gridItem2': course.code != '',
          'gridItem2Alt': course.code == '',
        }"
        v-for="(course, $courseIndex) in courses"
        :key="$courseIndex"
        draggable="true"
        @dragstart="pickupCourse($event, $courseIndex, coursePriority)"
        @drop.stop="moveCourse($event, $courseIndex)"
      >
        <div>
          <p>{{ course.code }} {{ course.name }}</p>
        </div>
      </div>
    </div>
    <br />
    <button @click="deleteCoursePriority()" class="prioButton" >
      Prio löschen
    </button>
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
    otherCourses: {
      type: Array,
      default: () => [],
    },
    coursePriority: {
      type: Number,
      default: 0,
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

  //Priority oder CoursePriority okay?
  methods: {
    deleteCoursePriority() {
      this.$store.dispatch("courseselection/deleteCoursePriority", {
        priority: this.coursePriority,
      });
    },

    courseWidth(course) {
      return course.ects * 30 + (course.ects / 5 - 1) * 30;
    },

    pickupCourse(e, fromCourseIndex, fromCoursePriority) {
      e.dataTransfer.effectAllowed = "move";
      e.dataTransfer.dropEffect = "move";
      e.dataTransfer.setData("from-course-index", fromCourseIndex);
      e.dataTransfer.setData("from-course-priority", fromCoursePriority);
    },

    moveCourse(e, toCourseIndex) {
      e.preventDefault();
      const fromCoursePriority = parseInt(
        e.dataTransfer.getData("from-course-priority"),
        10
      );
      //const fromSemesterIndex = e.dataTransfer.getData("from-semester-index");
      const fromCourseIndex = e.dataTransfer.getData("from-course-index");
      const toCoursePriority = this.coursePriority;

      this.$store.dispatch("courseselection/moveCourse", {
        fromCourseIndex,
        toCourseIndex,
        fromCoursePriority,
        toCoursePriority,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
$htwGruen: #76b900;
$belegtBackground: rgba(253, 177, 62, 0.55);

.gridContainer {
  display: inline-grid;
  width: 20rem;
  place-content: center;
}

.gridItem1 {
  grid-column-start: 1;
  grid-column-end: 1;
  width: 10rem;
  padding-top:0.5rem;
}

.gridItem2 {
  grid-column-start: 2;
  grid-column-end: 2;
  width: 12rem;
  place-content: left;
  border-radius: 20px;
  background: #c4c4c4;
  color: black;
  text-align: center;
  padding: 0.5rem 0.5rem;
  margin-bottom: 1rem;
}

.gridItem2Alt {
  margin: 0;
}
.prioButton{
  text-decoration: underline;
  place-content: center;
  background: none;
  border:none;
}
.prioButton:hover {
  color: rgb(56, 55, 55);
}
</style>
