<template>
  <div class="container">
    <div class="d-flex flex-column gap-4 mt-4">
      <template v-if="!isLoading">
        <div
          v-if="calendarEventTypes.length === 0"
          class="alert alert-warning d-flex align-items-center gap-2"
          role="alert"
        >
          <Icon name="mdi:alert" size="24" />
          <span class="fs-6">
            Pro práci s událostmi je potřeba mít
            <strong> vytvořený alespoň 1 typ události. </strong>
          </span>
        </div>

        <template v-if="calendarEventTypes.length > 0">
          <EventTable
            ref="eventRef"
            :form-errors="eventFormErrors"
            :initialEvents="calendarEvents"
            :event-types="calendarEventTypes"
            :key="`events-${formKey}`"
            @submit="updateEvents"
            @delete="openDeleteModal"
            @change="handleChange"
          />
          <RegularityTable
            ref="regularityRef"
            :form-errors="regularityFormErrors"
            :initialRegularity="calendarRegularity"
            :event-types="calendarEventTypes"
            :key="`regularity-${formKey}`"
            @submit="updateRegularity"
            @delete="openDeleteRegularityModal"
            @change="handleChange"
          />
        </template>
        <EventTypesTable
          ref="eventTypesRef"
          :form-errors="eventTypesFormErrors"
          :initialOptions="calendarEventTypes"
          :event-types="calendarEventTypes"
          :key="`options-${formKey}`"
          @submit="updateOption"
          @delete="openDeleteOption"
          @change="handleChange"
        />
      </template>
      <template v-else>
        <div class="d-flex justify-content-center align-items-center mt-5">
          <LoadingSpinner />
        </div>
      </template>
    </div>
    <ConfirmModal
      v-if="modalStore.confirmModalVisible"
      @confirm="handleDeleteConfirm"
      @close="closeDeleteModal"
    />
  </div>
</template>
<script setup lang="ts">
import EventTypesTable from "~/components/tables/EventTypesTable.vue";
import EventTable from "~/components/tables/EventTable.vue";
import RegularityTable from "~/components/tables/RegularityTable.vue";
import type { EventDate, EventType, RegularityEvent } from "~/types/sprava";
import ConfirmModal from "~/components/modal/ConfirmModal.vue";
import { useToastStore } from "~/store/toast";
import { useModalStore } from "~/store/modal";
const modalStore = useModalStore();
const { alert } = useToastStore();
const { $api } = useNuxtApp();
const route = useRoute();
const routeSlug = route.params.slug as string;

const regularityRef = ref<InstanceType<typeof RegularityTable> | null>(null);
const eventRef = ref<InstanceType<typeof EventTable> | null>(null);
const eventTypesRef = ref<InstanceType<typeof EventTypesTable> | null>(null);

const eventFormErrors = ref<Record<string, string>>({});
const regularityFormErrors = ref<Record<string, string>>({});
const eventTypesFormErrors = ref<Record<string, string>>({});

const formKey = ref(0);
const deleteState = ref<{
  id: number | null;
  type: "event" | "regularity" | "option" | null;
}>({
  id: null,
  type: null,
});

function handleChange(emitOption: { name: string; isEdit: boolean }) {
  if (emitOption.name === "option" && emitOption.isEdit) {
    regularityRef.value?.disableForm();
    eventRef.value?.disableForm();
  } else if (emitOption.name === "events" && emitOption.isEdit) {
    regularityRef.value?.disableForm();
    eventTypesRef.value?.disableForm();
  } else if (emitOption.name === "regularity" && emitOption.isEdit) {
    eventRef.value?.disableForm();
    eventTypesRef.value?.disableForm();
  }
}

const calendarEventTypes = ref<EventType[]>([]);
const calendarEvents = ref<EventDate[]>([]);
const calendarRegularity = ref<RegularityEvent[]>([]);
const isLoading = ref(true);

async function getDetailData() {
  try {
    const responseTypes = await $api.get("/calendars/events/types", {
      headers: { ["Calendar-Slug"]: routeSlug },
    });
    const responseEvents = await $api.get("/calendars/events", {
      headers: { ["Calendar-Slug"]: routeSlug },
    });
    const responseRegularity = await $api.get("/calendars/regularities", {
      headers: { ["Calendar-Slug"]: routeSlug },
    });

    calendarEvents.value = responseEvents.data.data.records;

    calendarEvents.value = calendarEvents.value.map((e) => ({
      ...e,
      date: e.date.formatSystem ? new Date(e.date.formatSystem) : null,
      timeFrom: e.timeFrom,
      timeTo: e.timeTo,
      eventTypeId: e.eventType.id,
    }));

    calendarEventTypes.value = responseTypes.data.data.records.sort(
      (a, b) => a.rank - b.rank,
    );

    calendarRegularity.value = responseRegularity.data.data.records;

    calendarRegularity.value = calendarRegularity.value.map((e) => ({
      id: e.id,
      dayNumber: e.dayNumber,
      timeFrom: e.timeFrom,
      timeTo: e.timeTo,
      eventTypeId: e.eventType.id,
    }));
    formKey.value += 1;
    isLoading.value = false;
  } catch (err) {
    const { message, errors } = parseApiError(err);
    isLoading.value = false;
    alert(message, "error");
  }
}

async function updateEvents(sendData: EventDate) {
  try {
    const response = await $api.post("/calendars/events", sendData, {
      headers: { ["Calendar-Slug"]: routeSlug },
    });
    alert(response.data.message, "success");
    getDetailData();
  } catch (err) {
    const { message, errors } = parseApiError(err);
    alert(message, "error");
    eventFormErrors.value = errors.events || {};
  } finally {
    regularityRef.value?.enableForm();
    eventTypesRef.value?.enableForm();
  }
}

async function updateRegularity(sendData: RegularityEvent) {
  try {
    const response = await $api.post("/calendars/regularities", sendData, {
      headers: { ["Calendar-Slug"]: routeSlug },
    });
    alert(response.data.message, "success");
    getDetailData();
  } catch (err) {
    const { message, errors } = parseApiError(err);
    alert(message, "error");
    regularityFormErrors.value = errors.regularities || {};
  } finally {
    eventRef.value?.enableForm();
    eventTypesRef.value?.enableForm();
  }
}

async function updateOption(sendData: any) {
  try {
    const response = await $api.post("/calendars/events/types", sendData, {
      headers: { ["Calendar-Slug"]: routeSlug },
    });
    alert(response.data.message, "success");
    getDetailData();
  } catch (err) {
    const { message, errors } = parseApiError(err);
    alert(message, "error");
    eventTypesFormErrors.value = errors.eventTypes || {};
  } finally {
    eventRef.value?.enableForm();
    regularityRef.value?.enableForm();
  }
}

async function handleDeleteConfirm() {
  if (deleteState.value.type === "event") {
    await deleteEvent(deleteState.value.id!);
  } else if (deleteState.value.type === "regularity") {
    await deleteRegularity(deleteState.value.id!);
  } else if (deleteState.value.type === "option") {
    await deleteOption(deleteState.value.id!);
  }
  closeDeleteModal();
}

function openDeleteModal(eventId: number) {
  deleteState.value = {
    id: eventId,
    type: "event",
  };
  modalStore.confirmModalVisible = true;
}

function openDeleteRegularityModal(regularityId: number) {
  deleteState.value = {
    id: regularityId,
    type: "regularity",
  };
  modalStore.confirmModalVisible = true;
}

function openDeleteOption(optionId: number) {
  deleteState.value = {
    id: optionId,
    type: "option",
  };
  modalStore.confirmModalVisible = true;
}

function closeDeleteModal() {
  modalStore.confirmModalVisible = false;
  deleteState.value = {
    id: null,
    type: null,
  };
}
async function deleteEvent(eventId: number) {
  try {
    const response = await $fetch(`/api/event/${eventId}`, {
      method: "DELETE",
    });

    if (response.success) {
      alert("Událost smazána!", "success");
    } else {
      alert("Chyba při mazání!", "error");
    }
  } catch (err) {
    console.error("Chyba při mazání:", err);
    alert("Chyba při mazání události!", "error");
  }
}

async function deleteRegularity(regularityId: number) {
  try {
    const response = await $fetch(`/api/regularity/${regularityId}`, {
      method: "DELETE",
    });

    if (response.success) {
      alert("Pravidelná událost smazána!", "success");
    } else {
      alert("Chyba při mazání!", "error");
    }
  } catch (err) {
    console.error("Chyba při mazání:", err);
    alert("Chyba při mazání pravidelné události!", "error");
  }
}

async function deleteOption(optionId: number) {
  try {
    const response = await $fetch(`/api/option/${optionId}`, {
      method: "DELETE",
    });

    if (response.success) {
      alert("Typ události smazán!", "success");
    } else {
      alert("Chyba při mazání!", "error");
    }
  } catch (err) {
    console.error("Chyba při mazání:", err);
    alert("Chyba při mazání typu události!", "error");
  }
}

useHead({
  title: "Správa událostí",
});

definePageMeta({
  layout: "admin",
});

onMounted(async () => {
  getDetailData();
});
</script>
<style lang="scss">
.table-evenets {
  width: 100%;
  border-collapse: collapse;
  table-layout: auto;

  th,
  td {
    padding: 8px;
    text-align: left;
    white-space: nowrap;
  }
  td {
    height: 55px;
  }
  thead {
    background-color: #f8f9fa;
  }
  tbody tr td:last-child {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
  }
  thead tr th:last-child {
    text-align: center;
    width: 120px;
  }
}
.table-evenets td .form-control .p-inputtext {
  min-width: 120px;
}

.p-inputtext {
  padding: 6px 12px !important;
}

@media (max-width: 768px) {
  .p-select-label {
    padding: 4px 6px !important;
  }
  .table-evenets th,
  .table-evenets td {
    font-size: 14px;
    padding: 4px;
  }
  .table-evenets thead tr th:last-child,
  .table-evenets tbody tr td:last-child {
    width: auto;
  }
  .table-date {
    min-width: 120px;
  }
  .table-type {
    min-width: 100px;
  }
  .table-day {
    min-width: 120px;
  }
  .table-timeFrom,
  .table-timeTo {
    min-width: 80px;
  }
  .table-id {
    min-width: 40px;
  }
  .table-dayName {
    min-width: 100px;
  }
  .table-name {
    min-width: 100px;
  }
  .table-cssClass {
    min-width: 50px;
  }
  .form-control {
    padding: 4px !important;
    font-size: 14px;
  }
  .p-inputtext {
    padding: 4px 8px !important;
  }
  .table {
    td {
      height: auto;
    }
  }
}
</style>
