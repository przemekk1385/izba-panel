<template>
  <v-menu
    :close-on-content-click="false"
    origin="center center"
    transition="scale-transition"
    v-model="picker"
  >
    <v-text-field
      ref="textField"
      slot="activator"
      clearable
      :color="color"
      :label="label"
      prepend-icon="date_range"
      readonly
      :rules="required ? [rules.required] : []"
      :value="datetime"
      @click:clear="clear"
    >
    </v-text-field>
    <v-scale-transition
      mode="out-in"
    >
      <v-date-picker
        v-if="!step2"
        :color="color"
        locale="pl"
        :max="dateMax"
        :min="dateMin"
        v-model="date"
        @change="step2 = true"
      >
      </v-date-picker>
      <v-time-picker
        v-else
        :color="color"
        format="24hr"
        :max="timeMax"
        :min="timeMin"
        v-model="time"
        @change="picker = step2 = false"
      >
      </v-time-picker>
    </v-scale-transition>
  </v-menu>
</template>

<script>
function isValidDate(d) {
  const datetime = new Date(d);
  return d === '' || !Number.isNaN(datetime.getTime());
}

export default {
  name: 'a-datetime-picker',
  props: {
    color: {
      default: '',
      type: String,
    },
    label: {
      default: 'Data i godzina',
      type: String,
    },
    max: {
      default: undefined,
      type: [String, undefined],
      validator: v => !v || isValidDate(v),
    },
    min: {
      default: undefined,
      type: [String, undefined],
      validator: v => !v || isValidDate(v),
    },
    required: {
      default: false,
      type: Boolean,
    },
    value: {
      default: '',
      type: [String, undefined],
      validator: v => !v || isValidDate(v),
    },
  },
  data() {
    return {
      picker: false,
      rules: {
        required: v => !!v || 'Pole wymagane',
      },
      buffer: this.value,
      step2: false,
    };
  },
  computed: {
    datetime() {
      return this.buffer.trim();
    },
    date: {
      get() {
        return this.buffer.split(' ')[0];
      },
      set(v) {
        if (this.time) {
          this.buffer = `${v} ${this.time}`;
        } else {
          this.buffer = `${v}`;
        }
      },
    },
    dateMin() {
      if (this.min) {
        return this.min.split(' ')[0];
      }
      return undefined;
    },
    dateMax() {
      if (this.max) {
        return this.max.split(' ')[0];
      }
      return undefined;
    },
    time: {
      get() {
        return this.buffer.split(' ')[1];
      },
      set(v) {
        this.buffer = `${this.buffer.split(' ')[0]} ${v}`;
      },
    },
    timeMin() {
      if (this.min) {
        const [date, time] = this.min.split(' ');
        const datetime = {
          current: new Date(`${this.date}`),
          limit: new Date(date),
        };
        if (datetime.current.getTime() === datetime.limit.getTime()) {
          return time;
        }
      }
      return undefined;
    },
    timeMax() {
      if (this.max) {
        const [date, time] = this.max.split(' ');
        const datetime = {
          current: new Date(`${this.date}`),
          limit: new Date(date),
        };
        if (datetime.current.getTime() === datetime.limit.getTime()) {
          return time;
        }
      }
      return undefined;
    },
  },
  watch: {
    buffer(v) {
      this.$emit('input', v);
    },
    picker(v) {
      if (!v && this.step2) {
        if (this.time === '') {
          this.time = '00:00';
        }
        this.step2 = false;
      }
    },
  },
  methods: {
    clear() {
      this.$nextTick(() => this.$nextTick(() => {
        this.buffer = '';
        this.$refs.textField.blur();
      }));
    },
  },
};
</script>
