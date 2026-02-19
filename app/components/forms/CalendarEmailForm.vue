<template>
  <Form
    ref="formRef"
    class="row gy-3"
    v-slot="{ errors }"
    @submit="onSubmit"
    :validation-schema="schema"
    :initial-values="intialValues"
  >
    <div class="col-lg-6 col-md-12">
      <label for="name" class="form-label">Jméno</label>
      <Field
        id="name"
        name="name"
        type="text"
        class="form-control"
        :class="{ 'is-invalid': errors.name }"
        placeholder="Zadejte jméno"
      />
      <ErrorMessage name="name" class="invalid-feedback" />
    </div>

    <div class="col-lg-6 col-md-12">
      <label for="phone" class="form-label">Telefon</label>
      <Field
        id="phone"
        name="phone"
        type="text"
        class="form-control"
        :class="{ 'is-invalid': errors.phone }"
        placeholder="Zadejte telefon"
      />
      <ErrorMessage name="phone" class="invalid-feedback" />
    </div>
    <div class="col-lg-6 col-md-12">
      <label for="date" class="form-label">Jaký den se mám ozvat?</label>
      <Field name="date" v-slot="{ value, handleChange }">
        <DatePicker
          id="date"
          :modelValue="value"
          @update:modelValue="handleChange"
          class="w-100"
          placeholder="Vybrat datum"
          date-format="dd.mm.yy"
        />
      </Field>
      <ErrorMessage name="date" class="text-danger" />
    </div>
    <div class="col-lg-6 col-md-12">
      <label for="time" class="form-label">V kolik hodin se mám ozvat?</label>
      <Field name="time" v-slot="{ value, handleChange }">
        <DatePicker
          id="time"
          :modelValue="value"
          @update:modelValue="handleChange"
          class="w-100"
          hour-format="24"
          :step-minute="15"
          :time-only="true"
          :show-time="true"
          :show-seconds="false"
          placeholder="Vybrat čas"
        />
      </Field>
      <ErrorMessage name="time" class="text-danger" />
    </div>
    <div class="col-lg-12 col-md-12">
      <label for="message" class="form-label">Poznámka</label>
      <Field
        id="message"
        name="message"
        as="textarea"
        class="form-control"
        :class="{ 'is-invalid': errors.message }"
        placeholder="Zadejte poznámku"
        rows="3"
      />
      <ErrorMessage name="message" class="invalid-feedback" />
    </div>

    <div class="d-flex justify-content-between">
      <button
        type="button"
        class="btn btn-secondary me-2 d-flex align-items-center gap-2"
        @click="onClose"
      >
        <Icon name="mdi:close-circle-outline" />

        Zavřít
      </button>
      <button
        type="submit"
        class="btn btn-success d-flex align-items-center gap-2"
      >
        <Icon name="mdi:check-circle-outline" />
        Potvrdit
      </button>
    </div>
  </Form>
</template>
<script setup lang="ts">
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

const props = defineProps<{
  formErrors?: Record<string, string[]>;
  data?: {
    name: string;
    phone: string;
    date: string | null;
    time: string | null;
    message: string | null;
  };
}>();

const formRef = ref<typeof Form>();

const schema = yup.object({
  name: yup.string().required("Jméno je povinné"),
  phone: yup.string().required("Telefon je povinný"),
  date: yup.mixed().nullable().required("Datum je povinné"),
  time: yup.mixed().nullable().required("Čas je povinný"),
  message: yup.string().nullable(),
});

const intialValues = ref({
  name: props.data?.name || "",
  phone: props.data?.phone || "",
  date: props.data?.date || null,
  time: props.data?.time || null,
  message: props.data?.message || "",
});

const emit = defineEmits(["submit", "close"]);

function onSubmit(values: any) {
  emit("submit", values);
}

function onClose() {
  emit("close");
}

watch(
  () => props.formErrors,
  (newErrors) => {
    if (formRef.value) {
      formRef.value.setErrors(props.formErrors);
    }
  },
  { deep: true },
);
</script>
