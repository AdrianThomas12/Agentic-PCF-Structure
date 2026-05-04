import * as React from "react";
import { IInputs } from "../generated/ManifestTypes";

export const StringKeys = {
    // Control metadata
    PCFTemplate_Name: "PCFTemplate_Name",
    PCFTemplate_Desc: "PCFTemplate_Desc",
    // Property labels
    Property_Display_Key: "Property_Display_Key",
    Property_Desc_Key: "Property_Desc_Key",
    Property_Input_AriaLabel: "Property_Input_AriaLabel",
    // States
    Loading: "Loading",
    Error_Generic: "Error_Generic",
    Error_Load: "Error_Load",
    Error_Save: "Error_Save",
    Empty: "Empty",
    // Actions
    Action_Save: "Action_Save",
    Action_Cancel: "Action_Cancel",
    Action_Delete: "Action_Delete",
    Action_Refresh: "Action_Refresh",
    Action_Close: "Action_Close",
    Action_ShowAlert: "Action_ShowAlert",
    // Confirmations
    Confirm_Delete_Title: "Confirm_Delete_Title",
    Confirm_Delete_Message: "Confirm_Delete_Message",
    // Notifications
    Success_Saved: "Success_Saved",
} as const;

export type StringKey = (typeof StringKeys)[keyof typeof StringKeys];

export function useLocalisation(context: ComponentFramework.Context<IInputs>) {
    const t = React.useCallback(
        (key: StringKey): string => context.resources.getString(key),
        [context.resources]
    );

    return { t };
}
