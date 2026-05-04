import { Nullable } from "../types";

// ── String interpolation ───────────────────────────────────────────────────────

/**
 * Replaces `{0}`, `{1}`, … placeholders in a localised string with the supplied values.
 *
 * Example:
 *   interpolate("Hello {0}, you have {1} messages", "Alice", 3)
 *   // → "Hello Alice, you have 3 messages"
 *
 * In the .resx file:
 *   <data name="Welcome_Message"><value>Hello {0}, you have {1} messages</value></data>
 */
export function interpolate(template: string, ...values: (string | number)[]): string {
    return template.replace(/\{(\d+)\}/g, (_, index: string) => {
        const value = values[Number(index)];
        return value !== undefined ? String(value) : `{${index}}`;
    });
}

// ── Pluralisation ──────────────────────────────────────────────────────────────

/**
 * Returns `singular` when count is 1, otherwise `plural`.
 * For use when the .resx file provides two separate keys (singular / plural).
 *
 * Example:
 *   pluralise(1, t(StringKeys.Record_Singular), t(StringKeys.Record_Plural))
 *   // → "1 record"
 *   pluralise(5, t(StringKeys.Record_Singular), t(StringKeys.Record_Plural))
 *   // → "5 records"
 */
export function pluralise(count: number, singular: string, plural: string): string {
    return `${count} ${count === 1 ? singular : plural}`;
}

// ── LCID → BCP 47 ─────────────────────────────────────────────────────────────

/**
 * Converts a Dynamics 365 LCID (from context.userSettings.languageId) to a
 * BCP 47 locale string suitable for Intl APIs and date formatting helpers.
 *
 * Falls back to "en-GB" for unknown LCIDs.
 *
 * Common LCIDs:
 *   1033 → en-US   1036 → fr-FR   1031 → de-DE   1034 → es-ES
 *   2052 → zh-CN   1041 → ja-JP   1049 → ru-RU   2057 → en-GB
 */
export function lcidToLocale(lcid: number): string {
    const map: Record<number, string> = {
        1025: "ar-SA", 1026: "bg-BG", 1027: "ca-ES", 1028: "zh-TW", 1029: "cs-CZ",
        1030: "da-DK", 1031: "de-DE", 1032: "el-GR", 1033: "en-US", 1034: "es-ES",
        1035: "fi-FI", 1036: "fr-FR", 1037: "he-IL", 1038: "hu-HU", 1040: "it-IT",
        1041: "ja-JP", 1042: "ko-KR", 1043: "nl-NL", 1044: "nb-NO", 1045: "pl-PL",
        1046: "pt-BR", 1048: "ro-RO", 1049: "ru-RU", 1050: "hr-HR", 1051: "sk-SK",
        1053: "sv-SE", 1054: "th-TH", 1055: "tr-TR", 1057: "id-ID", 1058: "uk-UA",
        1060: "sl-SI", 1061: "et-EE", 1062: "lv-LV", 1063: "lt-LT", 1066: "vi-VN",
        2052: "zh-CN", 2057: "en-GB", 2058: "es-MX", 2070: "pt-PT", 3082: "es-ES",
    };
    return map[lcid] ?? "en-GB";
}

// ── Number formatting ──────────────────────────────────────────────────────────

/**
 * Formats a number for display using the user's locale.
 * Pass `userLocale` from `useControlContext()` converted via `lcidToLocale`.
 *
 * Example:
 *   formatNumber(1234567.89, "en-GB")  // → "1,234,567.89"
 *   formatNumber(1234567.89, "de-DE")  // → "1.234.567,89"
 */
export function formatNumber(value: Nullable<number>, locale?: string, options?: Intl.NumberFormatOptions): string {
    if (value == null) return "";
    return new Intl.NumberFormat(locale ?? "en-GB", options).format(value);
}

/**
 * Formats a number as currency using the user's locale.
 *
 * Example:
 *   formatCurrency(1234.5, "en-GB", "GBP")  // → "£1,234.50"
 *   formatCurrency(1234.5, "de-DE", "EUR")  // → "1.234,50 €"
 */
export function formatCurrency(value: Nullable<number>, locale?: string, currencyCode = "GBP"): string {
    if (value == null) return "";
    return new Intl.NumberFormat(locale ?? "en-GB", {
        style: "currency",
        currency: currencyCode,
    }).format(value);
}

/**
 * Formats a number as a percentage.
 *
 * Example:
 *   formatPercent(0.75, "en-GB")  // → "75%"
 *   formatPercent(75, "en-GB", false)  // → "75%"  (pass false when value is already 0–100)
 */
export function formatPercent(value: Nullable<number>, locale?: string, isDecimal = true): string {
    if (value == null) return "";
    const normalized = isDecimal ? value : value / 100;
    return new Intl.NumberFormat(locale ?? "en-GB", { style: "percent" }).format(normalized);
}
