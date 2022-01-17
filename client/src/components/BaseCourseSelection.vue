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
        <h3>Please drag and drop your preference course</h3>
        <div>
          <button @click="addPriority" class="button">
            <font-awesome-icon :icon="['fas', 'plus-circle']" size="3x" />
          </button>
          <p>Prio hinzufügen</p>
        </div>
      </div>
      <div class="scroll">
      <BaseCourseSelectionRow
        class="priorities"
        v-for="course in bookedCourses"
        :key="course"
        :course-priority="course.priority"
        :courses="[course]"
        :other-courses="courses"
        :is-unbooked-courses="false"
      />
      </div>
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
    this.scrollToEnd();
  },
  updated() {
    this.scrollToEnd();
  },
  methods: {
    scrollToEnd() {
      var container = document.querySelector(".scroll");
      var scrollHeight = container.scrollHeight;
      container.scrollTop = scrollHeight;
    },
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

.button{
  text-decoration: none;
  background: white;
  border: none;
  padding:0px;
  border-radius: 5rem;
}
.button:hover {
  //background-color: #4CAF50; /* Green */
  color: rgb(56, 55, 55);
}
.prioritiesBox {
  background-color: #b3b3b3;
  color: white;
  grid-column-start: 2;
  grid-column-end: 2;
  flex: auto;
  padding-bottom: 0.5rem;
  min-width: 20rem;
  border-radius: 0.5rem;
  margin: 0.75rem;

  .addPriorities {
    border-bottom-style: solid;
    border-color: white;
    border-width: 0.125rem;
    padding-left: 1rem;
    padding-right: 1rem;
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
  min-width: 20rem;
  margin: 0.75rem;
}
.courseSelection {
  // display: inline-grid;
  // align-items: stretch;
  display: inline-grid;
  padding: 2rem;
  justify-content: start;
  align-items: left;
}

.scroll {
  max-height: 20rem;
  overflow-y: auto;
}
</style>
