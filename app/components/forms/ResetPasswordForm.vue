<template>
  <Form
    ref="formRef"
    v-slot="{ errors }"
    class="row gy-3"
    @submit="onSubmit"
    :validation-schema="schema"
  >
    <div class="col-lg-12">
      <label for="password" class="form-label">Heslo</label>
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
      <label for="repassword" class="form-label"> Potvrzení hesla </label>
      <Field
        id="repassword"
        name="repassword"
        type="password"
        class="form-control"
        :class="{ 'is-invalid': errors.repassword }"
        placeholder="Zadejte heslo znovu"
      />
      <ErrorMessage name="repassword" class="invalid-feedback" />
    </div>
    <div class="d-flex">
      <button type="submit" class="btn btn-primary w-100">Obnovit heslo</button>
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
  password: yup.string().required("Heslo je povinné"),
  repassword: yup
    .string()
    .required("Potvrzení hesla je povinné")
    .oneOf([yup.ref("password")], "Hesla se neshodují")
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
  { deep: true }
);
</script>
