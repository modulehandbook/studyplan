<template>
  <div class="sidebar">
    <p
    class="semesterCount"
    v-if="!isUnbookedCourses"
    >{{priority}}. Prioritaet
    </p>
    <p
    class="semesterCount"
    v-else
    >alle kurse
    </p>
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
  },
};
</script>

<style lang="scss" scoped>
$htwGruen: #76b900;

.semesterCount {
  font-size: 18px;
  padding: 10px;
  font-weight: bold;
  color: $htwGruen;
}

.semesterName {
  font-size: 15px;
  color: $htwGruen;
}

.semesterECTS {
  font-size: 12px;
}
p {
  margin: 0;
  font-weight: 700;
}

.sidebar {
  min-height: 87px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 14px;
}

.deleteSemester {
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  margin-top: 10px;
  text-decoration: underline;
}
</style>
