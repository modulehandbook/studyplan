<template>
    <div v-if="!pending && this.courseSelection && this.courseSelection.semesterPlans">
        <BaseHeading><h1>Diese Kurse wollen Sie Belegen</h1></BaseHeading>
       <div
        class = "wrap">
        <form @submit.prevent="removeChosenCourses">
         <div class="heading">
           <p>Belegte Kurse:</p>
           <div   v-for="(course) in this.courseSelection.semesterPlans[0].bookedCourses"
       :key = "course.key" class="belegteKurse">
             <div class="belegterKurs">
               <p>{{course.name}}</p>
             </div>
             <br>
           </div>
         </div>

         <div class="heading2">
           <p>Zugelassene Kurse: </p>
           <div   v-for="(course,index) in this.assignedCourses(this.user.id)"
       :key = "course.key" class="zugelasseneKurse">
             <div class="zugelassenerKurs">
               <p>{{course.name}}</p>
               <input type="checkbox" id="markCourse" v-model="coursesToRemove[index]" name="GE">
             </div>
             <br>
           </div>
         </div>
         <button class="button" type="submit"> Delete marked courses</button>
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
      await this.$store.dispatch("modalcourse/removeUserfromCourses", {coursesToRemoveUserFrom: helperArray, user: this.user.id || this.user._id,});
    }
  }
}
</script>

<style>
.button{
    background: #c4c4c4;
    border-radius: 20px;
    padding: 5px 5px;
}

 #markCourse{
    display: inline-flex;
  }
  
.wrap{
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

.belegteKurse{
   position: relative;
  border-radius: 20px;
  color: black;
  text-align: inline-block;
  display: inline-block;
  padding: 50px 50px;
  margin-top: -50px;
}

.belegterKurs{
  position: relative;
  border-radius: 20px;
  background: #c4c4c4;
  color: black;
  text-align: inline-block;
  display: block;
  padding: 50px 50px;
}

.zugelasseneKurse{
  position: relative;
  border-radius: 20px;
  color: black;
  text-align: inline-block;
  display: inline-block;
  padding: 50px 50px;
  margin-top: -50px;
}
.zugelassenerKurs{
  position: relative;
  border-radius: 20px;
  background: #c4c4c4;
  color: black;
  text-align: inline-block;
  display: block;
  padding: 50px 50px;
}

.heading{
  position: relative;
  border-radius: 20px;
  color: black;
  text-align: inline-block;
  display: inline-block;
  padding: 10px 10px;
  margin: 0px;
  left: 550;
}

.heading2{
  position: relative;
  border-radius: 20px;
  color: black;
  text-align: inline-block;
  display: inline-block;
  padding: 10px 10px;
  margin-left: 0px;
  right: 400;
}
</style>