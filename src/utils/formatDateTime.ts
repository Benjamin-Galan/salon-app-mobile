type DateTimeFormatOptions = {
    includeDate?: boolean
    includeTime?: boolean
    invalidFallback?: string
}

export function formatDateTime(
    value: string | Date,
    options: DateTimeFormatOptions = {}
) {
    const {
        includeDate = true,
        includeTime = true,
        invalidFallback = "-"
    } = options

    const date = value instanceof Date ? value : new Date(value)

    if (Number.isNaN(date.getTime())) {
        return invalidFallback
    }

    return new Intl.DateTimeFormat("es-NI", {
        ...(includeDate
            ? {
                day: "2-digit" as const,
                month: "2-digit" as const,
                year: "numeric" as const,
            }
            : {}),
        ...(includeTime
            ? {
                hour: "2-digit" as const,
                minute: "2-digit" as const,
            }
            : {}),
    }).format(date)
}

export function formatDate(date: string, invalidFallback = "-") {
    if (!date) {
        return invalidFallback
    }

    const [year, month, day] = date.split("T")[0].split("-")

    if (!year || !month || !day) {
        return invalidFallback
    }

    return `${day}/${month}/${year}`
}

export function formatDateLong(
    value: string | Date | null | undefined,
    invalidFallback = "-"
): string {
    if (!value) return invalidFallback;

    const raw = value instanceof Date ? value.toISOString() : value;

    const [year, month, day] = raw.split("T")[0]?.split("-") ?? [];

    if (!year || !month || !day) {
        return invalidFallback;
    }

    const monthName = new Date(
        Number(year),
        Number(month) - 1
    ).toLocaleString("es-NI", { month: "long" });

    return `${day} de ${monthName}\nde ${year}`;
}

export function formatTime(
    time: string | Date | null | undefined,
    invalidFallback = "-"
): string {
    if (!time) return invalidFallback;

    let raw: string;

    if (time instanceof Date) {
        raw = time.toISOString().split("T")[1]; // "HH:mm:ss"
    } else {
        raw = time.includes("T") ? time.split("T")[1] : time;
    }

    const [hours, minutes] = raw?.split(":") ?? [];

    if (!hours || !minutes) {
        return invalidFallback;
    }

    return `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`;
}