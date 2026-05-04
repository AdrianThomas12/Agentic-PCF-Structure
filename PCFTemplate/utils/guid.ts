import { Guid, guidEqual, trimGuid } from "dataverse-ify";
import { Nullable } from "../types";

export { guidEqual, trimGuid };

const GUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const EMPTY_GUID: Guid = "00000000-0000-0000-0000-000000000000";

export function isValidGuid(value: Nullable<string>): value is Guid {
    return value != null && GUID_REGEX.test(trimGuid(value));
}

export function isEmptyGuid(value: Nullable<string>): boolean {
    return value == null || guidEqual(trimGuid(value), EMPTY_GUID);
}

export function normalizeGuid(value: string): Guid {
    return trimGuid(value).toLowerCase();
}
