<template>
  <div class="calendar-container">
    <FullCalendar :options="calendarOptions">
      <template #eventContent="{ event }">
        <div>
          {{ getTypeName(event.extendedProps.typeId) }}: {{ event.title }}
        </div>
      </template>
    </FullCalendar>
    <div class="row">
      <div class="col-lg-12">
        <ul class="list-unstyled legend-list mt-2">
          <li v-for="option in optionsRef" :key="option.id">
            <span :class="`bg-${option.cssClass}`">&nbsp;&nbsp;</span>
            {{ option.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import interactionPlugin from "@fullcalendar/interaction";
import csLocale from "@fullcalendar/core/locales/cs";
import listPlugin from "@fullcalendar/list";
import { dates, regularity, options, name } from "~/assets/calendar_data.json";

const optionsRef = ref(options);
const datesRef = ref(dates);
const regularityRef = ref(regularity);
const dayNameToNumber = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6
};

function getTypeClass(typeId) {
  const type = optionsRef.value.find((t) => t.id === typeId);
  return type ? type.cssClass : "primary";
}
function getTypeName(typeId) {
  const type = optionsRef.value.find((t) => t.id === typeId);
  return type ? type.name : "Neznámý typ";
}
function getRecurringDates(dayName, startDate, endDate) {
  const result = [];
  const dayNumber = dayNameToNumber[dayName.toLowerCase()];

  if (dayNumber === undefined) return result;

  const current = new Date(startDate);
  const end = new Date(endDate);

  while (current.getDay() !== dayNumber) {
    current.setDate(current.getDate() + 1);
  }

  while (current <= end) {
    result.push(new Date(current));
    current.setDate(current.getDate() + 7);
  }

  return result;
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Generování eventů jako funkce
function generateEvents() {
  const allEvents = [];

  // 1. Konkrétní datumy z dates
  datesRef.value.forEach((item, index) => {
    const cssClass = getTypeClass(item.typeId);
    allEvents.push({
      id: `date-${index}`,
      title: `${item.dateFrom} - ${item.dateTo}`,
      start: `${item.date}T${item.dateFrom}`,
      end: `${item.date}T${item.dateTo}`,
      classNames: [`event-${cssClass}`], // Přidá třídu např. "event-danger"
      typeId: item.typeId // Přidá typeId do extendedProps
    });
  });

  // 2. Opakující se eventy z regularity
  const today = new Date();
  const rangeStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  const rangeEnd = new Date(today.getFullYear(), today.getMonth() + 6, 0);

  regularityRef.value.forEach((item, regIndex) => {
    const recurringDates = getRecurringDates(
      item.dayName,
      rangeStart,
      rangeEnd
    );
    const cssClass = getTypeClass(item.typeId);

    recurringDates.forEach((date, dateIndex) => {
      const dateStr = formatDate(date);

      allEvents.push({
        id: `regular-${regIndex}-${dateIndex}`,
        title: `${item.dateFrom} - ${item.dateTo}`,
        start: `${dateStr}T${item.dateFrom}`,
        end: `${dateStr}T${item.dateTo}`,
        classNames: [`event-${cssClass}`],
        typeId: item.typeId // Přidá typeId do extendedProps
      });
    });
  });

  return allEvents;
}

function initialDate() {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

function handleDateSelect(selectInfo) {}

function handleEventClick(clickInfo) {}

const calendarOptions = ref({
  locale: csLocale,
  displayEventTime: false,
  timeZone: "local",
  showNonCurrentDates: false,
  fixedWeekCount: false,
  plugins: [interactionPlugin, listPlugin],
  initialView: "listWeek",
  weekends: true,
  height: "auto",
  buttonText: {
    today: "Aktuální měsíc",
    month: "Měsíc",
    week: "Týden",
    day: "Den",
    list: "Týden"
  },
  headerToolbar: {
    left: "secondTitle",
    center: "title",
    right: "next"
  },
  customButtons: {
    secondTitle: {
      text: `Přehled dostupnosti - ${name}`,
      click: function () {
        // Nemusí dělat nic, jen zobrazuje text
      }
    }
  },
  initialDate: initialDate(),
  selectable: true,
  events: generateEvents(), // Volej funkci přímo
  eventClick: handleEventClick,
  dateClick: handleDateSelect
});

// Watch pro reaktivitu - pokud se změní dates nebo regularity, aktualizuj eventy
watch(
  [datesRef, regularityRef, optionsRef],
  () => {
    calendarOptions.value.events = generateEvents();
  },
  { deep: true }
);
</script>

<style lang="scss" scoped>
.calendar-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}

.legend-list {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  li {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  span {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: 50%;
  }
}

:deep(.fc) {
  font-family:
    system-ui,
    -apple-system,
    sans-serif;
}

:deep(.fc-toolbar-title) {
  font-size: 1.5rem;
  font-weight: 600;
}

:deep(.fc-button) {
  background-color: #3788d8;
  border-color: #3788d8;
}

:deep(.fc-button:hover) {
  background-color: #2563eb;
  border-color: #2563eb;
}

:deep(.fc-button-active) {
  background-color: #1d4ed8 !important;
  border-color: #1d4ed8 !important;
}
:deep(.fc-secondTitle-button) {
  background: none !important;
  border: none !important;
  color: inherit !important;
  cursor: default !important;
  font-size: 24px;
  font-weight: 500;
  padding: 0 !important;
}

:deep(.fc-secondTitle-button:hover) {
  background: none !important;
}

:deep(.fc-list-event-dot) {
  border-color: currentColor;
}

:deep(.event-danger .fc-list-event-dot) {
  border-color: #dc3545 !important;
}

:deep(.event-success .fc-list-event-dot) {
  border-color: #10b981 !important;
}

:deep(.event-primary .fc-list-event-dot) {
  border-color: #3788d8 !important;
}

:deep(.event-warning .fc-list-event-dot) {
  border-color: #f59e0b !important;
}
</style>
