<template>
  <Form
    ref="formRef"
    v-slot="{ errors }"
    class="row gy-3"
    @submit="onSubmit"
    :validation-schema="schema"
  >
    <div class="col-lg-12">
      <label for="oldPassword" class="form-label">Staré Heslo</label>
      <Field
        id="oldPassword"
        name="oldPassword"
        type="password"
        class="form-control"
        :class="{ 'is-invalid': errors.oldPassword }"
        placeholder="Zadejte staré heslo"
      />
      <ErrorMessage name="oldPassword" class="invalid-feedback" />
    </div>
    <div class="col-lg-12">
      <label for="password" class="form-label">Nové heslo</label>
      <Field
        id="password"
        name="password"
        type="password"
        class="form-control"
        :class="{ 'is-invalid': errors.password }"
        placeholder="Zadejte heslo"
      />
      <ErrorMessage name="password" class="invalid-feedback" />
    </div>
    <div class="col-lg-12">
      <label for="repassword" class="form-label">Potvrzení nového hesla</label>
      <Field
        id="repassword"
        name="repassword"
        type="password"
        class="form-control"
        :class="{ 'is-invalid': errors.repassword }"
        placeholder="Zadejte heslo"
      />
      <ErrorMessage name="repassword" class="invalid-feedback" />
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
  oldPassword: yup.string().required("Staré heslo je povinné"),
  password: yup.string().required("Nové heslo je povinné"),
  repassword: yup
    .string()
    .oneOf([yup.ref("password")], "Hesla se neshodují")
    .required("Potvrzení nového hesla je povinné"),
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
