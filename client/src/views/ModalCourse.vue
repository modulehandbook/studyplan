<template>
  <div>
    <BaseHeading> <h1>alle Kurse</h1> </BaseHeading>
    <div class="container">
      <div
        v-for="semester in $store.state.semester.semesters"
        :key="semester.id"
      >
        <div v-if="getCoursesfromSemester(semester).length">
          <BaseModalCourseContainer
            :courses-in-semester="getCoursesfromSemester(semester)"
            :semester="semester"
          />
        </div>
      </div>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      pending: false,
    };
  },
  computed: {
    ...mapState("modalcourse", ["modalCourses"]),
    ...mapState("user", ["user"]),
  },
  async created() {
    await this.$store.dispatch("semester/fetchSemesters");
  },
  async mounted() {
    this.pending = true;
    await this.$store.dispatch("modalcourse/fetchCourses");
    this.pending = false;
  },
  methods: {
    getCoursesfromSemester(semester) {
      return this.modalCourses.filter(
        (modalCourse) => modalCourse.semester.name == semester.name
      );
    },
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
