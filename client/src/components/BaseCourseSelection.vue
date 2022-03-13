<template>
<div :class="{ touch: isTouchDevice }">
  <button class="infoButton" @click="showInfo = true">
      Anleitung und wichtige Hinweise
  </button>
  <div>
    <div class="courseSelection">
      <BaseCourseSelectionColumn
        :course-priority="0"
        :courses="courses"
        :other-courses="bookedCourses"
        :is-unbooked-courses="true"
        :isEditable="isEditable"
        :semester="semester"
        :tappedPrio="tappedPrio"
        id="allCourses"
        @click="resetTappedPrio"
      />
      <div id="prioritiesBox">
        <div class="addPriorities">
          <h3>Kursauswahl</h3>
        </div>
        <div class="scroll">
          <BaseCourseSelectionRow
            class="priorities"
            :id="'asd'+bookedCourses.length"
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
            :isTouchDevice="isTouchDevice"
            @click="isTouchDevice && isEditable ? prioTapHandler(course.priority) : null"
            v-bind:data-index="index"
          />
        </div>
        <div class="maxCourse addPriorities">
            <p class="hMax">Anzahl der gewünschten Kurse</p>
            <button
              id="minus"
              class="counterBtn"
              v-if="isEditable"
              @click="updateMaxCourses(maxCourses - 1)"
            >
              −
            </button>
            <p class="maxCourseContent">{{ maxCourses }}</p>
            <button
              id="plus"
              class="counterBtn tooltip"
              v-if="isEditable"
              @click="updateMaxCourses(maxCourses + 1)"
            ><span class="tooltiptext">Füge zuerst weitere Kurse hinzu</span>
              +
            </button>
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
            Weiter
          </button>
        </div>
      </div>
      </div>
      <transition name="fade" appear>
        <div
          :class="{
            overlay: showInfo,
          }"
        ></div>
      </transition>
      <transition name="slide" appear>
        <div class="info" v-if="showInfo">
          <h2>Anleitung</h2>
          <ol>
            <li>Im LSF meldest du dich wie gewohnt für alle Wahlpflichtkurse an, die du dir vorstellen kannst im kommenden Semester zu belegen.</li>
            <li>Hier im Formular legst du fest, welche dieser angemeldeten Kurse dir am wichtigsten sind und wie viele dieser Kurse du dir überhaupt für das Semester vorenehmen möchtest. <br>Deine Änderungen werden automatisch gespeichert.</li>
          </ol>
          Die Kursbelegung über den Studyplan gilt aktuell nur für Wahlpflichtkurse aus dem IMI-Bachelor-Studiengang.
          <br />
          <h2>Hilfestellung zum Formular</h2>
          <p>
            Es ist sinnvoll, mehr Prioritäten festzulegen als die Anzahl gewünschter Kurse, weil es vorkommen kann, dass beliebte Kurse ausgebucht werden.
          </p>
          <h4>&quot;Wiederholer&quot;</h4>
          <p>
            Man gilt als Wiederholer, wenn der ausgewählte Kurs zuvor mindestens einmal
            belegt wurde. Weitere Informationen findest du auf der Hilfe-Seite.
          </p>
          <h4>&quot;Anzahl der gewünschten Kurse&quot;</h4>
          <p>
            Du hast sicherheitshalber viele Kurse angemeldet und priorisierst, und damit deine Präferenzen bekundet. Aber das heißt nicht unbedingt, dass du gleich alle belegen willst. Mit dieser Zahl legst du die Obergrenze an priorisierten Kursen fest.
          </p>
          <br>
          <p>
            <small>
              Wir bitten darum, alle Angaben wahrheitsgemäß zu machen, damit die Daten ein realistisches Bild abgeben.
              Zudem enthalten die angegebenen Bachelor Wahlpflicht-Kurse die aktuellen Daten für das SoSe22.
            </small>
          </p>
          <button class="infoButton" @click="showInfo = false">Schließen</button>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Login from '../views/Login.vue';

export default {
  components: { Login },
  data() {
    return {
      isTouchDevice: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.matchMedia("(max-width: 700px)").matches,
      tappedPrio: 0,
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
      default: 0,
    },
  },
  async mounted() {
    this.scrollToEnd();
    this.isEditable = false;
    if (this.bookedCourses.length == 0) {
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
      const showTooltip = () => {
        const plusTooltipClassList = document.getElementById("plus").firstChild.classList;
        plusTooltipClassList.add("active");
        setTimeout(() => plusTooltipClassList.remove("active"), 2500);
      }
      let updateAmount = amount;
      if (amount < 0) updateAmount = 0;
      if (
        amount > this.bookedCourses.length - 1 &&
        this.bookedCourses.length > 0
      ) {
        updateAmount = this.bookedCourses.length - 1;
        showTooltip();
      }
      if (amount > this.bookedCourses.length) {
        updateAmount = this.bookedCourses.length;
        showTooltip();
      }
      this.$store.dispatch("courseselection/updateMaxCourses", {
        maxCourses: updateAmount,
      });
    },
    scrollToEnd() {
      var container = document.querySelector(".scroll");
      var scrollHeight = container.scrollHeight;
      container.scrollTop = scrollHeight;
    },
    scrollTo(element) {
      window.scroll({
        behavior: "smooth",
        top: element.offsetTop
      });
    },
    scrollToBottomOf(element) {
      let bottom = element.getBoundingClientRect().bottom;
      window.scrollBy({
        behavior: "smooth",
        top: element.getBoundingClientRect().bottom-document.body.clientHeight
      });
    },
    prioTapHandler(prio) {
      this.tappedPrio = prio;
      this.scrollTo(document.getElementById("allCourses"));
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
        maxCourses: 0,
      });
    },
    resetTappedPrio() {
      this.tappedPrio = 0;
    }
  },
};
</script>

<style lang="scss" scoped>
$htwGruen: #76b900;
h4 {
  margin-bottom: 0;
}
h4+p, h2+p {
  margin-top: 0.5em;
}
li {
  text-align: left;
}
.maxCourse {
  padding: 0.85rem 0.75rem 0.75rem;
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
#plus {
  grid-column: 3;
  grid-row: 2;
  font-size: x-large;
}
#minus {
  grid-column: 1;
  grid-row: 2;
  font-size: x-large;
}
.maxCourseContent {
  grid-column: 2;
  grid-row: 2;
  padding-left: 0;
  padding-right: 0;
  font-weight: bold;
}
button {
  cursor: pointer;
}
.infoButton {
  margin-top: 0.5rem;
  margin-bottom: 1.5rem;
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
  max-width: 60rem;
  max-height: 80vh;
  transition: max-height 0.3s ease-in-out;
  border: 1px solid #c1c1c1;
  overflow-y: scroll;
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
#prioritiesBox {
  background-color: #b9b9b9;
  color: white;
  grid-column-start: 2;
  grid-column-end: 2;
  grid-row-start: 1;
  grid-row-end: 2;
  min-width: 25rem;
  height: fit-content;
  border-radius: 0.5rem;
  margin: 0 0.75rem;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
    > *:not(:last-child) {
      border-bottom: 5px solid white;
    }

  .addPriorities {
    border-bottom-style: solid;
    border-color: white;
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .priorities {
    padding: 1rem;
  }

  .priorities:not(:last-child) {
    border-bottom-style: solid;
    border-color: white;
    border-width: 0.125rem;
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

#allCourses {
  grid-column-start: 1;
  grid-column-end: 1;
  grid-row-start: 1;
  grid-row-end: 5;
  min-width: 20rem;
  margin: 0.75;
}
.courseSelection {
  display: flex;
  justify-content: space-evenly;
  padding: 2rem;
  padding-top: 0rem;
}

.scroll {
  background-color: #a7a7a7;
  max-height: 30rem;
  overflow-y: auto;
}
.scroll:empty {
  display: none 
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

.tooltip {
  position: relative;
}

.tooltip .tooltiptext {
  background-color: #555;
  color: #fff;
  font-size: initial;
  text-align: center;
  border-radius: 6px;
  padding: 5px;
  position: absolute;
  z-index: -1;
  bottom: 125%;
  left: 50%;
  width: 9rem;
  margin-left: calc(-4.5rem - 3px);
  opacity: 0;
  transition: opacity 0.5s ease-out;
}

.tooltip .tooltiptext::after {
  content: "";
  position: absolute;
  top: 100%;
  left: 50%;
  margin-left: -5px;
  border-width: 5px;
  border-style: solid;
  border-color: #555 transparent transparent transparent;
}

.tooltip .tooltiptext {
  &.active {
    opacity: 1;
    z-index: 100;
  }
}

.touch {
  .courseSelection {
    flex-direction: column-reverse;
    padding: 0;
  }

  .info {
    max-width: 80vw;
  }

  #prioritiesBox {
    min-width: initial;
    margin: 0 auto;
  }

  .priorities {
    padding-left: 0;
    padding-right: 0; 
  }

  .scroll {
    max-height: initial;
  }
}

</style>
