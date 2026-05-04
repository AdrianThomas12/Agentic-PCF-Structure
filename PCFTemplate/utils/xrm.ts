// Helpers for accessing the host model-driven app form from within a PCF control.
// All functions return null / no-op silently when running outside a model-driven app
// (e.g. the local test harness or a canvas app), so controls remain safe to use anywhere.

// ── Foundation ────────────────────────────────────────────────────────────────

function getFormContext(): Xrm.FormContext | null {
    try {
        // Xrm.Page is deprecated but remains the only reliable way to reach the
        // parent form's context from inside a PCF virtual control.
        // eslint-disable-next-line @microsoft/power-apps/use-client-context
        return typeof Xrm !== "undefined" ? (Xrm.Page as unknown as Xrm.FormContext) : null;
    } catch {
        return null;
    }
}

// ── Form info ─────────────────────────────────────────────────────────────────

export function getFormType(): XrmEnum.FormType | null {
    return getFormContext()?.ui.getFormType() ?? null;
}

export function isCreateForm(): boolean {
    return getFormType() === XrmEnum.FormType.Create;
}

export function isUpdateForm(): boolean {
    return getFormType() === XrmEnum.FormType.Update;
}

export function isReadOnlyForm(): boolean {
    return getFormType() === XrmEnum.FormType.ReadOnly || getFormType() === XrmEnum.FormType.Disabled;
}

export function getEntityId(): string | null {
    return getFormContext()?.data.entity.getId() ?? null;
}

export function getEntityName(): string | null {
    return getFormContext()?.data.entity.getEntityName() ?? null;
}

export function isDirty(): boolean {
    return getFormContext()?.data.entity.getIsDirty() ?? false;
}

// ── Attributes ────────────────────────────────────────────────────────────────

export function getAttribute<T extends Xrm.Attributes.Attribute = Xrm.Attributes.Attribute>(
    name: string
): T | null {
    return getFormContext()?.getAttribute<T>(name) ?? null;
}

export function getAttributeValue<T>(name: string): T | null {
    return (getAttribute(name)?.getValue() as T | null) ?? null;
}

export function setAttributeValue(name: string, value: Xrm.Attributes.AttributeValues | null): void {
    getAttribute(name)?.setValue(value);
}

export function setAttributeRequired(name: string, level: Xrm.Attributes.RequirementLevel): void {
    getAttribute(name)?.setRequiredLevel(level);
}

export function setAttributeSubmitMode(name: string, mode: Xrm.SubmitMode): void {
    getAttribute(name)?.setSubmitMode(mode);
}

// ── Controls ──────────────────────────────────────────────────────────────────

export function getControl<T extends Xrm.Controls.Control = Xrm.Controls.Control>(
    name: string
): T | null {
    return getFormContext()?.getControl<T>(name) ?? null;
}

export function setControlDisabled(name: string, disabled: boolean): void {
    getControl<Xrm.Controls.StandardControl>(name)?.setDisabled(disabled);
}

export function setControlNotification(name: string, message: string, uniqueId: string): void {
    getControl<Xrm.Controls.StandardControl>(name)?.setNotification(message, uniqueId);
}

export function clearControlNotification(name: string, uniqueId: string): void {
    getControl<Xrm.Controls.StandardControl>(name)?.clearNotification(uniqueId);
}

// ── Tabs & sections ───────────────────────────────────────────────────────────

export function getTab(name: string): Xrm.Controls.Tab | null {
    return getFormContext()?.ui.tabs.get(name) ?? null;
}

export function setTabVisible(name: string, visible: boolean): void {
    getTab(name)?.setVisible(visible);
}

export function setTabFocus(name: string): void {
    getTab(name)?.setFocus();
}

export function getSection(tabName: string, sectionName: string): Xrm.Controls.Section | null {
    return getTab(tabName)?.sections.get(sectionName) ?? null;
}

export function setSectionVisible(tabName: string, sectionName: string, visible: boolean): void {
    getSection(tabName, sectionName)?.setVisible(visible);
}

// ── Form-level notifications ──────────────────────────────────────────────────

export function setFormNotification(
    message: string,
    level: Xrm.FormNotificationLevel,
    uniqueId: string
): void {
    getFormContext()?.ui.setFormNotification(message, level, uniqueId);
}

export function clearFormNotification(uniqueId: string): void {
    getFormContext()?.ui.clearFormNotification(uniqueId);
}
