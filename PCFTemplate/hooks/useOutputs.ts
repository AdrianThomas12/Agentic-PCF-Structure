import * as React from "react";
import { IOutputs } from "../generated/ManifestTypes";

export function useOutputs(
    notifyOutputChanged: () => void,
    onOutputsChange: (outputs: IOutputs) => void
) {
    const outputsRef = React.useRef<IOutputs>({});

    const updateOutput = React.useCallback(
        <K extends keyof IOutputs>(key: K, value: IOutputs[K]) => {
            outputsRef.current = { ...outputsRef.current, [key]: value };
            onOutputsChange(outputsRef.current);
            notifyOutputChanged();
        },
        [notifyOutputChanged, onOutputsChange]
    );

    return { updateOutput };
}
