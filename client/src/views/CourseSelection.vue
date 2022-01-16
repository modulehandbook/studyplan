<template>
  <div>
    <BaseHeading><h1>Hier ist Die Seite zum Belegen</h1></BaseHeading>
    <div v-if="!simulatorDeadline && loaded">
      <div>
        Belegungs-Deadline:
    
      {{displayD}} d
      {{displayH}} h
      {{displayM}} m
      {{displayS}} s
      </div>
      <div
        v-if="courseSelection != null && courseSelection.semesterPlans != null "
      >
        <p>hier ist der inhalt der seite</p>
        <baseCourseSelection
          v-show="!pending"
          :courses="courseSelection.semesterPlans[0].unbookedCourses"
          :booked-courses="courseSelection.semesterPlans[0].bookedCourses"
        />
      </div>
      <div v-if="courseSelection == null" class="addSemester">
        <button
          class="addSemester addSemester__button"
          @click="addCourseSelection"
        >
          <font-awesome-icon :icon="['fas', 'plus-circle']" size="3x" />
        </button>
        <p class="addSemester addSemester__text">Kurswahl hinzufuegen</p>
      </div>
    </div>
    <div v-if="simulatorDeadline && loaded"> 
    <p>Die Belegungsphase ist geschlossen</p>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      pending: false,
      color: "#76b900",
      showingExplanations: false,
      downloading: false,
      displayD: 0,
      displayH: 0,
      displayM: 0,
      displayS: 0,
      simulatorDeadline: false,
      loaded: false,
    };
  },

  computed: {
    console: () => console,
    ...mapState("program", ["program"]),
    ...mapState("courseselection", ["courseSelection"]),
    ...mapState("user", ["user"]),

    _seconds: () => 1000,
    _minutes() {
      return this._seconds*60;
    },
    _hours() {
      return this._minutes*60;
    },
    _days() {
      return this._hours*24;
    },
    deadline() {
      return new Date(
        2022,
        1,
        11,
        1,
        0,
        0,
        0
      );
    }
  },


  async mounted() {
    this.countdown();
  
    if (!this.$store.state.user.user.startOfStudy) {
      this.$router.push("/select-program");
    } else {
      this.pending = true;
      await this.$store.dispatch("semester/fetchSemesters");
      await this.$store.dispatch("courseselection/fetchCourseSelection", {
        userId: this.user.id || this.user._id,
      });
      //console.log(this.courseSelection.semesterPlans[0].unbookedCourses);
      //onsole.log(this.courseSelection.semesterPlans[0].bookedCourses);
    }
    this.pending = false;
  
  },
  methods: {
    addCourseSelection() {
      this.$store.dispatch("courseselection/createCourseSelection", {
        userId: this.user.id || this.user._id,
      });
    },
    /*watch(){
      const timer = setInterval(()=> {
        //console.log("watch");
        //console.log(this.loaded);
        //console.log($root.loaded);
        //if($root.loaded){
        //  clearInterval(timer);
        //  this.loaded = true;
        //  return;
        //}
        this.loaded=true;
      }, 1001);

    },*/
    formatNum: num => (num<10? "0" + num : num),

    countdown(){
      if(!this.$root.end) this.$root.end = false;
      const timer = setInterval(()=> {
        const now = new Date().getTime();
        //const deadline = new Date(2022, 1, 14, 0, 0, 0).getTime();
        //const gap = deadline - now;
        const gap = this.deadline.getTime() - now;
        console.log(gap);

        //if(this.deadlineTest.getTime() - now < 0) this.simulatorDeadline=true;
    
        if(gap<0){
          clearInterval(timer);
          this.loaded = true;
          this.simulatorDeadline=true;
          console.log("dead");
          return;
        }

        const days = Math.floor(gap/this._days);
        const hours = Math.floor((gap%this._days) / this._hours);
        const minutes = Math.floor((gap%this._hours) / this._minutes);
        const seconds = Math.floor((gap%this._minutes) / this._seconds);
        this.displayD = this.formatNum(days);
        this.displayH = this.formatNum(hours);
        this.displayM = this.formatNum(minutes);
        this.displayS = this.formatNum(seconds);
        this.loaded = true;
        this.simulatorDeadline=false;
      }, 100);

    },
    
  },
};
</script>
