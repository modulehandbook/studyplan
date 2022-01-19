<template>
    <div v-if="!pending && this.courseSelection && this.courseSelection.semesterPlans">
        <BaseHeading><h1>Diese Kurse wollen Sie Belegen</h1></BaseHeading>
       <div
        class = "courses-selection">
        <form @submit.prevent="removeChosenCourses">
          <div class="courses-wrapper">
         <div class="courses-block courses-block--chosen">
           <h2>Belegte Kurse:</h2>
           <div   v-for="(course) in this.courseSelection.semesterPlans[0].bookedCourses"
       :key = "course.key" class="courses-content">
             <div class="courses-content-label">
               <p>{{course.code}}</p>
               <p>{{course.name}}</p>
             </div>
             <br>
           </div>
         </div>

         <div class="courses-block courses-block--approved">
           <h2>Zugelassene Kurse: </h2>
           <div   v-for="(course,index) in this.assignedCourses(this.user.id)"
       :key = "course.key" class="courses-content">
             <div class="courses-content-label">
               <p>{{course.code}}</p>
               <p>{{course.name}}</p>
               <input type="checkbox" id="markCourse" v-model="coursesToRemove[index]" name="GE">
             </div>
             <br>
           </div>
         </div>
         <button class="delete-button" type="submit"> Delete marked courses</button>
          </div>
        </form>
       </div>
    </div>
</template>

<script>
import { mapGetters, mapState} from 'vuex'
import BaseHeading from "../components/BaseHeading.vue";
export default {
  components: { BaseHeading },
  computed: {
    ...mapState("courseselection", ["courseSelection"]),
    ...mapState("user",["user"]),
    ...mapGetters({
        assignedCourses: 'modalcourse/getCoursesByUser'
    }),
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
    this.pending = false;
    await this.$store.dispatch("modalcourse/fetchCourses");
   // this.assignedCourses = this.$store.getters["modalcourse/getCoursesByUser"](this.user.id || this.user._id);
    //console.log( this.assignedcourses(this.user.id));
    console.log(this.assignedCourses(this.user.id));
    //console.log(this.courseSelection);
  },
  data(){
    return{
      coursesToRemove: [],
      //assignedCourses: [],
      pending: false,
    }
  },

  methods: {
    marked : function(){
        var getBox = document.getElementById("markCourse")
        if(getBox.checked){
          console.log("checked")
        }
    },
    async removeChosenCourses(){
      let helperArray = []
      this.coursesToRemove.forEach((course, index) => {
        if(course)helperArray.push(this.assignedCourses(this.user.id)[index]);
      });
      //helperArray.push({code: "VC1"});
      await this.$store.dispatch("modalcourse/removeUserfromCourses", {coursesToRemoveUserFrom: helperArray, user: this.user.id || this.user._id,});
    }
  }
}
</script>

<style lang="scss">
.courses{
  $space : 15px;
  $htw-green: #3d5814;


&-section{
  max-width: 1200px;
  margin: 0 auto;
}

&-wrapper{
  display: flex;
  flex-flow: wrap;

  @media (max-width: 768px) {
      flex-flow: column;
    }

    h2{
      font-style: normal;
      font-weight: bold;
      font-size: 24px;
      line-height: 1.5;
      color: #7eb726 ;
    }

    .button{
      width: 200px;
      margin: 30px auto;
      padding: $space 10px;
      border-radius: 10px;
      background: #000000;
      color: white;
      font-weight: 600;
      -webkit-border-radius: 10;
      -moz-border-radius: 10;
      &:hover{
      background: #292c2e;
      text-decoration: none;
      cursor: pointer;
    }
  }
}

&-block{
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
 /*#markCourse{
    display: inline-flex;
  }
  
.courses-selection{
        padding: 10px 10px;
        text-align: center;
        align-items: center;
        justify-content: center;
        display: center;
        position: relative;
        border-radius: 20px;
        margin: 40px auto;
        min-height: 100vh;
}

.courses-content{
   position: relative;
  border-radius: 20px;
  color: black;
  text-align: inline-block;
  display: inline-block;
  padding: 50px 50px;
  margin-top: -50px;
}

.courses-content-label{
  position: relative;
  border-radius: 20px;
  background: #c4c4c4;
  color: black;
  text-align: inline-block;
  display: block;
  padding: 50px 50px;
}

.courses-con{
  position: relative;
  border-radius: 20px;
  color: black;
  text-align: inline-block;
  display: inline-block;
  padding: 50px 50px;
  margin-top: -50px;
}
.courses-content-label{
  position: relative;
  border-radius: 20px;
  background: #c4c4c4;
  color: black;
  text-align: inline-block;
  display: block;
  padding: 50px 50px;
}

.courses-block courses-block--chosen{
  position: relative;
  border-radius: 20px;
  color: black;
  text-align: inline-block;
  display: inline-block;
  padding: 10px 10px;
  margin: 0px;
  left: 550;
}

.courses-block courses-block--approved{
  position: relative;
  border-radius: 20px;
  color: black;
  text-align: inline-block;
  display: inline-block;
  padding: 10px 10px;
  margin-left: 0px;
  right: 400;
}
*/
</style>