<template>
  <div class="card">
    <div class="card-header">
      <div class="row">
        <h3>Správa typů událostí</h3>
      </div>
    </div>
    <div class="card-body px-1">
      <form
        @submit.prevent="onSubmit"
        :class="{ 'user-select-none': formDisabled }"
      >
        <div class="table-responsive">
          <table class="table-evenets table table-bordered">
            <thead>
              <tr>
                <th class="table-id">ID</th>
                <th class="table-name">Název</th>
                <th class="table-cssClass">Barva</th>
                <th class="table-action">Akce</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(field, index) in fields" :key="field.key">
                <td>
                  <Field
                    :name="`options[${index}].id`"
                    type="number"
                    class="form-control"
                    :disabled="formDisabled"
                  />
                  <ErrorMessage
                    :name="`options[${index}].id`"
                    class="text-danger"
                  />
                </td>
                <td>
                  <Field
                    :name="`options[${index}].name`"
                    class="form-control"
                    type="text"
                    :disabled="formDisabled"
                  />
                  <ErrorMessage
                    :name="`options[${index}].name`"
                    class="text-danger"
                  />
                </td>
                <td>
                  <Field
                    :name="`options[${index}].cssClass`"
                    v-slot="{ value, handleChange }"
                  >
                    <Dropdown
                      :modelValue="value"
                      @update:modelValue="handleChange"
                      :options="cssClassesWithColors"
                      optionLabel="label"
                      optionValue="value"
                      placeholder="Vyberte barvu"
                      class="w-100"
                      :disabled="formDisabled"
                    >
                      <template #option="slotProps">
                        <div class="d-flex align-items-center gap-2">
                          <span
                            class="color-indicator"
                            :class="`event-${slotProps.option.value}`"
                          ></span>
                        </div>
                      </template>
                      <template #value="slotProps">
                        <div
                          v-if="slotProps.value"
                          class="d-flex align-items-center gap-2"
                        >
                          <span
                            class="color-indicator"
                            :class="`event-${slotProps.value}`"
                          ></span>
                        </div>
                        <span v-else>Vyberte barvu</span>
                      </template>
                    </Dropdown>
                  </Field>
                  <ErrorMessage
                    :name="`options[${index}].cssClass`"
                    class="text-danger"
                  />
                </td>
                <td>
                  <button
                    type="button"
                    class="btn btn-primary d-flex align-items-center justify-content-center"
                    @click="push({ id: '', name: '', cssClass: '' })"
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
                <td colspan="4" class="text-center">
                  <div class="d-flex flex-column align-items-center gap-3">
                    <span class="text-muted">
                      Nejsou zde žádné typy událostí k zobrazení.
                    </span>
                    <button
                      type="button"
                      class="btn btn-primary d-flex align-items-center justify-content-center"
                      @click="push({ id: '', name: '', cssClass: '' })"
                      :disabled="formDisabled"
                    >
                      <Icon name="mdi:plus" />
                      Přidat typ události
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
import Dropdown from "primevue/dropdown";
import { useForm, useFieldArray, Field, ErrorMessage } from "vee-validate";

const props = defineProps({
  initialOptions: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["submit", "delete", "change"]);

const isSaving = ref(false);
const formDisabled = ref(false);

const cssClassesWithColors = [
  { value: "indigo", label: "Modrá" },
  { value: "danger", label: "Červená" },
  { value: "success", label: "Zelená" },
  { value: "warning", label: "Žlutá" },
  { value: "primary", label: "Modrá" },
  { value: "pink", label: "Růžová" },
];

const { values, handleSubmit } = useForm({
  initialValues: {
    options: props.initialOptions || [],
  },
});

const { fields, push, remove } = useFieldArray("options");

// Sledování změn
watch(
  values,
  (newValues) => {
    let emitOption = { name: "option", isEdit: true };
    emit("change", emitOption);
  },
  { deep: true },
);

const onSubmit = handleSubmit((formValues) => {
  const sendData = {
    options: formValues.options.map((r: any) => ({
      id: r.id,
      name: r.name,
      cssClass: r.cssClass,
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
<style scoped>
.event-danger {
  background-color: #fd152c !important;
}
.event-success {
  background-color: #10b981 !important;
}
.event-primary {
  background-color: #3788d8 !important;
}
.event-warning {
  background-color: #f59e0b !important;
}
.event-indigo {
  background-color: #6610f2 !important;
}
.event-pink {
  background-color: #cc4589 !important;
}
</style>
