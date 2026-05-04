Generate a reference document for the current state of this PCF control and write it to `docs/<ControlName>.md`.

## Steps

### 1. Discover the control name and manifest properties

Read `PCFTemplate/ControlManifest.Input.xml`. Extract:
- `namespace`, `constructor`, `version`, `control-type`
- Every `<property>` element: name, of-type, usage (bound/input), required
- Every `<uses-feature>` that is uncommented

### 2. Read the generated manifest types

Read `PCFTemplate/generated/ManifestTypes.d.ts`. This gives the TypeScript shape of `IInputs` and `IOutputs` — use it to fill in any detail missing from the XML.

### 3. Inventory app models

List every file in `PCFTemplate/model/app/`. For each, read it and note the interface name and its fields with types.

### 4. Inventory services

List every file in `PCFTemplate/services/`. For each service, read it and note:
- Class name and what it extends
- Every `public` method: signature and a one-line description of what it does (infer from the body).

### 5. Inventory hooks

List every file in `PCFTemplate/hooks/`. For each hook, read it and note its return type and one-line purpose.

### 6. Inventory utilities

List every file in `PCFTemplate/utils/`. For each, note the exported functions and their one-line purpose.

### 7. Note Dataverse entities in scope

Read `dataverse-gen.json`. List the entities and actions/functions arrays. Do **not** enumerate individual generated fields — just the entity names.

### 8. Write the document

Create (or overwrite) `docs/<ControlName>.md` using the structure below. Be factual — only include what you actually observed in the code. Do not invent behaviour.

---

```markdown
# <ControlName>

> `<namespace>.<constructor>` · v<version> · `<control-type>` control

## Manifest properties

| Name | Type | Usage | Required |
|------|------|-------|----------|
| ... | ... | bound / input / output | yes / no |

## Dataverse entities

List the entity logical names from dataverse-gen.json.

## App models

For each interface in `model/app/`:

### `PCF_<Name>`

| Field | Type | Description |
|-------|------|-------------|

## Services

For each service class:

### `<ServiceName>`

Singleton. Extends `DataverseService`.

| Method | Signature | Description |
|--------|-----------|-------------|

## Hooks

| Hook | Returns | Purpose |
|------|---------|---------|

## Utilities

### `utils/xrm.ts`
Brief description of the module's role, then a table of exported functions.

### `utils/<other>.ts`
...

## PCF features used

List any uncommented `<uses-feature>` entries from the manifest, or "None" if all are commented out.
```
