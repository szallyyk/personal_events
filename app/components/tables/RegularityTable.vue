<template>
  <div class="card">
    <div class="card-header">
      <div class="row">
        <h3>Správa regularit</h3>
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
                  <Field
                    :name="`regularity[${index}].dayName`"
                    as="select"
                    class="form-control"
                    :disabled="formDisabled"
                  >
                    <option value="" disabled>Vyberte den</option>
                    <option
                      v-for="day in days"
                      :key="day.id"
                      :value="day.value"
                    >
                      {{ day.name }}
                    </option>
                  </Field>
                  <ErrorMessage
                    :name="`regularity[${index}].dayName`"
                    class="text-danger"
                  />
                </td>
                <td>
                  <Field
                    :name="`regularity[${index}].dateFrom`"
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
                    :name="`regularity[${index}].dateFrom`"
                    class="text-danger"
                  />
                </td>
                <td>
                  <Field
                    :name="`regularity[${index}].dateTo`"
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
                    :name="`regularity[${index}].dateTo`"
                    class="text-danger"
                  />
                </td>
                <td>
                  <Field
                    as="select"
                    :name="`regularity[${index}].typeId`"
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
                    :name="`regularity[${index}].typeId`"
                    class="text-danger"
                  />
                </td>
                <td>
                  <button
                    type="button"
                    class="btn btn-primary d-flex align-items-center justify-content-center"
                    @click="
                      push({
                        dayName: '',
                        dateFrom: '',
                        dateTo: '',
                        typeId: '',
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
                          dayName: '',
                          dateFrom: '',
                          dateTo: '',
                          typeId: '',
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

const props = defineProps({
  initialRegularity: {
    type: Array,
    default: () => [],
  },
  eventTypes: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["submit", "delete", "change"]);

const isSaving = ref(false);
const formDisabled = ref(false);

const days = [
  { id: 0, name: "Pondělí", value: "monday" },
  { id: 1, name: "Úterý", value: "tuesday" },
  { id: 2, name: "Středa", value: "wednesday" },
  { id: 3, name: "Čtvrtek", value: "thursday" },
  { id: 4, name: "Pátek", value: "friday" },
  { id: 5, name: "Sobota", value: "saturday" },
  { id: 6, name: "Neděle", value: "sunday" },
];

const { values, handleSubmit } = useForm({
  initialValues: {
    regularity: props.initialRegularity || [],
  },
});

const { fields, push, remove } = useFieldArray("regularity");

// Sledování změn
watch(
  values,
  (newValues) => {
    let emitOption = { name: "regularity", isEdit: true };
    emit("change", emitOption);
  },
  { deep: true },
);

const onSubmit = handleSubmit((formValues) => {
  const sendData = {
    regularity: formValues.regularity.map((r: any) => ({
      dayName: r.dayName,
      dateFrom: r.dateFrom ? formatTime(r.dateFrom) : null,
      dateTo: r.dateTo ? formatTime(r.dateTo) : null,
      typeId: r.typeId || null,
    })),
  };
  emit("submit", sendData);
});

function handleDelete(index: number) {
  emit("delete", index);
}

function disableForm() {
  formDisabled.value = true;
}
function enableForm() {
  formDisabled.value = false;
}

defineExpose({
  disableForm,
  enableForm,
});
</script>
<style></style>
