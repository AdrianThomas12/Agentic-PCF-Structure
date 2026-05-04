import * as React from "react";
import { IInputs, IOutputs } from "../generated/ManifestTypes";

export function useControlValue(
    context: ComponentFramework.Context<IInputs>,
    updateOutput: <K extends keyof IOutputs>(key: K, value: IOutputs[K]) => void
) {
    const raw = context.parameters.sampleProperty.raw ?? "";
    const [value, setValue] = React.useState<string>(raw);

    // Sync inbound context changes (e.g. form data refresh) back into local state
    React.useEffect(() => {
        setValue(raw);
    }, [raw]);

    const onChange = React.useCallback(
        (newValue: string) => {
            setValue(newValue);
            updateOutput("sampleProperty", newValue);
        },
        [updateOutput]
    );

    return { value, onChange };
}
