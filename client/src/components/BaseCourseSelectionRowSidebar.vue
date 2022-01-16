<template>
  <div>
    <p>{{ priority }}. Prioritaet</p>
    <button @click="deleteCoursePriority()">Prio löschen</button>
  </div>
</template>

<script>
export default {
  props: {
    priority: {
      type: Number,
      required: true,
    },
    isUnbookedCourses: {
      type: Boolean,
      required: true,
    },
  },
  methods: {
    ects(semester) {
      var ects = 0;
      for (let i in semester.plannedCourses) {
        if (semester.plannedCourses[i].ects)
          ects += semester.plannedCourses[i].ects;
      }
      return ects;
    },
    deleteCoursePriority() {
      this.$store.dispatch("courseselection/deleteCoursePriority", {
        priority: this.priority,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
$htwGruen: #76b900;
</style>
