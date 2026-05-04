import { Nullable } from "../types";

export * from "./guid";
export * from "./date";
export * from "./xrm";
export * from "./localisation";

export function isNullOrEmpty(value: Nullable<string>): boolean {
    return value == null || value.trim() === "";
}

export function formatValue(value: Nullable<string>, fallback = ""): string {
    return isNullOrEmpty(value) ? fallback : value!.trim();
}

export function classNames(...names: Nullable<string>[]): string {
    return names.filter(Boolean).join(" ");
}

