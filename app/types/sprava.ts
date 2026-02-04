
export interface EventType {
    id: number;
    name: string;
    cssClass: string;
}

export interface EventDate {
    id: number;
    date: Date | null;
    timeFrom: string | null;
    timeTo: string | null;
    eventTypeId: number | null;
}

export interface RegularityEvent {
    id: number;
    dayNumber: number;
    timeFrom: string | null;
    timeTo: string | null;
    eventTypeId: number | null;
}

