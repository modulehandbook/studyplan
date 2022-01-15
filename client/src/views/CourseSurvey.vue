<template>
  <div v-if="!pending">
  <form name="form" @submit.prevent="updateCourses"   v-if="courseSelection != null && courseSelection.semesterPlans != null && courseSelection.semesterPlans[0].bookedCourses.length > 0">
    <BaseHeading><h1>Wieso hast du den Kurs gewaehlt?</h1></BaseHeading>
    <div
      v-for="(course, index) in this.courseSelection.semesterPlans[0].bookedCourses"
      :key="course.key"
      class="survey-wrapper"
    >
      <input :name="'course' + index" :value="course.name" hidden />
      <div class="survey-left-content">
        <div class="block">
          <p>{{ course.key }}</p>
          <p>{{ course.name }}</p>
        </div>
      </div>
      <div class="survey-right-content">
        <div class="survey-form">
          <div class="survey-column-wrapper">
            <div class="survey-radio left">
              <input
                type="radio"
                :id="surveys[0].key + index"
                :name="'survey' + index"
                :value="surveys[0].value"
                v-model="test[index]"
                v-on:change="getChecked($event, index)"
              />
              <label :for="surveys[0].key + index">{{ surveys[0].name }}</label>
            </div>
            <div class="survey-radio right">
              <input
                type="radio"
                :id="surveys[1].key + index"
                :name="'survey' + index"
                :value="surveys[1].value"
                 v-model="test[index]"
                v-on:change="getChecked($event, index)"
              />
              <label :for="surveys[1].key + index">{{ surveys[1].name }}</label>
            </div>
          </div>
          <div class="survey-column-wrapper">
            <div class="survey-radio left">
              <input
                type="radio"
                :id="surveys[2].key + index"
                :name="'survey' + index"
                :value="surveys[2].value"
                 v-model="test[index]"
                v-on:change="getChecked($event, index)"
              />
              <label :for="surveys[2].key + index">{{ surveys[2].name }}</label>
            </div>

            <div class="survey-radio right">
              <input
                type="radio"
                :id="surveys[3].key + index"
                :name="'survey' + index"
                :value="surveys[3].value"
                 v-model="test[index]"
                v-on:change="getChecked($event, index)"
              />
              <label :for="surveys[3].key + index">{{ surveys[3].name }}</label>
            </div>
          </div>
          <div class="survey-column-wrapper">
            <div class="survey-radio left">
              <input
                type="radio"
                :id="surveys[4].key + index"
                :name="'survey' + index"
                :value="surveys[4].value"
                 v-model="test[index]"
                v-on:change="getChecked($event, index)"
              />
              <label :for="surveys[4].key + index">{{ surveys[4].name }}</label>
            </div>

            <div class="survey-radio right">
              <input
                type="radio"
                :id="surveys[5].key + index"
                :name="'survey' + index"
                 v-model="test[index]"
                v-on:change="getChecked($event, index)"
              />
              <label :for="surveys[5].key + index">{{ surveys[5].name }}</label>
              <input
                class="input-text"
                type="text"
                name=""
                 v-model="test[index]"
                :disabled="!isEnabledArray[index]"
                v-on:change="getTextFieldValue($event, surveys[5].key + index)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="button-wrapper">
      <button class="survey-button" type="submit">Submit</button>
      <p class="survey-time">Umfrageschluss: dd/mm/yyyy</p>
    </div>
  </form>
  <p v-else> komm wieder wenn du kurse gewaehlt hast</p>
  </div>
</template>
  
<!--
Frage an Backend guys


option 2
{
course1: informatik
survey1: relevant für Berufslaufbahn
course2: mathematik
survey2: zeitlich bedingt
}
..
..
-->




  <script>
import { mapState } from 'vuex';
import BaseHeading from "../components/BaseHeading.vue";
export default {
  components: { BaseHeading },
  computed: {
    ...mapState("courseselection", ["courseSelection"]),
    ...mapState("user", ["user"]),
  },
  async mounted(){
    this.pending = true;
       await this.$store.dispatch("courseselection/fetchCourseSelection", {
        userId: this.user.id || this.user._id,
      })
      .then((test)=>{
        console.log(test);
        this.pending = false;
      })
      .catch((e) => {
        console.log(e);
      });

    //console.log(this.courseSelection);
  },
  data() {
   
    const defaultCourses = [
      { key: "B1", name: "Informatik 1" },
      { key: "B2", name: "Computersysteme2" },
      { key: "B3", name: "Propädeutikum und Medientheorie" },
      { key: "B4", name: "Mathematik 1" },
      { key: "B5", name: "GWP" },
      { key: "B6", name: "Fremdsprache" },
    ];
    /*
      reasonsForSelecton: { 
        teacher: Number,
        time: Number,
        interest: Number,
        easy: Number,
        careerRelevant: Number,
      },
    */
    return {
      pending: false,
      courses: defaultCourses,
      test: [],
      surveys: [
        { key: "lb", name: "Lehrer bedingt", value: "teacher" },
        { key: "zb", name: "zeitlich bedingt", value: "time" },
        {
          key: "ki",
          name: "Kurs ist interessant",
          value: "interest",
        },
        {
          key: "rb",
          name: "relevant für Berufslaufbahn",
          value: "careerRelevant",
        },
        { key: "ke", name: "Kurs ist einfach", value: "easy" },
        { key: "so", name: "sonstiges", value: "" },
      ],
      // array of the enabled status for the text input field
      isEnabledArray: Array.apply(false, Array(defaultCourses.length)),
      
    };
  },
  methods: {
    /*
     * function to check if the sonstiges input field is checked or not
     * and set the isEnabledValue of its certain index of the courses
     */
    getChecked: function (event, index) {
      if (event.target.id.includes("so")) {
        this.isEnabledArray[index] = true;
      } else {
        this.isEnabledArray[index] = false;
      }
      // console.log(event.target.id, index, this.isEnabledArray);
    },
    //Get value of the user input
    getTextFieldValue: function (event, id) {
      // console.log(event);
      document.getElementById(id).value = event.target.value;
    },
    async updateCourses() {
      let mappedCourses = [];
      this.test.forEach((element, index) => {
        mappedCourses.push({
          code: this.courseSelection.semesterPlans[0].bookedCourses[index].code,
          selectionReason: element,
        });
      });
      console.log(mappedCourses);
      await this.$store.dispatch("modalcourse/updateSelectionReasons", {mappedCourses});
    },
  }
    
};
</script>

<style>
.survey-time {
  font-size: xx-small;
  text-align: right;
}

.button-wrapper {
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  margin: 0 auto;
  align-items: left;
  padding: 25px 0;
  max-width: 870px;
}

.survey-wrapper {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  align-items: center;
  padding: 35px 0;
  max-width: 870px;
}

.block {
  position: relative;
  width: 150px;
  border-radius: 20px;
  background: #c4c4c4;
  color: black;
  text-align: center;
  padding: 10px 10px;
  margin: 40px auto;
}

.survey-form {
  display: flex;
  flex-direction: column;
}

.survey-column-wrapper {
  display: flex;
  text-align: left;
}

.survey-column-wrapper div {
  padding: 20px 40px;
}
.survey-radio label {
  padding-left: 20px;
}

.survey-radio.right {
  min-width: 280px;
}

.survey-radio.left {
  min-width: 200px;
}

.survey-button {
  margin-left: auto;
  -webkit-border-radius: 10;
  -moz-border-radius: 10;
  border-radius: 10px;
  font-family: Arial;
  color: #ffffff;
  font-size: 20px;
  background: #000000;
  padding: 5px 80px;
  text-decoration: none;
  border: 0;
}

.survey-button:hover {
  background: #292c2e;
  text-decoration: none;
  cursor: pointer;
}

.input-text {
  margin-left: 10px;
}
</style>
