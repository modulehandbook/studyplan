<template>
  <div class="courseSelection">
    <BaseCourseSelectionColumn
      :course-priority="0"
      :courses="courses"
      :other-courses="bookedCourses"
      :is-unbooked-courses="true"
      class="allCourses"
    />
    <div class="prioritiesBox">
      <div class="addPriorities">
        <h2>Please drag and drop your preference course</h2>
        <div>
          <button @click="addPriority">
            <font-awesome-icon :icon="['fas', 'plus-circle']" size="3x" />
          </button>
          <p>Prio hinzufügen</p>
        </div>
      </div>
      <BaseCourseSelectionRow
        class="priorities"
        v-for="course in bookedCourses"
        :key="course"
        :course-priority="course.priority"
        :courses="[course]"
        :other-courses="courses"
        :is-unbooked-courses="false"
      />
      <button @click="resetCourseSelection" class="reset">
        <p>Reset</p>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    courses: {
      type: Array,
      default: () => [],
    },
    bookedCourses: {
      type: Array,
      default: () => [],
    },
  },
  async mounted() {
    console.log("test");
  },
  methods: {
    addPriority() {
      this.$store.dispatch("courseselection/addCoursePriority");
    },
    resetCourseSelection() {
      this.$store.dispatch("courseselection/resetCoursePriority2");
    },
  },
};
</script>

<style lang="scss" scoped>
$htwGruen: #76b900;

.prioritiesBox {
  background-color: #b3b3b3;
  color: white;
  grid-column-start: 2;
  grid-column-end: 2;
  flex: auto;
  padding-top: 1rem;
  padding-bottom: 1rem;
  
  margin: 2rem;
  border-radius: 0.5rem;

  .addPriorities {
    border-bottom-style: solid;
    border-color: white;
    border-width: 0.125rem;
    padding: 1rem;
    h2 {
      font-size: large;
    }
  }

  .priorities {
    border-bottom-style: solid;
    border-color: white;
    border-width: 0.125rem;
    padding: 1rem;
  }
  .reset {
    margin: 2rem;
    padding-left: 0.125rem;
    padding-right: 0.125rem;
  }
}

.allCourses {
  grid-column-start: 1;
  grid-column-end: 1;
  flex: auto;
  margin: 2rem;
}
.courseSelection {
  display: inline-grid;
  align-items: stretch;
  padding: 2rem;
}
</style>
