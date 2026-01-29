<script setup lang="ts">
import Calendar from "~/components/Calendar.vue";
useHead({
  title: "Přehled dostupnosti",
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
