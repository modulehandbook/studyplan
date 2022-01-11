<template>
  <div>
    <div v-if="!simulatorDeadline">
      Simulations-Deadline:
    </div>
    <div v-else="simulatorDeadline">
      Belegungs-Deadline:
    </div>
    {{displayD}} d
    {{displayH}} h
    {{displayM}} m
    {{displayS}} s
  </div>
</template>

<script>

export default {
  props: [
    "year", 
    "month", 
    "date", 
    "hour", 
    "minute", 
    "second", 
    "millisecond"],
    
  data:() => ({
    displayD: 0,
    displayH: 0,
    displayM: 0,
    displayS: 0,
    simulatorDeadline: false
  }),

  computed: {
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
        this.year,
        this.month,
        this.date,
        this.hour,
        this.minute,
        this.second,
        this.millisecond
      );
    },
    deadlineTest() {
      return new Date(
        2022,
        0,
        11,
        1,
        0,
        0,
        0
      );
    }
  },
  
  mounted() {
    this.countdown();
  },

  methods: {
    formatNum: num => (num<10? "0" + num : num),

    countdown(){
      const timer = setInterval(()=> {
        const now = new Date().getTime();
        const gap = this.deadline.getTime() - now;

        if(this.deadlineTest.getTime() - now < 0) this.simulatorDeadline=true;
    
        if(gap<0){
          clearInterval(timer);
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
      }, 1000);
      
    },
  },
};
</script>
