export type Nullable<T> = T | null | undefined;

export interface SelectOption<T = string> {
    key: string;
    text: string;
    value: T;
}

export interface AsyncState<T> {
    data: T | null;
    isLoading: boolean;
    error: string | null;
}
