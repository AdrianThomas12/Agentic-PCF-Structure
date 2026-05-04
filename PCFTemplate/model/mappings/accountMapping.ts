import { Account } from "../dataverse/entities/Account";
import { PCF_Account } from "../app/PCF_Account";

export function mapToAccount(entity: Account): PCF_Account {
    return {
        id: entity.accountid ?? "",
        name: entity.name ?? "",
    };
}

export function mapFromAccount(model: PCF_Account): Account {
    return {
        logicalName: "account",
        accountid: model.id || undefined,
        name: model.name,
    };
}
