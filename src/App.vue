<template>
  <v-app>
    <v-toolbar
      app
      flat
      v-if="username"
    >
      <v-toolbar-side-icon
        class="grey--text"
        @click="drawer = !drawer"
      />
      <v-toolbar-title>
        <span class="blue--text text--darken-4 text-uppercase font-weight-bold">IEP</span>
        <span class="grey--text text--lighten-1">admin</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        color="grey"
        flat
        @click="logout"
      >
        <span>wyloguj</span>
        <v-icon
          right
        >
          exit_to_app
        </v-icon>
      </v-btn>
    </v-toolbar>

    <v-navigation-drawer
      app
      v-model="drawer"
      class="blue darken-4"
    >
      <v-list>
        <v-list-tile
          router
          :to="link.route"
          v-for="link in links"
          :key="link.text"
        >
          <v-list-tile-action>
            <v-icon
              class="white--text"
            >
              {{ link.icon }}
            </v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title
              class="white--text"
            >
              {{ link.text }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  components: {
  },
  data() {
    return {
      links: [
        // {
        //   icon: 'dashboard', route: '/', text: 'pulpit',
        // },
        {
          icon: 'list', route: '/posts', text: 'wpisy',
        },
        {
          icon: 'people', route: '/entities/members', text: 'członkowie',
        },
        {
          icon: 'people', route: '/entities/others', text: 'podmioty',
        },
        // {
        //   icon: 'folder', route: '/media', text: 'media',
        // },
      ],
      drawer: false,
    };
  },
  computed: {
    username() {
      return this.$store.getters.username;
    },
  },
  methods: {
    logout() {
      this.$store.dispatch('logout').then(() => this.$router.push('/login'));
    },
  },
};
</script>
