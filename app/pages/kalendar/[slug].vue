<script setup lang="ts">
import Calendar from "~/components/Calendar.vue";

const userStore = useUserStore();
const layout = computed(() =>
  userStore.user?.bearerToken ? "admin" : "default"
);

// Nastav jednou při načtení
setPageLayout(layout.value);

useHead({
  title: "Přehled dostupnosti"
});
</script>
<template>
  <Calendar />
</template>
<style lang="scss">
.fc .fc-toolbar {
  flex-wrap: wrap;
}
</style>
