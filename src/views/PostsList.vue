<template>
  <v-container
    fluid
  >
    <h1 class="display-1 grey--text text--lighten-1 text-uppercase">Wpisy</h1>
    <!-- alert //-->
    <v-alert
      dismissible
      transition="scale-transition"
      :type="alert.type"
      v-for="(alert,index) in alerts"
      :key="index"
      v-model="alert.show"
    >
        {{ alert.message }}
    </v-alert>
    <v-layout
        row
        class="my-4"
    >
      <v-flex>
        <v-btn
          color="blue darken-4"
          flat
          icon
          title="Nowy"
          :to="{ name: 'postsEdit', params: { id: 'new' }}"
        >
          <v-icon>add</v-icon>
        </v-btn>
        <!-- delete button with confirmation dialog //-->
        <v-dialog
          max-width="360px"
          v-model="dialog"
        >
          <template v-slot:activator="{ on }">
            <v-btn
              color="red darken-4"
              :disabled="!checked.length"
              flat
              icon
              title="Usuń"
              v-on="on"
            >
              <v-icon>delete</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title class="headline grey--text text-lighten-1">
              <v-icon
                large
                left
              >
                warning
              </v-icon>
              Wymagane potwierdzenie
            </v-card-title>
            <v-card-text>
              Usunięcie wpisów jest nieodwracalne.
              Kliknij <span class="red--text text--darken-4">Potwierdź</span>
              aby kontynuować.
            </v-card-text>
            <v-card-actions>
              <v-btn
                block
                dark
                flat
                class="red darken-4"
                @click="postsDestroy"
              >
                Potwierdź
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-flex>
    </v-layout>
    <v-layout>
      <v-flex>
        <!-- posts table //-->
        <v-data-table
          :headers="headers"
          :items="items"
          :loading="loading"
          :pagination.sync="pagination"
          :rows-per-page-items="[20]"
          select-all
          v-model="checked"
        >
          <template v-slot:items="props">
            <tr
              :active="props.selected"
              @click="props.selected = !props.selected"
            >
              <td>
                <v-checkbox
                  :input-value="props.selected"
                  primary
                  hide-details
                ></v-checkbox>
              </td>
              <td class="text-xs-right">
                {{ props.item.title }}
              </td>
              <td class="text-xs-right">
                {{ props.item.created }}
              </td>
              <td class="text-xs-right">
                {{ props.item.updated }}
              </td>
              <td class="text-xs-right">
                <v-layout row>
                  <v-flex v-if="props.item.slider">
                    <v-icon
                      small
                      title="Slider"
                    >
                      play_circle_outline
                    </v-icon>
                  </v-flex>
                  <v-flex v-if="props.item.eventdetails">
                    <v-icon
                      small
                      title="Wydarzenie"
                    >
                      date_range
                    </v-icon>
                  </v-flex>
                </v-layout>
              </td>
              <td class="text-xs-right">
                <v-btn
                  color="blue darken-4"
                  dark
                  icon
                  small
                  title="Edytuj"
                  :to="{ name: 'postsEdit', params: { id: props.item.id }}"
                >
                  <v-icon
                    dark
                    small
                  >
                    edit
                  </v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { Factory } from '@/api/factory';

const Posts = Factory.get('posts');
export default {
  name: 'posts-list',
  data() {
    return {
      // alerts
      alerts: [],
      // confirmation dialog
      dialog: false,
      // model
      checked: [],
      // table
      headers: [
        {
          text: 'tytuł',
          sortable: false,
          value: 'title',
        },
        {
          text: 'utworzono',
          value: 'created',
        },
        {
          text: 'zmodyfikowano',
          value: 'updated',
        },
        {
          sortable: false,
          text: 'typ',
        },
        {
          sortable: false,
          text: 'akcje',
        },
      ],
      items: [],
      loading: false,
      pagination: {
        descending: true,
        sortBy: 'id',
      },
    };
  },
  mounted() {
    this.postsList();
  },
  methods: {
    async postsList() {
      this.loading = true;
      const data = await Posts.list()
        .then(r => r.data)
        .catch(() => []); // no alert
      this.items = data;
      this.loading = false;
    },
    async postsDestroy() {
      this.dialog = false;
      this.loading = true;
      const headers = {
        Authorization: `Token ${this.$store.getters.token}`,
      };
      const alerts = await Promise.all(this.checked.map((item) => {
        const { id } = item;
        return Posts.destroy(id, headers)
          .then(() => ({
            message: `Usunięto wpis (id ${id})`,
            type: 'success',
            show: true,
          }))
          .catch((r) => {
            const { request: { status } } = r;
            return {
              message: `Wystąpił błąd (kod ${status})`,
              type: 'error',
              show: true,
            };
          });
      }));
      this.alerts.push(...alerts);
      this.checked = [];
      const data = await Posts.list().then(r => r.data);
      this.items = data || [];
      this.loading = false;
    },
  },
};
</script>
