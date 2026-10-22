// Auto-generated via `yarn polkadot-types-from-chain`, do not edit
/* eslint-disable */

// import type lookup before we augment - in some environments
// this is required to allow for ambient/previous definitions
import '@polkadot/api-base/types/calls';

import type { Call } from '@polkadot/types/interfaces/runtime';

import type { ApiTypes, AugmentedCall, DecoratedCallBase } from '@polkadot/api-base/types';
import type { Bytes, Null, Option, Result, Struct, Text, U256, U8aFixed, Vec, bool, u128, u32, u64 } from '@polkadot/types-codec';
import type { AnyNumber, IMethod, ITuple } from '@polkadot/types-codec/types';
import type { OpaqueKeyOwnershipProof } from '@polkadot/types/interfaces/babe';
import type { Extrinsic } from '@polkadot/types/interfaces/extrinsics';
import type { OpaqueMetadata } from '@polkadot/types/interfaces/metadata';
import type { AccountId32, H160, H256, Slot } from '@polkadot/types/interfaces/runtime';
import type { FrameSupportTokensFungibleUnionOfNativeOrWithId, FrameSupportViewFunctionsViewFunctionDispatchError, FrameSupportViewFunctionsViewFunctionId, FrameSystemEventRecord, PalletContractsPrimitivesCode, PalletContractsPrimitivesCodeUploadReturnValue, PalletContractsPrimitivesContractAccessError, PalletContractsPrimitivesContractResult, PalletContractsPrimitivesExecReturnValue, PalletContractsPrimitivesStorageDeposit, PalletContractsWasmDeterminism, PalletRevivePrimitivesBalanceConversionError, PalletRevivePrimitivesContractAccessError, PalletRevivePrimitivesEthTransactError, PalletReviveTypesRuntimeApiDeclarationReviveRuntimeApiVersionDeclarations, PalletReviveTypesRuntimeApiPayloadsAccountIdAccountIdVersionedInputPayload, PalletReviveTypesRuntimeApiPayloadsAccountIdAccountIdVersionedOutputPayload, PalletReviveTypesRuntimeApiPayloadsAddressAddressVersionedInputPayload, PalletReviveTypesRuntimeApiPayloadsAddressAddressVersionedOutputPayload, PalletReviveTypesRuntimeApiPayloadsBalanceBalanceVersionedInputPayload, PalletReviveTypesRuntimeApiPayloadsBalanceBalanceVersionedOutputPayload, PalletReviveTypesRuntimeApiPayloadsBlockAuthorBlockAuthorVersionedInputPayload, PalletReviveTypesRuntimeApiPayloadsBlockAuthorBlockAuthorVersionedOutputPayload, PalletReviveTypesRuntimeApiPayloadsBlockGasLimitBlockGasLimitVersionedInputPayload, PalletReviveTypesRuntimeApiPayloadsBlockGasLimitBlockGasLimitVersionedOutputPayload, PalletReviveTypesRuntimeApiPayloadsBlockHashBlockHashVersionedInputPayload, PalletReviveTypesRuntimeApiPayloadsBlockHashBlockHashVersionedOutputPayload, PalletReviveTypesRuntimeApiPayloadsCallCallVersionedInputPayload, PalletReviveTypesRuntimeApiPayloadsCallCallVersionedOutputPayload, PalletReviveTypesRuntimeApiPayloadsCodeCodeVersionedInputPayload, PalletReviveTypesRuntimeApiPayloadsCodeCodeVersionedOutputPayload, PalletReviveTypesRuntimeApiPayloadsEthBlockBlockVersionedInputPayload, PalletReviveTypesRuntimeApiPayloadsEthBlockBlockVersionedOutputPayload, PalletReviveTypesRuntimeApiPayloadsEthEstimateGasEstimateGasVersionedInputPayload, PalletReviveTypesRuntimeApiPayloadsEthEstimateGasEstimateGasVersionedOutputPayload, PalletReviveTypesRuntimeApiPayloadsEthPreDispatchWeightPreDispatchWeightVersionedInputPayload, PalletReviveTypesRuntimeApiPayloadsEthPreDispatchWeightPreDispatchWeightVersionedOutputPayload, PalletReviveTypesRuntimeApiPayloadsEthTransactTransactVersionedInputPayload, PalletReviveTypesRuntimeApiPayloadsEthTransactTransactVersionedOutputPayload, PalletReviveTypesRuntimeApiPayloadsGasPriceGasPriceVersionedInputPayload, PalletReviveTypesRuntimeApiPayloadsGasPriceGasPriceVersionedOutputPayload, PalletReviveTypesRuntimeApiPayloadsGetStorageGetStorageVersionedInputPayload, PalletReviveTypesRuntimeApiPayloadsGetStorageGetStorageVersionedOutputPayload, PalletReviveTypesRuntimeApiPayloadsInstantiateInstantiateVersionedInputPayload, PalletReviveTypesRuntimeApiPayloadsInstantiateInstantiateVersionedOutputPayload, PalletReviveTypesRuntimeApiPayloadsMaxExtrinsicWeightInGasMaxExtrinsicWeightInGasVersionedInputPayload, PalletReviveTypesRuntimeApiPayloadsMaxExtrinsicWeightInGasMaxExtrinsicWeightInGasVersionedOutputPayload, PalletReviveTypesRuntimeApiPayloadsNewBalanceWithDustNewBalanceWithDustVersionedInputPayload, PalletReviveTypesRuntimeApiPayloadsNewBalanceWithDustNewBalanceWithDustVersionedOutputPayload, PalletReviveTypesRuntimeApiPayloadsNonceNonceVersionedInputPayload, PalletReviveTypesRuntimeApiPayloadsNonceNonceVersionedOutputPayload, PalletReviveTypesRuntimeApiPayloadsReceiptDataReceiptDataVersionedInputPayload, PalletReviveTypesRuntimeApiPayloadsReceiptDataReceiptDataVersionedOutputPayload, PalletReviveTypesRuntimeApiPayloadsRuntimePalletsAddressRuntimePalletsAddressVersionedInputPayload, PalletReviveTypesRuntimeApiPayloadsRuntimePalletsAddressRuntimePalletsAddressVersionedOutputPayload, PalletReviveTypesRuntimeApiPayloadsTraceBlockTraceBlockVersionedInputPayload, PalletReviveTypesRuntimeApiPayloadsTraceBlockTraceBlockVersionedOutputPayload, PalletReviveTypesRuntimeApiPayloadsTraceCallTraceCallVersionedInputPayload, PalletReviveTypesRuntimeApiPayloadsTraceCallTraceCallVersionedOutputPayload, PalletReviveTypesRuntimeApiPayloadsTraceTxTraceTxVersionedInputPayload, PalletReviveTypesRuntimeApiPayloadsTraceTxTraceTxVersionedOutputPayload, PalletReviveTypesRuntimeApiPayloadsUploadCodeUploadCodeVersionedInputPayload, PalletReviveTypesRuntimeApiPayloadsUploadCodeUploadCodeVersionedOutputPayload, PalletReviveTypesRuntimeApiTypesBlockBlockV1, PalletReviveTypesRuntimeApiTypesContractCodeV1, PalletReviveTypesRuntimeApiTypesContractContractResultV1ExecReturnValueV1, PalletReviveTypesRuntimeApiTypesContractContractResultV1InstantiateReturnValueV1, PalletReviveTypesRuntimeApiTypesDryRunDryRunConfigV1, PalletReviveTypesRuntimeApiTypesDryRunEthTransactInfoV1, PalletReviveTypesRuntimeApiTypesReceiptReceiptGasInfoV1, PalletReviveTypesRuntimeApiTypesStateOverridesTracingConfigV1, PalletReviveTypesRuntimeApiTypesTracerTracerTypeV1, PalletReviveTypesRuntimeApiTypesTracesTraceV1, PalletReviveTypesRuntimeApiTypesTransactionGenericTransactionV1, PalletReviveTypesRuntimeApiTypesUploadCodeUploadReturnValueV1, PalletTransactionPaymentFeeDetails, PalletTransactionPaymentRuntimeDispatchInfo, SpAuthorityDiscoveryAppPublic, SpConsensusBabeAppPublic, SpConsensusBabeBabeConfiguration, SpConsensusBabeEpoch, SpConsensusBeefyDoubleVotingProof, SpConsensusBeefyEcdsaCryptoPublic, SpConsensusBeefyForkVotingProofOpaqueValue, SpConsensusBeefyFutureBlockVotingProof, SpConsensusBeefyValidatorSet, SpConsensusGrandpaAppPublic, SpConsensusGrandpaEquivocationProof, SpConsensusSlotsEquivocationProof, SpCoreCryptoKeyTypeId, SpInherentsCheckInherentsResult, SpInherentsInherentData, SpMixnetMixnode, SpMixnetMixnodesErr, SpMixnetSessionStatus, SpMmrPrimitivesAncestryProof, SpMmrPrimitivesError, SpMmrPrimitivesLeafProof, SpRuntimeBlock, SpRuntimeBlockLazyBlock, SpRuntimeDispatchError, SpRuntimeExtrinsicInclusionMode, SpRuntimeHeader, SpRuntimeTransactionValidityTransactionSource, SpRuntimeTransactionValidityTransactionValidityError, SpRuntimeTransactionValidityValidTransaction, SpSessionRuntimeApiOpaqueGeneratedSessionKeys, SpTransactionStorageProofIndexedTransactionInfo, SpVersionRuntimeVersion, SpWeightsWeightV2Weight } from '@polkadot/types/lookup';
import type { IExtrinsic, Observable } from '@polkadot/types/types';

export type __AugmentedCall<ApiType extends ApiTypes> = AugmentedCall<ApiType>;
export type __DecoratedCallBase<ApiType extends ApiTypes> = DecoratedCallBase<ApiType>;

declare module '@polkadot/api-base/types/calls' {
  interface AugmentedCalls<ApiType extends ApiTypes> {
    /** 0xbc9d89904f5b923f/ */
    accountNonceApi: {
      /**
       * Get current account nonce of given `AccountId`.
       **/
      accountNonce: AugmentedCall<ApiType, (account: AccountId32 | string | Uint8Array) => Observable<u32>>;
      /**
       * Generic call
       **/
      [key: string]: DecoratedCallBase<ApiType>;
    };
    /** 0x8a8047a53a8277ec/ */
    assetConversionApi: {
      /**
       * Returns the size of the liquidity pool for the given asset pair.
       **/
      getReserves: AugmentedCall<ApiType, (asset1: FrameSupportTokensFungibleUnionOfNativeOrWithId | { Native: any } | { WithId: any } | string | Uint8Array, asset2: FrameSupportTokensFungibleUnionOfNativeOrWithId | { Native: any } | { WithId: any } | string | Uint8Array) => Observable<Option<ITuple<[u128, u128]>>>>;
      /**
       * Provides a quote for [`Pallet::swap_exact_tokens_for_tokens`].,, Note that the price may have changed by the time the transaction is executed., (Use `amount_out_min` to control slippage.)
       **/
      quotePriceExactTokensForTokens: AugmentedCall<ApiType, (asset1: FrameSupportTokensFungibleUnionOfNativeOrWithId | { Native: any } | { WithId: any } | string | Uint8Array, asset2: FrameSupportTokensFungibleUnionOfNativeOrWithId | { Native: any } | { WithId: any } | string | Uint8Array, amount: u128 | AnyNumber | Uint8Array, include_fee: bool | boolean | Uint8Array) => Observable<Option<u128>>>;
      /**
       * Provides a quote for [`Pallet::swap_tokens_for_exact_tokens`].,, Note that the price may have changed by the time the transaction is executed., (Use `amount_in_max` to control slippage.)
       **/
      quotePriceTokensForExactTokens: AugmentedCall<ApiType, (asset1: FrameSupportTokensFungibleUnionOfNativeOrWithId | { Native: any } | { WithId: any } | string | Uint8Array, asset2: FrameSupportTokensFungibleUnionOfNativeOrWithId | { Native: any } | { WithId: any } | string | Uint8Array, amount: u128 | AnyNumber | Uint8Array, include_fee: bool | boolean | Uint8Array) => Observable<Option<u128>>>;
      /**
       * Generic call
       **/
      [key: string]: DecoratedCallBase<ApiType>;
    };
    /** 0x8453b50b22293977/ */
    assetsApi: {
      /**
       * Returns the list of `AssetId`s and corresponding balance that an `AccountId` has.
       **/
      accountBalances: AugmentedCall<ApiType, (account: AccountId32 | string | Uint8Array) => Observable<Vec<ITuple<[u32, u128]>>>>;
      /**
       * Generic call
       **/
      [key: string]: DecoratedCallBase<ApiType>;
    };
    /** 0x687ad44ad37f03c2/ */
    authorityDiscoveryApi: {
      /**
       * Retrieve authority identifiers of the current and next authority set.
       **/
      authorities: AugmentedCall<ApiType, () => Observable<Vec<SpAuthorityDiscoveryAppPublic>>>;
      /**
       * Generic call
       **/
      [key: string]: DecoratedCallBase<ApiType>;
    };
    /** 0xcbca25e39f142387/ */
    babeApi: {
      /**
       * Return the configuration for BABE.
       **/
      configuration: AugmentedCall<ApiType, () => Observable<SpConsensusBabeBabeConfiguration>>;
      /**
       * Returns information regarding the current epoch.
       **/
      currentEpoch: AugmentedCall<ApiType, () => Observable<SpConsensusBabeEpoch>>;
      /**
       * Returns the slot that started the current epoch.
       **/
      currentEpochStart: AugmentedCall<ApiType, () => Observable<Slot>>;
      /**
       * Generates a proof of key ownership for the given authority in the, current epoch. An example usage of this module is coupled with the, session historical module to prove that a given authority key is, tied to a given staking identity during a specific session. Proofs, of key ownership are necessary for submitting equivocation reports., NOTE: even though the API takes a `slot` as parameter the current, implementations ignores this parameter and instead relies on this, method being called at the correct block height, i.e. any point at, which the epoch for the given slot is live on-chain. Future, implementations will instead use indexed data through an offchain, worker, not requiring older states to be available.
       **/
      generateKeyOwnershipProof: AugmentedCall<ApiType, (slot: Slot | AnyNumber | Uint8Array, authority_id: SpConsensusBabeAppPublic | string | Uint8Array) => Observable<Option<Bytes>>>;
      /**
       * Returns information regarding the next epoch (which was already, previously announced).
       **/
      nextEpoch: AugmentedCall<ApiType, () => Observable<SpConsensusBabeEpoch>>;
      /**
       * Submits an unsigned extrinsic to report an equivocation. The caller, must provide the equivocation proof and a key ownership proof, (should be obtained using `generate_key_ownership_proof`). The, extrinsic will be unsigned and should only be accepted for local, authorship (not to be broadcast to the network). This method returns, `None` when creation of the extrinsic fails, e.g. if equivocation, reporting is disabled for the given runtime (i.e. this method is, hardcoded to return `None`). Only useful in an offchain context.
       **/
      submitReportEquivocationUnsignedExtrinsic: AugmentedCall<ApiType, (equivocation_proof: SpConsensusSlotsEquivocationProof | { offender?: any; slot?: any; firstHeader?: any; secondHeader?: any } | string | Uint8Array, key_owner_proof: OpaqueKeyOwnershipProof | string | Uint8Array) => Observable<Option<Null>>>;
      /**
       * Generic call
       **/
      [key: string]: DecoratedCallBase<ApiType>;
    };
    /** 0x49eaaf1b548a0cb0/ */
    beefyApi: {
      /**
       * Return the block number where BEEFY consensus is enabled/started
       **/
      beefyGenesis: AugmentedCall<ApiType, () => Observable<Option<u32>>>;
      /**
       * Generates a proof of key ownership for the given authority in the, given set. An example usage of this module is coupled with the, session historical module to prove that a given authority key is, tied to a given staking identity during a specific session. Proofs, of key ownership are necessary for submitting equivocation reports., NOTE: even though the API takes a `set_id` as parameter the current, implementations ignores this parameter and instead relies on this, method being called at the correct block height, i.e. any point at, which the given set id is live on-chain. Future implementations will, instead use indexed data through an offchain worker, not requiring, older states to be available.
       **/
      generateKeyOwnershipProof: AugmentedCall<ApiType, (set_id: u64 | AnyNumber | Uint8Array, authority_id: SpConsensusBeefyEcdsaCryptoPublic | string | Uint8Array) => Observable<Option<Bytes>>>;
      /**
       * Submits an unsigned extrinsic to report a double voting equivocation. The caller, must provide the double voting proof and a key ownership proof, (should be obtained using `generate_key_ownership_proof`). The, extrinsic will be unsigned and should only be accepted for local, authorship (not to be broadcast to the network). This method returns, `None` when creation of the extrinsic fails, e.g. if equivocation, reporting is disabled for the given runtime (i.e. this method is, hardcoded to return `None`). Only useful in an offchain context.
       **/
      submitReportDoubleVotingUnsignedExtrinsic: AugmentedCall<ApiType, (equivocation_proof: SpConsensusBeefyDoubleVotingProof | { first?: any; second?: any } | string | Uint8Array, key_owner_proof: Bytes | string | Uint8Array) => Observable<Option<Null>>>;
      /**
       * Submits an unsigned extrinsic to report a fork voting equivocation. The caller, must provide the fork voting proof (the ancestry proof should be obtained using, `generate_ancestry_proof`) and a key ownership proof (should be obtained using, `generate_key_ownership_proof`). The extrinsic will be unsigned and should only, be accepted for local authorship (not to be broadcast to the network). This method, returns `None` when creation of the extrinsic fails, e.g. if equivocation, reporting is disabled for the given runtime (i.e. this method is, hardcoded to return `None`). Only useful in an offchain context.
       **/
      submitReportForkVotingUnsignedExtrinsic: AugmentedCall<ApiType, (equivocation_proof: SpConsensusBeefyForkVotingProofOpaqueValue | { vote?: any; ancestryProof?: any; header?: any } | string | Uint8Array, key_owner_proof: Bytes | string | Uint8Array) => Observable<Option<Null>>>;
      /**
       * Submits an unsigned extrinsic to report a future block voting equivocation. The caller, must provide the future block voting proof and a key ownership proof, (should be obtained using `generate_key_ownership_proof`)., The extrinsic will be unsigned and should only be accepted for local, authorship (not to be broadcast to the network). This method returns, `None` when creation of the extrinsic fails, e.g. if equivocation, reporting is disabled for the given runtime (i.e. this method is, hardcoded to return `None`). Only useful in an offchain context.
       **/
      submitReportFutureBlockVotingUnsignedExtrinsic: AugmentedCall<ApiType, (equivocation_proof: SpConsensusBeefyFutureBlockVotingProof | { vote?: any } | string | Uint8Array, key_owner_proof: Bytes | string | Uint8Array) => Observable<Option<Null>>>;
      /**
       * Return the current active BEEFY validator set
       **/
      validatorSet: AugmentedCall<ApiType, () => Observable<Option<SpConsensusBeefyValidatorSet>>>;
      /**
       * Generic call
       **/
      [key: string]: DecoratedCallBase<ApiType>;
    };
    /** 0x40fe3ad401f8959a/ */
    blockBuilder: {
      /**
       * Apply the given extrinsic.,, Returns an inclusion outcome which specifies if this extrinsic is included in, this block or not.
       **/
      applyExtrinsic: AugmentedCall<ApiType, (extrinsic: Extrinsic | IExtrinsic | string | Uint8Array) => Observable<Result<Result<Null, SpRuntimeDispatchError>, SpRuntimeTransactionValidityTransactionValidityError>>>;
      /**
       * Check that the inherents are valid. The inherent data will vary from chain to chain.
       **/
      checkInherents: AugmentedCall<ApiType, (block: SpRuntimeBlockLazyBlock | { header?: any; extrinsics?: any } | string | Uint8Array, data: SpInherentsInherentData | { data?: any } | string | Uint8Array) => Observable<SpInherentsCheckInherentsResult>>;
      /**
       * Finish the current block.
       **/
      finalizeBlock: AugmentedCall<ApiType, () => Observable<SpRuntimeHeader>>;
      /**
       * Generate inherent extrinsics. The inherent data will vary from chain to chain.
       **/
      inherentExtrinsics: AugmentedCall<ApiType, (inherent: SpInherentsInherentData | { data?: any } | string | Uint8Array) => Observable<Vec<Bytes>>>;
      /**
       * Generic call
       **/
      [key: string]: DecoratedCallBase<ApiType>;
    };
    /** 0x68b66ba122c93fa7/ */
    contractsApi: {
      /**
       * Perform a call from a specified account to a given contract.,, See [`crate::Pallet::bare_call`].
       **/
      call: AugmentedCall<ApiType, (origin: AccountId32 | string | Uint8Array, dest: AccountId32 | string | Uint8Array, value: u128 | AnyNumber | Uint8Array, gas_limit: Option<SpWeightsWeightV2Weight> | null | Uint8Array | SpWeightsWeightV2Weight | { refTime?: any; proofSize?: any } | string, storage_deposit_limit: Option<u128> | null | Uint8Array | u128 | AnyNumber, input_data: Bytes | string | Uint8Array) => Observable<{
    readonly gasConsumed: SpWeightsWeightV2Weight;
    readonly gasRequired: SpWeightsWeightV2Weight;
    readonly storageDeposit: PalletContractsPrimitivesStorageDeposit;
    readonly debugMessage: Bytes;
    readonly result: Result<PalletContractsPrimitivesExecReturnValue, SpRuntimeDispatchError>;
    readonly events: Option<Vec<FrameSystemEventRecord>>;
  } & Struct>>;
      /**
       * Query a given storage key in a given contract.,, Returns `Ok(Some(Vec<u8>))` if the storage value exists under the given key in the, specified account and `Ok(None)` if it doesn't. If the account specified by the address, doesn't exist, or doesn't have a contract then `Err` is returned.
       **/
      getStorage: AugmentedCall<ApiType, (address: AccountId32 | string | Uint8Array, key: Bytes | string | Uint8Array) => Observable<Result<Option<Bytes>, PalletContractsPrimitivesContractAccessError>>>;
      /**
       * Instantiate a new contract.,, See `[crate::Pallet::bare_instantiate]`.
       **/
      instantiate: AugmentedCall<ApiType, (origin: AccountId32 | string | Uint8Array, value: u128 | AnyNumber | Uint8Array, gas_limit: Option<SpWeightsWeightV2Weight> | null | Uint8Array | SpWeightsWeightV2Weight | { refTime?: any; proofSize?: any } | string, storage_deposit_limit: Option<u128> | null | Uint8Array | u128 | AnyNumber, code: PalletContractsPrimitivesCode | { Upload: any } | { Existing: any } | string | Uint8Array, data: Bytes | string | Uint8Array, salt: Bytes | string | Uint8Array) => Observable<PalletContractsPrimitivesContractResult>>;
      /**
       * Upload new code without instantiating a contract from it.,, See [`crate::Pallet::bare_upload_code`].
       **/
      uploadCode: AugmentedCall<ApiType, (origin: AccountId32 | string | Uint8Array, code: Bytes | string | Uint8Array, storage_deposit_limit: Option<u128> | null | Uint8Array | u128 | AnyNumber, determinism: PalletContractsWasmDeterminism | 'Enforced' | 'Relaxed' | number | Uint8Array) => Observable<Result<PalletContractsPrimitivesCodeUploadReturnValue, SpRuntimeDispatchError>>>;
      /**
       * Generic call
       **/
      [key: string]: DecoratedCallBase<ApiType>;
    };
    /** 0xdf6acb689907609b/ */
    core: {
      /**
       * Execute the given block.
       **/
      executeBlock: AugmentedCall<ApiType, (block: SpRuntimeBlockLazyBlock | { header?: any; extrinsics?: any } | string | Uint8Array) => Observable<Null>>;
      /**
       * Initialize a block with the given header and return the runtime executive mode.
       **/
      initializeBlock: AugmentedCall<ApiType, (header: SpRuntimeHeader | { parentHash?: any; number?: any; stateRoot?: any; extrinsicsRoot?: any; digest?: any } | string | Uint8Array) => Observable<SpRuntimeExtrinsicInclusionMode>>;
      /**
       * Returns the version of the runtime.
       **/
      version: AugmentedCall<ApiType, () => Observable<SpVersionRuntimeVersion>>;
      /**
       * Generic call
       **/
      [key: string]: DecoratedCallBase<ApiType>;
    };
    /** 0xfbc577b9d747efd6/ */
    genesisBuilder: {
      /**
       * Build `RuntimeGenesisConfig` from a JSON blob not using any defaults and store it in the, storage.,, In the case of a FRAME-based runtime, this function deserializes the full, `RuntimeGenesisConfig` from the given JSON blob and puts it into the storage. If the, provided JSON blob is incorrect or incomplete or the deserialization fails, an error, is returned.,, Please note that provided JSON blob must contain all `RuntimeGenesisConfig` fields, no, defaults will be used.
       **/
      buildState: AugmentedCall<ApiType, (json: Bytes | string | Uint8Array) => Observable<Result<Null, Text>>>;
      /**
       * Returns a JSON blob representation of the built-in `RuntimeGenesisConfig` identified by, `id`.,, If `id` is `None` the function should return JSON blob representation of the default, `RuntimeGenesisConfig` struct of the runtime. Implementation must provide default, `RuntimeGenesisConfig`.,, Otherwise function returns a JSON representation of the built-in, named, `RuntimeGenesisConfig` preset identified by `id`, or `None` if such preset does not, exist. Returned `Vec<u8>` contains bytes of JSON blob (patch) which comprises a list of, (potentially nested) key-value pairs that are intended for customizing the default, runtime genesis config. The patch shall be merged (rfc7386) with the JSON representation, of the default `RuntimeGenesisConfig` to create a comprehensive genesis config that can, be used in `build_state` method.
       **/
      getPreset: AugmentedCall<ApiType, (id: Option<Text> | null | Uint8Array | Text | string) => Observable<Option<Bytes>>>;
      /**
       * Returns a list of identifiers for available builtin `RuntimeGenesisConfig` presets.,, The presets from the list can be queried with [`GenesisBuilder::get_preset`] method. If, no named presets are provided by the runtime the list is empty.
       **/
      presetNames: AugmentedCall<ApiType, () => Observable<Vec<Text>>>;
      /**
       * Generic call
       **/
      [key: string]: DecoratedCallBase<ApiType>;
    };
    /** 0xed99c5acb25eedf5/ */
    grandpaApi: {
      /**
       * Get current GRANDPA authority set id.
       **/
      currentSetId: AugmentedCall<ApiType, () => Observable<u64>>;
      /**
       * Generates a proof of key ownership for the given authority in the, given set. An example usage of this module is coupled with the, session historical module to prove that a given authority key is, tied to a given staking identity during a specific session. Proofs, of key ownership are necessary for submitting equivocation reports., NOTE: even though the API takes a `set_id` as parameter the current, implementations ignore this parameter and instead rely on this, method being called at the correct block height, i.e. any point at, which the given set id is live on-chain. Future implementations will, instead use indexed data through an offchain worker, not requiring, older states to be available.
       **/
      generateKeyOwnershipProof: AugmentedCall<ApiType, (set_id: u64 | AnyNumber | Uint8Array, authority_id: SpConsensusGrandpaAppPublic | string | Uint8Array) => Observable<Option<Bytes>>>;
      /**
       * Get the current GRANDPA authorities and weights. This should not change except, for when changes are scheduled and the corresponding delay has passed.,, When called at block B, it will return the set of authorities that should be, used to finalize descendants of this block (B+1, B+2, ...). The block B itself, is finalized by the authorities from block B-1.
       **/
      grandpaAuthorities: AugmentedCall<ApiType, () => Observable<Vec<ITuple<[SpConsensusGrandpaAppPublic, u64]>>>>;
      /**
       * Submits an unsigned extrinsic to report an equivocation. The caller, must provide the equivocation proof and a key ownership proof, (should be obtained using `generate_key_ownership_proof`). The, extrinsic will be unsigned and should only be accepted for local, authorship (not to be broadcast to the network). This method returns, `None` when creation of the extrinsic fails, e.g. if equivocation, reporting is disabled for the given runtime (i.e. this method is, hardcoded to return `None`). Only useful in an offchain context.
       **/
      submitReportEquivocationUnsignedExtrinsic: AugmentedCall<ApiType, (equivocation_proof: SpConsensusGrandpaEquivocationProof | { setId?: any; equivocation?: any } | string | Uint8Array, key_owner_proof: Bytes | string | Uint8Array) => Observable<Option<Null>>>;
      /**
       * Generic call
       **/
      [key: string]: DecoratedCallBase<ApiType>;
    };
    /** 0x37e397fc7c91f5e4/ */
    metadata: {
      /**
       * Returns the metadata of a runtime.
       **/
      metadata: AugmentedCall<ApiType, () => Observable<OpaqueMetadata>>;
      /**
       * Returns the metadata at a given version.,, If the given `version` isn't supported, this will return `None`., Use [`Self::metadata_versions`] to find out about supported metadata version of the runtime.
       **/
      metadataAtVersion: AugmentedCall<ApiType, (version: u32 | AnyNumber | Uint8Array) => Observable<Option<OpaqueMetadata>>>;
      /**
       * Returns the supported metadata versions.,, This can be used to call `metadata_at_version`.
       **/
      metadataVersions: AugmentedCall<ApiType, () => Observable<Vec<u32>>>;
      /**
       * Generic call
       **/
      [key: string]: DecoratedCallBase<ApiType>;
    };
    /** 0x6fd7c327202e4a8d/ */
    mixnetApi: {
      /**
       * Get the mixnode set for the current session.
       **/
      currentMixnodes: AugmentedCall<ApiType, () => Observable<Result<Vec<SpMixnetMixnode>, SpMixnetMixnodesErr>>>;
      /**
       * Try to register a mixnode for the next session.,, If a registration extrinsic is submitted, `true` is returned. The caller should avoid, calling `maybe_register` again for a few blocks, to give the submitted extrinsic a, chance to get included.,, With the above exception, `maybe_register` is designed to be called every block. Most, of the time it will not do anything, for example:,, - If it is not an appropriate time to submit a registration extrinsic., - If the local node has already registered a mixnode for the next session., - If the local node is not permitted to register a mixnode for the next session.,, `session_index` should match `session_status().current_index`; if it does not, `false`, is returned immediately.
       **/
      maybeRegister: AugmentedCall<ApiType, (session_index: u32 | AnyNumber | Uint8Array, mixnode: SpMixnetMixnode | { kxPublic?: any; peerId?: any; externalAddresses?: any } | string | Uint8Array) => Observable<bool>>;
      /**
       * Get the mixnode set for the previous session.
       **/
      prevMixnodes: AugmentedCall<ApiType, () => Observable<Result<Vec<SpMixnetMixnode>, SpMixnetMixnodesErr>>>;
      /**
       * Get the index and phase of the current session.
       **/
      sessionStatus: AugmentedCall<ApiType, () => Observable<SpMixnetSessionStatus>>;
      /**
       * Generic call
       **/
      [key: string]: DecoratedCallBase<ApiType>;
    };
    /** 0x91d5df18b0d2cf58/ */
    mmrApi: {
      /**
       * Generates a proof that the `prev_block_number` is part of the canonical chain at, `best_known_block_number`.
       **/
      generateAncestryProof: AugmentedCall<ApiType, (prev_block_number: u32 | AnyNumber | Uint8Array, best_known_block_number: Option<u32> | null | Uint8Array | u32 | AnyNumber) => Observable<Result<SpMmrPrimitivesAncestryProof, SpMmrPrimitivesError>>>;
      /**
       * Generate MMR proof for a series of block numbers. If `best_known_block_number = Some(n)`,, use historical MMR state at given block height `n`. Else, use current MMR state.
       **/
      generateProof: AugmentedCall<ApiType, (block_numbers: Vec<u32> | (u32 | AnyNumber | Uint8Array)[], best_known_block_number: Option<u32> | null | Uint8Array | u32 | AnyNumber) => Observable<Result<ITuple<[Vec<Bytes>, SpMmrPrimitivesLeafProof]>, SpMmrPrimitivesError>>>;
      /**
       * Return the number of MMR blocks in the chain.
       **/
      mmrLeafCount: AugmentedCall<ApiType, () => Observable<Result<u64, SpMmrPrimitivesError>>>;
      /**
       * Return the on-chain MMR root hash.
       **/
      mmrRoot: AugmentedCall<ApiType, () => Observable<Result<H256, SpMmrPrimitivesError>>>;
      /**
       * Verify MMR proof against on-chain MMR for a batch of leaves.,, Note this function will use on-chain MMR root hash and check if the proof matches the hash., Note, the leaves should be sorted such that corresponding leaves and leaf indices have the, same position in both the `leaves` vector and the `leaf_indices` vector contained in the [LeafProof]
       **/
      verifyProof: AugmentedCall<ApiType, (leaves: Vec<Bytes> | (Bytes | string | Uint8Array)[], proof: SpMmrPrimitivesLeafProof | { leafIndices?: any; leafCount?: any; items?: any } | string | Uint8Array) => Observable<Result<Null, SpMmrPrimitivesError>>>;
      /**
       * Verify MMR proof against given root hash for a batch of leaves.,, Note this function does not require any on-chain storage - the, proof is verified against given MMR root hash.,, Note, the leaves should be sorted such that corresponding leaves and leaf indices have the, same position in both the `leaves` vector and the `leaf_indices` vector contained in the [LeafProof]
       **/
      verifyProofStateless: AugmentedCall<ApiType, (root: H256 | string | Uint8Array, leaves: Vec<Bytes> | (Bytes | string | Uint8Array)[], proof: SpMmrPrimitivesLeafProof | { leafIndices?: any; leafCount?: any; items?: any } | string | Uint8Array) => Observable<Result<Null, SpMmrPrimitivesError>>>;
      /**
       * Generic call
       **/
      [key: string]: DecoratedCallBase<ApiType>;
    };
    /** 0x899a250cbe84f250/ */
    nftsApi: {
      /**
       * 
       **/
      attribute: AugmentedCall<ApiType, (collection: u32 | AnyNumber | Uint8Array, item: u32 | AnyNumber | Uint8Array, key: Bytes | string | Uint8Array) => Observable<Option<Bytes>>>;
      /**
       * 
       **/
      collectionAttribute: AugmentedCall<ApiType, (collection: u32 | AnyNumber | Uint8Array, key: Bytes | string | Uint8Array) => Observable<Option<Bytes>>>;
      /**
       * 
       **/
      collectionOwner: AugmentedCall<ApiType, (collection: u32 | AnyNumber | Uint8Array) => Observable<Option<AccountId32>>>;
      /**
       * 
       **/
      customAttribute: AugmentedCall<ApiType, (account: AccountId32 | string | Uint8Array, collection: u32 | AnyNumber | Uint8Array, item: u32 | AnyNumber | Uint8Array, key: Bytes | string | Uint8Array) => Observable<Option<Bytes>>>;
      /**
       * 
       **/
      owner: AugmentedCall<ApiType, (collection: u32 | AnyNumber | Uint8Array, item: u32 | AnyNumber | Uint8Array) => Observable<Option<AccountId32>>>;
      /**
       * 
       **/
      systemAttribute: AugmentedCall<ApiType, (collection: u32 | AnyNumber | Uint8Array, item: Option<u32> | null | Uint8Array | u32 | AnyNumber, key: Bytes | string | Uint8Array) => Observable<Option<Bytes>>>;
      /**
       * Generic call
       **/
      [key: string]: DecoratedCallBase<ApiType>;
    };
    /** 0x17a6bc0d0062aeb3/ */
    nominationPoolsApi: {
      /**
       * Returns the equivalent points of `new_funds` for a given pool.
       **/
      balanceToPoints: AugmentedCall<ApiType, (pool_id: u32 | AnyNumber | Uint8Array, new_funds: u128 | AnyNumber | Uint8Array) => Observable<u128>>;
      /**
       * Returns true if the delegated funds of the pool `member` needs migration.,, Once a pool has successfully migrated to the strategy, [`DelegateStake`](pallet_nomination_pools::adapter::DelegateStake), the funds of the, member can be migrated from pool account to the member's account. Use, [`migrate_delegation`](pallet_nomination_pools::Call::migrate_delegation), to migrate the funds of the pool member.
       **/
      memberNeedsDelegateMigration: AugmentedCall<ApiType, (member: AccountId32 | string | Uint8Array) => Observable<bool>>;
      /**
       * Returns the pending slash for a given pool member.,, If pending slash of the member exceeds `ExistentialDeposit`, it can be reported on, chain.
       **/
      memberPendingSlash: AugmentedCall<ApiType, (member: AccountId32 | string | Uint8Array) => Observable<u128>>;
      /**
       * Returns the total contribution of a pool member including any balance that is unbonding.
       **/
      memberTotalBalance: AugmentedCall<ApiType, (who: AccountId32 | string | Uint8Array) => Observable<u128>>;
      /**
       * Returns the pending rewards for the member that the AccountId was given for.
       **/
      pendingRewards: AugmentedCall<ApiType, (who: AccountId32 | string | Uint8Array) => Observable<u128>>;
      /**
       * Returns the equivalent balance of `points` for a given pool.
       **/
      pointsToBalance: AugmentedCall<ApiType, (pool_id: u32 | AnyNumber | Uint8Array, points: u128 | AnyNumber | Uint8Array) => Observable<u128>>;
      /**
       * Returns the bonded account and reward account associated with the pool_id.
       **/
      poolAccounts: AugmentedCall<ApiType, (pool_id: u32 | AnyNumber | Uint8Array) => Observable<ITuple<[AccountId32, AccountId32]>>>;
      /**
       * Total balance contributed to the pool.
       **/
      poolBalance: AugmentedCall<ApiType, (pool_id: u32 | AnyNumber | Uint8Array) => Observable<u128>>;
      /**
       * Returns true if the pool with `pool_id` needs migration.,, This can happen when the `pallet-nomination-pools` has switched to using strategy, [`DelegateStake`](pallet_nomination_pools::adapter::DelegateStake) but the pool, still has funds that were staked using the older strategy, [TransferStake](pallet_nomination_pools::adapter::TransferStake). Use, [`migrate_pool_to_delegate_stake`](pallet_nomination_pools::Call::migrate_pool_to_delegate_stake), to migrate the pool.
       **/
      poolNeedsDelegateMigration: AugmentedCall<ApiType, (pool_id: u32 | AnyNumber | Uint8Array) => Observable<bool>>;
      /**
       * Returns the pending slash for a given pool.
       **/
      poolPendingSlash: AugmentedCall<ApiType, (pool_id: u32 | AnyNumber | Uint8Array) => Observable<u128>>;
      /**
       * Generic call
       **/
      [key: string]: DecoratedCallBase<ApiType>;
    };
    /** 0xf78b278be53f454c/ */
    offchainWorkerApi: {
      /**
       * Starts the off-chain task for given block header.
       **/
      offchainWorker: AugmentedCall<ApiType, (header: SpRuntimeHeader | { parentHash?: any; number?: any; stateRoot?: any; extrinsicsRoot?: any; digest?: any } | string | Uint8Array) => Observable<Null>>;
      /**
       * Generic call
       **/
      [key: string]: DecoratedCallBase<ApiType>;
    };
    /** 0x6ef953004ba30e59/ */
    oracleApi: {
      /**
       * Retrieves all oracle values for a specific provider.,, Returns a vector of key-value pairs containing all available oracle data, from the specified provider. Each pair contains the oracle key and its, corresponding value (if available).,, # Parameters,, * `provider_id`: The oracle provider identifier,, # Returns,, Returns a vector of `(Key, Option<Value>)` pairs representing all oracle, data available from the specified provider.
       **/
      getAllValues: AugmentedCall<ApiType, (provider_id: u32 | AnyNumber | Uint8Array) => Observable<Vec<ITuple<[u32, Option<u128>]>>>>;
      /**
       * Retrieves a specific oracle value for a given provider and key.,, Returns the current oracle value if available, or `None` if no data exists, for the specified provider and key combination.,, # Parameters,, * `provider_id`: The oracle provider identifier, * `key`: The oracle key identifying the data feed,, # Returns,, Returns `Some(value)` if oracle data exists, `None` otherwise.
       **/
      getValue: AugmentedCall<ApiType, (provider_id: u32 | AnyNumber | Uint8Array, key: u32 | AnyNumber | Uint8Array) => Observable<Option<u128>>>;
      /**
       * Generic call
       **/
      [key: string]: DecoratedCallBase<ApiType>;
    };
    /** 0x8c403e5c4a9fd442/ */
    reviveApi: {
      /**
       * Get the account id associated to this H160 address.
       * @deprecated Use the versioned equivalent `account_id_versioned` if available on your runtime
       **/
      accountId: AugmentedCall<ApiType, (address: H160 | string | Uint8Array) => Observable<AccountId32>>;
      /**
       * 
       **/
      accountIdVersioned: AugmentedCall<ApiType, (input: PalletReviveTypesRuntimeApiPayloadsAccountIdAccountIdVersionedInputPayload | { V1: any } | string | Uint8Array) => Observable<PalletReviveTypesRuntimeApiPayloadsAccountIdAccountIdVersionedOutputPayload>>;
      /**
       * Get the H160 address associated to this account id
       * @deprecated Use the versioned equivalent `address_versioned` if available on your runtime
       **/
      address: AugmentedCall<ApiType, (account_id: AccountId32 | string | Uint8Array) => Observable<H160>>;
      /**
       * 
       **/
      addressVersioned: AugmentedCall<ApiType, (input: PalletReviveTypesRuntimeApiPayloadsAddressAddressVersionedInputPayload | { V1: any } | string | Uint8Array) => Observable<PalletReviveTypesRuntimeApiPayloadsAddressAddressVersionedOutputPayload>>;
      /**
       * Returns the free balance of the given `[H160]` address, using EVM decimals.
       * @deprecated Use the versioned equivalent `balance_versioned` if available on your runtime
       **/
      balance: AugmentedCall<ApiType, (address: H160 | string | Uint8Array) => Observable<U256>>;
      /**
       * 
       **/
      balanceVersioned: AugmentedCall<ApiType, (input: PalletReviveTypesRuntimeApiPayloadsBalanceBalanceVersionedInputPayload | { V1: any } | string | Uint8Array) => Observable<PalletReviveTypesRuntimeApiPayloadsBalanceBalanceVersionedOutputPayload>>;
      /**
       * The address of the validator that produced the current block.
       * @deprecated Use the versioned equivalent `block_author_versioned` if available on your runtime
       **/
      blockAuthor: AugmentedCall<ApiType, () => Observable<H160>>;
      /**
       * 
       **/
      blockAuthorVersioned: AugmentedCall<ApiType, (input: PalletReviveTypesRuntimeApiPayloadsBlockAuthorBlockAuthorVersionedInputPayload | 'V1' | number | Uint8Array) => Observable<PalletReviveTypesRuntimeApiPayloadsBlockAuthorBlockAuthorVersionedOutputPayload>>;
      /**
       * Returns the block gas limit.
       * @deprecated Use the versioned equivalent `block_gas_limit_versioned` if available on your runtime
       **/
      blockGasLimit: AugmentedCall<ApiType, () => Observable<U256>>;
      /**
       * 
       **/
      blockGasLimitVersioned: AugmentedCall<ApiType, (input: PalletReviveTypesRuntimeApiPayloadsBlockGasLimitBlockGasLimitVersionedInputPayload | 'V1' | number | Uint8Array) => Observable<PalletReviveTypesRuntimeApiPayloadsBlockGasLimitBlockGasLimitVersionedOutputPayload>>;
      /**
       * Perform a call from a specified account to a given contract.,, See [`crate::Pallet::bare_call`].
       * @deprecated Use the versioned equivalent `call_versioned` if available on your runtime
       **/
      call: AugmentedCall<ApiType, (origin: AccountId32 | string | Uint8Array, dest: H160 | string | Uint8Array, value: u128 | AnyNumber | Uint8Array, gas_limit: Option<SpWeightsWeightV2Weight> | null | Uint8Array | SpWeightsWeightV2Weight | { refTime?: any; proofSize?: any } | string, storage_deposit_limit: Option<u128> | null | Uint8Array | u128 | AnyNumber, input_data: Bytes | string | Uint8Array) => Observable<PalletReviveTypesRuntimeApiTypesContractContractResultV1ExecReturnValueV1>>;
      /**
       * 
       **/
      callVersioned: AugmentedCall<ApiType, (input: PalletReviveTypesRuntimeApiPayloadsCallCallVersionedInputPayload | { V1: any } | string | Uint8Array) => Observable<PalletReviveTypesRuntimeApiPayloadsCallCallVersionedOutputPayload>>;
      /**
       * The code at the specified address taking pre-compiles into account.
       * @deprecated Use the versioned equivalent `code_versioned` if available on your runtime
       **/
      code: AugmentedCall<ApiType, (address: H160 | string | Uint8Array) => Observable<Bytes>>;
      /**
       * 
       **/
      codeVersioned: AugmentedCall<ApiType, (input: PalletReviveTypesRuntimeApiPayloadsCodeCodeVersionedInputPayload | { V1: any } | string | Uint8Array) => Observable<PalletReviveTypesRuntimeApiPayloadsCodeCodeVersionedOutputPayload>>;
      /**
       * Returns the current ETH block.,, This is one block behind the substrate block.
       * @deprecated Use the versioned equivalent `eth_block_versioned` if available on your runtime
       **/
      ethBlock: AugmentedCall<ApiType, () => Observable<PalletReviveTypesRuntimeApiTypesBlockBlockV1>>;
      /**
       * Returns the ETH block hash for the given block number.
       * @deprecated Use the versioned equivalent `eth_block_hash_versioned` if available on your runtime
       **/
      ethBlockHash: AugmentedCall<ApiType, (number: U256 | AnyNumber | Uint8Array) => Observable<Option<H256>>>;
      /**
       * 
       **/
      ethBlockHashVersioned: AugmentedCall<ApiType, (input: PalletReviveTypesRuntimeApiPayloadsBlockHashBlockHashVersionedInputPayload | { V1: any } | string | Uint8Array) => Observable<PalletReviveTypesRuntimeApiPayloadsBlockHashBlockHashVersionedOutputPayload>>;
      /**
       * 
       **/
      ethBlockVersioned: AugmentedCall<ApiType, (input: PalletReviveTypesRuntimeApiPayloadsEthBlockBlockVersionedInputPayload | 'V1' | number | Uint8Array) => Observable<PalletReviveTypesRuntimeApiPayloadsEthBlockBlockVersionedOutputPayload>>;
      /**
       * Estimates the amount of gas that a transactions requires.,, This function estimates the gas of the transaction according to the same binary search, algorithm that's implemented in Geth. It stops when with an acceptable error ratio of, 1.5% so that the algorithm terminates early.
       * @deprecated Use the versioned equivalent `eth_estimate_gas_versioned` if available on your runtime
       **/
      ethEstimateGas: AugmentedCall<ApiType, (tx: PalletReviveTypesRuntimeApiTypesTransactionGenericTransactionV1 | { accessList?: any; authorizationList?: any; blobVersionedHashes?: any; blobs?: any; chainId?: any; from?: any; gas?: any; gasPrice?: any; input?: any; maxFeePerBlobGas?: any; maxFeePerGas?: any; maxPriorityFeePerGas?: any; nonce?: any; to?: any; r_type?: any; value?: any } | string | Uint8Array, config: PalletReviveTypesRuntimeApiTypesDryRunDryRunConfigV1 | { timestampOverride?: any; performBalanceChecks?: any; stateOverrides?: any } | string | Uint8Array) => Observable<Result<U256, PalletRevivePrimitivesEthTransactError>>>;
      /**
       * 
       **/
      ethEstimateGasVersioned: AugmentedCall<ApiType, (input: PalletReviveTypesRuntimeApiPayloadsEthEstimateGasEstimateGasVersionedInputPayload | { V1: any } | string | Uint8Array) => Observable<Result<PalletReviveTypesRuntimeApiPayloadsEthEstimateGasEstimateGasVersionedOutputPayload, PalletRevivePrimitivesEthTransactError>>>;
      /**
       * Return the pre-dispatch weight booked for the signed Ethereum transaction payload.
       * @deprecated Use the versioned equivalent `eth_pre_dispatch_weight_versioned` if available on your runtime
       **/
      ethPreDispatchWeight: AugmentedCall<ApiType, (tx: Bytes | string | Uint8Array) => Observable<Result<SpWeightsWeightV2Weight, PalletRevivePrimitivesEthTransactError>>>;
      /**
       * 
       **/
      ethPreDispatchWeightVersioned: AugmentedCall<ApiType, (input: PalletReviveTypesRuntimeApiPayloadsEthPreDispatchWeightPreDispatchWeightVersionedInputPayload | { V1: any } | string | Uint8Array) => Observable<Result<PalletReviveTypesRuntimeApiPayloadsEthPreDispatchWeightPreDispatchWeightVersionedOutputPayload, PalletRevivePrimitivesEthTransactError>>>;
      /**
       * The details needed to reconstruct the receipt information offchain.,, # Note,, Each entry corresponds to the appropriate Ethereum transaction in the current block.
       * @deprecated Use the versioned equivalent `eth_receipt_data_versioned` if available on your runtime
       **/
      ethReceiptData: AugmentedCall<ApiType, () => Observable<Vec<PalletReviveTypesRuntimeApiTypesReceiptReceiptGasInfoV1>>>;
      /**
       * 
       **/
      ethReceiptDataVersioned: AugmentedCall<ApiType, (input: PalletReviveTypesRuntimeApiPayloadsReceiptDataReceiptDataVersionedInputPayload | 'V1' | number | Uint8Array) => Observable<PalletReviveTypesRuntimeApiPayloadsReceiptDataReceiptDataVersionedOutputPayload>>;
      /**
       * Perform an Ethereum call.,, See [`crate::Pallet::dry_run_eth_transact`]
       * @deprecated Use the versioned equivalent `eth_transact_versioned` if available on your runtime
       **/
      ethTransact: AugmentedCall<ApiType, (tx: PalletReviveTypesRuntimeApiTypesTransactionGenericTransactionV1 | { accessList?: any; authorizationList?: any; blobVersionedHashes?: any; blobs?: any; chainId?: any; from?: any; gas?: any; gasPrice?: any; input?: any; maxFeePerBlobGas?: any; maxFeePerGas?: any; maxPriorityFeePerGas?: any; nonce?: any; to?: any; r_type?: any; value?: any } | string | Uint8Array) => Observable<Result<PalletReviveTypesRuntimeApiTypesDryRunEthTransactInfoV1, PalletRevivePrimitivesEthTransactError>>>;
      /**
       * 
       **/
      ethTransactVersioned: AugmentedCall<ApiType, (input: PalletReviveTypesRuntimeApiPayloadsEthTransactTransactVersionedInputPayload | { V1: any } | string | Uint8Array) => Observable<Result<PalletReviveTypesRuntimeApiPayloadsEthTransactTransactVersionedOutputPayload, PalletRevivePrimitivesEthTransactError>>>;
      /**
       * Perform an Ethereum call.,, See [`crate::Pallet::dry_run_eth_transact`]
       * @deprecated Use the versioned equivalent `eth_transact_versioned` if available on your runtime
       **/
      ethTransactWithConfig: AugmentedCall<ApiType, (tx: PalletReviveTypesRuntimeApiTypesTransactionGenericTransactionV1 | { accessList?: any; authorizationList?: any; blobVersionedHashes?: any; blobs?: any; chainId?: any; from?: any; gas?: any; gasPrice?: any; input?: any; maxFeePerBlobGas?: any; maxFeePerGas?: any; maxPriorityFeePerGas?: any; nonce?: any; to?: any; r_type?: any; value?: any } | string | Uint8Array, config: PalletReviveTypesRuntimeApiTypesDryRunDryRunConfigV1 | { timestampOverride?: any; performBalanceChecks?: any; stateOverrides?: any } | string | Uint8Array) => Observable<Result<PalletReviveTypesRuntimeApiTypesDryRunEthTransactInfoV1, PalletRevivePrimitivesEthTransactError>>>;
      /**
       * Returns the gas price.
       * @deprecated Use the versioned equivalent `gas_price_versioned` if available on your runtime
       **/
      gasPrice: AugmentedCall<ApiType, () => Observable<U256>>;
      /**
       * 
       **/
      gasPriceVersioned: AugmentedCall<ApiType, (input: PalletReviveTypesRuntimeApiPayloadsGasPriceGasPriceVersionedInputPayload | 'V1' | number | Uint8Array) => Observable<PalletReviveTypesRuntimeApiPayloadsGasPriceGasPriceVersionedOutputPayload>>;
      /**
       * Query a given storage key in a given contract.,, Returns `Ok(Some(Vec<u8>))` if the storage value exists under the given key in the, specified account and `Ok(None)` if it doesn't. If the account specified by the address, doesn't exist, or doesn't have a contract then `Err` is returned.
       * @deprecated Use the versioned equivalent `get_storage_versioned` if available on your runtime
       **/
      getStorage: AugmentedCall<ApiType, (address: H160 | string | Uint8Array, key: U8aFixed | string | Uint8Array) => Observable<Result<Option<Bytes>, PalletRevivePrimitivesContractAccessError>>>;
      /**
       * Query a given variable-sized storage key in a given contract.,, Returns `Ok(Some(Vec<u8>))` if the storage value exists under the given key in the, specified account and `Ok(None)` if it doesn't. If the account specified by the address, doesn't exist, or doesn't have a contract then `Err` is returned.
       * @deprecated Use the versioned equivalent `get_storage_versioned` if available on your runtime
       **/
      getStorageVarKey: AugmentedCall<ApiType, (address: H160 | string | Uint8Array, key: Bytes | string | Uint8Array) => Observable<Result<Option<Bytes>, PalletRevivePrimitivesContractAccessError>>>;
      /**
       * 
       **/
      getStorageVersioned: AugmentedCall<ApiType, (input: PalletReviveTypesRuntimeApiPayloadsGetStorageGetStorageVersionedInputPayload | { V1: any } | string | Uint8Array) => Observable<Result<PalletReviveTypesRuntimeApiPayloadsGetStorageGetStorageVersionedOutputPayload, PalletRevivePrimitivesContractAccessError>>>;
      /**
       * Instantiate a new contract.,, See `[crate::Pallet::bare_instantiate]`.
       * @deprecated Use the versioned equivalent `instantiate_versioned` if available on your runtime
       **/
      instantiate: AugmentedCall<ApiType, (origin: AccountId32 | string | Uint8Array, value: u128 | AnyNumber | Uint8Array, gas_limit: Option<SpWeightsWeightV2Weight> | null | Uint8Array | SpWeightsWeightV2Weight | { refTime?: any; proofSize?: any } | string, storage_deposit_limit: Option<u128> | null | Uint8Array | u128 | AnyNumber, code: PalletReviveTypesRuntimeApiTypesContractCodeV1 | { Upload: any } | { Existing: any } | string | Uint8Array, data: Bytes | string | Uint8Array, salt: Option<U8aFixed> | null | Uint8Array | U8aFixed | string) => Observable<PalletReviveTypesRuntimeApiTypesContractContractResultV1InstantiateReturnValueV1>>;
      /**
       * 
       **/
      instantiateVersioned: AugmentedCall<ApiType, (input: PalletReviveTypesRuntimeApiPayloadsInstantiateInstantiateVersionedInputPayload | { V1: any } | string | Uint8Array) => Observable<PalletReviveTypesRuntimeApiPayloadsInstantiateInstantiateVersionedOutputPayload>>;
      /**
       * Returns the block gas limit as calculated from the weights.
       * @deprecated Use the versioned equivalent `max_extrinsic_weight_in_gas_versioned` if available on your runtime
       **/
      maxExtrinsicWeightInGas: AugmentedCall<ApiType, () => Observable<U256>>;
      /**
       * 
       **/
      maxExtrinsicWeightInGasVersioned: AugmentedCall<ApiType, (input: PalletReviveTypesRuntimeApiPayloadsMaxExtrinsicWeightInGasMaxExtrinsicWeightInGasVersionedInputPayload | 'V1' | number | Uint8Array) => Observable<PalletReviveTypesRuntimeApiPayloadsMaxExtrinsicWeightInGasMaxExtrinsicWeightInGasVersionedOutputPayload>>;
      /**
       * Construct the new balance and dust components of this EVM balance.
       * @deprecated Use the versioned equivalent `new_balance_with_dust_versioned` if available on your runtime
       **/
      newBalanceWithDust: AugmentedCall<ApiType, (balance: U256 | AnyNumber | Uint8Array) => Observable<Result<ITuple<[u128, u32]>, PalletRevivePrimitivesBalanceConversionError>>>;
      /**
       * 
       **/
      newBalanceWithDustVersioned: AugmentedCall<ApiType, (input: PalletReviveTypesRuntimeApiPayloadsNewBalanceWithDustNewBalanceWithDustVersionedInputPayload | { V1: any } | string | Uint8Array) => Observable<Result<PalletReviveTypesRuntimeApiPayloadsNewBalanceWithDustNewBalanceWithDustVersionedOutputPayload, PalletRevivePrimitivesBalanceConversionError>>>;
      /**
       * Returns the nonce of the given `[H160]` address.
       * @deprecated Use the versioned equivalent `nonce_versioned` if available on your runtime
       **/
      nonce: AugmentedCall<ApiType, (address: H160 | string | Uint8Array) => Observable<u32>>;
      /**
       * 
       **/
      nonceVersioned: AugmentedCall<ApiType, (input: PalletReviveTypesRuntimeApiPayloadsNonceNonceVersionedInputPayload | { V1: any } | string | Uint8Array) => Observable<PalletReviveTypesRuntimeApiPayloadsNonceNonceVersionedOutputPayload>>;
      /**
       * The address used to call the runtime's pallets dispatchables
       * @deprecated Use the versioned equivalent `runtime_pallets_address_versioned` if available on your runtime
       **/
      runtimePalletsAddress: AugmentedCall<ApiType, () => Observable<H160>>;
      /**
       * 
       **/
      runtimePalletsAddressVersioned: AugmentedCall<ApiType, (input: PalletReviveTypesRuntimeApiPayloadsRuntimePalletsAddressRuntimePalletsAddressVersionedInputPayload | 'V1' | number | Uint8Array) => Observable<PalletReviveTypesRuntimeApiPayloadsRuntimePalletsAddressRuntimePalletsAddressVersionedOutputPayload>>;
      /**
       * Traces the execution of an entire block and returns call traces.,, This is intended to be called through `state_call` to replay the block from the, parent block.,, See eth-rpc `debug_traceBlockByNumber` for usage.
       * @deprecated Use the versioned equivalent `trace_block_versioned` if available on your runtime
       **/
      traceBlock: AugmentedCall<ApiType, (block: SpRuntimeBlock | { header?: any; extrinsics?: any } | string | Uint8Array, config: PalletReviveTypesRuntimeApiTypesTracerTracerTypeV1 | { CallTracer: any } | { PrestateTracer: any } | { ExecutionTracer: any } | string | Uint8Array) => Observable<Vec<ITuple<[u32, PalletReviveTypesRuntimeApiTypesTracesTraceV1]>>>>;
      /**
       * 
       **/
      traceBlockVersioned: AugmentedCall<ApiType, (input: PalletReviveTypesRuntimeApiPayloadsTraceBlockTraceBlockVersionedInputPayload | { V1: any } | { V2: any } | string | Uint8Array) => Observable<PalletReviveTypesRuntimeApiPayloadsTraceBlockTraceBlockVersionedOutputPayload>>;
      /**
       * Dry run and return the trace of the given call.,, See eth-rpc `debug_traceCall` for usage.
       * @deprecated Use the versioned equivalent `trace_call_versioned` if available on your runtime
       **/
      traceCall: AugmentedCall<ApiType, (tx: PalletReviveTypesRuntimeApiTypesTransactionGenericTransactionV1 | { accessList?: any; authorizationList?: any; blobVersionedHashes?: any; blobs?: any; chainId?: any; from?: any; gas?: any; gasPrice?: any; input?: any; maxFeePerBlobGas?: any; maxFeePerGas?: any; maxPriorityFeePerGas?: any; nonce?: any; to?: any; r_type?: any; value?: any } | string | Uint8Array, config: PalletReviveTypesRuntimeApiTypesTracerTracerTypeV1 | { CallTracer: any } | { PrestateTracer: any } | { ExecutionTracer: any } | string | Uint8Array) => Observable<Result<PalletReviveTypesRuntimeApiTypesTracesTraceV1, PalletRevivePrimitivesEthTransactError>>>;
      /**
       * 
       **/
      traceCallVersioned: AugmentedCall<ApiType, (input: PalletReviveTypesRuntimeApiPayloadsTraceCallTraceCallVersionedInputPayload | { V1: any } | { V2: any } | string | Uint8Array) => Observable<Result<PalletReviveTypesRuntimeApiPayloadsTraceCallTraceCallVersionedOutputPayload, PalletRevivePrimitivesEthTransactError>>>;
      /**
       * Dry run and return the trace of the given call with additional configuration.,, Like [`Self::trace_call`], but accepts a [`TracingConfigV1`] that can carry state, overrides. The config must be the **last argument** for backwards compatibility.
       * @deprecated Use the versioned equivalent `trace_call_versioned` if available on your runtime
       **/
      traceCallWithConfig: AugmentedCall<ApiType, (tx: PalletReviveTypesRuntimeApiTypesTransactionGenericTransactionV1 | { accessList?: any; authorizationList?: any; blobVersionedHashes?: any; blobs?: any; chainId?: any; from?: any; gas?: any; gasPrice?: any; input?: any; maxFeePerBlobGas?: any; maxFeePerGas?: any; maxPriorityFeePerGas?: any; nonce?: any; to?: any; r_type?: any; value?: any } | string | Uint8Array, tracer_type: PalletReviveTypesRuntimeApiTypesTracerTracerTypeV1 | { CallTracer: any } | { PrestateTracer: any } | { ExecutionTracer: any } | string | Uint8Array, config: PalletReviveTypesRuntimeApiTypesStateOverridesTracingConfigV1 | { stateOverrides?: any } | string | Uint8Array) => Observable<Result<PalletReviveTypesRuntimeApiTypesTracesTraceV1, PalletRevivePrimitivesEthTransactError>>>;
      /**
       * Traces the execution of a specific transaction within a block.,, This is intended to be called through `state_call` to replay the block from the, parent hash up to the transaction.,, See eth-rpc `debug_traceTransaction` for usage.
       * @deprecated Use the versioned equivalent `trace_tx_versioned` if available on your runtime
       **/
      traceTx: AugmentedCall<ApiType, (block: SpRuntimeBlock | { header?: any; extrinsics?: any } | string | Uint8Array, tx_index: u32 | AnyNumber | Uint8Array, config: PalletReviveTypesRuntimeApiTypesTracerTracerTypeV1 | { CallTracer: any } | { PrestateTracer: any } | { ExecutionTracer: any } | string | Uint8Array) => Observable<Option<PalletReviveTypesRuntimeApiTypesTracesTraceV1>>>;
      /**
       * 
       **/
      traceTxVersioned: AugmentedCall<ApiType, (input: PalletReviveTypesRuntimeApiPayloadsTraceTxTraceTxVersionedInputPayload | { V1: any } | { V2: any } | string | Uint8Array) => Observable<PalletReviveTypesRuntimeApiPayloadsTraceTxTraceTxVersionedOutputPayload>>;
      /**
       * Upload new code without instantiating a contract from it.,, See [`crate::Pallet::bare_upload_code`].
       * @deprecated Use the versioned equivalent `upload_code_versioned` if available on your runtime
       **/
      uploadCode: AugmentedCall<ApiType, (origin: AccountId32 | string | Uint8Array, code: Bytes | string | Uint8Array, storage_deposit_limit: Option<u128> | null | Uint8Array | u128 | AnyNumber) => Observable<Result<PalletReviveTypesRuntimeApiTypesUploadCodeUploadReturnValueV1, SpRuntimeDispatchError>>>;
      /**
       * 
       **/
      uploadCodeVersioned: AugmentedCall<ApiType, (input: PalletReviveTypesRuntimeApiPayloadsUploadCodeUploadCodeVersionedInputPayload | { V1: any } | string | Uint8Array) => Observable<Result<PalletReviveTypesRuntimeApiPayloadsUploadCodeUploadCodeVersionedOutputPayload, SpRuntimeDispatchError>>>;
      /**
       * 
       **/
      versionDeclarations: AugmentedCall<ApiType, () => Observable<PalletReviveTypesRuntimeApiDeclarationReviveRuntimeApiVersionDeclarations>>;
      /**
       * Generic call
       **/
      [key: string]: DecoratedCallBase<ApiType>;
    };
    /** 0xccd9de6396c899ca/ */
    runtimeViewFunction: {
      /**
       * Execute a view function query.
       **/
      executeViewFunction: AugmentedCall<ApiType, (query_id: FrameSupportViewFunctionsViewFunctionId | { prefix?: any; suffix?: any } | string | Uint8Array, input: Bytes | string | Uint8Array) => Observable<Result<Bytes, FrameSupportViewFunctionsViewFunctionDispatchError>>>;
      /**
       * Generic call
       **/
      [key: string]: DecoratedCallBase<ApiType>;
    };
    /** 0xab3c0572291feb8b/ */
    sessionKeys: {
      /**
       * Decode the given public session keys.,, Returns the list of public raw public keys + key type.
       **/
      decodeSessionKeys: AugmentedCall<ApiType, (encoded: Bytes | string | Uint8Array) => Observable<Option<Vec<ITuple<[Bytes, SpCoreCryptoKeyTypeId]>>>>>;
      /**
       * Generate a set of session keys with optionally using the given seed., The keys should be stored within the keystore exposed via runtime, externalities.,, The seed needs to be a valid `utf8` string.,, Returns the concatenated SCALE encoded public keys.
       **/
      generateSessionKeys: AugmentedCall<ApiType, (owner: Bytes | string | Uint8Array, seed: Option<Bytes> | null | Uint8Array | Bytes | string) => Observable<SpSessionRuntimeApiOpaqueGeneratedSessionKeys>>;
      /**
       * Generic call
       **/
      [key: string]: DecoratedCallBase<ApiType>;
    };
    /** 0x18ef58a3b67ba770/ */
    stakingApi: {
      /**
       * Returns the page count of exposures for a validator `account` in a given era.
       **/
      erasStakersPageCount: AugmentedCall<ApiType, (era: u32 | AnyNumber | Uint8Array, account: AccountId32 | string | Uint8Array) => Observable<u32>>;
      /**
       * Returns the nominations quota for a nominator with a given balance.
       **/
      nominationsQuota: AugmentedCall<ApiType, (balance: u128 | AnyNumber | Uint8Array) => Observable<u32>>;
      /**
       * Returns true if a validator `account` has pages to be claimed for the given era.
       **/
      pendingRewards: AugmentedCall<ApiType, (era: u32 | AnyNumber | Uint8Array, account: AccountId32 | string | Uint8Array) => Observable<bool>>;
      /**
       * Generic call
       **/
      [key: string]: DecoratedCallBase<ApiType>;
    };
    /** 0xd2bc9897eed08f15/ */
    taggedTransactionQueue: {
      /**
       * Validate the transaction.,, This method is invoked by the transaction pool to learn details about given transaction., The implementation should make sure to verify the correctness of the transaction, against current state. The given `block_hash` corresponds to the hash of the block, that is used as current state.,, Note that this call may be performed by the pool multiple times and transactions, might be verified in any possible order.
       **/
      validateTransaction: AugmentedCall<ApiType, (source: SpRuntimeTransactionValidityTransactionSource | 'InBlock' | 'Local' | 'External' | number | Uint8Array, tx: Extrinsic | IExtrinsic | string | Uint8Array, block_hash: H256 | string | Uint8Array) => Observable<Result<SpRuntimeTransactionValidityValidTransaction, SpRuntimeTransactionValidityTransactionValidityError>>>;
      /**
       * Generic call
       **/
      [key: string]: DecoratedCallBase<ApiType>;
    };
    /** 0x37c8bb1350a9a2a8/ */
    transactionPaymentApi: {
      /**
       * 
       **/
      queryFeeDetails: AugmentedCall<ApiType, (uxt: Extrinsic | IExtrinsic | string | Uint8Array, len: u32 | AnyNumber | Uint8Array) => Observable<PalletTransactionPaymentFeeDetails>>;
      /**
       * 
       **/
      queryInfo: AugmentedCall<ApiType, (uxt: Extrinsic | IExtrinsic | string | Uint8Array, len: u32 | AnyNumber | Uint8Array) => Observable<PalletTransactionPaymentRuntimeDispatchInfo>>;
      /**
       * 
       **/
      queryLengthToFee: AugmentedCall<ApiType, (length: u32 | AnyNumber | Uint8Array) => Observable<u128>>;
      /**
       * 
       **/
      queryWeightToFee: AugmentedCall<ApiType, (weight: SpWeightsWeightV2Weight | { refTime?: any; proofSize?: any } | string | Uint8Array) => Observable<u128>>;
      /**
       * Generic call
       **/
      [key: string]: DecoratedCallBase<ApiType>;
    };
    /** 0xf3ff14d5ab527059/ */
    transactionPaymentCallApi: {
      /**
       * Query fee details of a given encoded `Call`.
       **/
      queryCallFeeDetails: AugmentedCall<ApiType, (call: Call | IMethod | string | Uint8Array, len: u32 | AnyNumber | Uint8Array) => Observable<PalletTransactionPaymentFeeDetails>>;
      /**
       * Query information of a dispatch class, weight, and fee of a given encoded `Call`.
       **/
      queryCallInfo: AugmentedCall<ApiType, (call: Call | IMethod | string | Uint8Array, len: u32 | AnyNumber | Uint8Array) => Observable<PalletTransactionPaymentRuntimeDispatchInfo>>;
      /**
       * Query the output of the current `LengthToFee` given some input.
       **/
      queryLengthToFee: AugmentedCall<ApiType, (length: u32 | AnyNumber | Uint8Array) => Observable<u128>>;
      /**
       * Query the output of the current `WeightToFee` given some input.
       **/
      queryWeightToFee: AugmentedCall<ApiType, (weight: SpWeightsWeightV2Weight | { refTime?: any; proofSize?: any } | string | Uint8Array) => Observable<u128>>;
      /**
       * Generic call
       **/
      [key: string]: DecoratedCallBase<ApiType>;
    };
    /** 0x3b1cfc440dd23f49/ */
    transactionStorageApi: {
      /**
       * Indexed-transaction metadata for `block`.,, Returns an empty vector if the block has no indexed transactions or, is outside the retention window.
       **/
      indexedTransactions: AugmentedCall<ApiType, (block: u32 | AnyNumber | Uint8Array) => Observable<Vec<SpTransactionStorageProofIndexedTransactionInfo>>>;
      /**
       * Retention period for indexed data, in blocks.
       **/
      retentionPeriod: AugmentedCall<ApiType, () => Observable<u32>>;
      /**
       * Generic call
       **/
      [key: string]: DecoratedCallBase<ApiType>;
    };
  } // AugmentedCalls
} // declare module
