<template>
  <v-container fluid>
    <h1 class="display-1 grey--text text--lighten-1 text-uppercase">
      {{ $route.params.id === 'new' ? 'Nowy wpis' : 'Edytuj wpis' }}
    </h1>
    <v-progress-linear
      color="blue darken-4"
      :indeterminate="true"
      height="20"
      v-if="progress"
    >
    </v-progress-linear>

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

    <!--
      form starts here
    //-->

    <v-form ref="form">
      <v-layout column>
        <v-flex>
          <v-text-field
            :counter="100"
            label="Tytuł"
            prepend-icon="title"
            :rules="[rules.required]"
            v-model="title"
          ></v-text-field>
          <v-textarea
            auto-grow
            label="Treść"
            prepend-icon="notes"
            rows="10"
            :rules="[rules.required]"
            v-model="content"
          ></v-textarea>
        </v-flex>
        <v-flex>
          <v-layout row>
            <v-flex>
              <v-text-field
                clearable
                :disabled="!header.name"
                label="Obrazek nagłówka"
                prepend-icon="image"
                readonly
                v-model="header.name"
                @click:clear="header.name = undefined"
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
                @click.stop="$_PostsForm_propagateClick('fileInputHeader')"
              >
                Przeglądaj
              </v-btn>
              <input
                ref="fileInputHeader"
                accept="image/*"
                style="display: none"
                type="file"
                @change="$_PostsForm_onPickSingle($event)"
              />
            </v-flex>
          </v-layout>
        </v-flex>
        <v-flex>
          <v-switch
            color="blue darken-4"
            prepend-icon="play_circle_outline"
            label="wyświetl w sliderze"
            v-model="slider"
          />
        </v-flex>

        <!--
          attachments
        //-->

        <v-flex
          text-xs-right
          class="mb-3"
        >
          <v-btn
            color="blue darken-4"
            dark
            flat
            small
            @click="$_PostsForm_propagateClick('fileInputAttachments')"
          >
            <v-icon left>attachment</v-icon>
            Załączniki
          </v-btn>
          <input
            ref="fileInputAttachments"
            multiple
            style="display: none"
            type="file"
            @change="$_PostsForm_onPickMultiple($event)"
          />
        </v-flex>
        <v-flex
          v-for="(attachment, index) in attachmentSet"
          :key="index"
        >
          <v-layout row>
            <v-flex>
              <v-text-field
                counter="100"
                label="Nazwa"
                :prepend-icon="attachment.id ? 'attach_file' : 'add'"
                v-model="attachment.name"
              >
              </v-text-field>
              <v-layout
                row
                v-if="attachment.id"
              >
                <v-flex text-xs-right>
                  <v-icon
                    small
                    class="mr-1"
                  >
                    link
                  </v-icon>
                  <a
                    class="red--text text--darken-4"
                    :href="`${attachment.file}`"
                  >
                    <small>{{ attachment.file }}</small>
                  </a>
                  <v-btn
                    color="red darken-4"
                    flat
                    small
                    title="Usuń"
                    @click="attachmentsDestroy(attachment.id)"
                  >
                    Usuń
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex shrink>
              <v-btn
                color="red darken-4"
                dark
                icon
                small
                v-if="!attachment.id"
                title="Usuń"
                class="mt-3"
                @click="attachmentSet.splice(index, 1);"
              >
                <v-icon small>
                  close
                </v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
        </v-flex>

        <!--
          event details
        //-->

        <v-flex>
          <v-switch
            color="blue darken-4"
            :disabled="eventParticipantsSetShow"
            prepend-icon="event"
            label="szczegóły wydarzenia"
            v-model="eventDetailsShow"
            />
        </v-flex>
        <v-scale-transition>
          <v-flex v-if="eventDetailsShow">
            <v-layout column>
              <v-flex>
                <v-text-field
                  :counter="100"
                  label="Miejsce"
                  prepend-icon="location_on"
                  v-model="eventDetails.place"
                ></v-text-field>
              </v-flex>
              <v-flex>
                <a-datetime-picker
                  color="blue darken-4"
                  label="Data rozpoczęcia"
                  :max="eventDetails.end"
                  required
                  v-model="eventDetails.start"
                />
              </v-flex>
              <v-flex>
                <a-datetime-picker
                  color="blue darken-4"
                  label="Data zakończenia"
                  :min="eventDetails.start"
                  required
                  v-model="eventDetails.end"
                />
              </v-flex>
            </v-layout>
          </v-flex>
        </v-scale-transition>

        <!--
          event particiants
        //-->

        <v-flex>
          <v-switch
            color="blue darken-4"
            :disabled="!eventDetailsShow"
            prepend-icon="people"
            label="uczestnicy wydarzenia"
            v-model="eventParticipantsSetShow"
            @change="eventParticipantsSetToggle"
          />
        </v-flex>
        <v-scale-transition>
          <v-flex v-if="eventParticipantsSetShow">
            <v-layout
              column
              v-for="(eventParticipants, index) in eventParticipantsSet"
              :key="index"
              class="mb-3"
            >
              <v-flex>
                <v-text-field
                  :counter="100"
                  label="Etykieta"
                  prepend-icon="title"
                  :rules="[rules.required]"
                  v-model="eventParticipants.label"
                >
                </v-text-field>
              </v-flex>
              <v-flex>
                <v-select
                  :ref="`selectField${index}`"
                  color="blue darken-4"
                  hide-selected
                  :items="entities"
                  item-text="name"
                  item-value="id"
                  label="Uczestnicy"
                  multiple
                  prepend-icon="people"
                  :rules="[rules.required]"
                  v-model="eventParticipants.entities"
                >
                  <template v-slot:selection="data">
                    <v-chip
                      close
                      color="blue darken-4"
                      dark
                      @input="eventParticipantDelete(index, data.item)"
                    >
                      <span>{{ data.item.name }}</span>
                    </v-chip>
                  </template>
                </v-select>
              </v-flex>
              <v-flex text-xs-right>
                <v-btn
                  color="blue darken-4"
                  flat
                  small
                  v-if="eventParticipantsSet.length - 1 === index
                    && eventParticipants.entities.length
                    && eventParticipants.label !== ''"
                  @click="eventParticipantsAdd"
                >
                  <span>Dodaj kolejną grupę</span>
                </v-btn>
                <v-btn
                  color="red darken-4"
                  flat
                  small
                  v-if="eventParticipantsSet.length > 1"
                  @click="eventParticipantsDelete(index)"
                >
                  <span>Usuń</span>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-flex>
        </v-scale-transition>

        <!--
          buttons
        //-->

        <v-flex text-xs-right>
          <v-btn
            color="blue darken-4"
            dark
            :disabled="progress"
            @click="formSubmit"
          >
            <v-icon left>
              send
            </v-icon>
            Wyślij
          </v-btn>
          <v-btn
            color="red darken-4"
            dark
            @click="formReset"
          >
            <v-icon left>
              clear
            </v-icon>
            Wyczyść
          </v-btn>
        </v-flex>
      </v-layout>
    </v-form>
  </v-container>
</template>

<script>
import Vue from 'vue';

import { Factory } from '@/api/factory';
import { isFile, isFileImage } from '@/utils/validators';
import ADatetimePicker from '@/components/ADatetimePicker.vue';

const Attachments = Factory.get('attachments');
const Entities = Factory.get('entities');
const Posts = Factory.get('posts');
export default {
  name: 'post-form',
  components: {
    ADatetimePicker,
  },
  data() {
    return {
      rules: {
        required: v => (!!v && v.length > 0) || 'Pole wymagane',
      },
      // alerts
      alerts: [],
      // attachments
      attachmentSet: [],
      // entities
      entities: [],
      // event details
      eventDetails: {
        start: undefined,
        end: undefined,
        place: undefined,
      },
      eventDetailsShow: false,
      // event participants
      eventParticipantsSet: [],
      eventParticipantsSetShow: false,
      // post
      id: undefined,
      title: undefined,
      content: undefined,
      header: {
        file: undefined,
        name: undefined,
      },
      slider: false,
      // progress
      progress: false,
    };
  },
  watch: {
    $route() {
      const { id } = this.$route.params;
      this.formReset();
      if (id !== 'new') {
        this.postsRetrieve(id);
      }
    },
  },
  mounted() {
    const { id } = this.$route.params;
    this.entitiesList();
    if (id !== 'new') {
      this.postsRetrieve(id);
    }
  },
  methods: {
    $_PostsForm_onPickMultiple(event) {
      const { files } = event.target;
      Array.from(files).forEach((file) => {
        const { name } = file;
        this.attachmentSet.push({
          file,
          name,
        });
      });
    },
    $_PostsForm_onPickSingle(event) {
      const file = event.target.files[0];
      if (file) {
        const { name } = file;
        this.header = {
          file,
          name,
        };
        // TODO preview, use FileReader()
      }
    },
    $_PostsForm_propagateClick(target) {
      this.$refs[target].click();
    },
    async attachmentsDestroy(id) {
      this.progress = true;
      const headers = {
        Authorization: `Token ${this.$store.getters.token}`,
      };
      const alert = await Attachments.destroy(id, headers)
        .then(() => ({
          message: `Usunięto załącznik (id ${id})`,
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
      this.attachmentSet = this.attachmentSet.filter(item => item.id !== id);
      this.progress = false;
    },
    async entitiesList() {
      const data = await Entities.list('other')
        .then(r => r.data)
        .catch(() => []); // no alert
      this.entities = data;
    },
    async postsCreate(payload, headers) {
      this.progress = true;
      const data = await Posts.create(payload, headers)
        .then(r => r.data)
        .catch(r => r.request);
      const { id } = data;
      if (id) {
        this.alerts.push({
          message: `Dodano wpis (id ${id})`,
          type: 'success',
          show: true,
        });
        // add attachments
        const alerts = await Promise.all(this.attachmentSet
          .map(item => Attachments
            .create(
              this.payloadAttachment(Vue.util.extend(item, { post: id })),
              headers,
            )
            .then((r) => {
              const { data: { id: aId } } = r;
              return {
                message: `Dodano załącznik (id ${aId})`,
                type: 'success',
                show: true,
              };
            })
            .catch((r) => {
              const { request: { status } } = r;
              return {
                message: `Wystąpił błąd (kod ${status})`,
                type: 'error',
                show: true,
              };
            })));
        this.alerts.push(...alerts);
        this.$router.push({ name: 'postsEdit', params: { id } });
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
    async postsRetrieve(id) {
      this.progress = true;
      const data = await Posts.retrieve(id)
        .then(r => r.data)
        .catch(r => r.request);
      const {
        title,
        content,
        header,
        slider,
        attachment_set: attachmentSet,
        eventdetails: eventDetails,
        eventparticipants_set: eventParticipantsSet,
      } = data;
      if (title && content) {
        this.title = title;
        this.content = content;
        this.attachmentSet = attachmentSet;
        this.header.name = header;
        this.slider = slider;
        if (eventDetails) {
          this.eventDetailsShow = true;
          this.eventDetails = eventDetails;
        }
        if (eventParticipantsSet.length) {
          this.eventParticipantsSetShow = true;
          this.eventParticipantsSet = eventParticipantsSet.map(
            ({ entities, label }) => ({
              entities: entities.map(entity => entity.id),
              label,
            }),
          );
        }
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
    async postsUpdate(id, payload, headers) {
      this.progress = true;
      const { status } = await Posts.update(id, payload, headers)
        .then(r => r)
        .catch(r => r.request);
      if (status === 200) {
        this.alerts.push({
          message: `Zmieniono wpis (id ${id})`,
          type: 'success',
          show: true,
        });
        // add attachments
        let alerts = await Promise.all(this.attachmentSet
          .filter(item => !item.id)
          .map(item => Attachments
            .create(
              this.payloadAttachment(Vue.util.extend(item, { post: id })),
              headers,
            )
            .then((r) => {
              const { data: { id: aId } } = r;
              return {
                message: `Dodano załącznik (id ${aId})`,
                type: 'success',
                show: true,
              };
            })
            .catch((r) => {
              const { request: { status: errorCode } } = r;
              return {
                message: `Wystąpił błąd (kod ${errorCode})`,
                type: 'error',
                show: true,
              };
            })));
        this.alerts.push(...alerts);
        // update attachments
        alerts = await Promise.all(this.attachmentSet
          .filter(item => item.id)
          .map(item => Attachments
            .update(
              item.id,
              this.payloadAttachment(item),
              headers,
            )
            .then((r) => {
              const { data: { id: aId } } = r;
              return {
                message: `Zmieniono załącznik (id ${aId})`,
                type: 'success',
                show: true,
              };
            })
            .catch((r) => {
              const { request: { status: errorCode } } = r;
              return {
                message: `Wystąpił błąd (kod ${errorCode})`,
                type: 'error',
                show: true,
              };
            })));
        this.alerts.push(...alerts);
        this.postsRetrieve(id);
        // this.$router.push({ name: 'postsEdit', params: { id: 'new' } });
      } else {
        this.alerts.push({
          message: `Wystąpił błąd (kod ${status})`,
          type: 'error',
          show: true,
        });
      }
      this.progress = false;
    },
    eventParticipantsAdd() {
      const last = this.eventParticipantsSet.length ? this.eventParticipantsSet.length - 1 : 0;
      if (!this.eventParticipantsSet.length || (this.eventParticipantsSet[last].label !== ''
        && this.eventParticipantsSet[last].entities.length)
      ) {
        this.eventParticipantsSet.push({
          label: '',
          entities: [],
        });
      }
    },
    eventParticipantDelete(i, { id }) {
      const j = this.eventParticipantsSet[i].entities.indexOf(id);
      this.eventParticipantsSet[i].entities.splice(j, 1);
    },
    eventParticipantsDelete(i) {
      this.eventParticipantsSet.splice(i, 1);
    },
    eventParticipantsSetToggle() {
      if (!this.eventParticipantsSet.length) {
        this.eventParticipantsAdd();
      }
    },
    formReset() {
      this.$refs.form.reset();
      this.attachmentSet = [];
      this.eventDetails.start = undefined;
      this.eventDetails.end = undefined;
    },
    formSubmit() {
      this.$vuetify.goTo(0, {
        duration: 500,
        easing: 'easeInQuad',
        offset: 0,
      });
      if (this.$refs.form.validate()) {
        const headers = {
          Authorization: `Token ${this.$store.getters.token}`,
          'Content-type': 'multipart/form-data',
        };
        const { id } = this.$route.params;
        if (id === 'new') {
          this.postsCreate(this.payloadPost(), headers);
        } else {
          this.postsUpdate(id, this.payloadPost(), headers);
        }
      }
    },
    payloadAttachment(attachment) {
      const { name, file, post } = attachment;
      const payload = new FormData();
      if (name) {
        payload.append('name', name);
      }
      if (isFile(file)) {
        payload.append('file', file, file.name);
      }
      if (post) {
        payload.append('post', post);
      }
      return payload;
    },
    payloadPost() {
      const payload = new FormData();
      payload.append('title', this.title);
      payload.append('content', this.content);
      if (this.header.name && isFileImage(this.header.file)) {
        payload.append('header', this.header.file, this.header.name);
      }
      payload.append('slider', this.slider);
      if (this.eventDetailsShow) {
        payload.append(
          'eventdetails_data',
          JSON.stringify(this.eventDetails),
        );
      }
      if (this.eventParticipantsSetShow) {
        payload.append(
          'eventparticipants_set_data',
          JSON.stringify(this.eventParticipantsSet),
        );
      }
      return payload;
    },
  },
};
</script>
