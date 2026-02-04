<template>
  <div class="calendar-container">
    <FullCalendar v-if="isLoaded" :options="calendarOptions" ref="calendarRef">
      <template #eventContent="{ event }">
        <div>
          <span
            class="event-dot"
            :style="{ backgroundColor: event.extendedProps.hexColor }"
          ></span>
          {{ event.extendedProps.typeName }} {{ event.title }}
        </div>
      </template>
    </FullCalendar>
    <div v-else>Načítání...</div>
    <div class="row mt-3">
      <div class="col-lg-12">
        <ul class="list-unstyled legend-list">
          <li v-for="eventType in uniqueEventTypes" :key="eventType.id">
            <span
              class="legend-dot"
              :style="{ backgroundColor: eventType.hexColor }"
            ></span>
            {{ eventType.name }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import FullCalendar from "@fullcalendar/vue3";
import interactionPlugin from "@fullcalendar/interaction";
import csLocale from "@fullcalendar/core/locales/cs";
import listPlugin from "@fullcalendar/list";

const route = useRoute();
const router = useRouter();

const { $api } = useNuxtApp();
const { alert } = useToastStore();

// Data z API
const calendarData = ref([]); // eventsAndRegularities
const name = ref("");
const isLoaded = ref(false);

const calendarRef = ref(null);

// Extrahuj unikátní typy eventů pro legendu
const uniqueEventTypes = computed(() => {
  const types = new Map();
  calendarData.value.forEach((day) => {
    day.records.forEach((record) => {
      if (record.eventType && !types.has(record.eventType.id)) {
        types.set(record.eventType.id, record.eventType);
      }
    });
  });
  return Array.from(types.values());
});

// Formátování data do českého formátu (8.2.2026)
function formatDateToCzech(date) {
  const d = new Date(date);
  const day = d.getDate();
  const month = d.getMonth() + 1;
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

// Parsování českého formátu (8.2.2026) na Date objekt
function parseCzechDate(dateString) {
  if (!dateString) return null;
  const parts = dateString.split(".");
  if (parts.length !== 3) return null;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);

  return new Date(year, month, day);
}

// Formátování data do ISO formátu (YYYY-MM-DD)
function formatDateToISO(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Získání počátečního data z query nebo dnešního data
function getInitialDate() {
  if (route.query.dateFrom) {
    const parsed = parseCzechDate(route.query.dateFrom);
    if (parsed) {
      return formatDateToISO(parsed);
    }
  }
  return formatDateToISO(new Date());
}

// Aktualizace query parametrů v URL
function updateQueryParams(startDate, endDate) {
  const dateFrom = formatDateToCzech(startDate);
  const dateTo = formatDateToCzech(endDate);

  router.replace({
    query: {
      ...route.query,
      dateFrom,
      dateTo,
    },
  });
}

// Fetch dat z BE
async function fetchData(dateFrom, dateTo) {
  try {
    const queryParams = new URLSearchParams();
    if (dateFrom) queryParams.append("dateFrom", dateFrom);
    if (dateTo) queryParams.append("dateTo", dateTo);

    const url = `/calendars/${route.params.slug}${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

    const response = await $api.get(url);
    const data = response.data.data.calendar;

    calendarData.value = data.eventsAndRegularities;
    name.value = data.name;

    isLoaded.value = true;
  } catch (error) {
    console.error("Chyba při načítání:", error);
    isLoaded.value = true;
  }
}

onMounted(async () => {
  const dateFrom = route.query.dateFrom || null;
  const dateTo = route.query.dateTo || null;
  await fetchData(dateFrom, dateTo);
});

// Generování eventů z nové struktury dat
function generateEvents() {
  const allEvents = [];

  calendarData.value.forEach((day) => {
    const dateStr = day.date; // YYYY-MM-DD formát

    // Pokud den nemá žádné záznamy a není víkend, přidej prázdný slot
    if (day.records.length === 0) {
      // dayInWeekNumber: 1=pondělí, ..., 6=sobota, 7=neděle
      if (day.dayInWeekNumber <= 5) {
        allEvents.push({
          id: `empty-${dateStr}`,
          title: "Volno",
          start: `${dateStr}T00:00:00`,
          end: `${dateStr}T23:59:59`,
          classNames: ["event-empty"],
          extendedProps: {
            isEmpty: true,
            hexColor: "#10b981",
            typeName: "",
          },
        });
      }
    } else {
      // Přidej všechny záznamy pro daný den
      day.records.forEach((record) => {
        const title = `${record.timeFrom} - ${record.timeTo}`;

        allEvents.push({
          id: `${record.baseType}-${record.id}`,
          title: title,
          start: `${dateStr}T${record.timeFrom}:00`,
          end: `${dateStr}T${record.timeTo}:00`,
          extendedProps: {
            typeId: record.eventType.id,
            typeName: record.eventType.name,
            hexColor: record.eventType.hexColor,
            baseType: record.baseType,
            isEmpty: false,
          },
        });
      });
    }
  });

  return allEvents;
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
  datesSet: async function (info) {
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    var isCurrentWeek = info.start <= today && today < info.end;
    var prevButton = document.querySelector(".fc-prev-button");
    if (prevButton) {
      if (isCurrentWeek) {
        prevButton.disabled = true;
        prevButton.classList.add("fc-button-disabled");
      } else {
        prevButton.disabled = false;
        prevButton.classList.remove("fc-button-disabled");
      }
    }

    // Aktualizuj query parametry
    updateQueryParams(info.start, info.end);

    // Načti nová data z BE
    const dateFrom = formatDateToCzech(info.start);
    const dateTo = formatDateToCzech(info.end);
    await fetchData(dateFrom, dateTo);

    // Vygeneruj eventy
    if (isLoaded.value) {
      calendarOptions.value.events = generateEvents();
    }
  },
  initialDate: getInitialDate(),
  selectable: true,
  events: [],
  eventClick: handleEventClick,
  dateClick: handleDateSelect,
});

// Watch pro aktualizaci eventů když se změní data
watch(
  calendarData,
  () => {
    if (isLoaded.value) {
      calendarOptions.value.events = generateEvents();
    }
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
    gap: 8px;
  }
}

.legend-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.event-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
}

:deep(.fc) {
  font-family: system-ui, -apple-system, sans-serif;
}

:deep(.fc-toolbar-title) {
  font-size: 1.5rem;
  font-weight: 600;
}

:deep(.fc-button) {
  background-color: #3788d8;
  border-color: #3788d8;
  padding: 0.5rem 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  .fc-icon {
    font-size: 1rem;
  }
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

/* Prázdné dny - zelená tečka */

:deep(.fc-list-event-dot) {
  display: none !important;
}


@media only screen and (max-width: 578px) {
  :deep(.fc-toolbar) {
    row-gap: 10px;
  }
}
</style>