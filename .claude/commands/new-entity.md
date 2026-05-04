Add a new Dataverse entity to the PCF project end-to-end.

Arguments: $ARGUMENTS (entity logical name, e.g. `opportunity`)

Follow these steps in order:

## 1. Check credentials

Read `dataverse-gen.json`. If `server` still contains a placeholder (e.g. `yourorg`), credentials have not been configured.

`dataverse-gen` reads saved authentication profiles written by `npx dataverse-auth`. Run the following to check what profiles are saved:

```bash
npx dataverse-auth
```

- **If one or more profiles are listed** — ask the user which environment to use, then update `server` and `tenant` in `dataverse-gen.json` with the values from that profile. Remove or clear the `auth` field if the profile handles authentication itself.
- **If no profiles are listed / command errors** — stop and tell the user to run `npx dataverse-auth` to authenticate against their Dataverse environment first, then re-run this command.

If `server` already contains a real URL (not a placeholder), skip this step entirely.

## 2. Add entity to both config files

`dataverse-gen` reads generation settings from `.dataverse-gen.json` (not `dataverse-gen.json`). Add the entity logical name to the `entities` array in **both** files so they stay in sync:
- `dataverse-gen.json` — credentials + entity list (not committed)
- `.dataverse-gen.json` — generation settings + entity list (committed)

## 3. Regenerate Dataverse models

```bash
npx dataverse-gen
```

This regenerates `PCFTemplate/model/dataverse/entities/<EntityName>.ts` and any related enum files. **Do not edit these generated files.**

If this command fails, show the error to the user and stop — do not proceed with stale or missing generated files.

## 4. Create the app model

Create `PCFTemplate/model/app/PCF_<PascalCase>.ts` with a clean interface containing only the fields this control actually needs. Prefix the interface name with `PCF_`.

Example for `opportunity`:
```ts
export interface PCF_Opportunity {
    id: string;
    name: string;
    estimatedValue: number | null;
}
```

## 5. Create the mapping

Create `PCFTemplate/model/mappings/<camelCase>Mapping.ts` with two pure functions:

- `mapTo<PascalCase>(entity: <EntityType>): PCF_<PascalCase>` — Dataverse entity → app model
- `mapFrom<PascalCase>(model: PCF_<PascalCase>): <EntityType>` — app model → Dataverse entity (set `logicalName`)

Use the generated `<Entity>Attributes` constants for all field names — never raw strings.

## 6. Add service methods (if needed)

If a service for this entity doesn't exist, create `PCFTemplate/services/<PascalCase>Service.ts` extending `DataverseService` with the singleton pattern (see `SampleService.ts`). If the entity belongs to an existing service, add methods there.

Typical CRUD methods: `get<PascalCase>s()`, `get<PascalCase>(id)`, `create<PascalCase>(model)`, `update<PascalCase>(model)`, `delete<PascalCase>(id)`.

## 7. Verify

```bash
npm run lint
npm run build
```
