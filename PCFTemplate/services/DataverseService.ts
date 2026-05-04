import { DataverseClient, XrmContextDataverseClient, setMetadataCache } from "dataverse-ify";
import { metadataCache } from "../model/dataverse/metadata";

export abstract class DataverseService {
    protected readonly client: DataverseClient;

    constructor(webApi: ComponentFramework.WebApi) {
        setMetadataCache(metadataCache);
        this.client = new XrmContextDataverseClient(webApi as unknown as Xrm.WebApi);
    }
}
