<template>
  <div>
    <BaseHeading>
      <h1>Profil</h1>
    </BaseHeading>
    <div class="changePassword">
      <router-link
        :to="{
          name: 'baseChangePasswordModal',
        }"
      >
        Passwort ändern
      </router-link>
    </div>
    <div class="fields fields-program">
      <div class="fieldgroup">
        <label for="username">Benutzername </label>
        <input
          v-model="username"
          type="text"
          name="username"
          :disabled="true"
        />
      </div>
      <div class="fieldgroup">
        <label for="email">Email</label>
        <input v-model="email" type="text" name="email" :disabled="true" />
      </div>
      <div class="fieldgroup">
        <label for="program">Studiengang </label>
        <input v-model="program" type="text" name="program" :disabled="true" />
      </div>
      <div class="fieldgroup">
        <label for="startOfStudy">Studienbeginn</label>
        <input
          v-model="startOfStudy"
          type="text"
          name="startOfStudy"
          :disabled="true"
        />
      </div>
      <div class="fieldgroup">
        <label for="isPreferred">Bevorzugte Belegung</label>
        <input
          v-model="isPreferredText"
          type="text"
          name="isPreferred"
          :disabled="true"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState} from "vuex";

export default {
  data() {
    return {
      username: "",
      email: "",
      message: "",
      startOfStudy: "",
      program: "",
      version: "",
      isPreferred: undefined,
    };
  },
  computed: {
    ...mapState("user", ["user"]),
    isPreferredText: function () {
      if (this.isPreferred == null) {
        return "";
      } else if (this.isPreferred) {
        return "ja";
      } else {
        return "nein";
      }
    },
  },

  created() {
    if (!this.user.startOfStudy) {
      this.$router.push("/select-program");
    } else {
      this.username = this.user.username;
      this.email = this.user.email;
      this.startOfStudy = this.user.startOfStudy.name;
      this.program = this.user.studyPlan.program.name;
      this.version = this.user.studyPlan.program.version;
      this.isPreferred = this.user.isPreferred;
    }
  },
};
</script>

<style lang="scss" scoped>
$htwGruen: #76b900;

.changePassword {
  margin-bottom: 40px;
  a {
    color: $htwGruen;
    font-size: 20px;
  }
}
.fields {
  display: flex;
  margin: 0 auto;
  justify-content: center;
  align-items: center;

  label {
    display: block;
    font-weight: bold;
    font-size: 18px;
  }

  input {
    max-width: 35vw;
    font-size: 20px;
    text-align: center;

    border-radius: 12px;
    height: 50px;
    margin-top: 20px;
    margin-bottom: 30px;
  }

  &-personal {
    .fieldgroup {
      margin: 20px;

      input {
        border: 3px solid $htwGruen;
        width: 250px;
      }

      input:focus {
        outline: none;
      }
    }
  }

  &-program {
    flex-direction: column;

    .fieldgroup {
      input {
        max-width: 80vw;
        width: 550px;
        background: rgba(204, 204, 204, 0.3);
        border: 3px solid #c1c1c1;
      }
    }
  }
}
</style>
