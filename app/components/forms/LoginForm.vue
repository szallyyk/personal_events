<template>
  <Form
    ref="formRef"
    v-slot="{ errors }"
    class="row gy-3"
    @submit="onSubmit"
    :validation-schema="schema"
  >
    <div class="col-lg-12">
      <label for="userEmail" class="form-label">Email</label>
      <Field
        id="userEmail"
        name="userEmail"
        type="email"
        class="form-control"
        :class="{ 'is-invalid': errors.userEmail }"
        placeholder="Zadejte email"
      />
      <ErrorMessage name="userEmail" class="invalid-feedback" />
    </div>
    <div class="col-lg-12">
      <label for="userPassword" class="form-label"> Heslo </label>
      <Field
        id="userPassword"
        name="userPassword"
        type="password"
        class="form-control"
        :class="{ 'is-invalid': errors.userPassword }"
        placeholder="Zadejte heslo"
      />
      <ErrorMessage name="userPassword" class="invalid-feedback" />
    </div>
    <small>
      <NuxtLink
        to="/zapomenute-heslo"
        class="text-primary text-decoration-underline"
        >Zapomněli jste heslo?</NuxtLink
      >
    </small>
    <div class="d-flex flex-column col-lg-12">
      <button type="submit" class="btn btn-primary w-100">Přihlásit se</button>
      <small class="mt-2 text-center">
        Nemáte účet?
        <NuxtLink
          to="/registrace"
          class="text-primary text-decoration-underline"
          >Zaregistrujte se</NuxtLink
        >
      </small>
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
  userEmail: yup.string().email("Neplatný email").required("Email je povinný"),
  userPassword: yup.string().required("Heslo je povinné"),
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
