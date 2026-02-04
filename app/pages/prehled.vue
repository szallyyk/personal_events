<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between flex-wrap">
      <h2>Moje kalendáře</h2>
      <button
        class="btn btn-primary d-flex align-items-center gap-2"
        @click="handleAdd"
        :disabled="calendars.length >= 2"
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
          @delete="openDeleteModal(item)"
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
      :title="modalTitle"
    >
      <CalendarForm
        @submit="addCalendar"
        @close="closeItemModal"
        :data="calendarDetail"
      ></CalendarForm>
    </ItemModal>
  </TransitionFade>
  <TransitionFade>
    <ConfirmModal
      v-if="modalStore.confirmModalVisible"
      @confirm="handleDeleteConfirm"
      @close="closeDeleteModal"
    />
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

const deleteSlug = ref<string | null>(null);

const isLoading = ref(true);

const modalTitle = ref("Vytvořit nový kalendář");
const isEditing = ref(false);
const calendars = ref<Calendar[]>([]);
const calendarDetail = ref<any>(null);

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
  modalTitle.value = "Upravit kalendář";
  isEditing.value = true;
  getDetailCalendar(calendar.slug);
}

function handleAdd() {
  modalTitle.value = "Vytvořit nový kalendář";
  isEditing.value = false;
  calendarDetail.value = null;
  openItemModal();
}

function handleSettings(calendar: Calendar) {
  navigateTo(`/sprava/${calendar.slug}`);
}

function openDeleteModal(calendar: Calendar) {
  deleteSlug.value = calendar.slug;
  modalStore.confirmModalVisible = true;
}

function closeDeleteModal() {
  modalStore.confirmModalVisible = false;
  deleteSlug.value = null;
}

async function handleDeleteConfirm() {
  try {
    const response = await $api.delete(`/calendars/${deleteSlug.value}`);
    alert(response.data.message, "success");
    getCalendars();
    closeDeleteModal();
  } catch (err) {
    const { message, errors } = parseApiError(err);
    alert(message, "error");
  }
}

function closeItemModal() {
  modalStore.itemModalVisible = false;
}

function openItemModal() {
  modalStore.itemModalVisible = !modalStore.itemModalVisible;
}

async function getDetailCalendar(slug: string) {
  try {
    const response = await $api.get(
      `/calendars/${slug}?dateFrom=${monday}&dateTo=${sunday}`
    );
    calendarDetail.value = response.data.data.calendar;
    openItemModal();
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
  if (isEditing.value) {
    try {
      const response = await $api.put(
        `/calendars/${calendarDetail.value.slug}`,
        data
      );
      alert(response.data.message, "success");
      getCalendars();
      closeItemModal();
    } catch (err) {
      const { message, errors } = parseApiError(err);
      alert(message, "error");
    }
  } else {
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
}

onMounted(async () => {
  await getCalendars();
});

useHead({
  title: "Přehled kalendářů"
});

definePageMeta({
  layout: "admin"
});
</script>

<style scoped></style>
