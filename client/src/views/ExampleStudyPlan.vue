<template>
  <div>
    <BaseHeading><h1>Plan nach Studienordnung</h1></BaseHeading>
    <BaseExampleSemesterAndCoursesTable
      :coursesInSemester="courses"
      v-show="!pending"
    />
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      pending: {
        type: Boolean,
        default: "false",
      },
      color: "#76b900",
      courses: {},
    };
  },
  async created() {
    if (!this.$store.state.user.user.startOfStudy) {
      this.$router.push("/select-program");
    } else {
      this.pending = true;
      await this.$store.dispatch("program/fetchProgram", {
        code: this.user.studyPlan.program.code.toLowerCase(),
        version: this.user.studyPlan.program.version,
      });
      this.courses = await this.$store.dispatch(
        "program/getOfficialCoursesInSemester"
      );
      this.pending = false;
    }
  },
  computed: {
    ...mapState("program", ["program"]),
    ...mapState("user", ["user"]),
  },
};
</script>

<style lang="scss" scoped>
$htwGruen: #76b900;

p {
  font-weight: bold;
}

.line {
  border-top: 3px solid $htwGruen;
  margin: 0 auto;
  padding: 0;
  width: 30px;
  height: 39px;
}
</style>
