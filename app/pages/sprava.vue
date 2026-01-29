<template>
  <div class="container">
    <div class="d-flex flex-column gap-4 mt-4">
      <EventTable
        ref="eventRef"
        :initialEvents="events"
        :event-types="eventTypes"
        :key="`events-${formKey}`"
        @submit="updateEvents"
        @delete="openDeleteModal"
        @change="handleChange"
      />
      <RegularityTable
        ref="regularityRef"
        :initialRegularity="regularity"
        :event-types="eventTypes"
        :key="`regularity-${formKey}`"
        @submit="updateRegularity"
        @delete="openDeleteRegularityModal"
        @change="handleChange"
      />
      <EventTypesTable
        ref="eventTypesRef"
        :initialOptions="eventTypes"
        :event-types="eventTypes"
        :key="`options-${formKey}`"
        @submit="updateOption"
        @delete="openDeleteOption"
        @change="handleChange"
      />
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

const regularityRef = ref<InstanceType<typeof RegularityTable> | null>(null);
const eventRef = ref<InstanceType<typeof EventTable> | null>(null);
const eventTypesRef = ref<InstanceType<typeof EventTypesTable> | null>(null);

useHead({
  title: "Správa událostí",
});

const isLoaded = ref(false);
const eventTypes = ref<EventType[]>([]);
const events = ref<EventDate[]>([]);
const regularity = ref<RegularityEvent[]>([]);

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

async function fetchData() {
  try {
    const data = await $fetch("/api/event");
    eventTypes.value = data.options;

    events.value = [
      ...data.dates.map((e: any) => ({
        ...e,
        date: e.date ? new Date(e.date) : null,
      })),
    ];

    regularity.value = [
      ...data.regularity.map((e: any) => ({
        ...e,
      })),
    ];
    formKey.value++;
    isLoaded.value = true;
  } catch (error) {
    console.error("Chyba při načítání:", error);
    isLoaded.value = true;
  }
}

async function updateEvents(sendData: EventDate) {
  try {
    const response = await $fetch("/api/event", {
      method: "POST",
      body: sendData,
    });

    if (response.success) {
      alert("Události uloženy", "success");
      await fetchData();
    }
  } catch (err) {
    console.error("Chyba při ukládání:", err);
  } finally {
    regularityRef.value?.enableForm();
    eventTypesRef.value?.enableForm();
  }
}

async function updateOption(sendData: any) {
  try {
    const response = await $fetch("/api/option", {
      method: "POST",
      body: sendData,
    });

    if (response.success) {
      alert("Typy událostí uloženy", "success");
      await fetchData();
    }
  } catch (err) {
    console.error("Chyba při ukládání:", err);
  } finally {
    regularityRef.value?.enableForm();
    eventRef.value?.enableForm();
  }
}

async function updateRegularity(sendData: RegularityEvent) {
  try {
    const response = await $fetch("/api/regularity", {
      method: "POST",
      body: sendData,
    });

    if (response.success) {
      alert("Pravidelné události uloženy", "success");
      await fetchData();
    }
  } catch (err) {
    console.error("Chyba při ukládání:", err);
  } finally {
    eventRef.value?.enableForm();
    eventTypesRef.value?.enableForm();
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
      await fetchData();
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
      await fetchData();
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
      await fetchData();
    } else {
      alert("Chyba při mazání!", "error");
    }
  } catch (err) {
    console.error("Chyba při mazání:", err);
    alert("Chyba při mazání typu události!", "error");
  }
}
onMounted(async () => {
  await fetchData();
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
  .table{
    td{
      height: auto;
    }
  }
}
</style>
