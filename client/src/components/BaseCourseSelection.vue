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
          <p class="hMax">Anzahl der gewünschten Kurse</p>
          <button
            class="minus counterBtn"
            v-if="isEditable"
            @click="updateMaxCourses(maxCourses - 1)"
          >
            −
          </button>
          <p class="maxCourseContent">{{ maxCourses }}</p>
          <button
            class="plus counterBtn"
            v-if="isEditable"
            @click="updateMaxCourses(maxCourses + 1)"
          >
            +
          </button>
        </div>
      </div>
      <div class="scroll">
        <BaseCourseSelectionRow
          class="priorities"
          v-for="(course, index) in bookedCourses"
          :bookedCourses="bookedCourses"
          :key="course"
          :course-priority="course.priority"
          :courses="[course]"
          :other-courses="courses"
          :is-unbooked-courses="false"
          :semester="semester"
          :isEditable="isEditable"
          :index="index"
          :maxCourses="maxCourses"
        />
      </div>
      <div>
        <button class="edit" @click="isEditable = true" v-show="!isEditable">
          Ändern
        </button>
        <button
          @click="resetCourseSelection"
          class="reset"
          v-if="isEditable"
        >
          Zurücksetzen
        </button>
        <button v-if="isEditable" class="save" @click="saveCourses">
          Speichern
        </button>
      </div>
    </div>
    <button class="infoButton" @click="showInfo = true">
      Mehr Informationen
    </button>
    <transition name="fade" appear>
      <div
        :class="{
          overlay: showInfo,
        }"
      ></div>
    </transition>
    <transition name="slide" appear>
      <div class="info" v-if="showInfo">
        <h2>Wiederholer</h2>
        <p>
          Man gilt als Wiederholer, wenn der ausgewählte Kurs mindestens einmal
          belegt wurde. Weitere Informationen findest du auf der Hilfe Seite.
        </p>
        <br />
        <h2>Funktion</h2>
        <p>
          Per Drag &amp; Drop kannst du dann deine gewünschten Kurse nach Priorität hinzufügen.
          Gib dann auch an, wie viele der gelisteten Kurse du dir überhaupt für das Semester vorenehmen möchtest.
          Es ist sinnvoll, mehr Kurse zu priorisieren als du am Ende haben möchtest, weil es vorkommen kann, dass Kurse ausgebucht werden.
        </p>
        <br />
        <p>
          Wir bitten darum alle Angaben wahrheitsgemäß anzugeben, damit die Daten ein realistisches Bild abgeben.
          <br>
          Zudem enthalten die angegebenen Bachelor Wahlpflicht-Kurse die aktuellen Daten für das SoSe22. 
        </p>
        <button class="infoButton" @click="showInfo = false">Schließen</button>
      </div>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      isEditable: false,
      showInfo: false,
      new: false,
    };
  },
  computed: {
    ...mapGetters({
      isEmptyCourse: "courseselection/isEmptyCourse",
    }),
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
    maxCourses: {
      type: Number,
      default: 1,
    },
  },
  async mounted() {
    this.scrollToEnd();
    this.isEditable = false;
    if (this.bookedCourses.length == 0) {
      this.addPriority();
      this.addPriority();
      this.new = true;
    }
    if(!this.new && this.bookedCourses[this.bookedCourses.length-1].ects==0){
      this.$store.dispatch("courseselection/deleteCoursePriority", {
            priority: this.bookedCourses[this.bookedCourses.length-1].priority,
          });
    }
  },
  updated() {
    if (!this.isEmptyCourse && this.isEditable) {
      this.addPriority();
      this.new = false;
    }

    this.scrollToEnd();

    var count = 0;
    var emptyCourses = [];
    var pass = false;
    if (!this.new) {
      for (let i = this.bookedCourses.length - 1; i >= 0; i--) {
        pass = false;
        if (this.bookedCourses[i].ects == 0) {
          count++;
          pass = true;
        }
        if (count > 1 && pass) emptyCourses.push(this.bookedCourses[i]);
      }
      if (count > 1) {
        for (let i = 0; i < emptyCourses.length; i++) {
          this.$store.dispatch("courseselection/deleteCoursePriority", {
            priority: emptyCourses[i].priority,
          });
          this.updateMaxCourses(this.maxCourses);
        }
      }
    }
  },
  methods: {
    updateMaxCourses(amount) {
      let updateAmount = amount;
      if (amount < 1) updateAmount = 1;
      if (
        amount > this.bookedCourses.length - 1 &&
        this.bookedCourses.length > 1
      )
        updateAmount = this.bookedCourses.length - 1;
      if (amount > this.bookedCourses.length)
        updateAmount = this.bookedCourses.length;
      this.$store.dispatch("courseselection/updateMaxCourses", {
        maxCourses: updateAmount,
      });
    },
    scrollToEnd() {
      var container = document.querySelector(".scroll");
      var scrollHeight = container.scrollHeight;
      container.scrollTop = scrollHeight;
    },
    addPriority() {
      this.$store.dispatch("courseselection/addCoursePriority");
    },
    saveCourses() {
      this.isEditable = false;

      this.$store.dispatch("courseselection/deleteCoursePriority", {
        priority: this.bookedCourses[this.bookedCourses.length - 1].priority,
      });

      this.bookedCourses.splice(this.bookedCourses.length - 1, 1);
      this.$router.push("/coursesurvey");
    },
    resetCourseSelection() {
      this.$store.dispatch("courseselection/resetCoursePriority2");
      this.$store.dispatch("courseselection/updateMaxCourses", {
        maxCourses: 1,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
$htwGruen: #76b900;
.maxCourse {
  display: grid;
  justify-content: center;
  justify-items: center;
  align-content: space-evenly;
  align-items: center;
}
.hMax {
  grid-row: 1;
  grid-column-start: 1;
  grid-column-end: 4;
  padding-bottom: 0;
  margin-bottom: 0;
  margin-top: 0;
}
.plus {
  grid-column: 3;
  grid-row: 2;
  font-size: x-large;
}
.minus {
  grid-column: 1;
  grid-row: 2;
  font-size: x-large;
}
.maxCourseContent {
  grid-column: 2;
  grid-row: 2;
  padding-left: 0;
  padding-right: 0;
}
.infoButton {
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  margin-right: 2rem;
  margin-left: 2rem;
  padding: 0.5rem;
  border: none;
  border-radius: 0.25rem;
  font-weight: 600;
  align-items: center;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
}
.infoButton:hover {
  box-shadow: 0 12px 16px 0 rgba(0, 0, 0, 0.24),
    0 17px 50px 0 rgba(0, 0, 0, 0.19);
}
.info {
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
  background-color: #fff;
  border-radius: 16 px;
  padding: 25px;
  border-radius: 1rem;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  backdrop-filter: blur(2px);
}
.slide-enter-active,
.slide-leave-active {
  transition: opacity 0.5s;
}
.slide-enter,
.slide-leave-to {
  opacity: 0;
}

.tooltip:hover .tooltiptext {
  visibility: visible;
}
.instruction {
  margin-bottom: 1.5rem;
  margin-left: 3rem;
  //padding-right: 2rem;
  text-align: justify;
  font-size: x-small;
  color: rgb(34, 34, 34);
  max-width: 20rem;
}
.error-message {
  color: #f8153d;
  margin-bottom: 30px;
  margin-top: 0;
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
  .counterBtn {
    max-width: fit-content;
    margin-top: 0.2rem;
    margin-bottom: 0.5rem;
    margin-right: 1rem;
    margin-left: 1rem;
    padding: 0.5rem;
    border: none;
    border-radius: 0.25rem;
    font-weight: 600;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
      0 4px 6px -4px rgb(0 0 0 / 0.1);
  }
  .counterBtn:hover:enabled {
    box-shadow: 0 12px 16px 0 rgba(0, 0, 0, 0.24),
      0 17px 50px 0 rgba(0, 0, 0, 0.19);
  }
  .reset {
    float: left;
    margin-top: 0.8rem;
    margin-bottom: 0.5rem;
    margin-left: 0.5rem;
    // padding-top: 0.5rem;
    // padding-bottom: 0.5rem;
    padding: 0.5rem;
    border: none;
    border-radius: 0.25rem;
    font-weight: 600;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
      0 4px 6px -4px rgb(0 0 0 / 0.1);
  }
  .reset:hover:enabled {
    box-shadow: 0 12px 16px 0 rgba(0, 0, 0, 0.24),
      0 17px 50px 0 rgba(0, 0, 0, 0.19);
  }
  .save {
    float: right;
    margin-top: 0.8rem;
    margin-bottom: 0.5rem;
    margin-left: 1.5rem;
    margin-right: 0.5rem;
    padding: 0.5rem;
    border: none;
    border-radius: 0.25rem;
    background: rgb(163, 223, 145);
    font-weight: 600;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
      0 4px 6px -4px rgb(0 0 0 / 0.1);
  }
  .save:hover:enabled {
    box-shadow: 0 12px 16px 0 rgba(0, 0, 0, 0.24),
      0 17px 50px 0 rgba(0, 0, 0, 0.19);
  }
  .edit {
    float: right;
    margin-top: 0.8rem;
    margin-bottom: 0.5rem;
    margin-right: 0.5rem;
    padding: 0.5rem;
    border: none;
    border-radius: 0.25rem;
    background: rgb(145, 201, 223);
    font-weight: 600;
    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1),
      0 4px 6px -4px rgb(0 0 0 / 0.1);
  }
  .edit:hover:enabled {
    box-shadow: 0 12px 16px 0 rgba(0, 0, 0, 0.24),
      0 17px 50px 0 rgba(0, 0, 0, 0.19);
  }
}

.allCourses {
  grid-column-start: 1;
  grid-column-end: 1;
  grid-row-start: 1;
  grid-row-end: 5;
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

.overlay {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(2px);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
