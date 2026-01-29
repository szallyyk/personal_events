export function calculateEaster(year: number): Date {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31);
    const day = ((h + l - 7 * m + 114) % 31) + 1;

    return new Date(year, month - 1, day);
}

export function generateCzechHolidays(year: number) {
    const holidays = [];

    // Pevné svátky
    const fixedHolidays = [
        { date: `${year}-01-01`, title: 'Nový rok' },
        { date: `${year}-05-01`, title: 'Svátek práce' },
        { date: `${year}-05-08`, title: 'Den vítězství' },
        { date: `${year}-07-05`, title: 'Den Cyrila a Metoděje' },
        { date: `${year}-07-06`, title: 'Den Jana Husa' },
        { date: `${year}-09-28`, title: 'Den české státnosti' },
        { date: `${year}-10-28`, title: 'Den vzniku Československa' },
        { date: `${year}-11-17`, title: 'Den boje za svobodu a demokracii' },
        { date: `${year}-12-24`, title: 'Štědrý den' },
        { date: `${year}-12-25`, title: '1. svátek vánoční' },
        { date: `${year}-12-26`, title: '2. svátek vánoční' }
    ];

    fixedHolidays.forEach((holiday, index) => {
        holidays.push({
            id: `holiday-${index}`,
            title: '(svátek)',
            start: holiday.date,
            allDay: true,
            classNames: ['event-danger'], // Použij tvoji existující třídu
            extendedProps: {
                isHoliday: true,
                typeId: 6 // Speciální typeId pro svátky
            }
        });
    });

    // Pohyblivé svátky (Velikonoce)
    const easter = calculateEaster(year);

    // Velký pátek
    const goodFriday = new Date(easter);
    goodFriday.setDate(goodFriday.getDate() - 2);
    holidays.push({
        id: 'holiday-good-friday',
        title: '(svátek)',
        start: formatDate(goodFriday),
        allDay: true,
        classNames: ['event-danger'],
        extendedProps: {
            isHoliday: true,
            typeId: 6
        }
    });

    // Velikonoční pondělí
    const easterMonday = new Date(easter);
    easterMonday.setDate(easterMonday.getDate() + 1);
    holidays.push({
        id: 'holiday-easter-monday',
        title: '(svátek)',
        start: formatDate(easterMonday),
        allDay: true,
        classNames: ['event-danger'],
        extendedProps: {
            isHoliday: true,
            typeId: 6
        }
    });

    return holidays;
}

export function formatDate(date: Date | string | null): string {
    if (!date) return "";
    if (typeof date === "string") return date;
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
}

export function formatTime(date: Date | string | null): string {
    if (!date) return "";
    if (typeof date === "string") return date;
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
}