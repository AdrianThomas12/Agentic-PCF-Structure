import { Opportunity, OpportunityAttributes } from "../model/dataverse/entities/Opportunity";
import { DataverseService } from "./DataverseService";
import { PCF_Opportunity } from "../model/app/PCF_Opportunity";
import { mapToOpportunity, mapFromOpportunity } from "../model/mappings/opportunityMapping";

export class OpportunityService extends DataverseService {
    private static instance: OpportunityService;

    private constructor(webApi: ComponentFramework.WebApi) {
        super(webApi);
    }

    public static getInstance(webApi?: ComponentFramework.WebApi): OpportunityService {
        if (!OpportunityService.instance) {
            if (!webApi) throw new Error("OpportunityService must be initialized with webApi on first call");
            OpportunityService.instance = new OpportunityService(webApi);
        }
        return OpportunityService.instance;
    }

    public async getOpportunities(): Promise<PCF_Opportunity[]> {
        const results = await this.client.retrieveMultiple<Opportunity>(
            `<fetch top="50">
               <entity name="opportunity">
                 <attribute name="${OpportunityAttributes.OpportunityId}" />
                 <attribute name="${OpportunityAttributes.Name}" />
                 <attribute name="${OpportunityAttributes.EstimatedValue}" />
                 <attribute name="${OpportunityAttributes.EstimatedCloseDate}" />
                 <attribute name="${OpportunityAttributes.CloseProbability}" />
                 <attribute name="${OpportunityAttributes.CustomerId}" />
                 <attribute name="${OpportunityAttributes.CustomerIdName}" />
                 <attribute name="${OpportunityAttributes.StateCode}" />
                 <attribute name="${OpportunityAttributes.StatusCode}" />
                 <attribute name="${OpportunityAttributes.Description}" />
               </entity>
             </fetch>`
        );
        return results.entities.map(mapToOpportunity);
    }

    public async getOpportunity(id: string): Promise<PCF_Opportunity> {
        const entity = await this.client.retrieve<Opportunity>(
            "opportunity",
            id,
            [
                OpportunityAttributes.OpportunityId,
                OpportunityAttributes.Name,
                OpportunityAttributes.EstimatedValue,
                OpportunityAttributes.EstimatedCloseDate,
                OpportunityAttributes.CloseProbability,
                OpportunityAttributes.CustomerId,
                OpportunityAttributes.CustomerIdName,
                OpportunityAttributes.StateCode,
                OpportunityAttributes.StatusCode,
                OpportunityAttributes.Description,
            ]
        );
        return mapToOpportunity(entity);
    }

    public async createOpportunity(model: Omit<PCF_Opportunity, "id">): Promise<string> {
        return this.client.create(mapFromOpportunity({ id: "", ...model }));
    }

    public async updateOpportunity(model: PCF_Opportunity): Promise<void> {
        await this.client.update(mapFromOpportunity(model));
    }

    public async deleteOpportunity(id: string): Promise<void> {
        await this.client.delete("opportunity", id);
    }
}
