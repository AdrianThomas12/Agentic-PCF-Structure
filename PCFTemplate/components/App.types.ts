import { IInputs, IOutputs } from "../generated/ManifestTypes";

export interface AppProps {
    context: ComponentFramework.Context<IInputs>;
    notifyOutputChanged: () => void;
    onOutputsChange: (outputs: IOutputs) => void;
}
