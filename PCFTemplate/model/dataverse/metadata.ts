/* eslint-disable*/
import { accountMetadata } from "./entities/Account";
import { contactMetadata } from "./entities/Contact";
import { opportunityMetadata } from "./entities/Opportunity";

export const Entities = {
  Account: "account",
  Contact: "contact",
  Opportunity: "opportunity",
};

// Setup Metadata
// Usage: setMetadataCache(metadataCache);
export const metadataCache = {
  entities: {
    account: accountMetadata,
    contact: contactMetadata,
    opportunity: opportunityMetadata,
  },
  actions: {
  }
};