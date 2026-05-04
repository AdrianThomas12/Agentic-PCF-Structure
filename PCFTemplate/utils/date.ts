import { Nullable } from "../types";

// Parse a Dataverse ISO 8601 date string into a Date, returning null on failure.
export function fromDataverseDate(value: Nullable<string>): Date | null {
    if (value == null || value.trim() === "") return null;
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
}

// Serialize a Date to the ISO 8601 format Dataverse expects for DateTime fields.
export function toDataverseDate(date: Date): string {
    return date.toISOString();
}

// Serialize a Date to YYYY-MM-DD for Dataverse DateOnly fields.
export function toDataverseDateOnly(date: Date): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

// Format a date for display, using the user's locale from context.userSettings.languageId.
// Pass the BCP 47 locale string (e.g. "en-GB") — derive it from the language ID if needed.
export function formatDisplayDate(date: Nullable<Date>, locale?: string): string {
    if (date == null) return "";
    return date.toLocaleDateString(locale ?? "en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

export function formatDisplayDateTime(date: Nullable<Date>, locale?: string): string {
    if (date == null) return "";
    return date.toLocaleString(locale ?? "en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function isToday(date: Date): boolean {
    const today = new Date();
    return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
    );
}

// Returns the start of a day (midnight UTC) — useful for date range queries in FetchXML.
export function startOfDay(date: Date): Date {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);
    return d;
}

export function endOfDay(date: Date): Date {
    const d = new Date(date);
    d.setUTCHours(23, 59, 59, 999);
    return d;
}
