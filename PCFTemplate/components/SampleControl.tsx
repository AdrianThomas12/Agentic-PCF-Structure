import * as React from "react";
import { Label, Input, Button, makeStyles, tokens } from "@fluentui/react-components";
import { StringKeys, StringKey } from "../hooks/useLocalisation";

export interface SampleControlProps {
    localize: (key: StringKey) => string;
    value: string;
    isDisabled: boolean;
    onChange: (value: string) => void;
    onShowAlert: () => void;
}

const useStyles = makeStyles({
    root: {
        display: "flex",
        flexDirection: "column",
        gap: tokens.spacingVerticalM,
        padding: tokens.spacingHorizontalM,
    },
    row: {
        display: "flex",
        alignItems: "center",
        gap: tokens.spacingHorizontalS,
    },
});

export const SampleControl: React.FC<SampleControlProps> = ({ localize, value, isDisabled, onChange, onShowAlert }) => {
    const styles = useStyles();

    return (
        <div className={styles.root}>
            <Label htmlFor="sample-input">{localize(StringKeys.Property_Display_Key)}</Label>
            <div className={styles.row}>
                <Input
                    id="sample-input"
                    value={value}
                    disabled={isDisabled}
                    aria-label={localize(StringKeys.Property_Input_AriaLabel)}
                    onChange={(_, data) => onChange(data.value)}
                />
                <Button appearance="primary" disabled={isDisabled} onClick={onShowAlert}>
                    {localize(StringKeys.Action_ShowAlert)}
                </Button>
            </div>
        </div>
    );
};
