<template>
  <div class="courseSelection">
    <BaseCourseSelectionColumn
      :course-priority="0"
      :courses="courses"
      :other-courses="bookedCourses"
      :is-unbooked-courses="true"
      :isEditable="isEditable"
      :semester="semester"
      class="allCourses"
    />
    <div class="prioritiesBox">
      <div class="addPriorities">
        <h3>Ziehe deine Kurse per Drag&amp;Drop hier rein</h3>
        <div>
          <button @click="addPriority" class="button" :disabled="!isEditable">
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
        :semester="semester"
        :isEditable="isEditable"
      />
      </div>
      <div>
        <button class="edit" @click="isEditable=true" :disabled="isEditable">
          Ändern
        </button>
        <button @click="resetCourseSelection" class="reset" :disabled="!isEditable">
          Zurücksetzen
        </button>
        <button :disabled="v$.$invalid || !isEditable" class="save" @click="isEditable=false">
          Speichern
        </button>
      </div>
        <p class="instruction"> 
          <u class="tooltip">Wiederholer
            <span class="tooltiptext">Man gilt als Wiederholer, wenn der ausgewählte Kurs mindestens einmal belegt wurde. Weitere Informationen finden Sie auf der Hilfe Seite.</span>
          </u>
          <br> <br>
          Bitte tätige alle Angaben wahrheitsgemäß!
          Diese werden nach der Belegungsphase auf Richtigkeit überprüft. Falsche
          Angaben führen zur Abmeldung aller Kurse.
          <br> <br>
        	<u>Bitte fülle alle Felder aus oder entferne leere Felder.</u>
        </p>
    </div>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";

export default {
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      isEditable: true,
    };
  },
  props: {
    semester: {
      type: Object,
    },
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
.tooltip {
  color:rgb(24, 24, 156);
}
.tooltip .tooltiptext {
  visibility: hidden;
  width: 200px;
  background-color: black;
  color: #fff;
  text-align: left;
  border-radius: 6px;
  //padding: 5px 0;
  padding: 5px;

  /* Position the tooltip */
  position: absolute;
  z-index: 1;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}
.instruction{
  margin-bottom: 1.5rem;
  margin-left: 3rem;
  //padding-right: 2rem;
  text-align: justify;
  font-size: x-small;
  color:rgb(34, 34, 34);
  max-width: 20rem;
}
.error-message {
  color: #f8153d;
  margin-bottom: 30px;
  margin-top: 0;
}
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
  grid-row-start: 1;
  grid-row-end: 2;
  flex: auto;
  //padding-bottom: 0.5rem;
  min-width: 20rem;
  border-radius: 0.5rem;
  margin: 0.75rem;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);

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
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    margin-right: 2rem;
    margin-left: 1rem;
    // padding-top: 0.5rem;
    // padding-bottom: 0.5rem;
    padding:0.5rem;
    border:none;
    border-radius: 0.25rem;
    font-weight: 600;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  }
  .reset:hover:enabled {
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
  } 
  .save {
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    margin-left: 1.5rem;
    // padding-top: 0.5rem;
    // padding-bottom: 0.5rem;
    padding:0.5rem;
    border:none;
    border-radius: 0.25rem;
    background:rgb(163, 223, 145);
    font-weight: 600;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  }
  .save:hover:enabled {
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
  } 
  .edit {
    margin-top: 1rem;
    margin-bottom: 0.5rem;
    padding:0.5rem;
    border:none;
    border-radius: 0.25rem;
    background:rgb(145, 201, 223);
    font-weight: 600;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  }
  .edit:hover:enabled {
    box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
  }
}

.allCourses {
  grid-column-start: 1;
  grid-column-end: 1;
  grid-row-start: 1;
  grid-row-end: 3;
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
