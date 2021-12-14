<template>
  <div>
    <h1>Willkommen zu deinem Studyplan!</h1>
    <h2>Plane dein Studium und behalte den Überblick!</h2>
    <h3 v-if="!successful">Registriere dich</h3>
    <div v-if="!successful" class="line"></div>
    <form name="form" @submit.prevent="handleRegister">
      <div v-if="!successful">
        <div>
          <label for="username">Benutzername</label>
          <input
            v-model="username"
            type="text"
            name="username"
            :class="{ error: v$.username.$error }"
            @blur="v$.username.$touch()"
          />
          <div v-if="v$.username.$error">
            <p v-if="!v$.username.required" class="message--error">
              Gib einen Nutzernamen an
            </p>
          </div>
        </div>
        <div>
          <label for="email">Email</label>
          <input
            v-model="email"
            type="email"
            name="email"
            :class="{ error: v$.email.$error }"
            @blur="v$.email.$touch()"
          />
          <div v-if="v$.email.$error">
            <p v-if="!v$.email.email" class="message--error">
              Bitte gib eine gülitge Emailadresse an
            </p>
            <p v-if="!v$.email.required" class="message--error">
              Gib eine Emailadresse an
            </p>
          </div>
        </div>
        <div>
          <label for="password">Passwort</label>
          <input
            v-model="password"
            type="password"
            name="password"
            id="password"
            :class="{ error: v$.password.$error }"
            @blur="v$.password.$touch()"
          />
          <div class="checkbox">
            <input
              class="checkbox checkbox-box"
              type="checkbox"
              name="checkbox"
              @click="showPassword('password')"
            />
            <label for="checkbox" class="checkbox checkbox-label"
              >Passwort zeigen</label
            >
          </div>
          <div v-if="v$.password.$error">
            <p v-if="!v$.password.required" class="message--error">
              Gib ein Passwort an
            </p>
          </div>
        </div>
        <div>
          <button :disabled="v$.$invalid" :class="{ disabled: v$.$invalid }">
            Registrieren
          </button>
          <p v-if="v$.$anyError" class="message--error">
            Bitte fülle alle Felder aus.
          </p>
          <a class="login-link" href="/login">zum Login</a>

          <router-link
            class="verification-link"
            :to="{
              name: 'baseResendVerification',
            }"
          >
            Verifizierungslink nochmal senden
          </router-link>
          <router-view></router-view>
        </div>
      </div>
    </form>
    <div
      v-if="message"
      class="message"
      :class="{
        'message message--error': !successful,
        'message message--success': successful,
      }"
    >
      {{ message }}
      <a v-if="successful" class="login-link" href="/login">Zum Login</a>
    </div>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required, email } from "@vuelidate/validators";

export default {
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      username: "",
      password: "",
      email: "",
      submitted: false,
      successful: false,
      message: "",
    };
  },
  validations() {
    return {
      email: {
        required,
        email,
      },
      username: {
        required,
      },
      password: {
        required,
      },
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.user.status.loggedIn;
    },
  },
  mounted() {
    if (this.loggedIn) {
      this.$router.push("/profile");
    }
  },
  methods: {
    showPassword(type) {
      var x = document.getElementById(type);
      if (x.type === "password") {
        x.type = "text";
      } else {
        x.type = "password";
      }
    },
    handleRegister() {
      this.v$.$touch();

      if (!this.v$.$invalid) {
        this.message = "";
        this.submitted = true;

        this.$store
          .dispatch("user/register", {
            username: this.username,
            password: this.password,
            email: this.email,
          })
          .then(
            (data) => {
              this.message = data;
              this.successful = true;
            },
            (error) => {
              this.message =
                (error.response &&
                  error.response.data &&
                  error.response.data.message) ||
                error.message ||
                error.toString();
              this.successful = false;
            }
          );
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$htwGruen: #76b900;
label {
  display: block;
  font-weight: bold;
}

.line {
  border-top: 3px solid;
  margin: 0 auto;
  padding: 0;
  width: 30px;
  height: 39px;
  margin-bottom: 30px;
}
.checkbox {
  margin-bottom: 10px;
  &-box {
    display: inline;
    margin-right: 15px;
  }

  &-label {
    display: inline;
    font-weight: 500;
  }
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
  margin-top: 70px;

  font-size: 23px;
}

input[type="text"],
input[type="password"],
input[type="email"] {
  font-size: 20px;
  text-align: center;
  border: 3px solid $htwGruen;
  border-radius: 12px;
  max-width: 350px;
  width: 80%;
  height: 60px;
  margin-top: 10px;
  margin-bottom: 30px;
}

input:focus {
  outline: none;
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
  margin-top: 20px;
  margin-bottom: 20px;
}

.disabled {
  color: grey;
  text-decoration: none;
  cursor: auto;
}

.message {
  &--error {
    color: #f8153d;
    margin-bottom: 30px;
    margin-top: 0;
  }
  &--success {
    margin-top: 50px;
    color: $htwGruen;
  }

  a {
    margin-top: 20px;
    font-weight: bold;
  }
}

.error {
  border-color: #f8153d;
}

.login-link {
  display: block;
  color: $htwGruen;
  font-size: 15px;
}

.verification-link {
  display: block;
  color: inherit;
  font-size: 15px;
  margin-top: 30px;
}
</style>
