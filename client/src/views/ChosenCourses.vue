<template>
    <div v-if="!pending && this.courseSelection.semesterPlans">
        <BaseHeading><h1>Diese Kurse wollen Sie Belegen</h1></BaseHeading>
       <div
       v-for="(course,index) in this.courseSelection.semesterPlans[0].bookedCourses"
       :key = "course.key"
        class = "wrap">
         <div class="heading">
           <p>Belegte Kurse:</p>
           <div class="belegteKurse">
             <input :name="'course' + index" :value="course.name" hidden />
             <div class="belegterKurs">
               <p>{{course.name}}</p>
               <input type="checkbox" id="markCourse" name="GE">
             </div>
             <br>
             <div class="belegterKurs">
               <p>DevOps</p>
               <input type="checkbox" id="markCourse" name="DS">
             </div>
           </div>
         </div>

         <div class="heading2">
           <p>Zugelassene Kurse: </p>
           <div class="zugelasseneKurse">
              <input :name="'course' + index" :value="course.name" hidden />
             <div class="zugelassenerKurs">
               <p>{{course.name}}</p>
               <input type="checkbox" id="markCourse" name="GE">
             </div>
             <br>
             <div class="zugelassenerKurs">
               <p>DevOps</p>
               <input type="checkbox" id="markCourse" name="DS">
             </div>
           </div>
         </div>
         <button class="button" onclick="marked()"> Delete marked courses</button>
       </div>
    </div>
</template>

<script>
import { mapState} from 'vuex'
import BaseHeading from "../components/BaseHeading.vue";
export default {
  components: { BaseHeading },
  computed: {
    ...mapState("courseselection", ["courseSelection"]),
    ...mapState("user",["user"]),
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
    //console.log(this.courseSelection);
  },
  data(){
    const defaultCourses = [
      { key: "B1", name: "Game Engines" },
      { key: "B2", name: "Visual Computing Aktuelle Themen 1" },
      { key: "B3", name: "Uability" },
      {key: "B4", name:"DevOps"},
    ];

    return{
      pending: false,
      courses: defaultCourses
    }
  },

  methods: {
    marked : function(){
        var getBox = document.getElementById("markCourse")
        if(getBox.checked){
          console.log("checked")
        }
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