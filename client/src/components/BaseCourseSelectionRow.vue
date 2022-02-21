<template>
  <div @drop.stop="moveCourse($event, 0)" @dragover.prevent @dragenter.prevent>
    <div class="gridContainer">
      <BaseCourseSelectionRowSidebar
        :isUnbookedCourses="false"
        :priority="coursePriority"
        class="gridItem1"
      />
      <div
        :class="{
          'gridItem2': course.code != '',
          'gridItem2Alt': course.code == '',
        }"
        v-for="(course, $courseIndex) in courses"
        :key="$courseIndex"
        :draggable="isEditable"
        @dragstart="pickupCourse($event, $courseIndex, coursePriority)"
        @drop.stop="moveCourse($event, $courseIndex)"
      >
        <router-link
          v-if="course.code != ''"
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
          <div>
            <p :class="{ notEditable : !isEditable }">{{ course.code }} {{ course.name }}</p>
          </div>
        </router-link>
        <small v-else>Kurs reinziehen</small>
      </div>
    </div>
    <br />
    <div
    v-for="(course, $courseIndex) in courses" 
    :key="$courseIndex"
    >
    <form name="form" v-if="course.code != ''" 
     @submit.prevent="updateCourses">
        <div :class="{ error: v$.wiederholer.$error}">
        Wiederholer:
        <label label for="yes" v-if="course.isRepeater || isEditable">Ja</label>
        <input  
          @change="courseRepeaterChanged($event)"     
          @blur="v$.wiederholer.$touch()"
          :disabled="!isEditable"
                type="radio"
                v-if="isEditable"
                v-model="course.isRepeater"
                :id="'ja'+index"
                :name="'test'+index"
                :value="true"
              />
        <label label for="no" v-if="!course.isRepeater || isEditable">Nein</label>
        <input
                @blur="v$.wiederholer.$touch()"
                @change="courseRepeaterChanged($event)" 
                :disabled="!isEditable"
                type="radio"
                v-if="isEditable"
                v-model="course.isRepeater"
                :id="'nein'+index"
                :name="'test'+index"
                :value="false"
              />
        </div>
      </form>
    </div>
    <button @click="deleteCoursePriority()" :class="{ prioButtonDisable: !isEditable, prioButton: isEditable}" :disabled="!isEditable" v-if="courses[0].code != '' && isEditable">
      Prio löschen
    </button>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { required } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

export default {
    setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      wiederholer: undefined,
      //wiederholer: [],
      // wiederholerOptions: [
      //   { name: "ja", value: true },
      //   { name: "nein", value: false },
      // ],
    };
  },

  validations() {
    return {
      wiederholer: {
        required,
      },
    };
  },

  props: {
    bookedCourses: {
      type: Array,
      default: () => [],
    },
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
    index: {
      type: Number,
      default: 0,
    },
    maxCourses: {
      type: Number,
      default: 0,
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
      var updateAmount = this.maxCourses;
      if (updateAmount > this.bookedCourses.length-1&& updateAmount>0) updateAmount = this.bookedCourses.length-1;
      if (this.bookedCourses.length==1 || this.bookedCourses.length==0) updateAmount = 1;
      this.$store.dispatch("courseselection/updateMaxCourses", {
        maxCourses: updateAmount,
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
    async courseRepeaterChanged(event){
      const isRepeater = event.target.value
      this.$store.dispatch("courseselection/updateIsRepeater", {index: this.index, isRepeater: isRepeater});
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

a {
  text-decoration: none;
  color: inherit;
}
.notEditable {
  opacity: 0.5;
}
.gridContainer {
  display: inline-grid;
  width: 20rem;
  place-content: center;
}

.gridItem1 {
  grid-column-start: 1;
  grid-column-end: 1;
  padding-top:0.5rem;
  width: 10rem;
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
  // border-color: #7c7c7c;
  // border-style: solid;
  // border-width: 0.125rem;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}
.gridItem2:hover {
  background: rgba(224, 223, 223, 0.7);
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
.prioButtonDisable{
  text-decoration: underline;
  place-content: center;
  background: none;
  border:none;
}
.prioButton:hover {
  //background-color: #4CAF50; /* Green */
  color: rgb(56, 55, 55);
}
.error-message {
  color: #f8153d;
  margin-bottom: 30px;
  margin-top: 0;
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
</style>
