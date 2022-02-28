<template>
  <div @drop.stop="moveCourse($event, 0)" @dragover.prevent @dragenter.prevent>
    <h3>Internationaler Studiengang Medieninformatik</h3>
    <div
      class="courses"
      :class="{ shake : $parent.tappedPrio > 0 }"
      :style="{ 'animation-delay' : Math.random()+'s' } "
      v-for="(course, $courseIndex) in courses"
      :key="$courseIndex"
      :draggable="isEditable"
      @dragstart="pickupCourse($event, $courseIndex, coursePriority)"
      @drop.stop="moveCourse($event, $courseIndex)"
    >
      <router-link
        class="courseContentContainer"
        :to="{
          name:'baseCourseSelectionDetails',
          params: {
            code: course.code,
            semester: semester.name,
          },
        }"
        draggable="false"
      >
        <div v-on="isEditable && $parent.tappedPrio > 0 ? { click: (e) => tapHandler(e, $courseIndex, $parent.tappedPrio) } : {}">
          <p>{{ course.code }}<br />{{ course.name }}</p>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  props: {
    semester: {
      type: Object,
    },
    isEditable: {
      type: Boolean,
    },
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
    tapHandler(e, courseIndex, tappedPrio) {
      e.preventDefault();
      e.stopPropagation();

      const fromCourseIndex = courseIndex,
        toCourseIndex = 0,
        fromCoursePriority = 0,
        toCoursePriority = tappedPrio;

      this.$store.dispatch("courseselection/moveCourse", {
        fromCourseIndex,
        toCourseIndex,
        fromCoursePriority,
        toCoursePriority,
      });

      this.$parent.tappedPrio = 0;
      this.$parent.scrollTo(document.getElementById("prioritiesBox"));
    }
  },
};
</script>

<style lang="scss" scoped>
$htwGruen: #76b900;
$belegtBackground: rgba(253, 177, 62, 0.55);

a {
  text-decoration: none;
  color: inherit;
}
.courses {
  margin-left: auto;
  margin-right: auto;
  width: 12rem;
  border-style: solid;
  border-radius: 20px;
  border-width: 0.125rem;
  border-color: #7c7c7c;
  color: black;
  text-align: center;
  margin-bottom: 1rem;

  a {
    
  }
}
.courses:hover {
  background: rgba(245, 243, 243, 0.7);
}
.courseContentContainer{
  transform: translate(0, 0);
  min-height: 87px;
  border-radius: 14px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 0.2s;
}

.touch {
  .shake {
    animation-name: shake;
    animation-duration: 1.5s;
    animation-iteration-count: infinite;
  }
  @keyframes shake {
    0% { transform: translate(1px, 1px) rotate(0deg); }
    10% { transform: translate(-1px, -1px) rotate(-1deg); }
    20% { transform: translate(-1px, 0px) rotate(1deg); }
    30% { transform: translate(1px, 1px) rotate(0deg); }
    40% { transform: translate(1px, -1px) rotate(1deg); }
    50% { transform: translate(-1px, 1px) rotate(-1deg); }
    60% { transform: translate(-1px, 1px) rotate(0deg); }
    70% { transform: translate(1px, 1px) rotate(-1deg); }
    80% { transform: translate(-1px, -1px) rotate(1deg); }
    90% { transform: translate(1px, 1px) rotate(0deg); }
    100% { transform: translate(1px, -1px) rotate(-1deg); }
  }
}
</style>

