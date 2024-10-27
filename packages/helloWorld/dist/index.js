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
        contractId: "CACCGYG4H4LJN5CFDSACZVZEACSJTTMU54H2BX2LFENFLGMJOEV2R5HH",
    }
};
export const Errors = {
    1: { message: "TargetNotAchieved" }
};
export class Client extends ContractClient {
    options;
    constructor(options) {
        super(new ContractSpec(["AAAAAQAAAAAAAAAAAAAAEUNyb3dkZnVuZGluZ1N0YXRlAAAAAAAABQAAAAAAAAAHYmFsYW5jZQAAAAAEAAAAAAAAAAhkZWFkbGluZQAAAAYAAAAAAAAABG5hbWUAAAAQAAAAAAAAAAVvd25lcgAAAAAAABMAAAAAAAAADHRhcmdldF9wcmljZQAAAAQ=",
            "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAAAQAAAAAAAAARVGFyZ2V0Tm90QWNoaWV2ZWQAAAAAAAAB",
            "AAAAAAAAAAAAAAAFaGVsbG8AAAAAAAABAAAAAAAAAAJ0bwAAAAAAEAAAAAEAAAPqAAAAEA==",
            "AAAAAAAAAAAAAAARaW5pdF9jcm93ZGZ1bmRpbmcAAAAAAAAFAAAAAAAAAAR1c2VyAAAAEwAAAAAAAAAMY3Jvd2RmdW5kX2lkAAAABAAAAAAAAAAGdGFyZ2V0AAAAAAAEAAAAAAAAAARuYW1lAAAAEAAAAAAAAAAIZGVhZGxpbmUAAAAGAAAAAA==",
            "AAAAAAAAAAAAAAAEZ2l2ZQAAAAIAAAAAAAAABmFtb3VudAAAAAAABAAAAAAAAAAMY3Jvd2RmdW5kX2lkAAAABAAAAAEAAAAE",
            "AAAAAAAAAAAAAAAId2l0aGRyYXcAAAABAAAAAAAAAAxjcm93ZGZ1bmRfaWQAAAAEAAAAAQAAA+kAAAPtAAAAAAAAAAM="]), options);
        this.options = options;
    }
    fromJSON = {
        hello: (this.txFromJSON),
        init_crowdfunding: (this.txFromJSON),
        give: (this.txFromJSON),
        withdraw: (this.txFromJSON)
    };
}
