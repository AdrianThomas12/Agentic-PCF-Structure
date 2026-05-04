import { EntityReference } from "dataverse-ify";
import { Account, AccountAttributes } from "../model/dataverse/entities/Account";
import { DataverseService } from "./DataverseService";
import { PCF_Account } from "../model/app/PCF_Account";
import { mapToAccount, mapFromAccount } from "../model/mappings/accountMapping";

export class SampleService extends DataverseService {
    private static instance: SampleService;

    private constructor(webApi: ComponentFramework.WebApi) {
        super(webApi);
    }

    public static getInstance(webApi?: ComponentFramework.WebApi): SampleService {
        if (!SampleService.instance) {
            if (!webApi) throw new Error("SampleService must be initialized with webApi on first call");
            SampleService.instance = new SampleService(webApi);
        }
        return SampleService.instance;
    }

    public async getAccounts(): Promise<PCF_Account[]> {
        const results = await this.client.retrieveMultiple<Account>(
            `<fetch top="50">
               <entity name="account">
                 <attribute name="${AccountAttributes.AccountId}" />
                 <attribute name="${AccountAttributes.Name}" />
               </entity>
             </fetch>`
        );
        return results.entities.map(mapToAccount);
    }

    public async getAccount(id: string): Promise<PCF_Account> {
        const entity = await this.client.retrieve<Account>(
            "account",
            id,
            [AccountAttributes.AccountId, AccountAttributes.Name]
        );
        return mapToAccount(entity);
    }

    public async createAccount(model: Omit<PCF_Account, "id">): Promise<string> {
        return this.client.create(mapFromAccount({ id: "", ...model }));
    }

    public async updateAccount(model: PCF_Account): Promise<void> {
        await this.client.update(mapFromAccount(model));
    }

    public async deleteAccount(id: string): Promise<void> {
        await this.client.delete("account", id);
    }

    public async associateContact(accountId: string, contactId: string): Promise<void> {
        await this.client.associate(
            "account",
            accountId,
            "contact_customer_accounts",
            [new EntityReference("contact", contactId)]
        );
    }
}
