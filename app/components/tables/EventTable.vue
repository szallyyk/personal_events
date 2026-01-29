<template>
  <div class="card">
    <div class="card-header">
      <div class="row">
        <h3>
          Správa událostí /
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
                </td>
                <td>
                  <Field
                    :name="`events[${index}].dateFrom`"
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
                    :name="`events[${index}].dateFrom`"
                    class="text-danger"
                  />
                </td>
                <td>
                  <Field
                    :name="`events[${index}].dateTo`"
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
                    :name="`events[${index}].dateTo`"
                    class="text-danger"
                  />
                </td>
                <td>
                  <Field
                    as="select"
                    :name="`events[${index}].typeId`"
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
                    :name="`events[${index}].typeId`"
                    class="text-danger"
                  />
                </td>
                <td>
                  <button
                    type="button"
                    class="btn btn-primary d-flex align-items-center justify-content-center"
                    @click="
                      push({ date: '', dateFrom: '', dateTo: '', typeId: '' })
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
                        push({ date: '', dateFrom: '', dateTo: '', typeId: '' })
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

const props = defineProps({
  initialEvents: {
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

const { values, handleSubmit } = useForm({
  initialValues: {
    events: props.initialEvents || [],
  },
});

const { fields, push, remove } = useFieldArray("events");

watch(
  values,
  (newValues) => {
    let emitOption = { name: "events", isEdit: true };
    emit("change", emitOption);
  },
  { deep: true },
);

const onSubmit = handleSubmit((formValues) => {
  const sendData = {
    dates: formValues.events.map((e: any) => ({
      date: e.date ? formatDate(e.date) : null,
      dateFrom: e.dateFrom ? formatTime(e.dateFrom) : null,
      dateTo: e.dateTo ? formatTime(e.dateTo) : null,
      typeId: e.typeId || null,
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
