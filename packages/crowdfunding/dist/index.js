import { Buffer } from "buffer";
import { Client as ContractClient, Spec as ContractSpec, } from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk';
export * as contract from '@stellar/stellar-sdk/contract';
export * as rpc from '@stellar/stellar-sdk/rpc';
if (typeof window !== 'undefined') {
    //@ts-ignore Buffer exists
    window.Buffer = window.Buffer || Buffer;
}
export const networks = {
    testnet: {
        networkPassphrase: "Test SDF Network ; September 2015",
        contractId: "CBMILZWCHO5R5ZSYPQI2P3H2ZMLLMKG4HBWPEKURGQAZRELZCTF52PSZ",
    }
};
export const Errors = {
    1: { message: "InvalidDeadline" },
    2: { message: "CrowfundingAlreadyClosed" },
    3: { message: "CrowfundingStillOpen" },
    4: { message: "OwnerCannotDonate" }
};
export class Client extends ContractClient {
    options;
    constructor(options) {
        super(new ContractSpec(["AAAAAQAAAAAAAAAAAAAAEUNyb3dkZnVuZGluZ1N0YXRlAAAAAAAABwAAAAAAAAAHYmFsYW5jZQAAAAALAAAAAAAAAA1jb250cmlidXRpb25zAAAAAAAD7AAAABMAAAALAAAAAAAAAAhkZWFkbGluZQAAAAYAAAAAAAAABG5hbWUAAAAQAAAAAAAAAAVvd25lcgAAAAAAABMAAAAAAAAADHRhcmdldF9wcmljZQAAAAsAAAAAAAAABXRva2VuAAAAAAAAEw==",
            "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAABAAAAAAAAAAPSW52YWxpZERlYWRsaW5lAAAAAAEAAAAAAAAAGENyb3dmdW5kaW5nQWxyZWFkeUNsb3NlZAAAAAIAAAAAAAAAFENyb3dmdW5kaW5nU3RpbGxPcGVuAAAAAwAAAAAAAAART3duZXJDYW5ub3REb25hdGUAAAAAAAAE",
            "AAAAAAAAAAAAAAATY3JlYXRlX2Nyb3dkZnVuZGluZwAAAAAGAAAAAAAAAAV0b2tlbgAAAAAAABMAAAAAAAAABHVzZXIAAAATAAAAAAAAAAxjcm93ZGZ1bmRfaWQAAAAEAAAAAAAAAAx0YXJnZXRfcHJpY2UAAAALAAAAAAAAAARuYW1lAAAAEAAAAAAAAAAIZGVhZGxpbmUAAAAGAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
            "AAAAAAAAAAAAAAAGZG9uYXRlAAAAAAADAAAAAAAAAAZzZW5kZXIAAAAAABMAAAAAAAAABmFtb3VudAAAAAAACwAAAAAAAAAMY3Jvd2RmdW5kX2lkAAAABAAAAAEAAAPpAAAACwAAAAM=",
            "AAAAAAAAAAAAAAAOd2l0aGRyYXdfZnVuZHMAAAAAAAEAAAAAAAAADGNyb3dkZnVuZF9pZAAAAAQAAAABAAAD6QAAA+0AAAAAAAAAAw==",
            "AAAAAAAAAAAAAAAQZ2V0X2NvbnRyaWJ1dGlvbgAAAAIAAAAAAAAADGNyb3dkZnVuZF9pZAAAAAQAAAAAAAAABHVzZXIAAAATAAAAAQAAAAs=",
            "AAAAAAAAAAAAAAALZ2V0X2JhbGFuY2UAAAAAAQAAAAAAAAAMY3Jvd2RmdW5kX2lkAAAABAAAAAEAAAAL",
            "AAAAAAAAAAAAAAAUZ2V0X2Nyb3dmdW5kaW5nX2RhdGEAAAABAAAAAAAAAAxjcm93ZGZ1bmRfaWQAAAAEAAAAAQAAA+0AAAAFAAAAEwAAAAsAAAAQAAAABgAAABM=",
            "AAAAAAAAAAAAAAAgZ2V0X2Z1bGxfY3Jvd2Z1bmRpbmdfaW5mb3JtYXRpb24AAAABAAAAAAAAAAxjcm93ZGZ1bmRfaWQAAAAEAAAAAQAAB9AAAAARQ3Jvd2RmdW5kaW5nU3RhdGUAAAA="]), options);
        this.options = options;
    }
    fromJSON = {
        create_crowdfunding: (this.txFromJSON),
        donate: (this.txFromJSON),
        withdraw_funds: (this.txFromJSON),
        get_contribution: (this.txFromJSON),
        get_balance: (this.txFromJSON),
        get_crowfunding_data: (this.txFromJSON),
        get_full_crowfunding_information: (this.txFromJSON)
    };
}
