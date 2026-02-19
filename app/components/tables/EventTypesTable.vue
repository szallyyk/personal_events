<template>
  <div class="card">
    <div class="card-header">
      <div class="row">
        <h3>Typy událostí</h3>
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
                <th class="table-drag"></th>
                <th class="table-id">Pořadí</th>
                <th class="table-name">Název</th>
                <th class="table-cssClass">Barva</th>
                <th class="table-action">Akce</th>
              </tr>
            </thead>
            <draggable
              :model-value="fields"
              handle=".drag-handle"
              :animation="200"
              @end="onDragEnd"
              tag="tbody"
            >
              <tr
                v-for="(field, index) in fields"
                :key="field.key"
                class="item-with-handle"
              >
                <td>
                  <Icon name="mdi:drag" class="drag-handle" size="32" />
                </td>
                <td>
                  <Field
                    :name="`eventTypes[${index}].id`"
                    type="hidden"
                    class="form-control"
                    :disabled="formDisabled"
                  />
                  <div class="d-flex flex-column gap-1">
                    {{ index + 1 }}
                  </div>
                </td>
                <td>
                  <div class="d-flex flex-column gap-1">
                    <Field
                      :name="`eventTypes[${index}].name`"
                      class="form-control"
                      type="text"
                      :disabled="formDisabled"
                    />
                    <ErrorMessage
                      :name="`eventTypes[${index}].name`"
                      class="text-danger"
                    />
                  </div>
                </td>
                <td>
                  <div class="d-flex flex-column gap-1">
                    <Field
                      :name="`eventTypes[${index}].hexColor`"
                      type="color"
                      class="form-control form-control-color p-0 border-0"
                      :disabled="formDisabled"
                    />
                    <ErrorMessage
                      :name="`eventTypes[${index}].hexColor`"
                      class="text-danger"
                    />
                  </div>
                </td>
                <td>
                  <button
                    type="button"
                    class="btn btn-primary d-flex align-items-center justify-content-center"
                    @click="push({ id: '', rank: '', name: '', hexColor: '' })"
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
            </draggable>
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
                      @click="
                        push({ id: '', rank: '', name: '', hexColor: '' })
                      "
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
import { VueDraggableNext as draggable } from "vue-draggable-next";

import { useForm, useFieldArray, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

const { alert } = useToastStore();
const { watchAndSetErrors } = useFormErrorTransformer();

const props = defineProps({
  formErrors: {
    type: Object,
    default: () => ({}),
  },
  initialOptions: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["submit", "delete", "change"]);

const isSaving = ref(false);
const formDisabled = ref(false);

const schema = yup.object({
  eventTypes: yup.array().of(
    yup.object({
      id: yup.string().nullable(),
      rank: yup.string().required("Pořadí je povinné"),
      name: yup.string().required("Název je povinný"),
      hexColor: yup
        .string()
        .matches(/^#([0-9A-F]{3}){1,2}$/i, "Neplatný formát barvy")
        .required("Barva je povinná"),
    }),
  ),
});

const { values, handleSubmit, setErrors, setFieldValue } = useForm({
  initialValues: {
    eventTypes: props.initialOptions || [],
  },
  validationSchema: schema,
});

const { fields, push, remove, move } = useFieldArray("eventTypes");

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
    eventTypes: formValues.eventTypes.map((r: any) => ({
      id: r.id,
      rank: parseInt(r.rank, 10),
      name: r.name,
      hexColor: r.hexColor,
    })),
  };
  emit("submit", sendData);
});

function handleDelete(index: number) {
  if (fields.value.length === 1 || fields.value.length < 0) {
    alert("Musí zde být alespoň jeden typ události.", "error");
    return;
  } else {
    remove(index);
  }
  // emit("delete", index);
}

function disableForm() {
  formDisabled.value = true;
}
function enableForm() {
  formDisabled.value = false;
}
function onDragEnd(event: any) {
  const { oldIndex, newIndex } = event;
  if (
    oldIndex !== undefined &&
    newIndex !== undefined &&
    oldIndex !== newIndex
  ) {
    move(oldIndex, newIndex);
    fields.value.forEach((_, index) => {
      setFieldValue(`eventTypes[${index}].rank`, String(index + 1));
    });
  }
}
const onListChange = (event: any) => {
  console.log("List changed:", event);
  console.log("New order:", fields.value);
  console.log("Current values:", values.eventTypes);
};

watchAndSetErrors(
  () => props.formErrors,
  setErrors,
  "eventTypes", // název tvého array fieldu
);

defineExpose({
  disableForm,
  enableForm,
});
</script>
<style scoped>
.item-with-handle {
  align-items: center;
  padding: 10px;
  margin: 5px 0;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.drag-handle {
  cursor: grab;
  margin-right: 10px;
  color: #999;
  user-select: none;
}

.drag-handle:active {
  cursor: grabbing;
}
.table-drag {
  width: 40px;
}

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
