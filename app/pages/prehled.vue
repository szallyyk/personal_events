<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between flex-wrap">
      <h2>Moje kalendáře</h2>
      <button
        class="btn btn-primary d-flex align-items-center gap-2"
        @click="openItemModal"
      >
        <Icon name="mdi:plus-circle" />
        Nový kalendář
      </button>
    </div>
    <div class="row mt-4">
      <template v-if="!isLoading">
        <CalendarCard
          v-for="(item, index) in calendars"
          :key="item.id"
          :calendar="item"
          @edit="handleEdit(item)"
          @settings="handleSettings(item)"
          @detail="handleDetail(item)"
        />
      </template>
      <template v-else>
        <div class="row mt-4 justify-content-center">
          <LoadingSpinner />
        </div>
      </template>
    </div>
  </div>
  <TransitionFade>
    <ItemModal
      :is-open="modalStore.itemModalVisible"
      @close="closeItemModal"
      title="Vytvořit nový kalendář"
    >
      <CalendarForm
        @submit="addCalendar"
        @close="closeItemModal"
      ></CalendarForm>
    </ItemModal>
  </TransitionFade>
</template>

<script setup lang="ts">
import { TransitionFade } from "@morev/vue-transitions";
import CalendarCard from "~/components/cards/CalendarCard.vue";
import LoadingSpinner from "~/components/LoadingSpinner.vue";
import ItemModal from "~/components/modal/ItemModal.vue";
const { $api } = useNuxtApp();
const { alert } = useToastStore();
const modalStore = useModalStore();

interface Calendar {
  id: number;
  name: string;
  slug: string;
}

const isLoading = ref(true);

const calendars = ref<Calendar[]>([]);

const { getWeekRangeFormatted } = useWeekRange();

const { monday, sunday } = getWeekRangeFormatted();

async function getCalendars() {
  try {
    const response = await $api.get("/calendars");
    calendars.value = response.data.data.records;
    isLoading.value = false;
  } catch (err) {
    const { message, errors } = parseApiError(err);
    isLoading.value = false;
    alert(message, "error");
  }
}

function handleEdit(calendar: Calendar) {
  getDetailCalendar(calendar.slug);
}

function handleSettings(calendar: Calendar) {
  navigateTo(`/sprava/${calendar.slug}`);
}

function closeItemModal() {
  modalStore.itemModalVisible = false;
}

function openItemModal() {
  modalStore.itemModalVisible = !modalStore.itemModalVisible;
}

async function getDetailCalendar(id: number) {
  try {
    const response = await $api.get(`/calendars/${id}`);
    return response.data.data.calendar;
  } catch (err) {
    const { message, errors } = parseApiError(err);
    alert(message, "error");
  }
}

function handleDetail(calendar: Calendar) {
  navigateTo(`/kalendar/${calendar.slug}?dateFrom=${monday}&dateTo=${sunday}`);
}

async function addCalendar(data: {
  name: string;
  description: string;
  infoDescription: string;
}) {
  try {
    const response = await $api.post("/calendars", data);
    alert(response.data.message, "success");
    getCalendars();
    closeItemModal();
  } catch (err) {
    const { message, errors } = parseApiError(err);

    alert(message, "error");
  }
}

onMounted(() => {
  getCalendars();
});

useHead({
  title: "Přehled kalendářů",
});

definePageMeta({
  layout: "admin",
});
</script>

<style scoped></style>
