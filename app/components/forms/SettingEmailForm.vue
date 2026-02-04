<template>
  <Form
    ref="formRef"
    v-slot="{ errors }"
    class="row gy-3"
    @submit="onSubmit"
    :validation-schema="schema"
  >
    <div class="col-lg-12">
      <label for="email" class="form-label">Email</label>
      <Field
        id="email"
        name="email"
        type="email"
        class="form-control"
        :class="{ 'is-invalid': errors.email }"
        placeholder="Zadejte email"
      />
      <ErrorMessage name="email" class="invalid-feedback" />
    </div>

    <div class="d-flex justify-content-end">
      <button
        type="submit"
        class="btn btn-success d-flex align-items-center gap-2"
      >
        <Icon name="mdi:content-save-outline" />
        Uložit
      </button>
    </div>
  </Form>
</template>
<script setup lang="ts">
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";

const props = defineProps<{
  formErrors?: Record<string, string[]>;
}>();

const formRef = ref<typeof Form>();

const schema = yup.object({
  email: yup.string().email("Neplatný email").required("Email je povinný"),
});

const emit = defineEmits(["submit"]);

function onSubmit(values: any) {
  emit("submit", values);
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
