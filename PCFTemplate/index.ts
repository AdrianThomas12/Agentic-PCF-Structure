import { IInputs, IOutputs } from "./generated/ManifestTypes";
import * as React from "react";
import { App } from "./components/App";
import { AppProps } from "./components/App.types";
import { SampleService } from "./services/AccountService";

export class PCFTemplate implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private notifyOutputChanged: () => void;
    private currentOutputs: IOutputs = {};

    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        _state: ComponentFramework.Dictionary
    ): void {
        this.notifyOutputChanged = notifyOutputChanged;
        // Initialise the service singleton with the PCF WebApi on first load.
        // All subsequent calls to SampleService.getInstance() return the same instance.
        SampleService.getInstance(context.webAPI);
    }

    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        const props: AppProps = {
            context,
            notifyOutputChanged: this.notifyOutputChanged,
            onOutputsChange: (outputs) => {
                this.currentOutputs = outputs;
            },
        };
        return React.createElement(App, props);
    }

    public getOutputs(): IOutputs {
        return this.currentOutputs;
    }

    public destroy(): void {
        // Cleanup if needed
    }
}
