<template>
  <div class="card">
    <div class="card-header">
      <div class="row">
        <h3>Opakující se události</h3>
      </div>
    </div>
    <div class="card-body px-1">
      <form
        @submit.prevent="onSubmit"
        class="position-relative"
        :class="{ 'user-select-none': formDisabled }"
      >
        <div class="table-responsive">
          <table class="table-evenets table table-bordered">
            <thead>
              <tr>
                <th class="table-day">Den</th>
                <th class="table-timeFrom">Od</th>
                <th class="table-timeTo">Do</th>
                <th class="table-type">Typ</th>
                <th class="table-action">Akce</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(field, index) in fields" :key="field.key">
                <td>
                  <div class="d-flex flex-column gap-1">
                    <Field
                      :name="`regularities[${index}].id`"
                      type="hidden"
                      class="form-control"
                      :disabled="formDisabled"
                    />
                    <Field
                      :name="`regularities[${index}].dayNumber`"
                      as="select"
                      class="form-control"
                      :disabled="formDisabled"
                    >
                      <option value="" disabled>Vyberte den</option>
                      <option v-for="day in days" :key="day.id" :value="day.id">
                        {{ day.name }}
                      </option>
                    </Field>
                    <ErrorMessage
                      :name="`regularities[${index}].dayNumber`"
                      class="text-danger"
                    />
                  </div>
                </td>
                <td>
                  <div class="d-flex flex-column gap-1">
                    <Field
                      :name="`regularities[${index}].timeFrom`"
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
                      :name="`regularities[${index}].timeFrom`"
                      class="text-danger"
                    />
                  </div>
                </td>
                <td>
                  <div class="d-flex flex-column gap-1">
                    <Field
                      :name="`regularities[${index}].timeTo`"
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
                      :name="`regularities[${index}].timeTo`"
                      class="text-danger"
                    />
                  </div>
                </td>
                <td>
                  <div class="d-flex flex-column gap-1">
                    <Field
                      as="select"
                      :name="`regularities[${index}].eventTypeId`"
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
                      :name="`regularities[${index}].eventTypeId`"
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
                        dayNumber: '',
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
                      Nejsou zde žádné regularity k zobrazení.
                    </span>
                    <button
                      type="button"
                      class="btn btn-primary d-flex align-items-center justify-content-center"
                      @click="
                        push({
                          id: null,
                          dayNumber: '',
                          timeFrom: '',
                          timeTo: '',
                          eventTypeId: ''
                        })
                      "
                      :disabled="formDisabled"
                    >
                      <Icon name="mdi:plus" />
                      Přidat regularitu
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
  initialRegularity: {
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

const days = [
  { id: 1, name: "Pondělí", value: "monday" },
  { id: 2, name: "Úterý", value: "tuesday" },
  { id: 3, name: "Středa", value: "wednesday" },
  { id: 4, name: "Čtvrtek", value: "thursday" },
  { id: 5, name: "Pátek", value: "friday" },
  { id: 6, name: "Sobota", value: "saturday" },
  { id: 7, name: "Neděle", value: "sunday" }
];

const schema = yup.object({
  regularities: yup.array().of(
    yup.object({
      dayNumber: yup.string().required("Den je povinný"),
      timeFrom: yup.string().required("Čas od je povinný"),
      timeTo: yup.string().required("Čas do je povinný"),
      eventTypeId: yup.string().required("Typ události je povinný")
    })
  )
});

const { values, handleSubmit, setErrors } = useForm({
  initialValues: {
    regularities: props.initialRegularity || []
  },
  validationSchema: schema
});

const { fields, push, remove } = useFieldArray("regularities");

watch(
  values,
  (newValues) => {
    let emitOption = { name: "regularity", isEdit: true };
    emit("change", emitOption);
  },
  { deep: true }
);

const onSubmit = handleSubmit((formValues) => {
  const sendData = {
    regularities: formValues.regularities.map((r: any) => ({
      id: r.id || null,
      dayNumber: r.dayNumber,
      timeFrom: r.timeFrom ? formatTime(r.timeFrom) : null,
      timeTo: r.timeTo ? formatTime(r.timeTo) : null,
      eventTypeId: r.eventTypeId || null
    }))
  };
  emit("submit", sendData);
});

function handleDelete(index: number) {
  remove(index);
  //emit("delete", index);
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
  "regularities" // název tvého array fieldu
);

defineExpose({
  disableForm,
  enableForm
});
</script>
<style></style>
