<template>
  <div
    class="min-vh-100 d-flex align-items-center justify-content-center bg-light"
  >
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-sm-8 col-md-6 col-lg-4">
          <div class="card shadow">
            <div class="card-body p-4">
              <h2 class="card-title mb-4 text-center">Registrace</h2>
              <template v-if="!isRegisterSuccess">
                <RegisterForm
                  :formErrors="registerFormErrors"
                  @submit="registerUser"
                />
              </template>
              <template v-else>
                <div class="mb-4 text-center">
                  Registrace proběhla úspěšně! Nyní se můžete přihlásit.
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
const userStore = useUserStore();

const registerFormErrors = ref<Record<string, string[]>>({});
const isRegisterSuccess = ref(false);

async function registerUser(data: { email: string; password: string }) {
  try {
    const response = await $api.post("/accounts/register", data);
    userStore.setUser(response.data.data.user);
    alert(response.data.message, "success");
    isRegisterSuccess.value = true;
  } catch (err) {
    const { message, errors } = parseApiError(err);
    alert(message, "error");
    registerFormErrors.value = errors;
  }
}

useHead({
  title: "Registrace",
});
</script>
