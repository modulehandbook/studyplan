<template>
  <div>
    <BaseModal :route="'/register'">
      <template #header>
        <button
          type="button"
          class="btn-close"
          @click="$router.push('/profile')"
        >
          x
        </button>
        <div class="headings">
          <h2>Hast du keine E-Mail erhalten oder der Link ist abgelaufen?</h2>
          <h3>
            Fordere eine neue E-Mail an mit der Adresse, mit der du
            registriert bist.
          </h3>
        </div>
      </template>
      <template #body>
        <div class="fieldgroup">
          <label for="email" class="email-label">Email</label>
          <input
            v-model="email"
            class="email-input"
            type="email"
            name="email"
            :class="{ error: v$.email.$error }"
            @blur="v$.email.$touch()"
          />

          <div v-if="v$.email.$error">
            <p v-if="!v$.email.required" class="message--error">
              Darf nicht leer sein
            </p>
            <p v-else class="message--error">Keine gültige Email</p>
          </div>
        </div>

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

      <template #footer>
        <button
          :disabled="v$.$invalid"
          class="submit"
          :class="{ disabled: v$.$invalid }"
          @click.prevent="resendConfirmation"
        >
          Neue Verifizierungsmail beantragen
        </button>
      </template>
    </BaseModal>
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
      email: "",
      message: "",
    };
  },

  validations() {
    return {
      email: {
        required,
        email,
      },
    };
  },
  created() {
    document.documentElement.style.overflow = "hidden";
  },

  unmounted() {
    document.documentElement.style.overflow = "auto";
  },
  methods: {
    async resendConfirmation() {
      this.v$.$touch();
      if (!this.v$.$invalid) {
        this.message = "";

        const response = await this.$store.dispatch(
          "user/resendVerificationEmail",
          {
            email: this.email,
          }
        );
        if (response) {
          //not resend
          this.message = response.message;
          this.successful = false;
        } else {
          //everything went ok
          this.message = "Verifizierungsmail erneut gesendet!";
          this.successful = true;
          this.email = "";

          this.v$.$reset();
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
$htwGruen: #76b900;
$errorRed: #f8153d;

.headings {
  width: 90%;
  margin: 0 auto;
  h2 {
    margin-top: 30px;
  }
  h3 {
    margin-top: 30px;
    font-weight: 500;
    line-height: 30px;
  }
}
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

.fieldgroup {
  margin-top: 60px;
  margin-bottom: 50px;
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

  .email-label {
    display: block;
    font-weight: bold;
    font-size: 18px;
  }

  .email-input {
    width: 50%;
    text-align: center;
    border-radius: 12px;
    height: 50px;
    font-size: 16px;
    margin-top: 30px;
    margin-bottom: 20px;
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
</style>
