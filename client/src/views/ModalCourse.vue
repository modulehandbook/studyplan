<template>
    <div>
        <BaseHeading> <h1> alle Kurse </h1> </BaseHeading>
      
        <div class="container">
        <div v-for="(
          semester) in this.$store.state.semester.semesters"
          :key="semester.id"
          > 
           
            <div  v-if="getCoursesfromSemester(semester).length">
              <BaseModalCourseContainer 
              :coursesInSemester="getCoursesfromSemester(semester)"
              :semester="semester"/>
          </div> 
          
        </div>
          <router-view></router-view>
        <form name="form" @submit.prevent="createNewModalCourse">
            <div>
                <h3>kursdaten</h3>
                <label for="courseName">Kursname</label>
                <input v-model="courseName" 
                placeholder="Kursnamen eintragen"
                name="courseName">
            </div>
            <div>
                <label for="code">Kurscode</label>
                <input v-model="code" 
                placeholder="Kurscode eintragen"
                name="code">
            </div>
            <div>
                <label for="availablePlaces">Platzanzahl</label>
                <input v-model.number="availablePlaces" 
                type="number"
                placeholder="anzahl der plaetze eintragen"
                name="availablePlaces">
            </div>
            <div>
                <label for="semester">Semester</label>
                <select v-model="semester" 
                name="semester">
                    <option    
                     v-for="semester in this.$store.state.semester.semesters"
                     :value="semester"
                     :key="semester.id">
                        {{semester.name}}

                    </option>
                </select>
            </div>
            <button >
                <span>Speichern</span>
            </button>
      </form>
    </div>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { mapState } from "vuex";
export default {
    setup(){
        return {v$: useVuelidate()};
    },
    data(){
        return {
            pending: false,
            semester: "",
            courseName: "",
            filterSemester: "",
            code: "",
            availablePlaces: "",
        };
    },
    validations(){
        return{
            semester:{
                required,
            },
            courseName:{
                required,
            },
            code:{
                required,
            },
            availablePlaces:{
                required,
            },
            
        };
    },
    async created(){
        await this.$store.dispatch("semester/fetchSemesters");
       
        var test = this.$store.getters["semester/getCurrentSemester"];
        console.log(test);
    },
    async mounted(){
      this.pending = true;
      await this.$store.dispatch("modalcourse/fetchCourses");
     // await this.$store.dispatch("modalcourse/assignUsers");
      // <p v-show="modalCourse != undefined"> {{modalCourse.name}} </p>

      console.log(this.modalCourses);
      this.pending = false;
    },
    methods: {
    async deleteCourse(index) {
      console.log(index);
      await this.$store.dispatch("modalcourse/deleteCourse", { index: index });
    },
    getCoursesfromSemester(semester) {
      return this.modalCourses.filter(
        (modalCourse) => modalCourse.semester.name == semester.name
      );
    },
  },
  computed: {
    ...mapState("modalcourse", ["modalCourses"]),
  },
};
</script>

<style lang="scss" scoped>
$htwGruen: #76b900;
$errorRed: #f8153d;
.container {
  display: grid;
  padding: 0 2rem;
  margin: 0 auto;
  max-width: 800px;
  border-radius: 20px;
}
.line {
  border-top: 3px solid;
  margin: 0 auto;
  padding: 0;
  width: 30px;
  height: 39px;
  margin-bottom: 20px;
  color: $htwGruen;
  margin-top: 40px;
}

h1,
h2 {
  color: $htwGruen;
}

h2 {
  font-weight: normal;
  font-size: 20px;
}

h3 {
  margin-top: 30px;
  font-size: 25px;
}

button,
input[type="submit"] {
  background: none;
  color: $htwGruen;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  text-decoration: underline;
  font-weight: bold;
  font-size: 18px;
  margin-top: 30px;
  margin-bottom: 20px;
}

.disabled {
  color: grey;
  text-decoration: none;
  cursor: auto;
}

.select-boxes {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  text-align: center;

  label {
    display: block;
    font-weight: bold;
  }

  &--box {
    margin: 10px;
  }
  label {
    color: $htwGruen;
  }

  .select {
    margin: 20px;
    width: 500px;
    max-width: 80%;
    height: 50px;
    font-size: 17px;
    border: 3px solid $htwGruen;
    border-radius: 12px;
    padding: 5px;

    &:focus {
      outline: none;
    }
    &--small {
      max-width: 200px;
    }
  }

  option {
    margin: 10px;
  }
}

.error-message {
  color: $errorRed;
  margin-bottom: 30px;
  margin-top: 0;
}

.error {
  border-color: $errorRed !important;
}
</style>
