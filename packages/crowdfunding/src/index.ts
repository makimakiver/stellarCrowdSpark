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
    contractId: "CBMILZWCHO5R5ZSYPQI2P3H2ZMLLMKG4HBWPEKURGQAZRELZCTF52PSZ",
  }
} as const


export interface CrowdfundingState {
  balance: i128;
  contributions: Map<string, i128>;
  deadline: u64;
  name: string;
  owner: string;
  target_price: i128;
  token: string;
}

export const Errors = {
  1: {message:"InvalidDeadline"},

  2: {message:"CrowfundingAlreadyClosed"},

  3: {message:"CrowfundingStillOpen"},

  4: {message:"OwnerCannotDonate"}
}

export interface Client {
  /**
   * Construct and simulate a create_crowdfunding transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  create_crowdfunding: ({token, user, crowdfund_id, target_price, name, deadline}: {token: string, user: string, crowdfund_id: u32, target_price: i128, name: string, deadline: u64}, options?: {
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

  /**
   * Construct and simulate a donate transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  donate: ({sender, amount, crowdfund_id}: {sender: string, amount: i128, crowdfund_id: u32}, options?: {
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
  }) => Promise<AssembledTransaction<Result<i128>>>

  /**
   * Construct and simulate a withdraw_funds transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  withdraw_funds: ({crowdfund_id}: {crowdfund_id: u32}, options?: {
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

  /**
   * Construct and simulate a get_contribution transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_contribution: ({crowdfund_id, user}: {crowdfund_id: u32, user: string}, options?: {
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
  }) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a get_balance transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_balance: ({crowdfund_id}: {crowdfund_id: u32}, options?: {
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
  }) => Promise<AssembledTransaction<i128>>

  /**
   * Construct and simulate a get_crowfunding_data transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_crowfunding_data: ({crowdfund_id}: {crowdfund_id: u32}, options?: {
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
  }) => Promise<AssembledTransaction<readonly [string, i128, string, u64, string]>>

  /**
   * Construct and simulate a get_full_crowfunding_information transaction. Returns an `AssembledTransaction` object which will have a `result` field containing the result of the simulation. If this transaction changes contract state, you will need to call `signAndSend()` on the returned object.
   */
  get_full_crowfunding_information: ({crowdfund_id}: {crowdfund_id: u32}, options?: {
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
  }) => Promise<AssembledTransaction<CrowdfundingState>>

}
export class Client extends ContractClient {
  constructor(public readonly options: ContractClientOptions) {
    super(
      new ContractSpec([ "AAAAAQAAAAAAAAAAAAAAEUNyb3dkZnVuZGluZ1N0YXRlAAAAAAAABwAAAAAAAAAHYmFsYW5jZQAAAAALAAAAAAAAAA1jb250cmlidXRpb25zAAAAAAAD7AAAABMAAAALAAAAAAAAAAhkZWFkbGluZQAAAAYAAAAAAAAABG5hbWUAAAAQAAAAAAAAAAVvd25lcgAAAAAAABMAAAAAAAAADHRhcmdldF9wcmljZQAAAAsAAAAAAAAABXRva2VuAAAAAAAAEw==",
        "AAAABAAAAAAAAAAAAAAABUVycm9yAAAAAAAABAAAAAAAAAAPSW52YWxpZERlYWRsaW5lAAAAAAEAAAAAAAAAGENyb3dmdW5kaW5nQWxyZWFkeUNsb3NlZAAAAAIAAAAAAAAAFENyb3dmdW5kaW5nU3RpbGxPcGVuAAAAAwAAAAAAAAART3duZXJDYW5ub3REb25hdGUAAAAAAAAE",
        "AAAAAAAAAAAAAAATY3JlYXRlX2Nyb3dkZnVuZGluZwAAAAAGAAAAAAAAAAV0b2tlbgAAAAAAABMAAAAAAAAABHVzZXIAAAATAAAAAAAAAAxjcm93ZGZ1bmRfaWQAAAAEAAAAAAAAAAx0YXJnZXRfcHJpY2UAAAALAAAAAAAAAARuYW1lAAAAEAAAAAAAAAAIZGVhZGxpbmUAAAAGAAAAAQAAA+kAAAPtAAAAAAAAAAM=",
        "AAAAAAAAAAAAAAAGZG9uYXRlAAAAAAADAAAAAAAAAAZzZW5kZXIAAAAAABMAAAAAAAAABmFtb3VudAAAAAAACwAAAAAAAAAMY3Jvd2RmdW5kX2lkAAAABAAAAAEAAAPpAAAACwAAAAM=",
        "AAAAAAAAAAAAAAAOd2l0aGRyYXdfZnVuZHMAAAAAAAEAAAAAAAAADGNyb3dkZnVuZF9pZAAAAAQAAAABAAAD6QAAA+0AAAAAAAAAAw==",
        "AAAAAAAAAAAAAAAQZ2V0X2NvbnRyaWJ1dGlvbgAAAAIAAAAAAAAADGNyb3dkZnVuZF9pZAAAAAQAAAAAAAAABHVzZXIAAAATAAAAAQAAAAs=",
        "AAAAAAAAAAAAAAALZ2V0X2JhbGFuY2UAAAAAAQAAAAAAAAAMY3Jvd2RmdW5kX2lkAAAABAAAAAEAAAAL",
        "AAAAAAAAAAAAAAAUZ2V0X2Nyb3dmdW5kaW5nX2RhdGEAAAABAAAAAAAAAAxjcm93ZGZ1bmRfaWQAAAAEAAAAAQAAA+0AAAAFAAAAEwAAAAsAAAAQAAAABgAAABM=",
        "AAAAAAAAAAAAAAAgZ2V0X2Z1bGxfY3Jvd2Z1bmRpbmdfaW5mb3JtYXRpb24AAAABAAAAAAAAAAxjcm93ZGZ1bmRfaWQAAAAEAAAAAQAAB9AAAAARQ3Jvd2RmdW5kaW5nU3RhdGUAAAA=" ]),
      options
    )
  }
  public readonly fromJSON = {
    create_crowdfunding: this.txFromJSON<Result<void>>,
        donate: this.txFromJSON<Result<i128>>,
        withdraw_funds: this.txFromJSON<Result<void>>,
        get_contribution: this.txFromJSON<i128>,
        get_balance: this.txFromJSON<i128>,
        get_crowfunding_data: this.txFromJSON<readonly [string, i128, string, u64, string]>,
        get_full_crowfunding_information: this.txFromJSON<CrowdfundingState>
  }
}