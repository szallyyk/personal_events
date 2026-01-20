<script setup lang="ts">
import Calendar from "~/components/Calendar.vue";
import RangeCalendar from "~/components/RangeCalendar.vue";
const route = useRoute();
const routeParams = reactive({
  timeFrom: (route.query.timeFrom as string) || null,
  timeTo: (route.query.timeTo as string) || null,
  dayName: (route.query.dayName as string) || null
});

const validParameters = checkParameters();

function checkParameters() {
  if (routeParams.timeFrom && routeParams.timeTo) {
    return true;
  }
  return false;
}
</script>

<template>
  <Calendar />
</template>
