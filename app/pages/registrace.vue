<template>
  <div
    class="min-vh-100 d-flex align-items-center justify-content-center bg-light"
  >
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-sm-8 col-md-6 col-lg-4">
          <div class="card shadow">
            <div class="card-body p-4">
              <h2 class="card-title text-center">Registrace</h2>
              <p class="mb-3 small">
                Zadejte svůj email a heslo pro vytvoření účtu, nebo se
                zaregistrujte pomocí Google účtu.
              </p>
              <template v-if="!isRegisterSuccess">
                <button
                  @click="redirectToGoogleAuth"
                  class="googleAuth-btn w-100 mb-3"
                >
                  <Icon name="flat-color-icons:google" size="24"></Icon>
                  Zaregistrujte se pomocí
                </button>
                <div class="divider-login">
                  <span class="divider-line"></span>
                  <span class="divider-text">Standardní registrace</span>
                  <span class="divider-line"></span>
                </div>
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


async function redirectToGoogleAuth() {
  try {
    const response = await $api.get("auth/google/redirect");
    window.location.href = response.data.data.authUrl;
  } catch (err) {
    const { message } = parseApiError(err);
    alert(message, "error");
  }
}


useHead({
  title: "Registrace"
});
</script>
