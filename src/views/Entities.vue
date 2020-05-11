<template>
  <v-container
    fluid
  >
    <h1 class="display-1 grey--text text--lighten-1 text-uppercase">
      {{ label }}
    </h1>
    <v-progress-linear
      color="blue darken-4"
      :indeterminate="true"
      height="20"
      v-if="progress"
    >
    </v-progress-linear>
    <!-- alert //-->
    <v-alert
      dismissible
      transition="scale-transition"
      :type="alert.type"
      v-for="(alert, index) in alerts"
      :key="index"
      v-model="alert.show"
    >
        {{ alert.message }}
    </v-alert>
    <v-form ref="form">
      <v-layout
        column
        class="my-4"
      >
        <v-flex>
          <v-text-field
            :counter="100"
            label="Nazwa"
            prepend-icon="title"
            :rules="[rules.required]"
            v-model="name"
          ></v-text-field>
        </v-flex>
        <v-flex>
          <v-text-field
            :counter="100"
            label="WWW"
            placeholder="http://www.example.com/"
            prepend-icon="link"
            :rules="[rules.required, rules.validUrl]"
            v-model="url"
          ></v-text-field>
        </v-flex>
        <v-flex>
          <v-layout row>
            <v-flex>
              <v-text-field
                clearable
                :disabled="!image.name"
                label="Logo"
                prepend-icon="image"
                readonly
                :rules="[rules.required]"
                v-model="image.name"
                @click:clear="image.name = undefined"
              >
              </v-text-field>
            </v-flex>
            <v-flex shrink>
              <v-btn
                color="blue darken-4"
                dark
                flat
                small
                class="mt-3"
                @click="$_Entities_propagateClick()"
              >
                Przeglądaj
              </v-btn>
              <input
                ref="fileInputImage"
                accept="image/*"
                style="display: none"
                type="file"
                @change="$_Entities_onPick($event)"
              />
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex text-xs-right>
          <v-btn
            color="blue darken-4"
            dark
            :disabled="progress"
            @click="formSubmit()"
          >
            <v-icon
              left
            >
              {{ !$route.params.id ? 'add' : 'edit' }}
            </v-icon>
            {{ !$route.params.id ? 'Dodaj' : 'Edytuj' }}
          </v-btn>
          <v-btn
            color="red darken-4"
            dark
            @click="$refs.form.reset()"
          >
            <v-icon
              left
            >
              clear
            </v-icon>
            wyczyść
          </v-btn>
        </v-flex>
      </v-layout>
    </v-form>
    <v-layout
      flex
      wrap
    >
      <v-flex
        xs12
        sm4
        md3
        v-for="item in items"
        :key="item.id"
        class="pa-1"
      >
        <v-card>
          <v-img
            contain
            :src="item.image"
          >
          </v-img>
          <v-card-text>
            <span class="subheading">{{ item.name }}</span><br />
            <a :href="`${item.url}`">{{ item.url }}</a>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-4"
              icon
              dark
              small
              :to="{ name: 'entitiesEdit',
                params: { resource: $route.params.resource, id: item.id }}"
              class="Edytuj"
              title="Edytuj"
              >
              <v-icon
                dark
                small
              >
                edit
              </v-icon>
            </v-btn>
            <v-dialog
              max-width="360px"
              v-model="item.dialog"
            >
              <template v-slot:activator="{ on }">
                <v-btn
                  color="red darken-4"
                  dark
                  icon
                  small
                  class="Usuń"
                  title="Usuń"
                  v-on="on"
                >
                  <v-icon
                    dark
                    small
                  >
                    delete
                  </v-icon>
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
                  Usunięcie jest nieodwracalne.
                  Kliknij <span class="red--text text--darken-4">Potwierdź</span>
                  aby kontynuować.
                </v-card-text>
                <v-card-actions>
                  <v-btn
                    block
                    dark
                    class="red darken-4"
                    @click="entitiesDestroy(item.id)"
                  >
                    Potwierdź
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Vue from 'vue';

import { Factory } from '@/api/factory';
import { isFileImage } from '@/utils/validators';

const Entities = Factory.get('entities');
export default {
  data() {
    return {
      // publicPath: process.env.BASE_URL,
      rules: {
        required: v => !!v || 'Pole wymagane',
        validUrl: v =>
          /^#$/.test(v) ||
          /^https?:\/\/([a-z\d-]+\.)+([a-z]{2,}\/)([a-z]+\/)*$/.test(v) ||
          "Nieprawidłowy URL"
      },
      // alerts
      alerts: [],
      // entity
      image: {
        file: undefined,
        name: undefined,
      },
      name: undefined,
      url: undefined,
      // entities
      items: [],
      // progress
      progress: false,
    };
  },
  computed: {
    label() {
      return {
        members: 'Członkowie',
        others: 'Podmioty',
      }[this.$route.params.type];
    },
  },
  watch: {
    $route() {
      this.entitiesList();
      const { id } = this.$route.params;
      if (id) {
        this.entitiesRetrieve(id);
      } else {
        this.$refs.form.reset();
      }
    },
  },
  mounted() {
    this.entitiesList();
    const { id } = this.$route.params;
    if (id) {
      this.entitiesRetrieve(id);
    }
  },
  methods: {
    $_Entities_onPick(event) {
      const file = event.target.files[0];
      const { name } = file;
      const fr = new FileReader();
      fr.readAsDataURL(file);
      fr.addEventListener('load', () => {
        this.image = {
          file,
          name,
        };
      });
    },
    $_Entities_propagateClick() {
      this.$refs.fileInputImage.click();
    },
    async entitiesCreate(payload, headers) {
      this.progress = true;
      const data = await Entities.create(payload, headers)
        .then(r => r.data)
        .catch(r => r.request);
      const { id } = data;
      if (id) {
        this.$refs.form.reset();
        this.alerts.push({
          message: `Dodano podmiot (id ${id})`,
          type: 'success',
          show: true,
        });
        // reload items
        const { type } = this.$route.params;
        const items = await Entities.list(type.slice(0, type.length - 1))
          .then((r) => {
            const { data: d } = r;
            return d.map(item => Vue.util.extend(item, { dialog: false }));
          })
          .catch(() => []); // no alert
        this.items = items;
      } else {
        const { status } = data;
        this.alerts.push({
          message: `Wystąpił błąd (kod ${status})`,
          type: 'error',
          show: true,
        });
      }
      this.progress = false;
    },
    async entitiesDestroy(id) {
      this.dialog = false;
      this.progress = true;
      const headers = {
        Authorization: `Token ${this.$store.getters.token}`,
      };
      const alert = await Entities.destroy(id, headers)
        .then(() => ({
          message: `Usunięto podmiot (id ${id})`,
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
      this.alerts.push(alert);
      // reload items
      const { type } = this.$route.params;
      const items = await Entities.list(type.slice(0, type.length - 1))
        .then((r) => {
          const { data: d } = r;
          return d.map(item => Vue.util.extend(item, { dialog: false }));
        })
        .catch(() => []); // no alert
      this.items = items;
      this.progress = false;
    },
    async entitiesList() {
      this.progress = true;
      const { type } = this.$route.params;
      const items = await Entities.list(type.slice(0, type.length - 1))
        .then((r) => {
          const { data: d } = r;
          return d.map(item => Vue.util.extend(item, { dialog: false }));
        })
        .catch(() => []); // no alert
      this.items = items;
      this.progress = false;
    },
    async entitiesRetrieve(id) {
      this.progress = true;
      const data = await Entities.retrieve(id)
        .then(r => r.data)
        .catch(r => r.request);
      const { image, name, url } = data;
      if (image && name && url) {
        this.name = name;
        this.image.name = image;
        this.url = url;
      } else {
        const { status } = data;
        this.alerts.push({
          message: `Wystąpił błąd (kod ${status})`,
          type: 'error',
          show: true,
        });
      }
      this.progress = false;
    },
    async entitiesUpdate(id, payload, headers) {
      this.progress = true;
      const { status } = await Entities.update(id, payload, headers)
        .then(r => r)
        .catch(r => r.request);
      if (status === 200) {
        this.alerts.push({
          message: `Zmieniono podmiot (id ${id})`,
          type: 'success',
          show: true,
        });
        this.$router.push({ name: 'entities', params: { type: this.$route.params.type } });
      } else {
        this.alerts.push({
          message: `Wystąpił błąd (kod ${status})`,
          type: 'error',
          show: true,
        });
      }
      this.progress = false;
    },
    formSubmit() {
      if (this.$refs.form.validate()) {
        const payload = new FormData();
        const headers = {
          Authorization: `Token ${this.$store.getters.token}`,
          'Content-type': 'multipart/form-data',
        };
        const { id, type } = this.$route.params;
        payload.append('name', this.name);
        payload.append('url', this.url);
        if (isFileImage(this.image.file)) {
          payload.append('image', this.image.file, this.image.name);
        }
        payload.append('type', {
          members: 1,
          others: 2,
        }[type]);
        if (!id) {
          this.entitiesCreate(payload, headers);
        } else {
          this.entitiesUpdate(id, payload, headers);
        }
      }
    },
  },
};
</script>
