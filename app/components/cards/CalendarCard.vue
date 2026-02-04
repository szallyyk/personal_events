<template>
  <div class="calendar-item">
    <span class="calendar-name">{{ calendar.name }}</span>

    <div class="calendar-actions">
      <button
        class="btn btn-warning d-flex align-items-center gap-1"
        @click="settingsCalendar()"
      >
        <Icon name="mdi:cog-outline" />
        Správa
      </button>
      <button
        class="btn btn-secondary d-flex align-items-center gap-1"
        @click="detailCalendar()"
      >
        <Icon name="mdi:eye-outline" />
        Zobrazit
      </button>
      <button
        class="btn btn-primary d-flex align-items-center gap-1"
        @click="editCalendar()"
      >
        <Icon name="mdi:pencil-outline" />
        Upravit
      </button>
      <button
        class="btn btn-danger d-flex align-items-center gap-1"
        @click="deleteCalendar()"
      >
        <Icon name="mdi:trash-can-outline" />
        Smazat
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  calendar: {
    id: number;
    name: string;
  };
}>();

const emit = defineEmits(["edit", "delete", "settings", "detail"]);

const detailCalendar = () => {
  emit("detail", props.calendar);
};

const editCalendar = () => {
  emit("edit", props.calendar);
};
const deleteCalendar = () => {
  emit("delete", props.calendar);
};
const settingsCalendar = () => {
  emit("settings", props.calendar);
};
</script>
<style scoped>
h2 {
  margin-bottom: 20px;
  color: #333;
}

.calendar-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  margin-bottom: 10px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.calendar-name {
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.calendar-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.empty-message {
  text-align: center;
  color: #6c757d;
  padding: 40px;
}
@media screen and (max-width: 768px) {
  .calendar-item {
    align-items: start;
    flex-direction: column;
    row-gap: 10px;
  }
}
</style>
