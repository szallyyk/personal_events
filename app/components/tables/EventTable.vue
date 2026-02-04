<template>
  <div class="card">
    <div class="card-header">
      <div class="row">
        <h3>
          Události /
          <nuxt-link to="/" target="_blank" class="text-under-line">
            Zobrazit kalendář
          </nuxt-link>
        </h3>
      </div>
    </div>
    <div class="card-body px-1">
      <!-- Už není <Form> komponenta, jen obyčejný form element -->
      <form
        @submit.prevent="onSubmit"
        :class="{ 'user-select-none': formDisabled }"
      >
        <div class="table-responsive">
          <table class="table-evenets table table-bordered">
            <thead>
              <tr>
                <th class="table-date">Datum</th>
                <th class="table-timeFrom">Od</th>
                <th class="table-timeTo">Do</th>
                <th class="table-type">Typ</th>
                <th class="table-action">Akce</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(field, index) in fields" :key="field.key">
                <td>
                  <Field
                    :name="`events[${index}].id`"
                    type="hidden"
                    class="form-control"
                    :disabled="formDisabled"
                  />
                  <div class="d-flex flex-column gap-1">
                    <Field
                      :name="`events[${index}].date`"
                      v-slot="{ value, handleChange }"
                    >
                      <DatePicker
                        :modelValue="value"
                        @update:modelValue="handleChange"
                        class="w-100"
                        placeholder="Vybrat datum"
                        date-format="dd.mm.yy"
                        :disabled="formDisabled"
                      />
                    </Field>
                    <ErrorMessage
                      :name="`events[${index}].date`"
                      class="text-danger"
                    />
                  </div>
                </td>
                <td>
                  <div class="d-flex flex-column gap-1">
                    <Field
                      :name="`events[${index}].timeFrom`"
                      v-slot="{ value, handleChange }"
                    >
                      <DatePicker
                        :modelValue="value"
                        @update:modelValue="handleChange"
                        class="w-100"
                        hour-format="24"
                        :step-minute="15"
                        :time-only="true"
                        :show-time="true"
                        :show-seconds="false"
                        placeholder="Vybrat čas"
                        :disabled="formDisabled"
                      />
                    </Field>
                    <ErrorMessage
                      :name="`events[${index}].timeFrom`"
                      class="text-danger"
                    />
                  </div>
                </td>
                <td>
                  <div class="d-flex flex-column gap-1">
                    <Field
                      :name="`events[${index}].timeTo`"
                      v-slot="{ value, handleChange }"
                    >
                      <DatePicker
                        :modelValue="value"
                        @update:modelValue="handleChange"
                        class="w-100"
                        hour-format="24"
                        :step-minute="15"
                        :time-only="true"
                        :show-time="true"
                        :show-seconds="false"
                        placeholder="Vybrat čas"
                        :disabled="formDisabled"
                      />
                    </Field>
                    <ErrorMessage
                      :name="`events[${index}].timeTo`"
                      class="text-danger"
                    />
                  </div>
                </td>
                <td>
                  <div class="d-flex flex-column gap-1">
                    <Field
                      as="select"
                      :name="`events[${index}].eventTypeId`"
                      class="form-control"
                      :disabled="formDisabled"
                    >
                      <option value="" disabled>Vyberte typ</option>
                      <option
                        v-for="type in eventTypes"
                        :key="type.id"
                        :value="type.id"
                      >
                        {{ type.name }}
                      </option>
                    </Field>
                    <ErrorMessage
                      :name="`events[${index}].eventTypeId`"
                      class="text-danger"
                    />
                  </div>
                </td>
                <td>
                  <button
                    type="button"
                    class="btn btn-primary d-flex align-items-center justify-content-center"
                    @click="
                      push({
                        id: null,
                        date: '',
                        timeFrom: '',
                        timeTo: '',
                        eventTypeId: ''
                      })
                    "
                    :disabled="formDisabled"
                  >
                    <Icon name="mdi:plus" />
                  </button>
                  <button
                    type="button"
                    class="btn btn-danger d-flex align-items-center justify-content-center"
                    @click="handleDelete(index)"
                    :disabled="formDisabled"
                  >
                    <Icon name="mdi:trash-can" />
                  </button>
                </td>
              </tr>
            </tbody>
            <tfoot v-if="fields.length === 0">
              <tr>
                <td colspan="5" class="text-center">
                  <div class="d-flex flex-column align-items-center gap-3">
                    <span class="text-muted">
                      Nejsou zde žádné další události k zobrazení.
                    </span>
                    <button
                      type="button"
                      class="btn btn-primary d-flex align-items-center justify-content-center"
                      @click="
                        push({
                          id: null,
                          date: '',
                          timeFrom: '',
                          timeTo: '',
                          eventTypeId: ''
                        })
                      "
                      :disabled="formDisabled"
                    >
                      <Icon name="mdi:plus" />
                      Přidat událost
                    </button>
                  </div>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
        <div class="d-flex justify-content-end mt-3">
          <button
            type="submit"
            class="btn btn-success d-flex align-items-center"
            :disabled="isSaving || formDisabled"
          >
            <Icon name="mdi:check" class="me-2" />
            Potvrdit
          </button>
        </div>
      </form>
    </div>
    <div v-if="formDisabled" class="disabled-backdrop"></div>
  </div>
</template>

<script setup lang="ts">
import DatePicker from "primevue/datepicker";
import { useForm, useFieldArray, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

const props = defineProps({
  formErrors: {
    type: Object,
    default: () => ({})
  },
  initialEvents: {
    type: Array,
    default: () => []
  },
  eventTypes: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(["submit", "delete", "change"]);

const isSaving = ref(false);
const formDisabled = ref(false);

const schema = yup.object({
  events: yup.array().of(
    yup.object({
      date: yup.string().required("Datum je povinné"),
      timeFrom: yup.string().required("Čas od je povinný"),
      timeTo: yup.string().required("Čas do je povinný"),
      eventTypeId: yup.string().required("Typ události je povinný")
    })
  )
});

const { values, handleSubmit, setErrors } = useForm({
  initialValues: {
    events: props.initialEvents || []
  },
  validationSchema: schema
});

const { fields, push, remove } = useFieldArray("events");

watch(
  values,
  (newValues) => {
    let emitOption = { name: "events", isEdit: true };
    emit("change", emitOption);
  },
  { deep: true }
);

const onSubmit = handleSubmit((formValues) => {
  const sendData = {
    events: formValues.events.map((e: any) => ({
      id: e.id || null,
      date: e.date ? formatDate(e.date) : null,
      timeFrom: e.timeFrom ? formatTime(e.timeFrom) : null,
      timeTo: e.timeTo ? formatTime(e.timeTo) : null,
      eventTypeId: e.eventTypeId || null
    }))
  };
  emit("submit", sendData);
});

function handleDelete(index: number) {
  remove(index);
  // emit("delete", index);
}

function resetToInitialValues() {
  values.events = props.initialEvents || [];
}

function disableForm() {
  formDisabled.value = true;
}
function enableForm() {
  formDisabled.value = false;
}

const { watchAndSetErrors } = useFormErrorTransformer();

watchAndSetErrors(
  () => props.formErrors,
  setErrors,
  "events" // název tvého array fieldu
);

defineExpose({
  disableForm,
  enableForm
});
</script>
