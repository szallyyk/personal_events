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
    <div class="col-lg-12">
      <label for="password" class="form-label"> Heslo </label>
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
    <div class="d-flex flex-column col-lg-12">
      <button type="submit" class="btn btn-primary w-100">
        Zaregistrovat se
      </button>
      <small class="mt-2 text-center">
        Už máte účet?
        <NuxtLink
          to="/prihlaseni"
          class="text-primary text-decoration-underline"
          >Přihlaste se</NuxtLink
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
  email: yup.string().email("Neplatný email").required("Email je povinný"),
  password: yup.string().required("Heslo je povinné"),
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
