import { opportunity_opportunity_statecode } from "../dataverse/enums/opportunity_opportunity_statecode";
import { opportunity_opportunity_statuscode } from "../dataverse/enums/opportunity_opportunity_statuscode";

export interface PCF_Opportunity {
    id: string;
    name: string;
    estimatedValue: number | null;
    estimatedCloseDate: Date | null;
    closeProbability: number | null;
    customerId: string | null;
    customerName: string | null;
    stateCode: opportunity_opportunity_statecode | null;
    statusCode: opportunity_opportunity_statuscode | null;
    description: string | null;
}
