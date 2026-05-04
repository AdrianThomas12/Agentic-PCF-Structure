Rename this PCF control from the generic `PCFTemplate` to a real control name throughout the entire codebase.

Arguments: $ARGUMENTS — the new control name in **PascalCase** (e.g. `OpportunityTracker`, `QuoteBuilder`).

## Before you start

1. Confirm `$ARGUMENTS` looks like PascalCase (starts with uppercase, no spaces or hyphens). If it doesn't, stop and ask the user to provide a valid PascalCase name.

2. Derive the three variants you'll need:
   - **PascalCase** — as provided, e.g. `OpportunityTracker`
   - **kebab-case** — lowercase with hyphens, e.g. `opportunity-tracker` (insert `-` before each uppercase letter after the first, then lowercase everything)
   - **Display name** — space-separated words, e.g. `Opportunity Tracker` (insert space before each uppercase letter after the first)

3. Show the user a summary of the four string substitutions and three renames that will happen (see steps below), and ask them to confirm before making any changes.

---

## Step 1 — Rename the control directory

```bash
mv PCFTemplate <PascalCase>
```

## Step 2 — Rename files with PCFTemplate in their name

```bash
mv <PascalCase>/css/PCFTemplate.css <PascalCase>/css/<PascalCase>.css
mv "<PascalCase>/strings/PCFTemplate.1033.resx" "<PascalCase>/strings/<PascalCase>.1033.resx"
```

If any additional `.resx` locale files exist (e.g. `PCFTemplate.2057.resx`), rename those too using the same pattern.

## Step 3 — Replace all text occurrences

Run four targeted substitutions across all non-generated, non-output files. Exclude `node_modules/`, `out/`, and `model/dataverse/` (generated).

**3a. `PCF.Template` → `PCF.<PascalCase>`** (manifest namespace — must run before 3b to avoid double-replacement)

```bash
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.xml" -o -name "*.json" -o -name "*.resx" -o -name "*.css" -o -name "*.md" -o -name "*.mjs" \) \
  ! -path "*/node_modules/*" ! -path "*/out/*" ! -path "*/<PascalCase>/model/dataverse/*" \
  -exec sed -i '' 's/PCF\.Template/PCF.<PascalCase>/g' {} +
```

**3b. `PCFTemplate` → `<PascalCase>`** (class name, file paths, string keys, comments)

```bash
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.xml" -o -name "*.json" -o -name "*.resx" -o -name "*.css" -o -name "*.md" -o -name "*.mjs" \) \
  ! -path "*/node_modules/*" ! -path "*/out/*" ! -path "*/<PascalCase>/model/dataverse/*" \
  -exec sed -i '' 's/PCFTemplate/<PascalCase>/g' {} +
```

**3c. `pcf-template` → `<kebab-case>`** (CSS class names and animation names)

```bash
find . -type f \( -name "*.css" -o -name "*.ts" -o -name "*.tsx" -o -name "*.md" \) \
  ! -path "*/node_modules/*" ! -path "*/out/*" \
  -exec sed -i '' 's/pcf-template/<kebab-case>/g' {} +
```

**3d. `PCF Template` → `<Display Name>`** (RESX display values and documentation)

```bash
find . -type f \( -name "*.resx" -o -name "*.md" -o -name "*.xml" \) \
  ! -path "*/node_modules/*" ! -path "*/out/*" \
  -exec sed -i '' 's/PCF Template/<Display Name>/g' {} +
```

## Step 4 — Verify

```bash
npm run build
```

If the build fails, show the errors and stop. Do not attempt to fix generated files.

## Step 5 — Report

List every file that was renamed or modified so the user can review the changes.
