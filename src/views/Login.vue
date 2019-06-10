<template>
  <v-container
    fill-height
    fluid
  >
    <v-layout
      align-center
      fill-height
    >
      <v-flex
        xs10
        sm6
        md4
        offset-xs1
        offset-sm3
        offset-md4
      >
        <v-alert
          dismissible
          transition="scale-transition"
          type="error"
          v-model="alert.dialog"
          class="mb-3"
        >
            {{ alert.message }}
        </v-alert>
        <v-form
          ref="form"
        >
          <v-text-field
            :counter="32"
            label="Użytkownik"
            prepend-icon="people"
            :rules="[rules.required]"
            v-model="username"
            @keyup.enter.native="login"
          ></v-text-field>
          <v-text-field
            :counter="32"
            label="Hasło"
            prepend-icon="lock"
            :rules="[rules.required]"
            type="password"
            v-model="password"
            @keyup.enter.native="login"
          ></v-text-field>
          <v-btn
            color="blue darken-4"
            dark
            @click="login"
          >
            Zaloguj
          </v-btn>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      alert: {
        dialog: false,
        message: 'Brak autoryzacji',
      },
      rules: {
        required: value => !!value || 'Pole wymagane',
      },
      username: '',
      password: '',
    };
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isLoggedIn;
    },
  },
  mounted() {
    if (this.$store.getters.token) {
      this.$router.push({ name: 'postsList' });
    }
  },
  methods: {
    login() {
      if (this.$refs.form.validate()) {
        this.$store
          .dispatch('login', { username: this.username, password: this.password })
          .then(() => {
            this.$router.push({ name: 'postsList' });
          })
          .catch(() => {
            this.alert.dialog = true;
            this.$refs.form.reset();
          });
      }
    },
  },
};
</script>
