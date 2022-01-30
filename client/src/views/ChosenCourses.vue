<template>
  <div v-if="!pending">
    <div
      v-if="!this.courseSelection || !this.courseSelection.semesterPlans"
      class="wrong-stage-wrapper"
    >
      <BaseHeading>
        <h2 class="wrong-stage-headline">
          Du hast keine Kurse gewählt.
        </h2></BaseHeading
      >
      <span class="wrong-stage-text">
        In der Belegungsphase hast du keine Kurse gewählt.
      </span>
    </div>
    <div
      v-else-if="
        (stage.debugStage === 'none' &&
        (stage.currentStage === 'EVALUATION' ||
        stage.currentStage === 'COURSE-RESULT')) ||
        (stage.debugStage === 'EVALUATION' ||
        stage.debugStage === 'COURSE-RESULT')
      "
    >
      <div v-if="(stage.debugStage === 'none' && stage.currentStage === 'EVALUATION') || stage.debugStage === 'EVALUATION'">
        <BaseHeading><h1>Meine Kurse</h1></BaseHeading>
        <div class="info-wrapper">
          <p><b>Hinweis:</b> Die Kursbelegungs-Phase ist beendet.</p>
          <p>
            Aktuell werden die Kurse verteilt.<br />
            In Kürze kannst du hier sehen, für welche Kurse du zugelassen
            wurdest.
          </p>
        </div>
        <p><br /></p>
      </div>
      <div class="courses-selection">
        <form @submit.prevent="removeChosenCourses">
          <div class="courses-wrapper">
            <div class="courses-block courses-block--chosen">
              <h2>Gewählte Kurse:</h2>
              <div
                v-for="course in this.courseSelection.semesterPlans[0]
                  .bookedCourses"
                :key="course.key"
                class="courses-content"
              >
                <div class="courses-content-label">
                  <p>{{ course.code }}</p>
                  <p>{{ course.name }}</p>
                </div>
                <br />
              </div>
            </div>

            <div v-if="this.user" class="courses-block courses-block--approved">
              <h2>Zugelassene Kurse:</h2>
              <div
                v-for="(course, index) in this.assignedCourses(
                  this.user.id || this.user._id
                )"
                :key="course.key"
                class="courses-content"
              >
                <div class="courses-content-label">
                  <p>{{ course.code }}</p>
                  <p>{{ course.name }}</p>
                  <input
                    type="checkbox"
                    id="markCourse"
                    v-model="coursesToRemove[index]"
                    name="GE"
                  />
                </div>
                <br />
              </div>
               <div class="delete-button-wrapper">
              <button class="delete-button" type="submit">
                Markierte Kurse abwählen
              </button>
            </div>
            </div>
          </div>
        </form>
      </div>
    </div>
    <div v-else class="wrong-stage-wrapper">
      <BaseHeading>
        <h2 class="wrong-stage-headline">
          Hier gibt es aktuell nichts zu sehen.
        </h2></BaseHeading
      >
      <span class="wrong-stage-text">
        Komm nach der Kursbelegungs-Phase wieder.
      </span>
    </div>
  </div>
</template>

<script>
import { mapState, useStore, mapGetters } from "vuex";
import { computed } from "vue";
import moment from "moment";
import BaseHeading from "../components/BaseHeading.vue";
export default {
  setup() {
    const store = useStore();
    return {
      stage: computed(() => store.state.stage),
    };
  },
  components: { BaseHeading },
  computed: {
    ...mapState("courseselection", ["courseSelection"]),
    ...mapState("user", ["user"]),
    ...mapGetters({
      assignedCourses: "modalcourse/getCoursesByUser",
    }),
    time() {
      return (stage, withPrefix) => {
        const deadline = new Date(this.stage.nextDates[stage].date);
        const gap = moment.duration(moment(deadline).diff(moment(Date.now())));
        return gap.locale("de").humanize(withPrefix);
      };
    },
  },
  async mounted() {
    this.pending = true;
    await this.$store
      .dispatch("courseselection/fetchCourseSelection", {
        userId: this.user.id || this.user._id,
      })
      .then(() => {
        //console.log(test);
        this.pending = false;
      })
      .catch((e) => {
        console.log(e);
      });
    await this.$store.dispatch("semester/fetchSemesters");
    await this.$store.dispatch("modalcourse/fetchCourses");
    this.pending = false;
  },
  data() {
    return {
      coursesToRemove: [],
      pending: false,
    };
  },

  methods: {
    marked: function () {
      var getBox = document.getElementById("markCourse");
      if (getBox.checked) {
        //console.log("checked");
      }
    },
    async removeChosenCourses() {
      if(confirm("Bist du dir sicher, dass du die markierten Kurse abwählen möchtest ?") == true){
      let helperArray = [];
      this.coursesToRemove.forEach((course, index) => {
        if (course)
          helperArray.push(
            this.assignedCourses(this.user.id || this.user._id)[index]
          );
      });
      await this.$store.dispatch("modalcourse/removeUserfromCourses", {
        coursesToRemoveUserFrom: helperArray,
        user: this.user.id || this.user._id,
      });
      this.coursesToRemove = [];
      }
    },
  },
};
</script>

<style lang="scss">
.delete-button-wrapper {
  width: 100%;
}
.delete-button {
  margin-left: auto;
  margin-top: 20px;
  -webkit-border-radius: 10;
  -moz-border-radius: 10;
  border-radius: 10px;
  font-family: Arial;
  color: #ffffff;
  font-size: 14px;
  background: #000000;
  padding: 5px 40px;
  text-decoration: none;
  border: 0;
}

.delete-button:hover {
  background: #292c2e;
  text-decoration: none;
  cursor: pointer;
}
.wrong-stage-wrapper {
  width: 700px;
  border-radius: 20px;
  color: black;
  text-align: center;
  padding: 10px 10px;
  margin: 40px auto;
  display: flex;
  flex-direction: column;
  height: 200px;
  background: #ffffff;
  border: 5px solid #7eb726;
  box-sizing: border-box;
  box-shadow: 6px 6px 18px 1px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
}
.info-wrapper {
  width: 700px;
  border-radius: 20px;
  color: black;
  text-align: center;
  padding: 10px 10px;
  margin: 10px auto;
  display: flex;
  flex-direction: column;
  height: 150px;
  background: #ffffff;
  border: 5px solid #7eb726;
  box-sizing: border-box;
  box-shadow: 6px 6px 18px 1px rgba(0, 0, 0, 0.25);
  border-radius: 10px;
}
.courses {
  $space: 15px;
  $htw-green: #3d5814;

  &-section {
    max-width: 1200px;
    margin: 0 auto;
  }

  &-wrapper {
    max-width: 1000px;
    margin: auto;
    display: flex;
    flex-flow: wrap;

    @media (max-width: 768px) {
      flex-flow: column;
    }

    h2 {
      font-style: normal;
      font-weight: bold;
      font-size: 24px;
      line-height: 1.5;
      color: #7eb726;
    }

    .button {
      width: 200px;
      margin: 30px auto;
      padding: $space 10px;
      border-radius: 10px;
      background: #000000;
      color: white;
      font-weight: 600;
      -webkit-border-radius: 10;
      -moz-border-radius: 10;
      &:hover {
        background: #292c2e;
        text-decoration: none;
        cursor: pointer;
      }
    }
  }

  &-block {
    flex: 0 0 calc(50% - ($space * 2));
    padding: 0 $space;
  }

  &-content {
    border: 1px solid $htw-green;
    border-radius: 10px;
    height: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    max-width: 350px;
    margin: $space auto;

    p {
      margin: 0;
    }

    input {
      position: absolute;
      right: $space;
      top: calc(50% - 6.5px);
      margin: 0;
    }
  }
}
</style>
