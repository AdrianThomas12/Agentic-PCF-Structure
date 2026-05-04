# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

PCF (PowerApps Component Framework) template — a React/TypeScript virtual control embedded in model-driven Power Apps. Uses `dataverse-ify` for typed Dataverse API access and Fluent UI v9 for components.

## Commands

```bash
npm run start          # Local test harness (pcf-start)
npm run start:watch    # Local test harness with file watching
npm run build          # Production build
npm run rebuild        # Clean + build
npm run lint           # ESLint
npm run lint:fix       # ESLint with auto-fix
npx dataverse-gen      # Regenerate Dataverse model from dataverse-gen.json
```

## Architecture

### PCF Lifecycle (`PCFTemplate/index.ts`)

The control class is the PCF entry point. `init()` initialises service singletons with `context.webAPI`. `updateView()` is called on every context change and renders the React tree. `getOutputs()` returns the latest outputs set by the React component. Do not put business logic here — delegate to services and hooks.

→ Full patterns: [docs/implementation-guide.md § 1 PCF Lifecycle](docs/implementation-guide.md#1-pcf-lifecycle)

### Model Layers

1. **Dataverse models** (`model/dataverse/`) — Auto-generated via `npx dataverse-gen`. **Never edit.** Config is in `dataverse-gen.json`.
2. **App models** (`model/app/`) — Business interfaces consumed by React. Prefix: `PCF_<Name>`.
3. **Mappings** (`model/mappings/`) — Pure functions converting between Dataverse entities and app models.

Services must map Dataverse entities to app models before returning. All React code uses app models only.

→ Full patterns: [docs/implementation-guide.md § 3 Model Layers & Mappings](docs/implementation-guide.md#3-model-layers--mappings)

### Services

Extend `DataverseService` (which wraps `XrmContextDataverseClient` and sets the metadata cache). Use the singleton pattern with `static getInstance(webApi?)` — pass `webApi` only on the first call from `init()`. Use generated `*Attributes` constants for field names, not raw strings.

→ Full reference (all `client.*` methods): [docs/implementation-guide.md § 2 Services](docs/implementation-guide.md#2-services)

### Hooks

- `useOutputs` — manages the `IOutputs` ref and wires `notifyOutputChanged` to React state changes.
- `useControlValue` — syncs a bound PCF property to local React state and pushes changes back via `updateOutput`.
- `useControlContext` — exposes PCF context utilities (disabled/visible state, navigation helpers).

New hooks for PCF integration belong in `PCFTemplate/hooks/`.

→ Full reference (all return values): [docs/implementation-guide.md § 4 Hooks](docs/implementation-guide.md#4-hooks)

### Host Form Access (`utils/xrm.ts`)

All functions in `utils/xrm.ts` access the parent model-driven app form via `Xrm.Page` and return `null`/no-op silently when running outside a model-driven app (test harness, canvas app). Use these helpers rather than accessing `Xrm` directly. The `@microsoft/power-apps/use-client-context` ESLint rule is suppressed only inside that file.

→ Full reference (all 18 helpers): [docs/implementation-guide.md § 5 Utilities — xrm.ts](docs/implementation-guide.md#5-utilities--xrmts)

### Utilities

- `utils/date.ts` — Dataverse date serialisation, display formatting, range helpers. → [§ 6](docs/implementation-guide.md#6-utilities--datets)
- `utils/guid.ts` — GUID validation, normalisation, comparison. → [§ 7](docs/implementation-guide.md#7-utilities--guidts)
- `utils/index.ts` — String helpers, `classNames`, re-exports all of the above. → [§ 8](docs/implementation-guide.md#8-utilities--indexts)

### Shared Types (`types/index.ts`)

`Nullable<T>`, `SelectOption<T>`, `AsyncState<T>` — see [docs/implementation-guide.md § 9 Shared Types](docs/implementation-guide.md#9-shared-types)

### Localisation

String resources live in `PCFTemplate/strings/PCFTemplate.1033.resx`. All keys are typed in `StringKeys` (`hooks/useLocalisation.ts`). Use `useLocalisation(context)` to get the `t(key)` function — never call `context.resources.getString()` directly. Add new keys to `StringKeys` and every `.resx` file together.

→ Full reference: [docs/implementation-guide.md § 10 Localisation](docs/implementation-guide.md#10-localisation)

### CSS

`PCFTemplate/css/PCFTemplate.css` is for animations (`@keyframes`), print styles, global resets, and third-party overrides. All component-level styling uses `makeStyles` with Fluent UI tokens. Apply `.pcf-template-root` to the outermost container element.

→ Full reference (utility classes, when to use CSS vs makeStyles): [docs/implementation-guide.md § 11 CSS](docs/implementation-guide.md#11-css)

### Styling

Use `makeStyles` with Fluent UI theme tokens. Do not use inline styles or arbitrary CSS.

## Skills (slash commands)

Custom commands live in `.claude/commands/` and are invoked with `/command-name`.

| Command | Description |
|---|---|
| `/init <PascalCaseName>` | Initialise this template as a real control — renames the directory, filenames, class name, manifest, CSS classes, RESX keys, imports, and docs from `PCFTemplate` to the given name. Shows a summary and asks for confirmation first. |
| `/new-entity <logical-name>` | Add a new Dataverse entity end-to-end: updates `dataverse-gen.json`, regenerates models, creates app model, mapping, and service stub. |
| `/generate-docs` | Read the current codebase and write `docs/<ControlName>.md` — manifest properties, app models, services, hooks, and utilities. |
| `/localise [file]` | Audit a component (or all components) for hardcoded user-visible strings. For each one: adds the key to `StringKeys`, adds a `<data>` entry to every RESX file, and replaces the hardcoded string with `t(StringKeys.<Key>)`. Confirms before writing. |

## Key Constraints

- Do **not** edit anything under `model/dataverse/` or `generated/` — regenerate instead.
- ESLint ignores `**/generated` and `**/model/dataverse/**` (both are auto-generated).
- The control is declared as `control-type="virtual"` in the manifest, which is required for React controls.
- React 17 is used (not 18) because the PCF platform library version pins it.

## Localisation

**Every user-visible string must go through the localisation system.** Never hardcode text that a user will see.

This applies to:
- JSX text content (button labels, headings, body copy, empty-state messages)
- `placeholder`, `aria-label`, `aria-description`, `title`, `alt` props
- Strings passed to `openAlert()`, `openConfirm()`, toast messages, or any notification API

When adding any of the above, always:
1. Add the key to `StringKeys` in `PCFTemplate/hooks/useLocalisation.ts` under the appropriate comment group
2. Add a `<data>` entry to **every** RESX file in `PCFTemplate/strings/`
3. Use `localize(StringKeys.<Key>)` in the component — never the raw string

The localisation function is **always named `localize`** at the call site:
- In `App` (or any component that calls `useLocalisation` directly): `const { t: localize } = useLocalisation(context)`
- In child components: accept it as a prop typed `localize: (key: StringKey) => string` and pass `localize={localize}` down the tree

Never rename it to `t`, `translate`, or anything else.

Keys that are **not** user-visible (IDs, CSS class names, Dataverse attribute names, prop values like `"primary"`) are exempt and must stay as raw strings.
