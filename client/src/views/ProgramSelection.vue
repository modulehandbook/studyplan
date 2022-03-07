<template>
  <div id="root">
    <h1>Bitte mache zuerst ein paar Angaben zu deinem Studium</h1>
    <h3 id="warnigDescription">
      Hierbei handelt es sich um einen Testlauf. Dennoch bitten wir um wahrheitsgemäße Angaben und realistische Entscheidungen.
    </h3>
    <h3 id="warning">Achtung: Nach dem Speichern können die Login-Daten nicht mehr bearbeitet werden. <br>Bei Veränderungen wende dich bitte an den Kontakt unter Hilfe.</h3>
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
            :class="{ error: v$.selectedProgram.$error }"
            @blur="v$.selectedProgram.$touch()"
          >
            <option
              v-for="program in $store.state.program.programs"
              :key="program.code"
              :value="program"
            >
              {{ program.name }}
            </option>
          </select>
          <div v-if="v$.selectedProgram.$error">
            <p v-if="!v$.selectedProgram.required" class="error-message">
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
            :class="{ error: v$.stupo.$error }"
            @blur="v$.stupo.$touch()"
          >
            <option>StuPo 28/12</option>
          </select>
          <div v-if="v$.stupo.$error">
            <p v-if="!v$.stupo.required" class="error-message">
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
            :class="{ error: v$.startOfStudy.$error }"
            @blur="v$.startOfStudy.$touch()"
          >
            <option
              v-for="semester in semestersNotInFuture"
              :key="semester.id"
              :value="semester"
            >
              {{ semester.name }}
            </option>
          </select>
          <div v-if="v$.startOfStudy.$error">
            <p v-if="!v$.startOfStudy.required" class="error-message">
              Gib das Semester deines Studienbeginns an
            </p>
          </div>
        </div>
      </div>
      <h3 id="noBottomMargin">Wirst du bei der Belegung bevorzugt?</h3>
      <p>
        Falls du Kinder hast, Angehörige pflegen musst, eine Behinderung hast
        oder Leistungssportler bist, kannst du bevorzugt Belegen.
        <a
          href="https://www.htw-berlin.de/studium/studienorganisation/kursbelegung/sonderregelungen/"
          >Weitere Infos</a
        >
      </p>
      <div class="select-boxes">
        <div class="select-boxes select-boxes--box">
          <label for="isPreferred">Bevorzugte Belegung</label>
          <select
            v-model="isPreferred"
            class="select select--small"
            name="isPreferred"
            :class="{ error: v$.isPreferred.$error }"
            @blur="v$.isPreferred.$touch()"
          >
            <option
              v-for="option in isPreferredOptions"
              :key="option.name"
              :value="option.value"
            >
              {{ option.name }}
            </option>
          </select>
          <div v-if="v$.isPreferred.$error">
            <p v-if="!v$.isPreferred.required" class="error-message">
              Gib an, ob du bevorzugt wirst.
            </p>
          </div>
        </div>
      </div>
      <div class="line"></div>
      <div id="acceptWrapper">
        <input
          id="accept"
          v-model="accept"
          type="checkbox"
          name="accept"
          :class="{ error: v$.accept.$error }"
          @blur="v$.accept.$touch()"
          @change="v$.accept.$touch()"
        />
        <div id="acceptLabel">
          <label for="accept"
            >Ich habe verstanden, dass ich die Angaben nach dem Bestätigen nicht nochmal bearbeiten kann.</label
          >
        </div>
      </div>
      <button :disabled="v$.$invalid" :class="{ disabled: v$.$invalid }">
        <span>Speichern</span>
      </button>
      <p v-if="v$.$anyError" class="error-message">
        Bitte fülle alle Felder aus.
      </p>
    </form>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { mapState } from "vuex";

const isTrue = (val) => {
  return val == true;
};

export default {
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      selectedProgram: "",
      stupo: "",
      startOfStudy: "",
      isPreferred: undefined,
      isPreferredOptions: [
        { name: "ja", value: true },
        { name: "nein", value: false },
      ],
      accept: false,
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
      isPreferred: {
        required,
      },
      accept: {
        isTrue,
      },
    };
  },
  computed: {
    ...mapState("studyplan", ["studyPlan"]),
    semestersNotInFuture: function() {
      return this.$store.state.semester.semesters.filter(function (oneSemester){
          return parseInt(oneSemester.name.substring(4, 6)) <= new Date().getFullYear() - 2000;
      })
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

  methods: {
    saveProgramAndStartOfStudy() {
      this.v$.$touch();
      if (!this.v$.$invalid) {
        if (
          this.selectedProgram &&
          this.stupo &&
          this.startOfStudy &&
          this.isPreferred != null &&
          this.accept == true
        ) {
          this.$store
            .dispatch("user/saveProgramAndStartOfStudy", {
              program: this.selectedProgram,
              stupo: this.stupo,
              startOfStudy: this.startOfStudy,
              isPreferred: this.isPreferred,
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

#root {
  max-width: 90vw;
  margin: 0 auto;
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

#acceptWrapper {
  display: flex;
  margin-left: auto;
  justify-content: center;
  align-items: center;
}

#accept {
  transform: scale(1.5);
  margin-right: 20px;
}

#acceptLabel {
  text-align: left;
  color: $htwGruen;
}

#warning {
  color: orangered;
  font-size: 20px;
  margin-top: 0px;
  font-weight: bold;
}

#warnigDescription {
  color: orange;
  font-size: 20px;
  margin-top: 0px;
  font-weight: normal;
}

#noBottomMargin {
  margin-bottom: 0px;
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
    max-width: 80vw;
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

select:empty {
  border-width: 1px !important;
  pointer-events: none;
  background: 
    linear-gradient(0.25turn, transparent, #eee, transparent),
    linear-gradient(#ddd, #ddd);
  background-repeat: no-repeat;
  background-size: 100% 100%, 100% 100%; 
  background-position: -80vw 0, 0 0; 
  animation: loading 1s infinite;

  @keyframes loading {  
    to {
      background-position: 80vw 0, 0 0;
    }
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
