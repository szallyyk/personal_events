<template>
  <div class="calendar-container">
    <FullCalendar v-if="isLoaded" :options="calendarOptions" ref="calendarRef">
      <template #eventContent="{ event }">
        <div>
          {{ getTypeName(event.extendedProps.typeId) }} {{ event.title }}
        </div>
      </template>
    </FullCalendar>
    <div v-else>Načítání...</div>
    <div class="row mt-3">
      <div class="col-lg-12">
        <ul class="list-unstyled legend-list">
          <li v-for="option in optionsRef" :key="option.id">
            <span :class="`event-${option.cssClass}`">&nbsp;&nbsp;</span>
            {{ option.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, watch, onMounted } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import interactionPlugin from "@fullcalendar/interaction";
import csLocale from "@fullcalendar/core/locales/cs";
import listPlugin from "@fullcalendar/list";

const optionsRef = ref([]);
const datesRef = ref([]);
const regularityRef = ref([]);
const name = ref("");
const isLoaded = ref(false);

const calendarRef = ref(null);

async function fetchData() {
  try {
    const response = await $fetch("/api/event");
    const data = response;
    optionsRef.value = data.options;
    datesRef.value = data.dates;
    regularityRef.value = data.regularity;
    name.value = data.name;

    isLoaded.value = true;
  } catch (error) {
    console.error("Chyba při načítání:", error);
    isLoaded.value = true;
  }
}

onMounted(async () => {
  await fetchData();
});

const dayNameToNumber = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
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

function createEmptySlots(realEvents, rangeStart, rangeEnd) {
  const emptySlots = [];

  const current = new Date(rangeStart);
  const end = new Date(rangeEnd);

  while (current <= end) {
    const dayOfWeek = current.getDay();

    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      const dateStr = formatDate(current);

      const hasAnyEvent = realEvents.some((event) => {
        const eventDate = event.start.split("T")[0];
        return eventDate === dateStr;
      });

      if (!hasAnyEvent) {
        emptySlots.push({
          id: `empty-${dateStr}`,
          title: "",
          start: `${dateStr}T00:00:00`,
          end: `${dateStr}T23:59:59`,
          classNames: [`event-success`],
          allDay: false,
          extendedProps: {
            isEmpty: true,
            typeId: -1,
          },
        });
      }
    }

    current.setDate(current.getDate() + 1);
  }
  return emptySlots;
}

function generateEvents(rangeStart, rangeEnd) {
  const allEvents = [];

  // 1. Konkrétní datumy z dates - filtrujeme podle rozsahu
  datesRef.value.forEach((item, index) => {
    const eventDate = new Date(item.date);

    // Přidáme jen eventy v aktuálním rozsahu
    if (eventDate >= rangeStart && eventDate <= rangeEnd) {
      const cssClass = getTypeClass(item.typeId);
      let title;
      let dateTo;
      let dateFrom;
      if (item.dateFrom && item.dateTo) {
        title = `${item.dateFrom} - ${item.dateTo}`;
        dateFrom = item.dateFrom;
        dateTo = item.dateTo;
      } else {
        title = "celý den";
        dateFrom = "00:00:00";
        dateTo = "23:59:59";
      }
      allEvents.push({
        id: `date-${index}`,
        title: title,
        start: `${item.date}T${dateFrom}`,
        end: `${item.date}T${dateTo}`,
        classNames: [`event-${cssClass}`],
        extendedProps: {
          typeId: item.typeId,
          isEmpty: false,
        },
      });
    }
  });

  // 2. Opakující se eventy z regularity
  regularityRef.value.forEach((item, regIndex) => {
    const recurringDates = getRecurringDates(
      item.dayName,
      rangeStart,
      rangeEnd,
    );
    const cssClass = getTypeClass(item.typeId);

    recurringDates.forEach((date, dateIndex) => {
      const dateStr = formatDate(date);
      let title;
      let dateTo;
      let dateFrom;
      if (item.dateFrom && item.dateTo) {
        title = `${item.dateFrom} - ${item.dateTo}`;
        dateFrom = item.dateFrom;
        dateTo = item.dateTo;
      } else {
        title = "celý den";
        dateFrom = "00:00:00";
        dateTo = "23:59:59";
      }
      allEvents.push({
        id: `regular-${regIndex}-${dateIndex}`,
        title: title,
        start: `${dateStr}T${dateFrom}`,
        end: `${dateStr}T${dateTo}`,
        classNames: [`event-${cssClass}`],
        extendedProps: {
          typeId: item.typeId,
          isEmpty: false,
        },
      });
    });
  });

  // 3. Prázdné sloty
  const emptySlots = createEmptySlots(allEvents, rangeStart, rangeEnd);

  // 4. Svátky - pro všechny roky v rozsahu
  const startYear = rangeStart.getFullYear();
  const endYear = rangeEnd.getFullYear();
  const allHolidays = [];

  for (let year = startYear; year <= endYear; year++) {
    const yearHolidays = generateCzechHolidays(year);
    allHolidays.push(...yearHolidays);
  }

  return [...allEvents, ...emptySlots, ...allHolidays];
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
  weekends: false,
  height: "auto",
  buttonText: {
    today: "Aktuální měsíc",
    month: "Měsíc",
    week: "Týden",
    day: "Den",
    list: "Týden",
  },
  headerToolbar: {
    left: "secondTitle",
    center: "title",
    right: "prev,next",
  },
  customButtons: {
    secondTitle: {
      text: computed(() => `Přehled dostupnosti - ${name.value}`),
      click: function () {},
    },
  },
  datesSet: function (info) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var isCurrentWeek = info.start <= today && today < info.end;
    var prevButton = document.querySelector(".fc-prev-button");
    if (isCurrentWeek) {
      prevButton.disabled = true;
      prevButton.classList.add("fc-button-disabled");
    } else {
      prevButton.disabled = false;
      prevButton.classList.remove("fc-button-disabled");
    }
    if (isLoaded.value) {
      calendarOptions.value.events = generateEvents(info.start, info.end);
    }
  },
  initialDate: initialDate(),
  selectable: true,
  events: [],
  eventClick: handleEventClick,
  dateClick: handleDateSelect,
});

watch(
  [datesRef, regularityRef, optionsRef, isLoaded],
  () => {
    if (isLoaded.value && datesRef.value.length > 0) {
      const calendarApi = calendarRef.value?.getApi();
      if (calendarApi) {
        calendarApi.refetchEvents();
      }
    }
  },
  { deep: true },
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
  border-color: #fd152c !important;
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
:deep(.event-indigo .fc-list-event-dot) {
  border-color: #6610f2 !important;
}
:deep(.event-pink .fc-list-event-dot) {
  border-color: #cc4589 !important;
}

:deep(.fc-button) {
  padding: 0.5rem 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  .fc-icon {
    font-size: 1rem;
  }
}

.event-danger {
  background-color: #fd152c !important;
}
.event-success {
  background-color: #10b981 !important;
}
.event-primary {
  background-color: #3788d8 !important;
}
.event-warning {
  background-color: #f59e0b !important;
}
.event-indigo {
  background-color: #6610f2 !important;
}
.event-pink {
  background-color: #cc4589 !important;
}
@media only screen and (max-width: 578px) {
  :deep(.fc-toolbar) {
    row-gap: 10px;
  }
}
</style>
