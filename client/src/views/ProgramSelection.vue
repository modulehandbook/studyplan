<template>
  <div>
    <h1>Bitte mach zuerst ein paar Angaben zu deinem Studium</h1>
    <h2>
      Wir benötigen die richtigen Angaben, um dir deinen korrekten Studyplan zu
      erstellen!
    </h2>
    <div class="line"></div>
    <form name="form" @submit.prevent="saveProgramAndStartOfStudy">
      <h3>Was studierst du?</h3>
      <div class="select-boxes">
        <div class="select-boxes select-boxes--box">
          <label for="program">Studiengang</label>
          <select
            v-model="selectedProgram"
            class="select"
            name="program"
            @blur="$v.selectedProgram.$touch()"
            :class="{ error: $v.selectedProgram.$error }"
          >
            <option
              v-for="program in this.$store.state.program.programs"
              :value="program"
              :key="program.code"
            >
              {{ program.name }}
            </option>
          </select>
          <div v-if="$v.selectedProgram.$error">
            <p v-if="!$v.selectedProgram.required" class="error-message">
              Gib deinen Studiengang an
            </p>
          </div>
        </div>

        <div class="select-boxes select-boxes--box">
          <label for="stupo">Studienordnung</label>
          <select
            v-model="stupo"
            class="select"
            name="stupo"
            @blur="$v.stupo.$touch()"
            :class="{ error: $v.stupo.$error }"
          >
            <option>StuPo 28/12</option>
          </select>
          <div v-if="$v.stupo.$error">
            <p v-if="!$v.stupo.required" class="error-message">
              Gib deine Studienordnung an
            </p>
          </div>
        </div>
      </div>

      <h3>Wann hast du dein Studium begonnen?</h3>
      <div class="select-boxes">
        <div class="select-boxes select-boxes--box">
          <label for="startOfStudy">Semester</label>
          <select
            v-model="startOfStudy"
            class="select select--small"
            name="startOfStudy"
            @blur="$v.startOfStudy.$touch()"
            :class="{ error: $v.startOfStudy.$error }"
          >
            <option
              v-for="semester in this.$store.state.semester.semesters"
              :value="semester"
              :key="semester.id"
            >
              {{ semester.name }}
            </option>
          </select>
          <div v-if="$v.startOfStudy.$error">
            <p v-if="!$v.startOfStudy.required" class="error-message">
              Gib das Semester deines Studienbeginns an
            </p>
          </div>
        </div>
      </div>
      <button :disabled="$v.$invalid" :class="{ disabled: $v.$invalid }">
        <span>Speichern</span>
      </button>
      <p v-if="$v.$anyError" class="error-message">
        Bitte fülle alle Felder aus.
      </p>
    </form>
  </div>
</template>

<script>
import useVuelidate from '@vuelidate/core'
import { required } from "@vuelidate/validators";
import { mapState } from "vuex";

export default {
  setup () {
    return { v$: useVuelidate() }
  },
  data() {
    return {
      selectedProgram: "",
      stupo: "",
      startOfStudy: "",
    };
  },
  validations() {
    return {
    selectedProgram: {
      required,
    },
    stupo: {
      required,
    },
    startOfStudy: {
      required,
    },
    }
  },
  async created() {
    if (this.$store.state.user.user.startOfStudy) {
      this.$router.push("/my-studyplan");
    } else {
      await this.$store.dispatch("program/fetchPrograms");
      await this.$store.dispatch("semester/fetchSemesters");
    }
  },
  computed: {
    ...mapState("studyplan", ["studyPlan"]),
  },

  methods: {
    saveProgramAndStartOfStudy() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        if (this.selectedProgram && this.stupo && this.startOfStudy) {
          this.$store
            .dispatch("user/saveProgramAndStartOfStudy", {
              program: this.selectedProgram,
              stupo: this.stupo,
              startOfStudy: this.startOfStudy,
            })
            .then(
              () => {
                this.$router.push("/my-studyplan");
              },
              (error) => {
                // this.loading = false;
                this.message =
                  (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                  error.message ||
                  error.toString();
              }
            );
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$htwGruen: #76b900;
$errorRed: #f8153d;

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
