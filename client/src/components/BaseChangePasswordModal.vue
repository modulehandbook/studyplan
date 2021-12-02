<template>
  <div>
    <BaseModal :route="'/profile'">
      <template v-slot:header>
        <button
          type="button"
          class="btn-close"
          @click="$router.push('/profile')"
        >
          x
        </button>
        <h1>Passwort ändern</h1>
      </template>

      <template v-slot:body>
        <form name="form">
          <div class="fields">
            <div class="fieldgroup">
              <label for="oldPassword" class="password-label"
                >Altes Passwort</label
              >
              <input
                class="password-input"
                v-model="oldPassword"
                type="password"
                name="oldPassword"
                id="oldPassword"
                @blur="$v.oldPassword.$touch()"
                :class="{ error: $v.oldPassword.$error }"
              />
              <div>
                <input
                  type="checkbox"
                  name="checkbox"
                  @click="showPassword('oldPassword')"
                />
                <label for="checkbox">Passwort zeigen</label>
              </div>
            </div>

            <div class="fieldgroup">
              <label for="newPassword" class="password-label"
                >Neues Passwort</label
              >
              <input
                class="password-input"
                v-model="newPassword"
                type="password"
                name="newPassword"
                id="newPassword"
                @blur="$v.newPassword.$touch()"
                :class="{ error: $v.newPassword.$error }"
              />
              <div>
                <input
                  type="checkbox"
                  name="checkbox"
                  @click="showPassword('newPassword')"
                />
                <label for="checkbox">Passwort zeigen</label>
              </div>
            </div>
            <div v-if="$v.newPassword.$error">
              <p
                v-if="!$v.newPassword.required || $v.oldPassword.required"
                class="message--error"
              >
                Darf nicht leer sein
              </p>
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
        </div>
      </template>

      <template v-slot:footer>
        <button
          :disabled="$v.$invalid"
          class="submit"
          :class="{ disabled: $v.$invalid }"
          @click="handlePasswordUpdate"
        >
          Passwort ändern
        </button>
      </template>
    </BaseModal>
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";

export default {
  data() {
    return {
      oldPassword: "",
      newPassword: "",
      message: "",
    };
  },

  validations: {
    oldPassword: {
      required,
    },
    newPassword: {
      required,
    },
  },
  created() {
    document.documentElement.style.overflow = "hidden";
  },

  unmounted() {
    document.documentElement.style.overflow = "auto";
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
    async handlePasswordUpdate() {
      this.$v.$touch();
      if (!this.$v.$invalid) {
        const response = await this.$store.dispatch("user/changePassword", {
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
        });
        if (response) {
          //not updated
          this.message = response.message;
          this.successful = false;
        } else {
          //everything went ok
          this.message = "Password erfolgreich geändert!";
          this.successful = true;
          this.oldPassword = "";
          this.newPassword = "";
          this.$v.$reset();
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$htwGruen: #76b900;
$errorRed: #f8153d;

.error {
  border-color: $errorRed !important;
}

.message {
  &--error {
    color: $errorRed;
    margin-bottom: 30px;
    margin-top: 0;
  }
  &--success {
    color: $htwGruen;
  }
}

.fields {
  display: flex;
  flex-direction: column;
  margin: 0 auto;

  .fieldgroup {
    margin-bottom: 50px;

    .password-label {
      display: block;
      font-weight: bold;
      font-size: 18px;
    }

    .password-input {
      max-width: 35vw;
      font-size: 20px;
      text-align: center;
      border-radius: 12px;
      height: 50px;
      margin-top: 30px;
      margin-bottom: 20px;

      @media screen and (max-width: 500px) {
        max-width: 80vw;
        font-size: 15px;
        height: 50px;
      }
    }

    input {
      border: 3px solid $htwGruen;
      display: inline;

      &:focus {
        outline: none;
      }
    }

    .checkbox {
      display: inline;
    }
  }
  .submit,
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
  }

  .disabled {
    color: grey;
    text-decoration: none;
    cursor: auto;
  }
}
</style>
