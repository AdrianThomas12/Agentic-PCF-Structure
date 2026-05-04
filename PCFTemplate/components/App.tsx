import * as React from "react";
import { FluentProvider, webLightTheme } from "@fluentui/react-components";
import { AppProps } from "./App.types";
import { useOutputs } from "../hooks/useOutputs";
import { useControlValue } from "../hooks/useControlValue";
import { useControlContext } from "../hooks/useControlContext";
import { useLocalisation } from "../hooks/useLocalisation";
import { SampleControl } from "./SampleControl";

export const App: React.FC<AppProps> = ({ context, notifyOutputChanged, onOutputsChange }) => {
    const { updateOutput } = useOutputs(notifyOutputChanged, onOutputsChange);
    const { value, onChange } = useControlValue(context, updateOutput);
    const { isDisabled, openAlert } = useControlContext(context);
    const { t: localize } = useLocalisation(context);

    return (
        <FluentProvider theme={webLightTheme}>
            <SampleControl
                localize={localize}
                value={value}
                isDisabled={isDisabled}
                onChange={onChange}
                onShowAlert={() => void openAlert(`Current value: ${value}`, "Sample Alert")}
            />
        </FluentProvider>
    );
};
