<template>
  <div></div>
</template>

<script lang="ts" setup>
const { $api } = useNuxtApp();
const userStore = useUserStore();
const route = useRoute();

const queryJWT = route.query.jwt as string;

function base64UrlDecode(str: string) {
  str = str.replace(/-/g, "+").replace(/_/g, "/");
  while (str.length % 4) str += "=";
  return decodeURIComponent(
    atob(str)
      .split("")
      .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
      .join("")
  );
}

function decodeJwt(token: string) {
  const [h, p /*, s*/] = token.split(".");
  if (!h || !p) throw new Error("Neplatný token");
  return {
    header: JSON.parse(base64UrlDecode(h)),
    payload: JSON.parse(base64UrlDecode(p))
  };
}

async function loginWithJwt(decodedToken: string, authType: string) {
  const response = await $api.post("/auth/login", {
    token: decodedToken,
    authType: authType
  });
  if (response.status === 200 || response.status === 201) {
    userStore.setUser(response.data.data.user);
    userStore.setBarierToken(response.data.data.bearerToken);
    navigateTo("/prehled");
    return;
  }
}

onMounted(async () => {
  const decoded = decodeJwt(queryJWT as string);
  await loginWithJwt(decoded.payload.oauthToken, decoded.payload.authType);
});
</script>

<style></style>
