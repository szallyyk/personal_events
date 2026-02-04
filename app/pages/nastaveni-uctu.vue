<template>
  <div class="container mt-4">
    <h2>Nastavení účtu</h2>
    <div class="row mt-4">
      <div class="col-lg-6 col-md-6 col-12">
        <div class="card shadow">
          <div class="card-header">
            <h4 class="card-title">Změna hesla</h4>
          </div>
          <div class="card-body">
            <SettingPasswordForm
              @submit="handleChangePassword"
              :formErrors="changePasswordFormErrors"
            />
          </div>
        </div>
      </div>
      <div class="col-lg-6 col-md-6 col-12">
        <div class="card shadow">
          <div class="card-header">
            <h4 class="card-title">Změna emailu</h4>
          </div>
          <div class="card-body">
            <SettingEmailForm
              @submit="handleChangeEmail"
              :formErrors="changeEmailFormErrors"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const { $api } = useNuxtApp();
const { alert } = useToastStore();

const changeEmailFormErrors = ref<Record<string, string[]>>({});
const changePasswordFormErrors = ref<Record<string, string[]>>({});

async function handleChangePassword(data: {
  oldPassword: string;
  password: string;
  repassword: string;
}) {
  try {
    const response = await $api.put("/accounts/me/passwords", data);
    alert(response.data.message, "success");
  } catch (err) {
    const { message, errors } = parseApiError(err);
    changePasswordFormErrors.value = errors || {};
    alert(message, "error");
  }
}

async function handleChangeEmail(data: { email: string }) {
  try {
    const response = await $api.put("/accounts/me/email", data);
    alert(response.data.message, "success");
  } catch (err) {
    const { message, errors } = parseApiError(err);
    changeEmailFormErrors.value = errors || {};
    alert(message, "error");
  }
}

definePageMeta({
  layout: "admin",
});

useHead({
  title: "Nastavení účtu",
});
</script>
