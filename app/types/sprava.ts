
export interface EventType {
    id: number;
    name: string;
    cssClass: string;
}

export interface EventDate {
    id: number;
    date: Date | null;
    dateFrom: string | null;
    dateTo: string | null;
    typeId: number | null;
}

export interface RegularityEvent {
    id: number;
    dayOfWeek: number;
    timeFrom: string | null;
    timeTo: string | null;
    typeId: number | null;
}

