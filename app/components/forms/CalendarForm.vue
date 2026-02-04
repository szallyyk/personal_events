<template>
  <Form
    ref="formRef"
    class="row gy-3"
    v-slot="{ errors }"
    @submit="onSubmit"
    :validation-schema="schema"
    :initial-values="intialValues"
  >
    <div class="col-lg-12">
      <label for="name" class="form-label">Interní název kalendáře</label>
      <Field
        id="name"
        name="name"
        type="text"
        class="form-control"
        :class="{ 'is-invalid': errors.name }"
        placeholder="Zadejte název kalendáře"
      />
      <ErrorMessage name="name" class="invalid-feedback" />
    </div>

    <div class="col-lg-12">
      <label for="namePublic" class="form-label">Veřejný název kalendáře</label>
      <Field
        id="namePublic"
        name="namePublic"
        type="text"
        class="form-control"
        :class="{ 'is-invalid': errors.namePublic }"
        placeholder="Zadejte veřejný název kalendáře"
      />
      <ErrorMessage name="namePublic" class="invalid-feedback" />
    </div>
    <div class="col-lg-12">
      <label for="description" class="form-label">Popisek</label>
      <Field
        id="description"
        name="description"
        as="textarea"
        class="form-control"
        :class="{ 'is-invalid': errors.description }"
        placeholder="Zadejte popis kalendáře"
        rows="3"
      />
      <ErrorMessage name="description" class="invalid-feedback" />
    </div>
    <div class="col-lg-12">
      <label for="infoDescription" class="form-label">Další informace</label>
      <Field
        id="infoDescription"
        name="infoDescription"
        as="textarea"
        class="form-control"
        :class="{ 'is-invalid': errors.infoDescription }"
        placeholder="Zadejte popis kalendáře"
        rows="3"
      />
      <ErrorMessage name="infoDescription" class="invalid-feedback" />
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
    description: string;
    infoDescription: string;
    namePublic: string;
  };
}>();

const formRef = ref<typeof Form>();

const schema = yup.object({
  name: yup.string().required("Název kalendáře je povinný"),
  description: yup.string(),
  infoDescription: yup.string()
});

const intialValues = ref({
  name: props.data?.name || "",
  description: props.data?.description || "",
  infoDescription: props.data?.infoDescription || "",
  namePublic: props.data?.namePublic || ""
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
  { deep: true }
);
</script>
