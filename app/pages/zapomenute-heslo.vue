<template>
  <div
    class="min-vh-100 d-flex align-items-center justify-content-center bg-light"
  >
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-sm-8 col-md-6 col-lg-4">
          <div class="card shadow">
            <div class="card-body p-4">
              <h2 class="card-title mb-4 text-center">Zapomenuté heslo</h2>
              <template v-if="!isSuccess">
                <ForgottenPasswordForm
                  :formErrors="forgottenPasswordFormErrors"
                  @submit="forgottenPassword"
                />
              </template>
              <template v-else>
                <div class="mb-4 text-center">
                  Na váš email byl odeslán odkaz pro obnovení hesla.
                </div>
                <button
                  class="btn btn-primary w-100"
                  @click="navigateTo('/prihlaseni')"
                >
                  Přejít na přihlášení
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const { $api } = useNuxtApp();
const { alert } = useToastStore();

const forgottenPasswordFormErrors = ref<Record<string, string[]>>({});
const isSuccess = ref(false);

async function forgottenPassword(data: { email: string }) {
  try {
    const response = await $api.post("/accounts/passwords/reset", data);
    alert(response.data.message, "success");
    isSuccess.value = true;
  } catch (err) {
    const { message, errors } = parseApiError(err);
    alert(message, "error");
    forgottenPasswordFormErrors.value = errors;
  }
}

useHead({
  title: "Zapomenuté heslo"
});
</script>
