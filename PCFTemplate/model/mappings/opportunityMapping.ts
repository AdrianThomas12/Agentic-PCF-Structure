import { EntityReference } from "dataverse-ify";
import { Opportunity, OpportunityAttributes } from "../dataverse/entities/Opportunity";
import { PCF_Opportunity } from "../app/PCF_Opportunity";

export function mapToOpportunity(entity: Opportunity): PCF_Opportunity {
    return {
        id: entity.opportunityid ?? "",
        name: entity.name ?? "",
        estimatedValue: entity.estimatedvalue ?? null,
        estimatedCloseDate: entity.estimatedclosedate ?? null,
        closeProbability: entity.closeprobability ?? null,
        customerId: entity.customerid?.id ?? null,
        customerName: entity.customeridname ?? null,
        stateCode: entity.statecode ?? null,
        statusCode: entity.statuscode ?? null,
        description: entity.description ?? null,
    };
}

export function mapFromOpportunity(model: PCF_Opportunity): Opportunity {
    return {
        logicalName: "opportunity",
        opportunityid: model.id || undefined,
        name: model.name,
        estimatedvalue: model.estimatedValue ?? undefined,
        estimatedclosedate: model.estimatedCloseDate ?? undefined,
        closeprobability: model.closeProbability ?? undefined,
        customerid: model.customerId ? new EntityReference("account", model.customerId) : undefined,
        statecode: model.stateCode ?? undefined,
        statuscode: model.statusCode ?? undefined,
        description: model.description ?? undefined,
    };
}
