Audit a component file (or the whole project) for hardcoded user-visible strings and replace them with localised equivalents — updating `StringKeys`, the RESX file, and every affected component in one pass.

Arguments: $ARGUMENTS (optional path to a single component file; omit to scan all `.tsx` files under `PCFTemplate/components/`)

## Rules

A string is **user-visible** if it appears as JSX text content, in a `title`, `aria-label`, `placeholder`, `alt`, or `tooltip` prop, or as a value passed to `openAlert`/`openConfirm`. Strings that are IDs, CSS class names, HTML attribute values like `"primary"`, or internal constants are **not** user-visible and must be left alone.

## Step 1 — Identify target files

If `$ARGUMENTS` names a file, use only that file. Otherwise, list every `.tsx` file under `PCFTemplate/components/`.

## Step 2 — Find hardcoded strings

For each target file, read it and list every hardcoded user-visible string. For each one, note:
- The exact string value
- The line number
- Whether a matching key already exists in `StringKeys` (read `PCFTemplate/hooks/useLocalisation.ts`)

## Step 3 — Propose new keys and show a summary

For strings without an existing key, propose a `PascalCase` key name following the conventions already in `StringKeys`:
- `Action_*` — button / link labels
- `*_Title` — dialog / section headings
- `*_Message` — body copy in dialogs or notifications
- `Error_*` — error messages
- `Confirm_*` — confirmation prompts
- `Success_*` — success notifications
- Anything else — describe with a clear noun + qualifier

Print a table:

| File | Line | Hardcoded string | Key (new / existing) |
|------|------|-----------------|----------------------|

Ask the user to confirm before making any changes.

## Step 4 — Update `StringKeys`

In `PCFTemplate/hooks/useLocalisation.ts`, add each new key to the `StringKeys` object under the appropriate comment group. Keep alphabetical order within each group.

## Step 5 — Update the RESX file

In `PCFTemplate/strings/PCFTemplate.1033.resx`, add a `<data>` entry for each new key immediately after the last entry in the same logical group:

```xml
<data name="My_New_Key" xml:space="preserve">
  <value>The English string</value>
</data>
```

If other locale RESX files exist (e.g. `PCFTemplate.2057.resx`), add the entry to every one of them. Use the same English value as a placeholder and note in your summary that a translator should review those files.

## Step 6 — Update components

For each component that had hardcoded strings:

1. Ensure `localize` is available in scope:
   - If the component already receives `localize` as a prop, use it.
   - If the component calls `useLocalisation(context)` itself, destructure as `const { t: localize } = useLocalisation(context)`.
   - If neither, add `localize: (key: StringKey) => string` as a prop, import `StringKey` from `"../hooks/useLocalisation"`, and update the parent to pass `localize={t}` (where `t` comes from `useLocalisation` in `App`).
2. Replace each hardcoded string with `localize(StringKeys.<Key>)`.

The localisation function is always called `localize` at the call site — never `t` or any other name. Do **not** add `useLocalisation` directly to a component that already receives `localize` as a prop.

## Step 7 — Verify

```bash
npm run lint
npm run type-check
```

Fix any errors before reporting done. If `type-check` is not available, use `npm run build` instead.

## Step 8 — Report

List every file changed, every key added, and any locale RESX files that need a translator's review.
