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
        <h3>Kursauswahl</h3>
        <div class="maxCourse">
          <p class="hMax">max. Kurse</p>
          <button class="minus" @click="maxCourse -= 1">-</button>
          <p class="maxCourseContent">{{maxCourse}}</p>
          <button class="plus" @click="maxCourse += 1">+</button>
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
        <div>
          <button @click="addPriority" class="button" :disabled="!isEditable">
            <font-awesome-icon :icon="['fas', 'plus-circle']" size="2x" />
          </button>
          <p style="margin-top:0.5rem;">Prio hinzufügen</p>
        </div>
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
    </div>
    <button class="infoButton" @click="showInfo=true">
      Mehr Informationen
    </button>
    <transition name="slide" appear >
      <div class="info" v-if="showInfo"> 
        <h2>Wiederholer</h2>
        <p>Man gilt als Wiederholer, wenn der ausgewählte Kurs mindestens einmal belegt wurde. Weitere Informationen finden Sie auf der Hilfe Seite.</p>
        <br> <br>
        <h2>Funktion</h2>
        <p>Per Drag&amp;Drop kannst du deine gewünschten Kurse hinzufügen.</p>
        <br> <br>
        <h2>Achtung!</h2>
        <p>Bitte tätige alle Angaben wahrheitsgemäß!
        Diese werden nach der Belegungsphase auf Richtigkeit überprüft. Falsche
        Angaben führen zur Abmeldung aller Kurse.
        <br> <br>
      	Zudem sollten alle Felder ausgefüllt oder entfernt werden, um Änderungen speichern zu können
        </p>
        <button class="infoButton" @click="showInfo=false">
          Schließen
        </button>
      </div>
    </transition>
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
      isEditable: false,
      showInfo: false,
      maxCourse: 0,
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
    this.isEditable=false;
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
.maxCourse{
  display: grid;
}
.hMax{
  grid-row:1;
  grid-column-start: 1;
  grid-column-end: 4;
  padding-bottom: 0;
  margin-bottom: 0;
  margin-top: 0;
}
.plus{
  text-align: left;
  grid-column: 3;
  grid-row:2;
  border:none;
  background-color: #b3b3b3;
  font-size: x-large;
}
.minus{
  text-align: right;
  grid-column: 1;
  grid-row:2;
  border:none;
  background-color: #b3b3b3;
  font-size: x-large;
}
.maxCourseContent{
  grid-column: 2;
  grid-row:2;
  padding-left: 0;
  padding-right: 0;
}
.infoButton{
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  margin-right: 2rem;
  margin-left: 2rem;
  padding:0.5rem;
  border:none;
  border-radius: 0.25rem;
  font-weight: 600;
  align-items: center;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}
.infoButton:hover {
  box-shadow: 0 12px 16px 0 rgba(0,0,0,0.24), 0 17px 50px 0 rgba(0,0,0,0.19);
}
.info{
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 99;
  width: 100%;
  max-width: 30rem;
  transition: max-height 0.3s ease-in-out;
  border: 1px solid #c1c1c1;
  overflow: hidden;
  border-width: 0.25rem;
  border-color: #76b900;
  background-color: #FFF;
  border-radius: 16 px;
  padding: 25px;
  border-radius: 1rem;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}
.slide-enter-active,
.slide-leave-active{
  transition: opacity .5s;
}
.slide-enter,
.slide-leave-to{
  opacity: 0;
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
  margin-top:0.5rem;
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
  min-width: 25rem;
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
    margin-top: 0.5rem;
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
    margin-top: 0.5rem;
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
    margin-top: 0.5rem;
    margin-bottom: 1rem;
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
  grid-row-end: 4;
  flex: auto;
  min-width: 20rem;
  margin: 0.75rem;
}
.courseSelection {
  // display: inline-grid;
  // align-items: stretch;
  display: inline-grid;
  padding: 2rem;
  padding-top: 0rem;
  justify-content: start;
  align-items: left;
}

.scroll {
  max-height: 30rem;
  overflow-y: auto;
}
</style>
