import { Buffer } from "buffer";
import { Address } from '@stellar/stellar-sdk';
import {
  AssembledTransaction,
  Client as ContractClient,
  ClientOptions as ContractClientOptions,
  Result,
  Spec as ContractSpec,
} from '@stellar/stellar-sdk/contract';
import type {
  u32,
  i32,
  u64,
  i64,
  u128,
  i128,
  u256,
  i256,
  Option,
  Typepoint,
  Duration,
} from '@stellar/stellar-sdk/contract';
export * from '@stellar/stellar-sdk'
export * as contract from '@stellar/stellar-sdk/contract'
export * as rpc from '@stellar/stellar-sdk/rpc'

if (typeof window !== 'undefined') {
  //@ts-ignore Buffer exists
  window.Buffer = window.Buffer || Buffer;
}


export const networks = {
  testnet: {
    networkPassphrase: "Test SDF Network ; September 2015",
    contractId: "CACCGYG4H4LJN5CFDSACZVZEACSJTTMU54H2BX2LFENFLGMJOEV2R5HH",
  }
} as const


export interface CrowdfundingState {
  balance: u32;
  deadline: u64;
  name: string;
  owner: string;
  target_price: u32;
}

export const Errors = {
  1: {message:"TargetNotAchieved"}
}

export interface Client {
  /**
   * Construct and simulate a hello transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  hello: ({to}: {to: string}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Array<string>>>

  /**
   * Construct and simulate a init_crowdfunding transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  init_crowdfunding: ({user, crowdfund_id, target, name, deadline}: {user: string, crowdfund_id: u32, target: u32, name: string, deadline: u64}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<null>>

  /**
   * Construct and simulate a give transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  give: ({amount, crowdfund_id}: {amount: u32, crowdfund_id: u32}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<u32>>

  /**
   * Construct and simulate a withdraw transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  withdraw: ({crowdfund_id}: {crowdfund_id: u32}, options?: {
    /**
     * The fee to pay for the transaction. Default: BASE_FEE
     */
    fee?: number;

    /**
     * The maximum amount of time to wait for the transaction to complete. Default: DEFAULT_TIMEOUT
     */
    timeoutInSeconds?: number;

    /**
     * Whether to automatically simulate the transaction when constructing the AssembledTransaction. Default: true
     */
    simulate?: boolean;
  }) => Promise<AssembledTransaction<Result<void>>>

}
export class Client extends ContractClient {
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAQAAAAAAAAAAAAAAEUNyb3dkZnVuZGluZ1N0YXRlAAAAAAAABQAAAAAAAAAHYmFsYW5jZQAAAAAEAAAAAAAAAAhkZWFkbGluZQAAAAYAAAAAAAAABG5hbWUAAAAQAAAAAAAAAAVvd25lcgAAAAAAABMAAAAAAAAADHRhcmdldF9wcmljZQAAAAQ=",
        "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAAAQAAAAAAAAARVGFyZ2V0Tm90QWNoaWV2ZWQAAAAAAAAB",
        "AAAAAAAAAAAAAAAFaGVsbG8AAAAAAAABAAAAAAAAAAJ0bwAAAAAAEAAAAAEAAAPqAAAAEA==",
        "AAAAAAAAAAAAAAARaW5pdF9jcm93ZGZ1bmRpbmcAAAAAAAAFAAAAAAAAAAR1c2VyAAAAEwAAAAAAAAAMY3Jvd2RmdW5kX2lkAAAABAAAAAAAAAAGdGFyZ2V0AAAAAAAEAAAAAAAAAARuYW1lAAAAEAAAAAAAAAAIZGVhZGxpbmUAAAAGAAAAAA==",
        "AAAAAAAAAAAAAAAEZ2l2ZQAAAAIAAAAAAAAABmFtb3VudAAAAAAABAAAAAAAAAAMY3Jvd2RmdW5kX2lkAAAABAAAAAEAAAAE",
        "AAAAAAAAAAAAAAAId2l0aGRyYXcAAAABAAAAAAAAAAxjcm93ZGZ1bmRfaWQAAAAEAAAAAQAAA+kAAAPtAAAAAAAAAAM=" ]),
      options
    )
  }
  public readonly fromJSON = {
    hello: this.txFromJSON<Array<string>>,
        init_crowdfunding: this.txFromJSON<null>,
        give: this.txFromJSON<u32>,
        withdraw: this.txFromJSON<Result<void>>
  }
}