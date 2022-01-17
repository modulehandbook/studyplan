<template>
  <div @drop.stop="moveCourse($event, 0)" @dragover.prevent @dragenter.prevent>
    <h3>Internationaler Studiengang Medieninformatik</h3>
    <div
      v-for="(course, $courseIndex) in courses"
      :key="$courseIndex"
      draggable="true"
      @dragstart="pickupCourse($event, $courseIndex, coursePriority)"
      @drop.stop="moveCourse($event, $courseIndex)"
      class="border"
    >
      <div>
        <p class="ub-content">
          {{ course.code }} {{ course.name }}
        </p>
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
  methods: {
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
.ub-content{
  display: flex;
  align-items: center;
  padding-bottom: 10px;
}
.border{
  border-left-style: solid;
  border-right-style: solid;
  padding-left: 5px;
  border-width: 1px;
  border-color: #b3b3b3;
}
</style>
