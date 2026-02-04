<template>
  <div
    class="min-vh-100 d-flex align-items-center justify-content-center bg-light"
  >
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-12 col-sm-8 col-md-6 col-lg-4">
          <template v-if="!isLoading">
            <div v-if="isValid" class="card shadow">
              <div class="card-body p-4">
                <template v-if="!passwordSended">
                  <h2 class="card-title mb-3 text-center">Obnovení hesla</h2>
                  <div class="d-flex flex-column">
                    <ResetPasswordForm @submit="resetPassword" />
                  </div>
                </template>
                <template v-else>
                  <h2 class="card-title mb-3 text-center">Obnovení hesla</h2>
                  <p>
                    Vaše heslo bylo úspěšně změněno. Nyní se můžete přihlásit.
                  </p>
                  <div class="d-flex flex-column">
                    <button
                      @click="navigateTo('/prihlaseni')"
                      class="btn btn-primary w-100"
                    >
                      Přejít na přihlášení
                    </button>
                  </div>
                </template>
              </div>
            </div>
            <div v-else>
              <h2 class="text-center">Neplatný aktivační odkaz.</h2>
            </div>
          </template>
          <template v-else>
            <div class="d-flex flex-column align-items-center gap-3">
              <LoadingSpinner />
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
const { $api } = useNuxtApp();
const { alert } = useToastStore();
const userStore = useUserStore();
const route = useRoute();

const routeParams = ref({
  userId: route.query.userId as string,
  email: route.query.email as string,
  process: route.query.process as string,
  type: route.query.type as string
});

const isLoading = ref(true);
const isValid = ref(false);
const passwordSended = ref(false);

async function resetPassword(values: { password: string; repassword: string }) {
  try {
    const response = await $api.post("/accounts/passwords/new", {
      userId: routeParams.value.userId,
      process: routeParams.value.process,
      ...values
    });
    if (response.status === 200) {
      alert(response.data.message, "success");
      passwordSended.value = true;
    }
  } catch (err) {
    const { message } = parseApiError(err);
    alert(message, "error");
  }
}

async function checkActivation() {
  try {
    const response = await $api.post("/accounts/passwords/new/check", {
      userId: routeParams.value.userId,
      process: routeParams.value.process
    });
    if (response.status === 200) {
      alert(response.data.message, "success");
      isValid.value = true;
    } else {
      isValid.value = false;
    }
  } catch (err) {
    const { message } = parseApiError(err);
    alert(message, "error");
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  if (
    routeParams.value.process === "verify_password_reset" ||
    routeParams.value.email ||
    routeParams.value.userId ||
    routeParams.value.process
  ) {
    checkActivation();
  } else {
    isLoading.value = false;
    isValid.value = false;
  }
});

useHead({
  title: "Obnovení hesla"
});
</script>
