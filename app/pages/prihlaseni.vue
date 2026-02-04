<template>
  <div
    class="min-vh-100 d-flex align-items-center justify-content-center bg-light"
  >
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-sm-8 col-md-6 col-lg-4">
          <div class="card shadow">
            <div class="card-body p-4">
              <h2 class="card-title text-center">Přihlášení</h2>
              <p class="mb-3 small">
                Zadejte svoje přihlašovací údaje nebo se přihlaste pomocí Google
                účtu.
              </p>
              <button
                @click="redirectToGoogleAuth"
                class="googleAuth-btn w-100 mb-3"
              >
                <Icon name="flat-color-icons:google" size="24"></Icon> Přihlásit
                se pomocí
              </button>
              <div class="divider-login">
                <span class="divider-line"></span>
                <span class="divider-text">Standardní přihlášení</span>
                <span class="divider-line"></span>
              </div>
              <LoginForm :formErrors="loginFormErrors" @submit="loginUser" />
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

const loginFormErrors = ref<Record<string, string[]>>({});

async function loginUser(data: { userEmail: string; userPassword: string }) {
  try {
    const response = await $api.post("/accounts/login", data);
    userStore.setUser(response.data.data.user);
    userStore.setEmail(data.userEmail);

    alert(response.data.message, "success");
    navigateTo("/prehled");
  } catch (err) {
    const { message, errors } = parseApiError(err);
    alert(message, "error");
    loginFormErrors.value = errors;
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
  title: "Přihlášení"
});
</script>
<style lang="scss">
.divider-login {
  display: flex;
  align-items: center;
  text-align: center;

  .divider-line {
    flex: 1;
    height: 1px;
    background-color: #ccc;
  }

  .divider-text {
    padding: 0 1rem;
    color: #666;
    font-size: 0.875rem;
  }
}
</style>
