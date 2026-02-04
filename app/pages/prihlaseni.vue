<template>
  <div
    class="min-vh-100 d-flex align-items-center justify-content-center bg-light"
  >
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-sm-8 col-md-6 col-lg-4">
          <div class="card shadow">
            <div class="card-body p-4">
              <h2 class="card-title mb-4 text-center">Přihlášení</h2>
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

async function loginUser(data: { userName: string; userPassword: string }) {
  try {
    const response = await $api.post("/accounts/login", data);
    userStore.setUser(response.data.data.user);
    alert(response.data.message, "success");
    navigateTo("/prehled");
  } catch (err) {
    const { message, errors } = parseApiError(err);
    alert(message, "error");
    loginFormErrors.value = errors;
  }
}

useHead({
  title: "Přihlášení",
});
</script>
