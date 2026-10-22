// Auto-generated via `yarn polkadot-types-from-defs`, do not edit
/* eslint-disable */

// import type lookup before we augment - in some environments
// this is required to allow for ambient/previous definitions
import '@polkadot/types/lookup';

import type { Data } from '@polkadot/types';
import type { BTreeMap, Bytes, Compact, Enum, Null, Option, Result, Struct, Text, U256, U8aFixed, Vec, bool, i32, i64, u128, u16, u32, u64, u8 } from '@polkadot/types-codec';
import type { ITuple } from '@polkadot/types-codec/types';
import type { Era } from '@polkadot/types/interfaces/extrinsics';
import type { AccountId32, Call, H160, H256, MultiAddress, PerU16, Perbill, Percent, Permill } from '@polkadot/types/interfaces/runtime';
import type { Event } from '@polkadot/types/interfaces/system';

declare module '@polkadot/types/lookup' {
  /** @name FrameSystemCall (9) */
  interface FrameSystemCall extends Enum {
    readonly isRemark: boolean;
    readonly asRemark: {
      readonly remark: Bytes;
    } & Struct;
    readonly isSetHeapPages: boolean;
    readonly asSetHeapPages: {
      readonly pages: u64;
    } & Struct;
    readonly isSetCode: boolean;
    readonly asSetCode: {
      readonly code: Bytes;
    } & Struct;
    readonly isSetCodeWithoutChecks: boolean;
    readonly asSetCodeWithoutChecks: {
      readonly code: Bytes;
    } & Struct;
    readonly isSetStorage: boolean;
    readonly asSetStorage: {
      readonly items: Vec<ITuple<[Bytes, Bytes]>>;
    } & Struct;
    readonly isKillStorage: boolean;
    readonly asKillStorage: {
      readonly keys_: Vec<Bytes>;
    } & Struct;
    readonly isKillPrefix: boolean;
    readonly asKillPrefix: {
      readonly prefix: Bytes;
      readonly subkeys: u32;
    } & Struct;
    readonly isRemarkWithEvent: boolean;
    readonly asRemarkWithEvent: {
      readonly remark: Bytes;
    } & Struct;
    readonly isAuthorizeUpgrade: boolean;
    readonly asAuthorizeUpgrade: {
      readonly codeHash: H256;
    } & Struct;
    readonly isAuthorizeUpgradeWithoutChecks: boolean;
    readonly asAuthorizeUpgradeWithoutChecks: {
      readonly codeHash: H256;
    } & Struct;
    readonly isApplyAuthorizedUpgrade: boolean;
    readonly asApplyAuthorizedUpgrade: {
      readonly code: Bytes;
    } & Struct;
    readonly type: 'Remark' | 'SetHeapPages' | 'SetCode' | 'SetCodeWithoutChecks' | 'SetStorage' | 'KillStorage' | 'KillPrefix' | 'RemarkWithEvent' | 'AuthorizeUpgrade' | 'AuthorizeUpgradeWithoutChecks' | 'ApplyAuthorizedUpgrade';
  }

  /** @name PalletUtilityCall (15) */
  interface PalletUtilityCall extends Enum {
    readonly isBatch: boolean;
    readonly asBatch: {
      readonly calls: Vec<Call>;
    } & Struct;
    readonly isAsDerivative: boolean;
    readonly asAsDerivative: {
      readonly index: u16;
      readonly call: Call;
    } & Struct;
    readonly isBatchAll: boolean;
    readonly asBatchAll: {
      readonly calls: Vec<Call>;
    } & Struct;
    readonly isDispatchAs: boolean;
    readonly asDispatchAs: {
      readonly asOrigin: PortaldotV3RuntimeOriginCaller;
      readonly call: Call;
    } & Struct;
    readonly isForceBatch: boolean;
    readonly asForceBatch: {
      readonly calls: Vec<Call>;
    } & Struct;
    readonly isWithWeight: boolean;
    readonly asWithWeight: {
      readonly call: Call;
      readonly weight: SpWeightsWeightV2Weight;
    } & Struct;
    readonly isIfElse: boolean;
    readonly asIfElse: {
      readonly main: Call;
      readonly fallback: Call;
    } & Struct;
    readonly isDispatchAsFallible: boolean;
    readonly asDispatchAsFallible: {
      readonly asOrigin: PortaldotV3RuntimeOriginCaller;
      readonly call: Call;
    } & Struct;
    readonly type: 'Batch' | 'AsDerivative' | 'BatchAll' | 'DispatchAs' | 'ForceBatch' | 'WithWeight' | 'IfElse' | 'DispatchAsFallible';
  }

  /** @name PortaldotV3RuntimeOriginCaller (18) */
  interface PortaldotV3RuntimeOriginCaller extends Enum {
    readonly isSystem: boolean;
    readonly asSystem: FrameSupportDispatchRawOrigin;
    readonly isTechnicalCommittee: boolean;
    readonly asTechnicalCommittee: PalletCollectiveRawOrigin;
    readonly isRevive: boolean;
    readonly asRevive: PalletReviveOrigin;
    readonly type: 'System' | 'TechnicalCommittee' | 'Revive';
  }

  /** @name FrameSupportDispatchRawOrigin (19) */
  interface FrameSupportDispatchRawOrigin extends Enum {
    readonly isRoot: boolean;
    readonly isSigned: boolean;
    readonly asSigned: AccountId32;
    readonly isNone: boolean;
    readonly isAuthorized: boolean;
    readonly type: 'Root' | 'Signed' | 'None' | 'Authorized';
  }

  /** @name PalletCollectiveRawOrigin (20) */
  interface PalletCollectiveRawOrigin extends Enum {
    readonly isMembers: boolean;
    readonly asMembers: ITuple<[u32, u32]>;
    readonly isMember: boolean;
    readonly asMember: AccountId32;
    readonly isPhantom: boolean;
    readonly type: 'Members' | 'Member' | 'Phantom';
  }

  /** @name PalletReviveOrigin (21) */
  interface PalletReviveOrigin extends Enum {
    readonly isEthTransaction: boolean;
    readonly asEthTransaction: AccountId32;
    readonly type: 'EthTransaction';
  }

  /** @name PortaldotV3RuntimeRuntime (22) */
  type PortaldotV3RuntimeRuntime = Null;

  /** @name SpWeightsWeightV2Weight (23) */
  interface SpWeightsWeightV2Weight extends Struct {
    readonly refTime: Compact<u64>;
    readonly proofSize: Compact<u64>;
  }

  /** @name PalletBabeCall (25) */
  interface PalletBabeCall extends Enum {
    readonly isReportEquivocation: boolean;
    readonly asReportEquivocation: {
      readonly equivocationProof: SpConsensusSlotsEquivocationProof;
      readonly keyOwnerProof: SpSessionMembershipProof;
    } & Struct;
    readonly isReportEquivocationUnsigned: boolean;
    readonly asReportEquivocationUnsigned: {
      readonly equivocationProof: SpConsensusSlotsEquivocationProof;
      readonly keyOwnerProof: SpSessionMembershipProof;
    } & Struct;
    readonly isPlanConfigChange: boolean;
    readonly asPlanConfigChange: {
      readonly config: SpConsensusBabeDigestsNextConfigDescriptor;
    } & Struct;
    readonly type: 'ReportEquivocation' | 'ReportEquivocationUnsigned' | 'PlanConfigChange';
  }

  /** @name SpConsensusSlotsEquivocationProof (26) */
  interface SpConsensusSlotsEquivocationProof extends Struct {
    readonly offender: SpConsensusBabeAppPublic;
    readonly slot: u64;
    readonly firstHeader: SpRuntimeHeader;
    readonly secondHeader: SpRuntimeHeader;
  }

  /** @name SpRuntimeHeader (27) */
  interface SpRuntimeHeader extends Struct {
    readonly parentHash: H256;
    readonly number: Compact<u32>;
    readonly stateRoot: H256;
    readonly extrinsicsRoot: H256;
    readonly digest: SpRuntimeDigest;
  }

  /** @name SpRuntimeDigest (28) */
  interface SpRuntimeDigest extends Struct {
    readonly logs: Vec<SpRuntimeDigestDigestItem>;
  }

  /** @name SpRuntimeDigestDigestItem (30) */
  interface SpRuntimeDigestDigestItem extends Enum {
    readonly isOther: boolean;
    readonly asOther: Bytes;
    readonly isConsensus: boolean;
    readonly asConsensus: ITuple<[U8aFixed, Bytes]>;
    readonly isSeal: boolean;
    readonly asSeal: ITuple<[U8aFixed, Bytes]>;
    readonly isPreRuntime: boolean;
    readonly asPreRuntime: ITuple<[U8aFixed, Bytes]>;
    readonly isRuntimeEnvironmentUpdated: boolean;
    readonly type: 'Other' | 'Consensus' | 'Seal' | 'PreRuntime' | 'RuntimeEnvironmentUpdated';
  }

  /** @name SpConsensusBabeAppPublic (32) */
  interface SpConsensusBabeAppPublic extends U8aFixed {}

  /** @name SpSessionMembershipProof (34) */
  interface SpSessionMembershipProof extends Struct {
    readonly session: u32;
    readonly trieNodes: Vec<Bytes>;
    readonly validatorCount: u32;
  }

  /** @name SpConsensusBabeDigestsNextConfigDescriptor (35) */
  interface SpConsensusBabeDigestsNextConfigDescriptor extends Enum {
    readonly isV1: boolean;
    readonly asV1: {
      readonly c: ITuple<[u64, u64]>;
      readonly allowedSlots: SpConsensusBabeAllowedSlots;
    } & Struct;
    readonly type: 'V1';
  }

  /** @name SpConsensusBabeAllowedSlots (37) */
  interface SpConsensusBabeAllowedSlots extends Enum {
    readonly isPrimarySlots: boolean;
    readonly isPrimaryAndSecondaryPlainSlots: boolean;
    readonly isPrimaryAndSecondaryVRFSlots: boolean;
    readonly type: 'PrimarySlots' | 'PrimaryAndSecondaryPlainSlots' | 'PrimaryAndSecondaryVRFSlots';
  }

  /** @name PalletTimestampCall (38) */
  interface PalletTimestampCall extends Enum {
    readonly isSet: boolean;
    readonly asSet: {
      readonly now: Compact<u64>;
    } & Struct;
    readonly type: 'Set';
  }

  /** @name PalletIndicesCall (39) */
  interface PalletIndicesCall extends Enum {
    readonly isClaim: boolean;
    readonly asClaim: {
      readonly index: u32;
    } & Struct;
    readonly isTransfer: boolean;
    readonly asTransfer: {
      readonly new_: MultiAddress;
      readonly index: u32;
    } & Struct;
    readonly isFree: boolean;
    readonly asFree: {
      readonly index: u32;
    } & Struct;
    readonly isForceTransfer: boolean;
    readonly asForceTransfer: {
      readonly new_: MultiAddress;
      readonly index: u32;
      readonly freeze: bool;
    } & Struct;
    readonly isFreeze: boolean;
    readonly asFreeze: {
      readonly index: u32;
    } & Struct;
    readonly isPokeDeposit: boolean;
    readonly asPokeDeposit: {
      readonly index: u32;
    } & Struct;
    readonly type: 'Claim' | 'Transfer' | 'Free' | 'ForceTransfer' | 'Freeze' | 'PokeDeposit';
  }

  /** @name PalletBalancesCall (41) */
  interface PalletBalancesCall extends Enum {
    readonly isTransferAllowDeath: boolean;
    readonly asTransferAllowDeath: {
      readonly dest: MultiAddress;
      readonly value: Compact<u128>;
    } & Struct;
    readonly isForceTransfer: boolean;
    readonly asForceTransfer: {
      readonly source: MultiAddress;
      readonly dest: MultiAddress;
      readonly value: Compact<u128>;
    } & Struct;
    readonly isTransferKeepAlive: boolean;
    readonly asTransferKeepAlive: {
      readonly dest: MultiAddress;
      readonly value: Compact<u128>;
    } & Struct;
    readonly isTransferAll: boolean;
    readonly asTransferAll: {
      readonly dest: MultiAddress;
      readonly keepAlive: bool;
    } & Struct;
    readonly isForceUnreserve: boolean;
    readonly asForceUnreserve: {
      readonly who: MultiAddress;
      readonly amount: u128;
    } & Struct;
    readonly isUpgradeAccounts: boolean;
    readonly asUpgradeAccounts: {
      readonly who: Vec<AccountId32>;
    } & Struct;
    readonly isForceSetBalance: boolean;
    readonly asForceSetBalance: {
      readonly who: MultiAddress;
      readonly newFree: Compact<u128>;
    } & Struct;
    readonly isForceAdjustTotalIssuance: boolean;
    readonly asForceAdjustTotalIssuance: {
      readonly direction: PalletBalancesAdjustmentDirection;
      readonly delta: Compact<u128>;
    } & Struct;
    readonly isBurn: boolean;
    readonly asBurn: {
      readonly value: Compact<u128>;
      readonly keepAlive: bool;
    } & Struct;
    readonly type: 'TransferAllowDeath' | 'ForceTransfer' | 'TransferKeepAlive' | 'TransferAll' | 'ForceUnreserve' | 'UpgradeAccounts' | 'ForceSetBalance' | 'ForceAdjustTotalIssuance' | 'Burn';
  }

  /** @name PalletBalancesAdjustmentDirection (45) */
  interface PalletBalancesAdjustmentDirection extends Enum {
    readonly isIncrease: boolean;
    readonly isDecrease: boolean;
    readonly type: 'Increase' | 'Decrease';
  }

  /** @name PalletElectionProviderMultiPhaseCall (46) */
  interface PalletElectionProviderMultiPhaseCall extends Enum {
    readonly isSubmitUnsigned: boolean;
    readonly asSubmitUnsigned: {
      readonly rawSolution: PalletElectionProviderMultiPhaseRawSolution;
      readonly witness: PalletElectionProviderMultiPhaseSolutionOrSnapshotSize;
    } & Struct;
    readonly isSetMinimumUntrustedScore: boolean;
    readonly asSetMinimumUntrustedScore: {
      readonly maybeNextScore: Option<SpNposElectionsElectionScore>;
    } & Struct;
    readonly isSetEmergencyElectionResult: boolean;
    readonly asSetEmergencyElectionResult: {
      readonly supports: Vec<ITuple<[AccountId32, SpNposElectionsSupport]>>;
    } & Struct;
    readonly isSubmit: boolean;
    readonly asSubmit: {
      readonly rawSolution: PalletElectionProviderMultiPhaseRawSolution;
    } & Struct;
    readonly isGovernanceFallback: boolean;
    readonly type: 'SubmitUnsigned' | 'SetMinimumUntrustedScore' | 'SetEmergencyElectionResult' | 'Submit' | 'GovernanceFallback';
  }

  /** @name PalletElectionProviderMultiPhaseRawSolution (47) */
  interface PalletElectionProviderMultiPhaseRawSolution extends Struct {
    readonly solution: PortaldotV3RuntimeNposSolution16;
    readonly score: SpNposElectionsElectionScore;
    readonly round: u32;
  }

  /** @name PortaldotV3RuntimeNposSolution16 (48) */
  interface PortaldotV3RuntimeNposSolution16 extends Struct {
    readonly votes1: Vec<ITuple<[Compact<u32>, Compact<u16>]>>;
    readonly votes2: Vec<ITuple<[Compact<u32>, ITuple<[Compact<u16>, Compact<PerU16>]>, Compact<u16>]>>;
    readonly votes3: Vec<ITuple<[Compact<u32>, Vec<ITuple<[Compact<u16>, Compact<PerU16>]>>, Compact<u16>]>>;
    readonly votes4: Vec<ITuple<[Compact<u32>, Vec<ITuple<[Compact<u16>, Compact<PerU16>]>>, Compact<u16>]>>;
    readonly votes5: Vec<ITuple<[Compact<u32>, Vec<ITuple<[Compact<u16>, Compact<PerU16>]>>, Compact<u16>]>>;
    readonly votes6: Vec<ITuple<[Compact<u32>, Vec<ITuple<[Compact<u16>, Compact<PerU16>]>>, Compact<u16>]>>;
    readonly votes7: Vec<ITuple<[Compact<u32>, Vec<ITuple<[Compact<u16>, Compact<PerU16>]>>, Compact<u16>]>>;
    readonly votes8: Vec<ITuple<[Compact<u32>, Vec<ITuple<[Compact<u16>, Compact<PerU16>]>>, Compact<u16>]>>;
    readonly votes9: Vec<ITuple<[Compact<u32>, Vec<ITuple<[Compact<u16>, Compact<PerU16>]>>, Compact<u16>]>>;
    readonly votes10: Vec<ITuple<[Compact<u32>, Vec<ITuple<[Compact<u16>, Compact<PerU16>]>>, Compact<u16>]>>;
    readonly votes11: Vec<ITuple<[Compact<u32>, Vec<ITuple<[Compact<u16>, Compact<PerU16>]>>, Compact<u16>]>>;
    readonly votes12: Vec<ITuple<[Compact<u32>, Vec<ITuple<[Compact<u16>, Compact<PerU16>]>>, Compact<u16>]>>;
    readonly votes13: Vec<ITuple<[Compact<u32>, Vec<ITuple<[Compact<u16>, Compact<PerU16>]>>, Compact<u16>]>>;
    readonly votes14: Vec<ITuple<[Compact<u32>, Vec<ITuple<[Compact<u16>, Compact<PerU16>]>>, Compact<u16>]>>;
    readonly votes15: Vec<ITuple<[Compact<u32>, Vec<ITuple<[Compact<u16>, Compact<PerU16>]>>, Compact<u16>]>>;
    readonly votes16: Vec<ITuple<[Compact<u32>, Vec<ITuple<[Compact<u16>, Compact<PerU16>]>>, Compact<u16>]>>;
  }

  /** @name SpNposElectionsElectionScore (99) */
  interface SpNposElectionsElectionScore extends Struct {
    readonly minimalStake: u128;
    readonly sumStake: u128;
    readonly sumStakeSquared: u128;
  }

  /** @name PalletElectionProviderMultiPhaseSolutionOrSnapshotSize (100) */
  interface PalletElectionProviderMultiPhaseSolutionOrSnapshotSize extends Struct {
    readonly voters: Compact<u32>;
    readonly targets: Compact<u32>;
  }

  /** @name SpNposElectionsSupport (104) */
  interface SpNposElectionsSupport extends Struct {
    readonly total: u128;
    readonly voters: Vec<ITuple<[AccountId32, u128]>>;
  }

  /** @name PalletStakingPalletCall (107) */
  interface PalletStakingPalletCall extends Enum {
    readonly isBond: boolean;
    readonly asBond: {
      readonly value: Compact<u128>;
      readonly payee: PalletStakingRewardDestination;
    } & Struct;
    readonly isBondExtra: boolean;
    readonly asBondExtra: {
      readonly maxAdditional: Compact<u128>;
    } & Struct;
    readonly isUnbond: boolean;
    readonly asUnbond: {
      readonly value: Compact<u128>;
    } & Struct;
    readonly isWithdrawUnbonded: boolean;
    readonly asWithdrawUnbonded: {
      readonly numSlashingSpans: u32;
    } & Struct;
    readonly isValidate: boolean;
    readonly asValidate: {
      readonly prefs: PalletStakingValidatorPrefs;
    } & Struct;
    readonly isNominate: boolean;
    readonly asNominate: {
      readonly targets: Vec<MultiAddress>;
    } & Struct;
    readonly isChill: boolean;
    readonly isSetPayee: boolean;
    readonly asSetPayee: {
      readonly payee: PalletStakingRewardDestination;
    } & Struct;
    readonly isSetController: boolean;
    readonly isSetValidatorCount: boolean;
    readonly asSetValidatorCount: {
      readonly new_: Compact<u32>;
    } & Struct;
    readonly isIncreaseValidatorCount: boolean;
    readonly asIncreaseValidatorCount: {
      readonly additional: Compact<u32>;
    } & Struct;
    readonly isScaleValidatorCount: boolean;
    readonly asScaleValidatorCount: {
      readonly factor: Percent;
    } & Struct;
    readonly isForceNoEras: boolean;
    readonly isForceNewEra: boolean;
    readonly isSetInvulnerables: boolean;
    readonly asSetInvulnerables: {
      readonly invulnerables: Vec<AccountId32>;
    } & Struct;
    readonly isForceUnstake: boolean;
    readonly asForceUnstake: {
      readonly stash: AccountId32;
      readonly numSlashingSpans: u32;
    } & Struct;
    readonly isForceNewEraAlways: boolean;
    readonly isCancelDeferredSlash: boolean;
    readonly asCancelDeferredSlash: {
      readonly era: u32;
      readonly slashIndices: Vec<u32>;
    } & Struct;
    readonly isPayoutStakers: boolean;
    readonly asPayoutStakers: {
      readonly validatorStash: AccountId32;
      readonly era: u32;
    } & Struct;
    readonly isRebond: boolean;
    readonly asRebond: {
      readonly value: Compact<u128>;
    } & Struct;
    readonly isReapStash: boolean;
    readonly asReapStash: {
      readonly stash: AccountId32;
      readonly numSlashingSpans: u32;
    } & Struct;
    readonly isKick: boolean;
    readonly asKick: {
      readonly who: Vec<MultiAddress>;
    } & Struct;
    readonly isSetStakingConfigs: boolean;
    readonly asSetStakingConfigs: {
      readonly minNominatorBond: PalletStakingPalletConfigOpU128;
      readonly minValidatorBond: PalletStakingPalletConfigOpU128;
      readonly maxNominatorCount: PalletStakingPalletConfigOpU32;
      readonly maxValidatorCount: PalletStakingPalletConfigOpU32;
      readonly chillThreshold: PalletStakingPalletConfigOpPercent;
      readonly minCommission: PalletStakingPalletConfigOpPerbill;
      readonly maxStakedRewards: PalletStakingPalletConfigOpPercent;
    } & Struct;
    readonly isChillOther: boolean;
    readonly asChillOther: {
      readonly stash: AccountId32;
    } & Struct;
    readonly isForceApplyMinCommission: boolean;
    readonly asForceApplyMinCommission: {
      readonly validatorStash: AccountId32;
    } & Struct;
    readonly isSetMinCommission: boolean;
    readonly asSetMinCommission: {
      readonly new_: Perbill;
    } & Struct;
    readonly isPayoutStakersByPage: boolean;
    readonly asPayoutStakersByPage: {
      readonly validatorStash: AccountId32;
      readonly era: u32;
      readonly page: u32;
    } & Struct;
    readonly isUpdatePayee: boolean;
    readonly asUpdatePayee: {
      readonly controller: AccountId32;
    } & Struct;
    readonly isDeprecateControllerBatch: boolean;
    readonly asDeprecateControllerBatch: {
      readonly controllers: Vec<AccountId32>;
    } & Struct;
    readonly isRestoreLedger: boolean;
    readonly asRestoreLedger: {
      readonly stash: AccountId32;
      readonly maybeController: Option<AccountId32>;
      readonly maybeTotal: Option<u128>;
      readonly maybeUnlocking: Option<Vec<PalletStakingUnlockChunk>>;
    } & Struct;
    readonly isMigrateCurrency: boolean;
    readonly asMigrateCurrency: {
      readonly stash: AccountId32;
    } & Struct;
    readonly isManualSlash: boolean;
    readonly asManualSlash: {
      readonly validatorStash: AccountId32;
      readonly era: u32;
      readonly slashFraction: Perbill;
    } & Struct;
    readonly type: 'Bond' | 'BondExtra' | 'Unbond' | 'WithdrawUnbonded' | 'Validate' | 'Nominate' | 'Chill' | 'SetPayee' | 'SetController' | 'SetValidatorCount' | 'IncreaseValidatorCount' | 'ScaleValidatorCount' | 'ForceNoEras' | 'ForceNewEra' | 'SetInvulnerables' | 'ForceUnstake' | 'ForceNewEraAlways' | 'CancelDeferredSlash' | 'PayoutStakers' | 'Rebond' | 'ReapStash' | 'Kick' | 'SetStakingConfigs' | 'ChillOther' | 'ForceApplyMinCommission' | 'SetMinCommission' | 'PayoutStakersByPage' | 'UpdatePayee' | 'DeprecateControllerBatch' | 'RestoreLedger' | 'MigrateCurrency' | 'ManualSlash';
  }

  /** @name PalletStakingRewardDestination (108) */
  interface PalletStakingRewardDestination extends Enum {
    readonly isStaked: boolean;
    readonly isStash: boolean;
    readonly isController: boolean;
    readonly isAccount: boolean;
    readonly asAccount: AccountId32;
    readonly isNone: boolean;
    readonly type: 'Staked' | 'Stash' | 'Controller' | 'Account' | 'None';
  }

  /** @name PalletStakingValidatorPrefs (109) */
  interface PalletStakingValidatorPrefs extends Struct {
    readonly commission: Compact<Perbill>;
    readonly blocked: bool;
  }

  /** @name PalletStakingPalletConfigOpU128 (115) */
  interface PalletStakingPalletConfigOpU128 extends Enum {
    readonly isNoop: boolean;
    readonly isSet: boolean;
    readonly asSet: u128;
    readonly isRemove: boolean;
    readonly type: 'Noop' | 'Set' | 'Remove';
  }

  /** @name PalletStakingPalletConfigOpU32 (116) */
  interface PalletStakingPalletConfigOpU32 extends Enum {
    readonly isNoop: boolean;
    readonly isSet: boolean;
    readonly asSet: u32;
    readonly isRemove: boolean;
    readonly type: 'Noop' | 'Set' | 'Remove';
  }

  /** @name PalletStakingPalletConfigOpPercent (117) */
  interface PalletStakingPalletConfigOpPercent extends Enum {
    readonly isNoop: boolean;
    readonly isSet: boolean;
    readonly asSet: Percent;
    readonly isRemove: boolean;
    readonly type: 'Noop' | 'Set' | 'Remove';
  }

  /** @name PalletStakingPalletConfigOpPerbill (118) */
  interface PalletStakingPalletConfigOpPerbill extends Enum {
    readonly isNoop: boolean;
    readonly isSet: boolean;
    readonly asSet: Perbill;
    readonly isRemove: boolean;
    readonly type: 'Noop' | 'Set' | 'Remove';
  }

  /** @name PalletStakingUnlockChunk (124) */
  interface PalletStakingUnlockChunk extends Struct {
    readonly value: Compact<u128>;
    readonly era: Compact<u32>;
  }

  /** @name PalletSessionCall (126) */
  interface PalletSessionCall extends Enum {
    readonly isSetKeys: boolean;
    readonly asSetKeys: {
      readonly keys_: PortaldotV3RuntimeSessionKeys;
      readonly proof: Bytes;
    } & Struct;
    readonly isPurgeKeys: boolean;
    readonly type: 'SetKeys' | 'PurgeKeys';
  }

  /** @name PortaldotV3RuntimeSessionKeys (127) */
  interface PortaldotV3RuntimeSessionKeys extends Struct {
    readonly grandpa: SpConsensusGrandpaAppPublic;
    readonly babe: SpConsensusBabeAppPublic;
    readonly imOnline: PalletImOnlineSr25519AppSr25519Public;
    readonly authorityDiscovery: SpAuthorityDiscoveryAppPublic;
    readonly mixnet: SpMixnetAppPublic;
    readonly beefy: SpConsensusBeefyEcdsaCryptoPublic;
  }

  /** @name SpConsensusGrandpaAppPublic (128) */
  interface SpConsensusGrandpaAppPublic extends U8aFixed {}

  /** @name PalletImOnlineSr25519AppSr25519Public (129) */
  interface PalletImOnlineSr25519AppSr25519Public extends U8aFixed {}

  /** @name SpAuthorityDiscoveryAppPublic (130) */
  interface SpAuthorityDiscoveryAppPublic extends U8aFixed {}

  /** @name SpMixnetAppPublic (131) */
  interface SpMixnetAppPublic extends U8aFixed {}

  /** @name SpConsensusBeefyEcdsaCryptoPublic (132) */
  interface SpConsensusBeefyEcdsaCryptoPublic extends U8aFixed {}

  /** @name PalletCollectiveCall (134) */
  interface PalletCollectiveCall extends Enum {
    readonly isSetMembers: boolean;
    readonly asSetMembers: {
      readonly newMembers: Vec<AccountId32>;
      readonly prime: Option<AccountId32>;
      readonly oldCount: u32;
    } & Struct;
    readonly isExecute: boolean;
    readonly asExecute: {
      readonly proposal: Call;
      readonly lengthBound: Compact<u32>;
    } & Struct;
    readonly isPropose: boolean;
    readonly asPropose: {
      readonly threshold: Compact<u32>;
      readonly proposal: Call;
      readonly lengthBound: Compact<u32>;
    } & Struct;
    readonly isVote: boolean;
    readonly asVote: {
      readonly proposal: H256;
      readonly index: Compact<u32>;
      readonly approve: bool;
    } & Struct;
    readonly isDisapproveProposal: boolean;
    readonly asDisapproveProposal: {
      readonly proposalHash: H256;
    } & Struct;
    readonly isClose: boolean;
    readonly asClose: {
      readonly proposalHash: H256;
      readonly index: Compact<u32>;
      readonly proposalWeightBound: SpWeightsWeightV2Weight;
      readonly lengthBound: Compact<u32>;
    } & Struct;
    readonly isKill: boolean;
    readonly asKill: {
      readonly proposalHash: H256;
    } & Struct;
    readonly isReleaseProposalCost: boolean;
    readonly asReleaseProposalCost: {
      readonly proposalHash: H256;
    } & Struct;
    readonly type: 'SetMembers' | 'Execute' | 'Propose' | 'Vote' | 'DisapproveProposal' | 'Close' | 'Kill' | 'ReleaseProposalCost';
  }

  /** @name PalletMembershipCall (135) */
  interface PalletMembershipCall extends Enum {
    readonly isAddMember: boolean;
    readonly asAddMember: {
      readonly who: MultiAddress;
    } & Struct;
    readonly isRemoveMember: boolean;
    readonly asRemoveMember: {
      readonly who: MultiAddress;
    } & Struct;
    readonly isSwapMember: boolean;
    readonly asSwapMember: {
      readonly remove: MultiAddress;
      readonly add: MultiAddress;
    } & Struct;
    readonly isResetMembers: boolean;
    readonly asResetMembers: {
      readonly members: Vec<AccountId32>;
    } & Struct;
    readonly isChangeKey: boolean;
    readonly asChangeKey: {
      readonly new_: MultiAddress;
    } & Struct;
    readonly isSetPrime: boolean;
    readonly asSetPrime: {
      readonly who: MultiAddress;
    } & Struct;
    readonly isClearPrime: boolean;
    readonly type: 'AddMember' | 'RemoveMember' | 'SwapMember' | 'ResetMembers' | 'ChangeKey' | 'SetPrime' | 'ClearPrime';
  }

  /** @name PalletGrandpaCall (136) */
  interface PalletGrandpaCall extends Enum {
    readonly isReportEquivocation: boolean;
    readonly asReportEquivocation: {
      readonly equivocationProof: SpConsensusGrandpaEquivocationProof;
      readonly keyOwnerProof: SpSessionMembershipProof;
    } & Struct;
    readonly isReportEquivocationUnsigned: boolean;
    readonly asReportEquivocationUnsigned: {
      readonly equivocationProof: SpConsensusGrandpaEquivocationProof;
      readonly keyOwnerProof: SpSessionMembershipProof;
    } & Struct;
    readonly isNoteStalled: boolean;
    readonly asNoteStalled: {
      readonly delay: u32;
      readonly bestFinalizedBlockNumber: u32;
    } & Struct;
    readonly type: 'ReportEquivocation' | 'ReportEquivocationUnsigned' | 'NoteStalled';
  }

  /** @name SpConsensusGrandpaEquivocationProof (137) */
  interface SpConsensusGrandpaEquivocationProof extends Struct {
    readonly setId: u64;
    readonly equivocation: SpConsensusGrandpaEquivocation;
  }

  /** @name SpConsensusGrandpaEquivocation (138) */
  interface SpConsensusGrandpaEquivocation extends Enum {
    readonly isPrevote: boolean;
    readonly asPrevote: FinalityGrandpaEquivocationPrevote;
    readonly isPrecommit: boolean;
    readonly asPrecommit: FinalityGrandpaEquivocationPrecommit;
    readonly type: 'Prevote' | 'Precommit';
  }

  /** @name FinalityGrandpaEquivocationPrevote (139) */
  interface FinalityGrandpaEquivocationPrevote extends Struct {
    readonly roundNumber: u64;
    readonly identity: SpConsensusGrandpaAppPublic;
    readonly first: ITuple<[FinalityGrandpaPrevote, SpConsensusGrandpaAppSignature]>;
    readonly second: ITuple<[FinalityGrandpaPrevote, SpConsensusGrandpaAppSignature]>;
  }

  /** @name FinalityGrandpaPrevote (140) */
  interface FinalityGrandpaPrevote extends Struct {
    readonly targetHash: H256;
    readonly targetNumber: u32;
  }

  /** @name SpConsensusGrandpaAppSignature (141) */
  interface SpConsensusGrandpaAppSignature extends U8aFixed {}

  /** @name FinalityGrandpaEquivocationPrecommit (144) */
  interface FinalityGrandpaEquivocationPrecommit extends Struct {
    readonly roundNumber: u64;
    readonly identity: SpConsensusGrandpaAppPublic;
    readonly first: ITuple<[FinalityGrandpaPrecommit, SpConsensusGrandpaAppSignature]>;
    readonly second: ITuple<[FinalityGrandpaPrecommit, SpConsensusGrandpaAppSignature]>;
  }

  /** @name FinalityGrandpaPrecommit (145) */
  interface FinalityGrandpaPrecommit extends Struct {
    readonly targetHash: H256;
    readonly targetNumber: u32;
  }

  /** @name PalletTreasuryCall (147) */
  interface PalletTreasuryCall extends Enum {
    readonly isSpendLocal: boolean;
    readonly asSpendLocal: {
      readonly amount: Compact<u128>;
      readonly beneficiary: MultiAddress;
    } & Struct;
    readonly isRemoveApproval: boolean;
    readonly asRemoveApproval: {
      readonly proposalId: Compact<u32>;
    } & Struct;
    readonly isSpend: boolean;
    readonly asSpend: {
      readonly assetKind: FrameSupportTokensFungibleUnionOfNativeOrWithId;
      readonly amount: Compact<u128>;
      readonly beneficiary: MultiAddress;
      readonly validFrom: Option<u32>;
    } & Struct;
    readonly isPayout: boolean;
    readonly asPayout: {
      readonly index: u32;
    } & Struct;
    readonly isCheckStatus: boolean;
    readonly asCheckStatus: {
      readonly index: u32;
    } & Struct;
    readonly isVoidSpend: boolean;
    readonly asVoidSpend: {
      readonly index: u32;
    } & Struct;
    readonly type: 'SpendLocal' | 'RemoveApproval' | 'Spend' | 'Payout' | 'CheckStatus' | 'VoidSpend';
  }

  /** @name FrameSupportTokensFungibleUnionOfNativeOrWithId (148) */
  interface FrameSupportTokensFungibleUnionOfNativeOrWithId extends Enum {
    readonly isNative: boolean;
    readonly isWithId: boolean;
    readonly asWithId: u32;
    readonly type: 'Native' | 'WithId';
  }

  /** @name PalletAssetRateCall (150) */
  interface PalletAssetRateCall extends Enum {
    readonly isCreate: boolean;
    readonly asCreate: {
      readonly assetKind: FrameSupportTokensFungibleUnionOfNativeOrWithId;
      readonly rate: u128;
    } & Struct;
    readonly isUpdate: boolean;
    readonly asUpdate: {
      readonly assetKind: FrameSupportTokensFungibleUnionOfNativeOrWithId;
      readonly rate: u128;
    } & Struct;
    readonly isRemove: boolean;
    readonly asRemove: {
      readonly assetKind: FrameSupportTokensFungibleUnionOfNativeOrWithId;
    } & Struct;
    readonly type: 'Create' | 'Update' | 'Remove';
  }

  /** @name PalletContractsCall (152) */
  interface PalletContractsCall extends Enum {
    readonly isCallOldWeight: boolean;
    readonly asCallOldWeight: {
      readonly dest: MultiAddress;
      readonly value: Compact<u128>;
      readonly gasLimit: Compact<u64>;
      readonly storageDepositLimit: Option<Compact<u128>>;
      readonly data: Bytes;
    } & Struct;
    readonly isInstantiateWithCodeOldWeight: boolean;
    readonly asInstantiateWithCodeOldWeight: {
      readonly value: Compact<u128>;
      readonly gasLimit: Compact<u64>;
      readonly storageDepositLimit: Option<Compact<u128>>;
      readonly code: Bytes;
      readonly data: Bytes;
      readonly salt: Bytes;
    } & Struct;
    readonly isInstantiateOldWeight: boolean;
    readonly asInstantiateOldWeight: {
      readonly value: Compact<u128>;
      readonly gasLimit: Compact<u64>;
      readonly storageDepositLimit: Option<Compact<u128>>;
      readonly codeHash: H256;
      readonly data: Bytes;
      readonly salt: Bytes;
    } & Struct;
    readonly isUploadCode: boolean;
    readonly asUploadCode: {
      readonly code: Bytes;
      readonly storageDepositLimit: Option<Compact<u128>>;
      readonly determinism: PalletContractsWasmDeterminism;
    } & Struct;
    readonly isRemoveCode: boolean;
    readonly asRemoveCode: {
      readonly codeHash: H256;
    } & Struct;
    readonly isSetCode: boolean;
    readonly asSetCode: {
      readonly dest: MultiAddress;
      readonly codeHash: H256;
    } & Struct;
    readonly isCall: boolean;
    readonly asCall: {
      readonly dest: MultiAddress;
      readonly value: Compact<u128>;
      readonly gasLimit: SpWeightsWeightV2Weight;
      readonly storageDepositLimit: Option<Compact<u128>>;
      readonly data: Bytes;
    } & Struct;
    readonly isInstantiateWithCode: boolean;
    readonly asInstantiateWithCode: {
      readonly value: Compact<u128>;
      readonly gasLimit: SpWeightsWeightV2Weight;
      readonly storageDepositLimit: Option<Compact<u128>>;
      readonly code: Bytes;
      readonly data: Bytes;
      readonly salt: Bytes;
    } & Struct;
    readonly isInstantiate: boolean;
    readonly asInstantiate: {
      readonly value: Compact<u128>;
      readonly gasLimit: SpWeightsWeightV2Weight;
      readonly storageDepositLimit: Option<Compact<u128>>;
      readonly codeHash: H256;
      readonly data: Bytes;
      readonly salt: Bytes;
    } & Struct;
    readonly isMigrate: boolean;
    readonly asMigrate: {
      readonly weightLimit: SpWeightsWeightV2Weight;
    } & Struct;
    readonly type: 'CallOldWeight' | 'InstantiateWithCodeOldWeight' | 'InstantiateOldWeight' | 'UploadCode' | 'RemoveCode' | 'SetCode' | 'Call' | 'InstantiateWithCode' | 'Instantiate' | 'Migrate';
  }

  /** @name PalletContractsWasmDeterminism (154) */
  interface PalletContractsWasmDeterminism extends Enum {
    readonly isEnforced: boolean;
    readonly isRelaxed: boolean;
    readonly type: 'Enforced' | 'Relaxed';
  }

  /** @name PalletSudoCall (155) */
  interface PalletSudoCall extends Enum {
    readonly isSudo: boolean;
    readonly asSudo: {
      readonly call: Call;
    } & Struct;
    readonly isSudoUncheckedWeight: boolean;
    readonly asSudoUncheckedWeight: {
      readonly call: Call;
      readonly weight: SpWeightsWeightV2Weight;
    } & Struct;
    readonly isSetKey: boolean;
    readonly asSetKey: {
      readonly new_: MultiAddress;
    } & Struct;
    readonly isSudoAs: boolean;
    readonly asSudoAs: {
      readonly who: MultiAddress;
      readonly call: Call;
    } & Struct;
    readonly isRemoveKey: boolean;
    readonly type: 'Sudo' | 'SudoUncheckedWeight' | 'SetKey' | 'SudoAs' | 'RemoveKey';
  }

  /** @name PalletImOnlineCall (156) */
  interface PalletImOnlineCall extends Enum {
    readonly isHeartbeat: boolean;
    readonly asHeartbeat: {
      readonly heartbeat: PalletImOnlineHeartbeat;
      readonly signature: PalletImOnlineSr25519AppSr25519Signature;
    } & Struct;
    readonly type: 'Heartbeat';
  }

  /** @name PalletImOnlineHeartbeat (157) */
  interface PalletImOnlineHeartbeat extends Struct {
    readonly blockNumber: u32;
    readonly sessionIndex: u32;
    readonly authorityIndex: u32;
    readonly validatorsLen: u32;
  }

  /** @name PalletImOnlineSr25519AppSr25519Signature (158) */
  interface PalletImOnlineSr25519AppSr25519Signature extends U8aFixed {}

  /** @name PalletIdentityCall (159) */
  interface PalletIdentityCall extends Enum {
    readonly isAddRegistrar: boolean;
    readonly asAddRegistrar: {
      readonly account: MultiAddress;
    } & Struct;
    readonly isSetIdentity: boolean;
    readonly asSetIdentity: {
      readonly info: PalletIdentityLegacyIdentityInfo;
    } & Struct;
    readonly isSetSubs: boolean;
    readonly asSetSubs: {
      readonly subs: Vec<ITuple<[AccountId32, Data]>>;
    } & Struct;
    readonly isClearIdentity: boolean;
    readonly isRequestJudgement: boolean;
    readonly asRequestJudgement: {
      readonly regIndex: Compact<u32>;
      readonly maxFee: Compact<u128>;
    } & Struct;
    readonly isCancelRequest: boolean;
    readonly asCancelRequest: {
      readonly regIndex: u32;
    } & Struct;
    readonly isSetFee: boolean;
    readonly asSetFee: {
      readonly index: Compact<u32>;
      readonly fee: Compact<u128>;
    } & Struct;
    readonly isSetAccountId: boolean;
    readonly asSetAccountId: {
      readonly index: Compact<u32>;
      readonly new_: MultiAddress;
    } & Struct;
    readonly isSetFields: boolean;
    readonly asSetFields: {
      readonly index: Compact<u32>;
      readonly fields: u64;
    } & Struct;
    readonly isProvideJudgement: boolean;
    readonly asProvideJudgement: {
      readonly regIndex: Compact<u32>;
      readonly target: MultiAddress;
      readonly judgement: PalletIdentityJudgement;
      readonly identity: H256;
    } & Struct;
    readonly isKillIdentity: boolean;
    readonly asKillIdentity: {
      readonly target: MultiAddress;
    } & Struct;
    readonly isAddSub: boolean;
    readonly asAddSub: {
      readonly sub: MultiAddress;
      readonly data: Data;
    } & Struct;
    readonly isRenameSub: boolean;
    readonly asRenameSub: {
      readonly sub: MultiAddress;
      readonly data: Data;
    } & Struct;
    readonly isRemoveSub: boolean;
    readonly asRemoveSub: {
      readonly sub: MultiAddress;
    } & Struct;
    readonly isQuitSub: boolean;
    readonly isAddUsernameAuthority: boolean;
    readonly asAddUsernameAuthority: {
      readonly authority: MultiAddress;
      readonly suffix: Bytes;
      readonly allocation: u32;
    } & Struct;
    readonly isRemoveUsernameAuthority: boolean;
    readonly asRemoveUsernameAuthority: {
      readonly suffix: Bytes;
      readonly authority: MultiAddress;
    } & Struct;
    readonly isSetUsernameFor: boolean;
    readonly asSetUsernameFor: {
      readonly who: MultiAddress;
      readonly username: Bytes;
      readonly signature: Option<SpRuntimeMultiSignature>;
      readonly useAllocation: bool;
    } & Struct;
    readonly isAcceptUsername: boolean;
    readonly asAcceptUsername: {
      readonly username: Bytes;
    } & Struct;
    readonly isRemoveExpiredApproval: boolean;
    readonly asRemoveExpiredApproval: {
      readonly username: Bytes;
    } & Struct;
    readonly isSetPrimaryUsername: boolean;
    readonly asSetPrimaryUsername: {
      readonly username: Bytes;
    } & Struct;
    readonly isUnbindUsername: boolean;
    readonly asUnbindUsername: {
      readonly username: Bytes;
    } & Struct;
    readonly isRemoveUsername: boolean;
    readonly asRemoveUsername: {
      readonly username: Bytes;
    } & Struct;
    readonly isKillUsername: boolean;
    readonly asKillUsername: {
      readonly username: Bytes;
    } & Struct;
    readonly isRemoveRegistrar: boolean;
    readonly asRemoveRegistrar: {
      readonly index: Compact<u32>;
    } & Struct;
    readonly type: 'AddRegistrar' | 'SetIdentity' | 'SetSubs' | 'ClearIdentity' | 'RequestJudgement' | 'CancelRequest' | 'SetFee' | 'SetAccountId' | 'SetFields' | 'ProvideJudgement' | 'KillIdentity' | 'AddSub' | 'RenameSub' | 'RemoveSub' | 'QuitSub' | 'AddUsernameAuthority' | 'RemoveUsernameAuthority' | 'SetUsernameFor' | 'AcceptUsername' | 'RemoveExpiredApproval' | 'SetPrimaryUsername' | 'UnbindUsername' | 'RemoveUsername' | 'KillUsername' | 'RemoveRegistrar';
  }

  /** @name PalletIdentityLegacyIdentityInfo (160) */
  interface PalletIdentityLegacyIdentityInfo extends Struct {
    readonly additional: Vec<ITuple<[Data, Data]>>;
    readonly display: Data;
    readonly legal: Data;
    readonly web: Data;
    readonly riot: Data;
    readonly email: Data;
    readonly pgpFingerprint: Option<U8aFixed>;
    readonly image: Data;
    readonly twitter: Data;
  }

  /** @name PalletIdentityJudgement (198) */
  interface PalletIdentityJudgement extends Enum {
    readonly isUnknown: boolean;
    readonly isFeePaid: boolean;
    readonly asFeePaid: u128;
    readonly isReasonable: boolean;
    readonly isKnownGood: boolean;
    readonly isOutOfDate: boolean;
    readonly isLowQuality: boolean;
    readonly isErroneous: boolean;
    readonly type: 'Unknown' | 'FeePaid' | 'Reasonable' | 'KnownGood' | 'OutOfDate' | 'LowQuality' | 'Erroneous';
  }

  /** @name SpRuntimeMultiSignature (200) */
  interface SpRuntimeMultiSignature extends Enum {
    readonly isEd25519: boolean;
    readonly asEd25519: U8aFixed;
    readonly isSr25519: boolean;
    readonly asSr25519: U8aFixed;
    readonly isEcdsa: boolean;
    readonly asEcdsa: U8aFixed;
    readonly isEth: boolean;
    readonly asEth: U8aFixed;
    readonly type: 'Ed25519' | 'Sr25519' | 'Ecdsa' | 'Eth';
  }

  /** @name PalletRecoveryCall (203) */
  interface PalletRecoveryCall extends Enum {
    readonly isControlInheritedAccount: boolean;
    readonly asControlInheritedAccount: {
      readonly recovered: MultiAddress;
      readonly call: Call;
    } & Struct;
    readonly isRevokeInheritor: boolean;
    readonly isSetFriendGroups: boolean;
    readonly asSetFriendGroups: {
      readonly friendGroups: Vec<PalletRecoveryFriendGroup>;
    } & Struct;
    readonly isInitiateAttempt: boolean;
    readonly asInitiateAttempt: {
      readonly lost: MultiAddress;
      readonly friendGroupIndex: u32;
    } & Struct;
    readonly isApproveAttempt: boolean;
    readonly asApproveAttempt: {
      readonly lost: MultiAddress;
      readonly friendGroupIndex: u32;
    } & Struct;
    readonly isFinishAttempt: boolean;
    readonly asFinishAttempt: {
      readonly lost: MultiAddress;
      readonly friendGroupIndex: u32;
    } & Struct;
    readonly isCancelAttempt: boolean;
    readonly asCancelAttempt: {
      readonly lost: MultiAddress;
      readonly friendGroupIndex: u32;
    } & Struct;
    readonly isSlashAttempt: boolean;
    readonly asSlashAttempt: {
      readonly friendGroupIndex: u32;
    } & Struct;
    readonly type: 'ControlInheritedAccount' | 'RevokeInheritor' | 'SetFriendGroups' | 'InitiateAttempt' | 'ApproveAttempt' | 'FinishAttempt' | 'CancelAttempt' | 'SlashAttempt';
  }

  /** @name PalletRecoveryFriendGroup (205) */
  interface PalletRecoveryFriendGroup extends Struct {
    readonly friends: Vec<AccountId32>;
    readonly friendsNeeded: u32;
    readonly inheritor: AccountId32;
    readonly inheritanceDelay: u32;
    readonly inheritancePriority: u32;
    readonly cancelDelay: u32;
  }

  /** @name PalletVestingCall (207) */
  interface PalletVestingCall extends Enum {
    readonly isVest: boolean;
    readonly isVestOther: boolean;
    readonly asVestOther: {
      readonly target: MultiAddress;
    } & Struct;
    readonly isVestedTransfer: boolean;
    readonly asVestedTransfer: {
      readonly target: MultiAddress;
      readonly schedule: PalletVestingVestingInfo;
    } & Struct;
    readonly isForceVestedTransfer: boolean;
    readonly asForceVestedTransfer: {
      readonly source: MultiAddress;
      readonly target: MultiAddress;
      readonly schedule: PalletVestingVestingInfo;
    } & Struct;
    readonly isMergeSchedules: boolean;
    readonly asMergeSchedules: {
      readonly schedule1Index: u32;
      readonly schedule2Index: u32;
    } & Struct;
    readonly isForceRemoveVestingSchedule: boolean;
    readonly asForceRemoveVestingSchedule: {
      readonly target: MultiAddress;
      readonly scheduleIndex: u32;
    } & Struct;
    readonly type: 'Vest' | 'VestOther' | 'VestedTransfer' | 'ForceVestedTransfer' | 'MergeSchedules' | 'ForceRemoveVestingSchedule';
  }

  /** @name PalletVestingVestingInfo (208) */
  interface PalletVestingVestingInfo extends Struct {
    readonly locked: u128;
    readonly perBlock: u128;
    readonly startingBlock: u32;
  }

  /** @name PalletSchedulerCall (209) */
  interface PalletSchedulerCall extends Enum {
    readonly isSchedule: boolean;
    readonly asSchedule: {
      readonly when: u32;
      readonly maybePeriodic: Option<ITuple<[u32, u32]>>;
      readonly priority: u8;
      readonly call: Call;
    } & Struct;
    readonly isCancel: boolean;
    readonly asCancel: {
      readonly when: u32;
      readonly index: u32;
    } & Struct;
    readonly isScheduleNamed: boolean;
    readonly asScheduleNamed: {
      readonly id: U8aFixed;
      readonly when: u32;
      readonly maybePeriodic: Option<ITuple<[u32, u32]>>;
      readonly priority: u8;
      readonly call: Call;
    } & Struct;
    readonly isCancelNamed: boolean;
    readonly asCancelNamed: {
      readonly id: U8aFixed;
    } & Struct;
    readonly isScheduleAfter: boolean;
    readonly asScheduleAfter: {
      readonly after: u32;
      readonly maybePeriodic: Option<ITuple<[u32, u32]>>;
      readonly priority: u8;
      readonly call: Call;
    } & Struct;
    readonly isScheduleNamedAfter: boolean;
    readonly asScheduleNamedAfter: {
      readonly id: U8aFixed;
      readonly after: u32;
      readonly maybePeriodic: Option<ITuple<[u32, u32]>>;
      readonly priority: u8;
      readonly call: Call;
    } & Struct;
    readonly isSetRetry: boolean;
    readonly asSetRetry: {
      readonly task: ITuple<[u32, u32]>;
      readonly retries: u8;
      readonly period: u32;
    } & Struct;
    readonly isSetRetryNamed: boolean;
    readonly asSetRetryNamed: {
      readonly id: U8aFixed;
      readonly retries: u8;
      readonly period: u32;
    } & Struct;
    readonly isCancelRetry: boolean;
    readonly asCancelRetry: {
      readonly task: ITuple<[u32, u32]>;
    } & Struct;
    readonly isCancelRetryNamed: boolean;
    readonly asCancelRetryNamed: {
      readonly id: U8aFixed;
    } & Struct;
    readonly type: 'Schedule' | 'Cancel' | 'ScheduleNamed' | 'CancelNamed' | 'ScheduleAfter' | 'ScheduleNamedAfter' | 'SetRetry' | 'SetRetryNamed' | 'CancelRetry' | 'CancelRetryNamed';
  }

  /** @name PalletPreimageCall (212) */
  interface PalletPreimageCall extends Enum {
    readonly isNotePreimage: boolean;
    readonly asNotePreimage: {
      readonly bytes: Bytes;
    } & Struct;
    readonly isUnnotePreimage: boolean;
    readonly asUnnotePreimage: {
      readonly hash_: H256;
    } & Struct;
    readonly isRequestPreimage: boolean;
    readonly asRequestPreimage: {
      readonly hash_: H256;
    } & Struct;
    readonly isUnrequestPreimage: boolean;
    readonly asUnrequestPreimage: {
      readonly hash_: H256;
    } & Struct;
    readonly isEnsureUpdated: boolean;
    readonly asEnsureUpdated: {
      readonly hashes: Vec<H256>;
    } & Struct;
    readonly type: 'NotePreimage' | 'UnnotePreimage' | 'RequestPreimage' | 'UnrequestPreimage' | 'EnsureUpdated';
  }

  /** @name PalletProxyCall (214) */
  interface PalletProxyCall extends Enum {
    readonly isProxy: boolean;
    readonly asProxy: {
      readonly real: MultiAddress;
      readonly forceProxyType: Option<PortaldotV3RuntimeProxyType>;
      readonly call: Call;
    } & Struct;
    readonly isAddProxy: boolean;
    readonly asAddProxy: {
      readonly delegate: MultiAddress;
      readonly proxyType: PortaldotV3RuntimeProxyType;
      readonly delay: u32;
    } & Struct;
    readonly isRemoveProxy: boolean;
    readonly asRemoveProxy: {
      readonly delegate: MultiAddress;
      readonly proxyType: PortaldotV3RuntimeProxyType;
      readonly delay: u32;
    } & Struct;
    readonly isRemoveProxies: boolean;
    readonly isCreatePure: boolean;
    readonly asCreatePure: {
      readonly proxyType: PortaldotV3RuntimeProxyType;
      readonly delay: u32;
      readonly index: u16;
    } & Struct;
    readonly isKillPure: boolean;
    readonly asKillPure: {
      readonly spawner: MultiAddress;
      readonly proxyType: PortaldotV3RuntimeProxyType;
      readonly index: u16;
      readonly height: Compact<u32>;
      readonly extIndex: Compact<u32>;
    } & Struct;
    readonly isAnnounce: boolean;
    readonly asAnnounce: {
      readonly real: MultiAddress;
      readonly callHash: H256;
    } & Struct;
    readonly isRemoveAnnouncement: boolean;
    readonly asRemoveAnnouncement: {
      readonly real: MultiAddress;
      readonly callHash: H256;
    } & Struct;
    readonly isRejectAnnouncement: boolean;
    readonly asRejectAnnouncement: {
      readonly delegate: MultiAddress;
      readonly callHash: H256;
    } & Struct;
    readonly isProxyAnnounced: boolean;
    readonly asProxyAnnounced: {
      readonly delegate: MultiAddress;
      readonly real: MultiAddress;
      readonly forceProxyType: Option<PortaldotV3RuntimeProxyType>;
      readonly call: Call;
    } & Struct;
    readonly isPokeDeposit: boolean;
    readonly type: 'Proxy' | 'AddProxy' | 'RemoveProxy' | 'RemoveProxies' | 'CreatePure' | 'KillPure' | 'Announce' | 'RemoveAnnouncement' | 'RejectAnnouncement' | 'ProxyAnnounced' | 'PokeDeposit';
  }

  /** @name PortaldotV3RuntimeProxyType (216) */
  interface PortaldotV3RuntimeProxyType extends Enum {
    readonly isAny: boolean;
    readonly isNonTransfer: boolean;
    readonly isGovernance: boolean;
    readonly isStaking: boolean;
    readonly type: 'Any' | 'NonTransfer' | 'Governance' | 'Staking';
  }

  /** @name PalletMultisigCall (217) */
  interface PalletMultisigCall extends Enum {
    readonly isAsMultiThreshold1: boolean;
    readonly asAsMultiThreshold1: {
      readonly otherSignatories: Vec<AccountId32>;
      readonly call: Call;
    } & Struct;
    readonly isAsMulti: boolean;
    readonly asAsMulti: {
      readonly threshold: u16;
      readonly otherSignatories: Vec<AccountId32>;
      readonly maybeTimepoint: Option<PalletMultisigTimepoint>;
      readonly call: Call;
      readonly maxWeight: SpWeightsWeightV2Weight;
    } & Struct;
    readonly isApproveAsMulti: boolean;
    readonly asApproveAsMulti: {
      readonly threshold: u16;
      readonly otherSignatories: Vec<AccountId32>;
      readonly maybeTimepoint: Option<PalletMultisigTimepoint>;
      readonly callHash: U8aFixed;
      readonly maxWeight: SpWeightsWeightV2Weight;
    } & Struct;
    readonly isCancelAsMulti: boolean;
    readonly asCancelAsMulti: {
      readonly threshold: u16;
      readonly otherSignatories: Vec<AccountId32>;
      readonly timepoint: PalletMultisigTimepoint;
      readonly callHash: U8aFixed;
    } & Struct;
    readonly isPokeDeposit: boolean;
    readonly asPokeDeposit: {
      readonly threshold: u16;
      readonly otherSignatories: Vec<AccountId32>;
      readonly callHash: U8aFixed;
    } & Struct;
    readonly type: 'AsMultiThreshold1' | 'AsMulti' | 'ApproveAsMulti' | 'CancelAsMulti' | 'PokeDeposit';
  }

  /** @name PalletMultisigTimepoint (219) */
  interface PalletMultisigTimepoint extends Struct {
    readonly height: u32;
    readonly index: u32;
  }

  /** @name PalletBountiesCall (220) */
  interface PalletBountiesCall extends Enum {
    readonly isProposeBounty: boolean;
    readonly asProposeBounty: {
      readonly value: Compact<u128>;
      readonly description: Bytes;
    } & Struct;
    readonly isApproveBounty: boolean;
    readonly asApproveBounty: {
      readonly bountyId: Compact<u32>;
    } & Struct;
    readonly isProposeCurator: boolean;
    readonly asProposeCurator: {
      readonly bountyId: Compact<u32>;
      readonly curator: MultiAddress;
      readonly fee: Compact<u128>;
    } & Struct;
    readonly isUnassignCurator: boolean;
    readonly asUnassignCurator: {
      readonly bountyId: Compact<u32>;
    } & Struct;
    readonly isAcceptCurator: boolean;
    readonly asAcceptCurator: {
      readonly bountyId: Compact<u32>;
    } & Struct;
    readonly isAwardBounty: boolean;
    readonly asAwardBounty: {
      readonly bountyId: Compact<u32>;
      readonly beneficiary: MultiAddress;
    } & Struct;
    readonly isClaimBounty: boolean;
    readonly asClaimBounty: {
      readonly bountyId: Compact<u32>;
    } & Struct;
    readonly isCloseBounty: boolean;
    readonly asCloseBounty: {
      readonly bountyId: Compact<u32>;
    } & Struct;
    readonly isExtendBountyExpiry: boolean;
    readonly asExtendBountyExpiry: {
      readonly bountyId: Compact<u32>;
      readonly remark: Bytes;
    } & Struct;
    readonly isApproveBountyWithCurator: boolean;
    readonly asApproveBountyWithCurator: {
      readonly bountyId: Compact<u32>;
      readonly curator: MultiAddress;
      readonly fee: Compact<u128>;
    } & Struct;
    readonly isPokeDeposit: boolean;
    readonly asPokeDeposit: {
      readonly bountyId: Compact<u32>;
    } & Struct;
    readonly isReclaimBountyFunds: boolean;
    readonly asReclaimBountyFunds: {
      readonly bountyId: Compact<u32>;
    } & Struct;
    readonly type: 'ProposeBounty' | 'ApproveBounty' | 'ProposeCurator' | 'UnassignCurator' | 'AcceptCurator' | 'AwardBounty' | 'ClaimBounty' | 'CloseBounty' | 'ExtendBountyExpiry' | 'ApproveBountyWithCurator' | 'PokeDeposit' | 'ReclaimBountyFunds';
  }

  /** @name PalletAssetsCall (221) */
  interface PalletAssetsCall extends Enum {
    readonly isCreate: boolean;
    readonly asCreate: {
      readonly id: Compact<u32>;
      readonly admin: MultiAddress;
      readonly minBalance: u128;
    } & Struct;
    readonly isForceCreate: boolean;
    readonly asForceCreate: {
      readonly id: Compact<u32>;
      readonly owner: MultiAddress;
      readonly isSufficient: bool;
      readonly minBalance: Compact<u128>;
    } & Struct;
    readonly isStartDestroy: boolean;
    readonly asStartDestroy: {
      readonly id: Compact<u32>;
    } & Struct;
    readonly isDestroyAccounts: boolean;
    readonly asDestroyAccounts: {
      readonly id: Compact<u32>;
    } & Struct;
    readonly isDestroyApprovals: boolean;
    readonly asDestroyApprovals: {
      readonly id: Compact<u32>;
    } & Struct;
    readonly isFinishDestroy: boolean;
    readonly asFinishDestroy: {
      readonly id: Compact<u32>;
    } & Struct;
    readonly isMint: boolean;
    readonly asMint: {
      readonly id: Compact<u32>;
      readonly beneficiary: MultiAddress;
      readonly amount: Compact<u128>;
    } & Struct;
    readonly isBurn: boolean;
    readonly asBurn: {
      readonly id: Compact<u32>;
      readonly who: MultiAddress;
      readonly amount: Compact<u128>;
    } & Struct;
    readonly isTransfer: boolean;
    readonly asTransfer: {
      readonly id: Compact<u32>;
      readonly target: MultiAddress;
      readonly amount: Compact<u128>;
    } & Struct;
    readonly isTransferKeepAlive: boolean;
    readonly asTransferKeepAlive: {
      readonly id: Compact<u32>;
      readonly target: MultiAddress;
      readonly amount: Compact<u128>;
    } & Struct;
    readonly isForceTransfer: boolean;
    readonly asForceTransfer: {
      readonly id: Compact<u32>;
      readonly source: MultiAddress;
      readonly dest: MultiAddress;
      readonly amount: Compact<u128>;
    } & Struct;
    readonly isFreeze: boolean;
    readonly asFreeze: {
      readonly id: Compact<u32>;
      readonly who: MultiAddress;
    } & Struct;
    readonly isThaw: boolean;
    readonly asThaw: {
      readonly id: Compact<u32>;
      readonly who: MultiAddress;
    } & Struct;
    readonly isFreezeAsset: boolean;
    readonly asFreezeAsset: {
      readonly id: Compact<u32>;
    } & Struct;
    readonly isThawAsset: boolean;
    readonly asThawAsset: {
      readonly id: Compact<u32>;
    } & Struct;
    readonly isTransferOwnership: boolean;
    readonly asTransferOwnership: {
      readonly id: Compact<u32>;
      readonly owner: MultiAddress;
    } & Struct;
    readonly isSetTeam: boolean;
    readonly asSetTeam: {
      readonly id: Compact<u32>;
      readonly issuer: MultiAddress;
      readonly admin: MultiAddress;
      readonly freezer: MultiAddress;
    } & Struct;
    readonly isSetMetadata: boolean;
    readonly asSetMetadata: {
      readonly id: Compact<u32>;
      readonly name: Bytes;
      readonly symbol: Bytes;
      readonly decimals: u8;
    } & Struct;
    readonly isClearMetadata: boolean;
    readonly asClearMetadata: {
      readonly id: Compact<u32>;
    } & Struct;
    readonly isForceSetMetadata: boolean;
    readonly asForceSetMetadata: {
      readonly id: Compact<u32>;
      readonly name: Bytes;
      readonly symbol: Bytes;
      readonly decimals: u8;
      readonly isFrozen: bool;
    } & Struct;
    readonly isForceClearMetadata: boolean;
    readonly asForceClearMetadata: {
      readonly id: Compact<u32>;
    } & Struct;
    readonly isForceAssetStatus: boolean;
    readonly asForceAssetStatus: {
      readonly id: Compact<u32>;
      readonly owner: MultiAddress;
      readonly issuer: MultiAddress;
      readonly admin: MultiAddress;
      readonly freezer: MultiAddress;
      readonly minBalance: Compact<u128>;
      readonly isSufficient: bool;
      readonly isFrozen: bool;
    } & Struct;
    readonly isApproveTransfer: boolean;
    readonly asApproveTransfer: {
      readonly id: Compact<u32>;
      readonly delegate: MultiAddress;
      readonly amount: Compact<u128>;
    } & Struct;
    readonly isCancelApproval: boolean;
    readonly asCancelApproval: {
      readonly id: Compact<u32>;
      readonly delegate: MultiAddress;
    } & Struct;
    readonly isForceCancelApproval: boolean;
    readonly asForceCancelApproval: {
      readonly id: Compact<u32>;
      readonly owner: MultiAddress;
      readonly delegate: MultiAddress;
    } & Struct;
    readonly isTransferApproved: boolean;
    readonly asTransferApproved: {
      readonly id: Compact<u32>;
      readonly owner: MultiAddress;
      readonly destination: MultiAddress;
      readonly amount: Compact<u128>;
    } & Struct;
    readonly isTouch: boolean;
    readonly asTouch: {
      readonly id: Compact<u32>;
    } & Struct;
    readonly isRefund: boolean;
    readonly asRefund: {
      readonly id: Compact<u32>;
      readonly allowBurn: bool;
    } & Struct;
    readonly isSetMinBalance: boolean;
    readonly asSetMinBalance: {
      readonly id: Compact<u32>;
      readonly minBalance: u128;
    } & Struct;
    readonly isTouchOther: boolean;
    readonly asTouchOther: {
      readonly id: Compact<u32>;
      readonly who: MultiAddress;
    } & Struct;
    readonly isRefundOther: boolean;
    readonly asRefundOther: {
      readonly id: Compact<u32>;
      readonly who: MultiAddress;
    } & Struct;
    readonly isBlock: boolean;
    readonly asBlock: {
      readonly id: Compact<u32>;
      readonly who: MultiAddress;
    } & Struct;
    readonly isTransferAll: boolean;
    readonly asTransferAll: {
      readonly id: Compact<u32>;
      readonly dest: MultiAddress;
      readonly keepAlive: bool;
    } & Struct;
    readonly isSetReserves: boolean;
    readonly asSetReserves: {
      readonly id: Compact<u32>;
      readonly reserves: Vec<Null>;
    } & Struct;
    readonly type: 'Create' | 'ForceCreate' | 'StartDestroy' | 'DestroyAccounts' | 'DestroyApprovals' | 'FinishDestroy' | 'Mint' | 'Burn' | 'Transfer' | 'TransferKeepAlive' | 'ForceTransfer' | 'Freeze' | 'Thaw' | 'FreezeAsset' | 'ThawAsset' | 'TransferOwnership' | 'SetTeam' | 'SetMetadata' | 'ClearMetadata' | 'ForceSetMetadata' | 'ForceClearMetadata' | 'ForceAssetStatus' | 'ApproveTransfer' | 'CancelApproval' | 'ForceCancelApproval' | 'TransferApproved' | 'Touch' | 'Refund' | 'SetMinBalance' | 'TouchOther' | 'RefundOther' | 'Block' | 'TransferAll' | 'SetReserves';
  }

  /** @name PalletBeefyCall (226) */
  interface PalletBeefyCall extends Enum {
    readonly isReportDoubleVoting: boolean;
    readonly asReportDoubleVoting: {
      readonly equivocationProof: SpConsensusBeefyDoubleVotingProof;
      readonly keyOwnerProof: SpSessionMembershipProof;
    } & Struct;
    readonly isReportDoubleVotingUnsigned: boolean;
    readonly asReportDoubleVotingUnsigned: {
      readonly equivocationProof: SpConsensusBeefyDoubleVotingProof;
      readonly keyOwnerProof: SpSessionMembershipProof;
    } & Struct;
    readonly isSetNewGenesis: boolean;
    readonly asSetNewGenesis: {
      readonly delayInBlocks: u32;
    } & Struct;
    readonly isReportForkVoting: boolean;
    readonly asReportForkVoting: {
      readonly equivocationProof: SpConsensusBeefyForkVotingProofAncestryProof;
      readonly keyOwnerProof: SpSessionMembershipProof;
    } & Struct;
    readonly isReportForkVotingUnsigned: boolean;
    readonly asReportForkVotingUnsigned: {
      readonly equivocationProof: SpConsensusBeefyForkVotingProofAncestryProof;
      readonly keyOwnerProof: SpSessionMembershipProof;
    } & Struct;
    readonly isReportFutureBlockVoting: boolean;
    readonly asReportFutureBlockVoting: {
      readonly equivocationProof: SpConsensusBeefyFutureBlockVotingProof;
      readonly keyOwnerProof: SpSessionMembershipProof;
    } & Struct;
    readonly isReportFutureBlockVotingUnsigned: boolean;
    readonly asReportFutureBlockVotingUnsigned: {
      readonly equivocationProof: SpConsensusBeefyFutureBlockVotingProof;
      readonly keyOwnerProof: SpSessionMembershipProof;
    } & Struct;
    readonly type: 'ReportDoubleVoting' | 'ReportDoubleVotingUnsigned' | 'SetNewGenesis' | 'ReportForkVoting' | 'ReportForkVotingUnsigned' | 'ReportFutureBlockVoting' | 'ReportFutureBlockVotingUnsigned';
  }

  /** @name SpConsensusBeefyDoubleVotingProof (227) */
  interface SpConsensusBeefyDoubleVotingProof extends Struct {
    readonly first: SpConsensusBeefyVoteMessage;
    readonly second: SpConsensusBeefyVoteMessage;
  }

  /** @name SpConsensusBeefyEcdsaCryptoSignature (228) */
  interface SpConsensusBeefyEcdsaCryptoSignature extends U8aFixed {}

  /** @name SpConsensusBeefyVoteMessage (229) */
  interface SpConsensusBeefyVoteMessage extends Struct {
    readonly commitment: SpConsensusBeefyCommitment;
    readonly id: SpConsensusBeefyEcdsaCryptoPublic;
    readonly signature: SpConsensusBeefyEcdsaCryptoSignature;
  }

  /** @name SpConsensusBeefyCommitment (230) */
  interface SpConsensusBeefyCommitment extends Struct {
    readonly payload: SpConsensusBeefyPayload;
    readonly blockNumber: u32;
    readonly validatorSetId: u64;
  }

  /** @name SpConsensusBeefyPayload (231) */
  interface SpConsensusBeefyPayload extends Vec<ITuple<[U8aFixed, Bytes]>> {}

  /** @name SpConsensusBeefyForkVotingProofAncestryProof (234) */
  interface SpConsensusBeefyForkVotingProofAncestryProof extends Struct {
    readonly vote: SpConsensusBeefyVoteMessage;
    readonly ancestryProof: SpMmrPrimitivesAncestryProof;
    readonly header: SpRuntimeHeader;
  }

  /** @name SpMmrPrimitivesAncestryProof (235) */
  interface SpMmrPrimitivesAncestryProof extends Struct {
    readonly prevPeaks: Vec<H256>;
    readonly prevLeafCount: u64;
    readonly leafCount: u64;
    readonly items: Vec<ITuple<[u64, H256]>>;
  }

  /** @name SpConsensusBeefyFutureBlockVotingProof (238) */
  interface SpConsensusBeefyFutureBlockVotingProof extends Struct {
    readonly vote: SpConsensusBeefyVoteMessage;
  }

  /** @name PalletLotteryCall (239) */
  interface PalletLotteryCall extends Enum {
    readonly isBuyTicket: boolean;
    readonly asBuyTicket: {
      readonly call: Call;
    } & Struct;
    readonly isSetCalls: boolean;
    readonly asSetCalls: {
      readonly calls: Vec<Call>;
    } & Struct;
    readonly isStartLottery: boolean;
    readonly asStartLottery: {
      readonly price: u128;
      readonly length: u32;
      readonly delay: u32;
      readonly repeat: bool;
    } & Struct;
    readonly isStopRepeat: boolean;
    readonly type: 'BuyTicket' | 'SetCalls' | 'StartLottery' | 'StopRepeat';
  }

  /** @name PalletUniquesCall (240) */
  interface PalletUniquesCall extends Enum {
    readonly isCreate: boolean;
    readonly asCreate: {
      readonly collection: u32;
      readonly admin: MultiAddress;
    } & Struct;
    readonly isForceCreate: boolean;
    readonly asForceCreate: {
      readonly collection: u32;
      readonly owner: MultiAddress;
      readonly freeHolding: bool;
    } & Struct;
    readonly isDestroy: boolean;
    readonly asDestroy: {
      readonly collection: u32;
      readonly witness: PalletUniquesDestroyWitness;
    } & Struct;
    readonly isMint: boolean;
    readonly asMint: {
      readonly collection: u32;
      readonly item: u32;
      readonly owner: MultiAddress;
    } & Struct;
    readonly isBurn: boolean;
    readonly asBurn: {
      readonly collection: u32;
      readonly item: u32;
      readonly checkOwner: Option<MultiAddress>;
    } & Struct;
    readonly isTransfer: boolean;
    readonly asTransfer: {
      readonly collection: u32;
      readonly item: u32;
      readonly dest: MultiAddress;
    } & Struct;
    readonly isRedeposit: boolean;
    readonly asRedeposit: {
      readonly collection: u32;
      readonly items: Vec<u32>;
    } & Struct;
    readonly isFreeze: boolean;
    readonly asFreeze: {
      readonly collection: u32;
      readonly item: u32;
    } & Struct;
    readonly isThaw: boolean;
    readonly asThaw: {
      readonly collection: u32;
      readonly item: u32;
    } & Struct;
    readonly isFreezeCollection: boolean;
    readonly asFreezeCollection: {
      readonly collection: u32;
    } & Struct;
    readonly isThawCollection: boolean;
    readonly asThawCollection: {
      readonly collection: u32;
    } & Struct;
    readonly isTransferOwnership: boolean;
    readonly asTransferOwnership: {
      readonly collection: u32;
      readonly newOwner: MultiAddress;
    } & Struct;
    readonly isSetTeam: boolean;
    readonly asSetTeam: {
      readonly collection: u32;
      readonly issuer: MultiAddress;
      readonly admin: MultiAddress;
      readonly freezer: MultiAddress;
    } & Struct;
    readonly isApproveTransfer: boolean;
    readonly asApproveTransfer: {
      readonly collection: u32;
      readonly item: u32;
      readonly delegate: MultiAddress;
    } & Struct;
    readonly isCancelApproval: boolean;
    readonly asCancelApproval: {
      readonly collection: u32;
      readonly item: u32;
      readonly maybeCheckDelegate: Option<MultiAddress>;
    } & Struct;
    readonly isForceItemStatus: boolean;
    readonly asForceItemStatus: {
      readonly collection: u32;
      readonly owner: MultiAddress;
      readonly issuer: MultiAddress;
      readonly admin: MultiAddress;
      readonly freezer: MultiAddress;
      readonly freeHolding: bool;
      readonly isFrozen: bool;
    } & Struct;
    readonly isSetAttribute: boolean;
    readonly asSetAttribute: {
      readonly collection: u32;
      readonly maybeItem: Option<u32>;
      readonly key: Bytes;
      readonly value: Bytes;
    } & Struct;
    readonly isClearAttribute: boolean;
    readonly asClearAttribute: {
      readonly collection: u32;
      readonly maybeItem: Option<u32>;
      readonly key: Bytes;
    } & Struct;
    readonly isSetMetadata: boolean;
    readonly asSetMetadata: {
      readonly collection: u32;
      readonly item: u32;
      readonly data: Bytes;
      readonly isFrozen: bool;
    } & Struct;
    readonly isClearMetadata: boolean;
    readonly asClearMetadata: {
      readonly collection: u32;
      readonly item: u32;
    } & Struct;
    readonly isSetCollectionMetadata: boolean;
    readonly asSetCollectionMetadata: {
      readonly collection: u32;
      readonly data: Bytes;
      readonly isFrozen: bool;
    } & Struct;
    readonly isClearCollectionMetadata: boolean;
    readonly asClearCollectionMetadata: {
      readonly collection: u32;
    } & Struct;
    readonly isSetAcceptOwnership: boolean;
    readonly asSetAcceptOwnership: {
      readonly maybeCollection: Option<u32>;
    } & Struct;
    readonly isSetCollectionMaxSupply: boolean;
    readonly asSetCollectionMaxSupply: {
      readonly collection: u32;
      readonly maxSupply: u32;
    } & Struct;
    readonly isSetPrice: boolean;
    readonly asSetPrice: {
      readonly collection: u32;
      readonly item: u32;
      readonly price: Option<u128>;
      readonly whitelistedBuyer: Option<MultiAddress>;
    } & Struct;
    readonly isBuyItem: boolean;
    readonly asBuyItem: {
      readonly collection: u32;
      readonly item: u32;
      readonly bidPrice: u128;
    } & Struct;
    readonly type: 'Create' | 'ForceCreate' | 'Destroy' | 'Mint' | 'Burn' | 'Transfer' | 'Redeposit' | 'Freeze' | 'Thaw' | 'FreezeCollection' | 'ThawCollection' | 'TransferOwnership' | 'SetTeam' | 'ApproveTransfer' | 'CancelApproval' | 'ForceItemStatus' | 'SetAttribute' | 'ClearAttribute' | 'SetMetadata' | 'ClearMetadata' | 'SetCollectionMetadata' | 'ClearCollectionMetadata' | 'SetAcceptOwnership' | 'SetCollectionMaxSupply' | 'SetPrice' | 'BuyItem';
  }

  /** @name PalletUniquesDestroyWitness (241) */
  interface PalletUniquesDestroyWitness extends Struct {
    readonly items: Compact<u32>;
    readonly itemMetadatas: Compact<u32>;
    readonly attributes: Compact<u32>;
  }

  /** @name PalletNftsCall (245) */
  interface PalletNftsCall extends Enum {
    readonly isCreate: boolean;
    readonly asCreate: {
      readonly admin: MultiAddress;
      readonly config: PalletNftsCollectionConfig;
    } & Struct;
    readonly isForceCreate: boolean;
    readonly asForceCreate: {
      readonly owner: MultiAddress;
      readonly config: PalletNftsCollectionConfig;
    } & Struct;
    readonly isDestroy: boolean;
    readonly asDestroy: {
      readonly collection: u32;
      readonly witness: PalletNftsDestroyWitness;
    } & Struct;
    readonly isMint: boolean;
    readonly asMint: {
      readonly collection: u32;
      readonly item: u32;
      readonly mintTo: MultiAddress;
      readonly witnessData: Option<PalletNftsMintWitness>;
    } & Struct;
    readonly isForceMint: boolean;
    readonly asForceMint: {
      readonly collection: u32;
      readonly item: u32;
      readonly mintTo: MultiAddress;
      readonly itemConfig: PalletNftsItemConfig;
    } & Struct;
    readonly isBurn: boolean;
    readonly asBurn: {
      readonly collection: u32;
      readonly item: u32;
    } & Struct;
    readonly isTransfer: boolean;
    readonly asTransfer: {
      readonly collection: u32;
      readonly item: u32;
      readonly dest: MultiAddress;
    } & Struct;
    readonly isRedeposit: boolean;
    readonly asRedeposit: {
      readonly collection: u32;
      readonly items: Vec<u32>;
    } & Struct;
    readonly isLockItemTransfer: boolean;
    readonly asLockItemTransfer: {
      readonly collection: u32;
      readonly item: u32;
    } & Struct;
    readonly isUnlockItemTransfer: boolean;
    readonly asUnlockItemTransfer: {
      readonly collection: u32;
      readonly item: u32;
    } & Struct;
    readonly isLockCollection: boolean;
    readonly asLockCollection: {
      readonly collection: u32;
      readonly lockSettings: u64;
    } & Struct;
    readonly isTransferOwnership: boolean;
    readonly asTransferOwnership: {
      readonly collection: u32;
      readonly newOwner: MultiAddress;
    } & Struct;
    readonly isSetTeam: boolean;
    readonly asSetTeam: {
      readonly collection: u32;
      readonly issuer: Option<MultiAddress>;
      readonly admin: Option<MultiAddress>;
      readonly freezer: Option<MultiAddress>;
    } & Struct;
    readonly isForceCollectionOwner: boolean;
    readonly asForceCollectionOwner: {
      readonly collection: u32;
      readonly owner: MultiAddress;
    } & Struct;
    readonly isForceCollectionConfig: boolean;
    readonly asForceCollectionConfig: {
      readonly collection: u32;
      readonly config: PalletNftsCollectionConfig;
    } & Struct;
    readonly isApproveTransfer: boolean;
    readonly asApproveTransfer: {
      readonly collection: u32;
      readonly item: u32;
      readonly delegate: MultiAddress;
      readonly maybeDeadline: Option<u32>;
    } & Struct;
    readonly isCancelApproval: boolean;
    readonly asCancelApproval: {
      readonly collection: u32;
      readonly item: u32;
      readonly delegate: MultiAddress;
    } & Struct;
    readonly isClearAllTransferApprovals: boolean;
    readonly asClearAllTransferApprovals: {
      readonly collection: u32;
      readonly item: u32;
    } & Struct;
    readonly isLockItemProperties: boolean;
    readonly asLockItemProperties: {
      readonly collection: u32;
      readonly item: u32;
      readonly lockMetadata: bool;
      readonly lockAttributes: bool;
    } & Struct;
    readonly isSetAttribute: boolean;
    readonly asSetAttribute: {
      readonly collection: u32;
      readonly maybeItem: Option<u32>;
      readonly namespace: PalletNftsAttributeNamespace;
      readonly key: Bytes;
      readonly value: Bytes;
    } & Struct;
    readonly isForceSetAttribute: boolean;
    readonly asForceSetAttribute: {
      readonly setAs: Option<AccountId32>;
      readonly collection: u32;
      readonly maybeItem: Option<u32>;
      readonly namespace: PalletNftsAttributeNamespace;
      readonly key: Bytes;
      readonly value: Bytes;
    } & Struct;
    readonly isClearAttribute: boolean;
    readonly asClearAttribute: {
      readonly collection: u32;
      readonly maybeItem: Option<u32>;
      readonly namespace: PalletNftsAttributeNamespace;
      readonly key: Bytes;
    } & Struct;
    readonly isApproveItemAttributes: boolean;
    readonly asApproveItemAttributes: {
      readonly collection: u32;
      readonly item: u32;
      readonly delegate: MultiAddress;
    } & Struct;
    readonly isCancelItemAttributesApproval: boolean;
    readonly asCancelItemAttributesApproval: {
      readonly collection: u32;
      readonly item: u32;
      readonly delegate: MultiAddress;
      readonly witness: PalletNftsCancelAttributesApprovalWitness;
    } & Struct;
    readonly isSetMetadata: boolean;
    readonly asSetMetadata: {
      readonly collection: u32;
      readonly item: u32;
      readonly data: Bytes;
    } & Struct;
    readonly isClearMetadata: boolean;
    readonly asClearMetadata: {
      readonly collection: u32;
      readonly item: u32;
    } & Struct;
    readonly isSetCollectionMetadata: boolean;
    readonly asSetCollectionMetadata: {
      readonly collection: u32;
      readonly data: Bytes;
    } & Struct;
    readonly isClearCollectionMetadata: boolean;
    readonly asClearCollectionMetadata: {
      readonly collection: u32;
    } & Struct;
    readonly isSetAcceptOwnership: boolean;
    readonly asSetAcceptOwnership: {
      readonly maybeCollection: Option<u32>;
    } & Struct;
    readonly isSetCollectionMaxSupply: boolean;
    readonly asSetCollectionMaxSupply: {
      readonly collection: u32;
      readonly maxSupply: u32;
    } & Struct;
    readonly isUpdateMintSettings: boolean;
    readonly asUpdateMintSettings: {
      readonly collection: u32;
      readonly mintSettings: PalletNftsMintSettings;
    } & Struct;
    readonly isSetPrice: boolean;
    readonly asSetPrice: {
      readonly collection: u32;
      readonly item: u32;
      readonly price: Option<u128>;
      readonly whitelistedBuyer: Option<MultiAddress>;
    } & Struct;
    readonly isBuyItem: boolean;
    readonly asBuyItem: {
      readonly collection: u32;
      readonly item: u32;
      readonly bidPrice: u128;
    } & Struct;
    readonly isPayTips: boolean;
    readonly asPayTips: {
      readonly tips: Vec<PalletNftsItemTip>;
    } & Struct;
    readonly isCreateSwap: boolean;
    readonly asCreateSwap: {
      readonly offeredCollection: u32;
      readonly offeredItem: u32;
      readonly desiredCollection: u32;
      readonly maybeDesiredItem: Option<u32>;
      readonly maybePrice: Option<PalletNftsPriceWithDirection>;
      readonly duration: u32;
    } & Struct;
    readonly isCancelSwap: boolean;
    readonly asCancelSwap: {
      readonly offeredCollection: u32;
      readonly offeredItem: u32;
    } & Struct;
    readonly isClaimSwap: boolean;
    readonly asClaimSwap: {
      readonly sendCollection: u32;
      readonly sendItem: u32;
      readonly receiveCollection: u32;
      readonly receiveItem: u32;
      readonly witnessPrice: Option<PalletNftsPriceWithDirection>;
    } & Struct;
    readonly isMintPreSigned: boolean;
    readonly asMintPreSigned: {
      readonly mintData: PalletNftsPreSignedMint;
      readonly signature: SpRuntimeMultiSignature;
      readonly signer: AccountId32;
    } & Struct;
    readonly isSetAttributesPreSigned: boolean;
    readonly asSetAttributesPreSigned: {
      readonly data: PalletNftsPreSignedAttributes;
      readonly signature: SpRuntimeMultiSignature;
      readonly signer: AccountId32;
    } & Struct;
    readonly type: 'Create' | 'ForceCreate' | 'Destroy' | 'Mint' | 'ForceMint' | 'Burn' | 'Transfer' | 'Redeposit' | 'LockItemTransfer' | 'UnlockItemTransfer' | 'LockCollection' | 'TransferOwnership' | 'SetTeam' | 'ForceCollectionOwner' | 'ForceCollectionConfig' | 'ApproveTransfer' | 'CancelApproval' | 'ClearAllTransferApprovals' | 'LockItemProperties' | 'SetAttribute' | 'ForceSetAttribute' | 'ClearAttribute' | 'ApproveItemAttributes' | 'CancelItemAttributesApproval' | 'SetMetadata' | 'ClearMetadata' | 'SetCollectionMetadata' | 'ClearCollectionMetadata' | 'SetAcceptOwnership' | 'SetCollectionMaxSupply' | 'UpdateMintSettings' | 'SetPrice' | 'BuyItem' | 'PayTips' | 'CreateSwap' | 'CancelSwap' | 'ClaimSwap' | 'MintPreSigned' | 'SetAttributesPreSigned';
  }

  /** @name PalletNftsCollectionConfig (246) */
  interface PalletNftsCollectionConfig extends Struct {
    readonly settings: u64;
    readonly maxSupply: Option<u32>;
    readonly mintSettings: PalletNftsMintSettings;
  }

  /** @name PalletNftsCollectionSetting (248) */
  interface PalletNftsCollectionSetting extends Enum {
    readonly isTransferableItems: boolean;
    readonly isUnlockedMetadata: boolean;
    readonly isUnlockedAttributes: boolean;
    readonly isUnlockedMaxSupply: boolean;
    readonly isDepositRequired: boolean;
    readonly type: 'TransferableItems' | 'UnlockedMetadata' | 'UnlockedAttributes' | 'UnlockedMaxSupply' | 'DepositRequired';
  }

  /** @name PalletNftsMintSettings (249) */
  interface PalletNftsMintSettings extends Struct {
    readonly mintType: PalletNftsMintType;
    readonly price: Option<u128>;
    readonly startBlock: Option<u32>;
    readonly endBlock: Option<u32>;
    readonly defaultItemSettings: u64;
  }

  /** @name PalletNftsMintType (250) */
  interface PalletNftsMintType extends Enum {
    readonly isIssuer: boolean;
    readonly isPublic: boolean;
    readonly isHolderOf: boolean;
    readonly asHolderOf: u32;
    readonly type: 'Issuer' | 'Public' | 'HolderOf';
  }

  /** @name PalletNftsItemSetting (252) */
  interface PalletNftsItemSetting extends Enum {
    readonly isTransferable: boolean;
    readonly isUnlockedMetadata: boolean;
    readonly isUnlockedAttributes: boolean;
    readonly type: 'Transferable' | 'UnlockedMetadata' | 'UnlockedAttributes';
  }

  /** @name PalletNftsDestroyWitness (253) */
  interface PalletNftsDestroyWitness extends Struct {
    readonly itemMetadatas: Compact<u32>;
    readonly itemConfigs: Compact<u32>;
    readonly attributes: Compact<u32>;
  }

  /** @name PalletNftsMintWitness (255) */
  interface PalletNftsMintWitness extends Struct {
    readonly ownedItem: Option<u32>;
    readonly mintPrice: Option<u128>;
  }

  /** @name PalletNftsItemConfig (256) */
  interface PalletNftsItemConfig extends Struct {
    readonly settings: u64;
  }

  /** @name PalletNftsAttributeNamespace (257) */
  interface PalletNftsAttributeNamespace extends Enum {
    readonly isPallet: boolean;
    readonly isCollectionOwner: boolean;
    readonly isItemOwner: boolean;
    readonly isAccount: boolean;
    readonly asAccount: AccountId32;
    readonly type: 'Pallet' | 'CollectionOwner' | 'ItemOwner' | 'Account';
  }

  /** @name PalletNftsCancelAttributesApprovalWitness (259) */
  interface PalletNftsCancelAttributesApprovalWitness extends Struct {
    readonly accountAttributes: u32;
  }

  /** @name PalletNftsItemTip (261) */
  interface PalletNftsItemTip extends Struct {
    readonly collection: u32;
    readonly item: u32;
    readonly receiver: AccountId32;
    readonly amount: u128;
  }

  /** @name PalletNftsPriceWithDirection (264) */
  interface PalletNftsPriceWithDirection extends Struct {
    readonly amount: u128;
    readonly direction: PalletNftsPriceDirection;
  }

  /** @name PalletNftsPriceDirection (265) */
  interface PalletNftsPriceDirection extends Enum {
    readonly isSend: boolean;
    readonly isReceive: boolean;
    readonly type: 'Send' | 'Receive';
  }

  /** @name PalletNftsPreSignedMint (266) */
  interface PalletNftsPreSignedMint extends Struct {
    readonly collection: u32;
    readonly item: u32;
    readonly attributes: Vec<ITuple<[Bytes, Bytes]>>;
    readonly metadata: Bytes;
    readonly onlyAccount: Option<AccountId32>;
    readonly deadline: u32;
    readonly mintPrice: Option<u128>;
  }

  /** @name PalletNftsPreSignedAttributes (267) */
  interface PalletNftsPreSignedAttributes extends Struct {
    readonly collection: u32;
    readonly item: u32;
    readonly attributes: Vec<ITuple<[Bytes, Bytes]>>;
    readonly namespace: PalletNftsAttributeNamespace;
    readonly deadline: u32;
  }

  /** @name PalletNftFractionalizationCall (268) */
  interface PalletNftFractionalizationCall extends Enum {
    readonly isFractionalize: boolean;
    readonly asFractionalize: {
      readonly nftCollectionId: u32;
      readonly nftId: u32;
      readonly assetId: u32;
      readonly beneficiary: MultiAddress;
      readonly fractions: u128;
    } & Struct;
    readonly isUnify: boolean;
    readonly asUnify: {
      readonly nftCollectionId: u32;
      readonly nftId: u32;
      readonly assetId: u32;
      readonly beneficiary: MultiAddress;
    } & Struct;
    readonly type: 'Fractionalize' | 'Unify';
  }

  /** @name PalletTransactionStorageCall (269) */
  interface PalletTransactionStorageCall extends Enum {
    readonly isStore: boolean;
    readonly asStore: {
      readonly data: Bytes;
    } & Struct;
    readonly isRenew: boolean;
    readonly asRenew: {
      readonly block: u32;
      readonly index: u32;
    } & Struct;
    readonly isCheckProof: boolean;
    readonly asCheckProof: {
      readonly proof: SpTransactionStorageProofTransactionStorageProof;
    } & Struct;
    readonly type: 'Store' | 'Renew' | 'CheckProof';
  }

  /** @name SpTransactionStorageProofTransactionStorageProof (270) */
  interface SpTransactionStorageProofTransactionStorageProof extends Struct {
    readonly chunk: Bytes;
    readonly proof: Vec<Bytes>;
  }

  /** @name PalletBagsListCall (271) */
  interface PalletBagsListCall extends Enum {
    readonly isRebag: boolean;
    readonly asRebag: {
      readonly dislocated: MultiAddress;
    } & Struct;
    readonly isPutInFrontOf: boolean;
    readonly asPutInFrontOf: {
      readonly lighter: MultiAddress;
    } & Struct;
    readonly isPutInFrontOfOther: boolean;
    readonly asPutInFrontOfOther: {
      readonly heavier: MultiAddress;
      readonly lighter: MultiAddress;
    } & Struct;
    readonly type: 'Rebag' | 'PutInFrontOf' | 'PutInFrontOfOther';
  }

  /** @name PalletChildBountiesCall (272) */
  interface PalletChildBountiesCall extends Enum {
    readonly isAddChildBounty: boolean;
    readonly asAddChildBounty: {
      readonly parentBountyId: Compact<u32>;
      readonly value: Compact<u128>;
      readonly description: Bytes;
    } & Struct;
    readonly isProposeCurator: boolean;
    readonly asProposeCurator: {
      readonly parentBountyId: Compact<u32>;
      readonly childBountyId: Compact<u32>;
      readonly curator: MultiAddress;
      readonly fee: Compact<u128>;
    } & Struct;
    readonly isAcceptCurator: boolean;
    readonly asAcceptCurator: {
      readonly parentBountyId: Compact<u32>;
      readonly childBountyId: Compact<u32>;
    } & Struct;
    readonly isUnassignCurator: boolean;
    readonly asUnassignCurator: {
      readonly parentBountyId: Compact<u32>;
      readonly childBountyId: Compact<u32>;
    } & Struct;
    readonly isAwardChildBounty: boolean;
    readonly asAwardChildBounty: {
      readonly parentBountyId: Compact<u32>;
      readonly childBountyId: Compact<u32>;
      readonly beneficiary: MultiAddress;
    } & Struct;
    readonly isClaimChildBounty: boolean;
    readonly asClaimChildBounty: {
      readonly parentBountyId: Compact<u32>;
      readonly childBountyId: Compact<u32>;
    } & Struct;
    readonly isCloseChildBounty: boolean;
    readonly asCloseChildBounty: {
      readonly parentBountyId: Compact<u32>;
      readonly childBountyId: Compact<u32>;
    } & Struct;
    readonly type: 'AddChildBounty' | 'ProposeCurator' | 'AcceptCurator' | 'UnassignCurator' | 'AwardChildBounty' | 'ClaimChildBounty' | 'CloseChildBounty';
  }

  /** @name PalletRemarkCall (273) */
  interface PalletRemarkCall extends Enum {
    readonly isStore: boolean;
    readonly asStore: {
      readonly remark: Bytes;
    } & Struct;
    readonly type: 'Store';
  }

  /** @name PalletNominationPoolsCall (274) */
  interface PalletNominationPoolsCall extends Enum {
    readonly isJoin: boolean;
    readonly asJoin: {
      readonly amount: Compact<u128>;
      readonly poolId: u32;
    } & Struct;
    readonly isBondExtra: boolean;
    readonly asBondExtra: {
      readonly extra: PalletNominationPoolsBondExtra;
    } & Struct;
    readonly isClaimPayout: boolean;
    readonly isUnbond: boolean;
    readonly asUnbond: {
      readonly memberAccount: MultiAddress;
      readonly unbondingPoints: Compact<u128>;
    } & Struct;
    readonly isPoolWithdrawUnbonded: boolean;
    readonly asPoolWithdrawUnbonded: {
      readonly poolId: u32;
      readonly numSlashingSpans: u32;
    } & Struct;
    readonly isWithdrawUnbonded: boolean;
    readonly asWithdrawUnbonded: {
      readonly memberAccount: MultiAddress;
      readonly numSlashingSpans: u32;
    } & Struct;
    readonly isCreate: boolean;
    readonly asCreate: {
      readonly amount: Compact<u128>;
      readonly root: MultiAddress;
      readonly nominator: MultiAddress;
      readonly bouncer: MultiAddress;
    } & Struct;
    readonly isCreateWithPoolId: boolean;
    readonly asCreateWithPoolId: {
      readonly amount: Compact<u128>;
      readonly root: MultiAddress;
      readonly nominator: MultiAddress;
      readonly bouncer: MultiAddress;
      readonly poolId: u32;
    } & Struct;
    readonly isNominate: boolean;
    readonly asNominate: {
      readonly poolId: u32;
      readonly validators: Vec<AccountId32>;
    } & Struct;
    readonly isSetState: boolean;
    readonly asSetState: {
      readonly poolId: u32;
      readonly state: PalletNominationPoolsPoolState;
    } & Struct;
    readonly isSetMetadata: boolean;
    readonly asSetMetadata: {
      readonly poolId: u32;
      readonly metadata: Bytes;
    } & Struct;
    readonly isSetConfigs: boolean;
    readonly asSetConfigs: {
      readonly minJoinBond: PalletNominationPoolsConfigOpU128;
      readonly minCreateBond: PalletNominationPoolsConfigOpU128;
      readonly maxPools: PalletNominationPoolsConfigOpU32;
      readonly maxMembers: PalletNominationPoolsConfigOpU32;
      readonly maxMembersPerPool: PalletNominationPoolsConfigOpU32;
      readonly globalMaxCommission: PalletNominationPoolsConfigOpPerbill;
    } & Struct;
    readonly isUpdateRoles: boolean;
    readonly asUpdateRoles: {
      readonly poolId: u32;
      readonly newRoot: PalletNominationPoolsConfigOpAccountId32;
      readonly newNominator: PalletNominationPoolsConfigOpAccountId32;
      readonly newBouncer: PalletNominationPoolsConfigOpAccountId32;
    } & Struct;
    readonly isChill: boolean;
    readonly asChill: {
      readonly poolId: u32;
    } & Struct;
    readonly isBondExtraOther: boolean;
    readonly asBondExtraOther: {
      readonly member: MultiAddress;
      readonly extra: PalletNominationPoolsBondExtra;
    } & Struct;
    readonly isSetClaimPermission: boolean;
    readonly asSetClaimPermission: {
      readonly permission: PalletNominationPoolsClaimPermission;
    } & Struct;
    readonly isClaimPayoutOther: boolean;
    readonly asClaimPayoutOther: {
      readonly other: AccountId32;
    } & Struct;
    readonly isSetCommission: boolean;
    readonly asSetCommission: {
      readonly poolId: u32;
      readonly newCommission: Option<ITuple<[Perbill, AccountId32]>>;
    } & Struct;
    readonly isSetCommissionMax: boolean;
    readonly asSetCommissionMax: {
      readonly poolId: u32;
      readonly maxCommission: Perbill;
    } & Struct;
    readonly isSetCommissionChangeRate: boolean;
    readonly asSetCommissionChangeRate: {
      readonly poolId: u32;
      readonly changeRate: PalletNominationPoolsCommissionChangeRate;
    } & Struct;
    readonly isClaimCommission: boolean;
    readonly asClaimCommission: {
      readonly poolId: u32;
    } & Struct;
    readonly isAdjustPoolDeposit: boolean;
    readonly asAdjustPoolDeposit: {
      readonly poolId: u32;
    } & Struct;
    readonly isSetCommissionClaimPermission: boolean;
    readonly asSetCommissionClaimPermission: {
      readonly poolId: u32;
      readonly permission: Option<PalletNominationPoolsCommissionClaimPermission>;
    } & Struct;
    readonly isApplySlash: boolean;
    readonly asApplySlash: {
      readonly memberAccount: MultiAddress;
    } & Struct;
    readonly isMigrateDelegation: boolean;
    readonly asMigrateDelegation: {
      readonly memberAccount: MultiAddress;
    } & Struct;
    readonly isMigratePoolToDelegateStake: boolean;
    readonly asMigratePoolToDelegateStake: {
      readonly poolId: u32;
    } & Struct;
    readonly type: 'Join' | 'BondExtra' | 'ClaimPayout' | 'Unbond' | 'PoolWithdrawUnbonded' | 'WithdrawUnbonded' | 'Create' | 'CreateWithPoolId' | 'Nominate' | 'SetState' | 'SetMetadata' | 'SetConfigs' | 'UpdateRoles' | 'Chill' | 'BondExtraOther' | 'SetClaimPermission' | 'ClaimPayoutOther' | 'SetCommission' | 'SetCommissionMax' | 'SetCommissionChangeRate' | 'ClaimCommission' | 'AdjustPoolDeposit' | 'SetCommissionClaimPermission' | 'ApplySlash' | 'MigrateDelegation' | 'MigratePoolToDelegateStake';
  }

  /** @name PalletNominationPoolsBondExtra (275) */
  interface PalletNominationPoolsBondExtra extends Enum {
    readonly isFreeBalance: boolean;
    readonly asFreeBalance: u128;
    readonly isRewards: boolean;
    readonly type: 'FreeBalance' | 'Rewards';
  }

  /** @name PalletNominationPoolsPoolState (276) */
  interface PalletNominationPoolsPoolState extends Enum {
    readonly isOpen: boolean;
    readonly isBlocked: boolean;
    readonly isDestroying: boolean;
    readonly type: 'Open' | 'Blocked' | 'Destroying';
  }

  /** @name PalletNominationPoolsConfigOpU128 (277) */
  interface PalletNominationPoolsConfigOpU128 extends Enum {
    readonly isNoop: boolean;
    readonly isSet: boolean;
    readonly asSet: u128;
    readonly isRemove: boolean;
    readonly type: 'Noop' | 'Set' | 'Remove';
  }

  /** @name PalletNominationPoolsConfigOpU32 (278) */
  interface PalletNominationPoolsConfigOpU32 extends Enum {
    readonly isNoop: boolean;
    readonly isSet: boolean;
    readonly asSet: u32;
    readonly isRemove: boolean;
    readonly type: 'Noop' | 'Set' | 'Remove';
  }

  /** @name PalletNominationPoolsConfigOpPerbill (279) */
  interface PalletNominationPoolsConfigOpPerbill extends Enum {
    readonly isNoop: boolean;
    readonly isSet: boolean;
    readonly asSet: Perbill;
    readonly isRemove: boolean;
    readonly type: 'Noop' | 'Set' | 'Remove';
  }

  /** @name PalletNominationPoolsConfigOpAccountId32 (280) */
  interface PalletNominationPoolsConfigOpAccountId32 extends Enum {
    readonly isNoop: boolean;
    readonly isSet: boolean;
    readonly asSet: AccountId32;
    readonly isRemove: boolean;
    readonly type: 'Noop' | 'Set' | 'Remove';
  }

  /** @name PalletNominationPoolsClaimPermission (281) */
  interface PalletNominationPoolsClaimPermission extends Enum {
    readonly isPermissioned: boolean;
    readonly isPermissionlessCompound: boolean;
    readonly isPermissionlessWithdraw: boolean;
    readonly isPermissionlessAll: boolean;
    readonly type: 'Permissioned' | 'PermissionlessCompound' | 'PermissionlessWithdraw' | 'PermissionlessAll';
  }

  /** @name PalletNominationPoolsCommissionChangeRate (284) */
  interface PalletNominationPoolsCommissionChangeRate extends Struct {
    readonly maxIncrease: Perbill;
    readonly minDelay: u32;
  }

  /** @name PalletNominationPoolsCommissionClaimPermission (286) */
  interface PalletNominationPoolsCommissionClaimPermission extends Enum {
    readonly isPermissionless: boolean;
    readonly isAccount: boolean;
    readonly asAccount: AccountId32;
    readonly type: 'Permissionless' | 'Account';
  }

  /** @name PalletAssetConversionCall (287) */
  interface PalletAssetConversionCall extends Enum {
    readonly isCreatePool: boolean;
    readonly asCreatePool: {
      readonly asset1: FrameSupportTokensFungibleUnionOfNativeOrWithId;
      readonly asset2: FrameSupportTokensFungibleUnionOfNativeOrWithId;
    } & Struct;
    readonly isAddLiquidity: boolean;
    readonly asAddLiquidity: {
      readonly asset1: FrameSupportTokensFungibleUnionOfNativeOrWithId;
      readonly asset2: FrameSupportTokensFungibleUnionOfNativeOrWithId;
      readonly amount1Desired: u128;
      readonly amount2Desired: u128;
      readonly amount1Min: u128;
      readonly amount2Min: u128;
      readonly mintTo: AccountId32;
    } & Struct;
    readonly isRemoveLiquidity: boolean;
    readonly asRemoveLiquidity: {
      readonly asset1: FrameSupportTokensFungibleUnionOfNativeOrWithId;
      readonly asset2: FrameSupportTokensFungibleUnionOfNativeOrWithId;
      readonly lpTokenBurn: u128;
      readonly amount1MinReceive: u128;
      readonly amount2MinReceive: u128;
      readonly withdrawTo: AccountId32;
    } & Struct;
    readonly isSwapExactTokensForTokens: boolean;
    readonly asSwapExactTokensForTokens: {
      readonly path: Vec<FrameSupportTokensFungibleUnionOfNativeOrWithId>;
      readonly amountIn: u128;
      readonly amountOutMin: u128;
      readonly sendTo: AccountId32;
      readonly keepAlive: bool;
    } & Struct;
    readonly isSwapTokensForExactTokens: boolean;
    readonly asSwapTokensForExactTokens: {
      readonly path: Vec<FrameSupportTokensFungibleUnionOfNativeOrWithId>;
      readonly amountOut: u128;
      readonly amountInMax: u128;
      readonly sendTo: AccountId32;
      readonly keepAlive: bool;
    } & Struct;
    readonly isTouch: boolean;
    readonly asTouch: {
      readonly asset1: FrameSupportTokensFungibleUnionOfNativeOrWithId;
      readonly asset2: FrameSupportTokensFungibleUnionOfNativeOrWithId;
    } & Struct;
    readonly isCreatePoolWithFee: boolean;
    readonly asCreatePoolWithFee: {
      readonly creator: AccountId32;
      readonly asset1: FrameSupportTokensFungibleUnionOfNativeOrWithId;
      readonly asset2: FrameSupportTokensFungibleUnionOfNativeOrWithId;
      readonly fee: Permill;
    } & Struct;
    readonly isSetPoolFee: boolean;
    readonly asSetPoolFee: {
      readonly poolId: ITuple<[FrameSupportTokensFungibleUnionOfNativeOrWithId, FrameSupportTokensFungibleUnionOfNativeOrWithId]>;
      readonly fee: Permill;
    } & Struct;
    readonly type: 'CreatePool' | 'AddLiquidity' | 'RemoveLiquidity' | 'SwapExactTokensForTokens' | 'SwapTokensForExactTokens' | 'Touch' | 'CreatePoolWithFee' | 'SetPoolFee';
  }

  /** @name PalletFastUnstakeCall (291) */
  interface PalletFastUnstakeCall extends Enum {
    readonly isRegisterFastUnstake: boolean;
    readonly isDeregister: boolean;
    readonly isControl: boolean;
    readonly asControl: {
      readonly erasToCheck: u32;
    } & Struct;
    readonly type: 'RegisterFastUnstake' | 'Deregister' | 'Control';
  }

  /** @name PalletMessageQueueCall (292) */
  interface PalletMessageQueueCall extends Enum {
    readonly isReapPage: boolean;
    readonly asReapPage: {
      readonly messageOrigin: u32;
      readonly pageIndex: u32;
    } & Struct;
    readonly isExecuteOverweight: boolean;
    readonly asExecuteOverweight: {
      readonly messageOrigin: u32;
      readonly page: u32;
      readonly index: u32;
      readonly weightLimit: SpWeightsWeightV2Weight;
    } & Struct;
    readonly type: 'ReapPage' | 'ExecuteOverweight';
  }

  /** @name PalletTxPauseCall (293) */
  interface PalletTxPauseCall extends Enum {
    readonly isPause: boolean;
    readonly asPause: {
      readonly fullName: ITuple<[Bytes, Bytes]>;
    } & Struct;
    readonly isUnpause: boolean;
    readonly asUnpause: {
      readonly ident: ITuple<[Bytes, Bytes]>;
    } & Struct;
    readonly type: 'Pause' | 'Unpause';
  }

  /** @name PalletSafeModeCall (295) */
  interface PalletSafeModeCall extends Enum {
    readonly isEnter: boolean;
    readonly isForceEnter: boolean;
    readonly isExtend: boolean;
    readonly isForceExtend: boolean;
    readonly isForceExit: boolean;
    readonly isForceSlashDeposit: boolean;
    readonly asForceSlashDeposit: {
      readonly account: AccountId32;
      readonly block: u32;
    } & Struct;
    readonly isReleaseDeposit: boolean;
    readonly asReleaseDeposit: {
      readonly account: AccountId32;
      readonly block: u32;
    } & Struct;
    readonly isForceReleaseDeposit: boolean;
    readonly asForceReleaseDeposit: {
      readonly account: AccountId32;
      readonly block: u32;
    } & Struct;
    readonly type: 'Enter' | 'ForceEnter' | 'Extend' | 'ForceExtend' | 'ForceExit' | 'ForceSlashDeposit' | 'ReleaseDeposit' | 'ForceReleaseDeposit';
  }

  /** @name PalletMigrationsCall (296) */
  interface PalletMigrationsCall extends Enum {
    readonly isForceSetCursor: boolean;
    readonly asForceSetCursor: {
      readonly cursor: Option<PalletMigrationsMigrationCursor>;
    } & Struct;
    readonly isForceSetActiveCursor: boolean;
    readonly asForceSetActiveCursor: {
      readonly index: u32;
      readonly innerCursor: Option<Bytes>;
      readonly startedAt: Option<u32>;
    } & Struct;
    readonly isForceOnboardMbms: boolean;
    readonly isClearHistoric: boolean;
    readonly asClearHistoric: {
      readonly selector: PalletMigrationsHistoricCleanupSelector;
    } & Struct;
    readonly type: 'ForceSetCursor' | 'ForceSetActiveCursor' | 'ForceOnboardMbms' | 'ClearHistoric';
  }

  /** @name PalletMigrationsMigrationCursor (298) */
  interface PalletMigrationsMigrationCursor extends Enum {
    readonly isActive: boolean;
    readonly asActive: PalletMigrationsActiveCursor;
    readonly isStuck: boolean;
    readonly type: 'Active' | 'Stuck';
  }

  /** @name PalletMigrationsActiveCursor (300) */
  interface PalletMigrationsActiveCursor extends Struct {
    readonly index: u32;
    readonly innerCursor: Option<Bytes>;
    readonly startedAt: u32;
  }

  /** @name PalletMigrationsHistoricCleanupSelector (302) */
  interface PalletMigrationsHistoricCleanupSelector extends Enum {
    readonly isSpecific: boolean;
    readonly asSpecific: Vec<Bytes>;
    readonly isWildcard: boolean;
    readonly asWildcard: {
      readonly limit: Option<u32>;
      readonly previousCursor: Option<Bytes>;
    } & Struct;
    readonly type: 'Specific' | 'Wildcard';
  }

  /** @name PalletBrokerCall (305) */
  interface PalletBrokerCall extends Enum {
    readonly isConfigure: boolean;
    readonly asConfigure: {
      readonly config: PalletBrokerConfigRecord;
    } & Struct;
    readonly isReserve: boolean;
    readonly asReserve: {
      readonly workload: Vec<PalletBrokerScheduleItem>;
    } & Struct;
    readonly isUnreserve: boolean;
    readonly asUnreserve: {
      readonly itemIndex: u32;
    } & Struct;
    readonly isSetLease: boolean;
    readonly asSetLease: {
      readonly task: u32;
      readonly until: u32;
    } & Struct;
    readonly isStartSales: boolean;
    readonly asStartSales: {
      readonly endPrice: u128;
      readonly extraCores: u16;
    } & Struct;
    readonly isPurchase: boolean;
    readonly asPurchase: {
      readonly priceLimit: u128;
    } & Struct;
    readonly isRenew: boolean;
    readonly asRenew: {
      readonly core: u16;
    } & Struct;
    readonly isTransfer: boolean;
    readonly asTransfer: {
      readonly regionId: FpCoretimeRegionId;
      readonly newOwner: AccountId32;
    } & Struct;
    readonly isPartition: boolean;
    readonly asPartition: {
      readonly regionId: FpCoretimeRegionId;
      readonly pivot: u32;
    } & Struct;
    readonly isInterlace: boolean;
    readonly asInterlace: {
      readonly regionId: FpCoretimeRegionId;
      readonly pivot: FpCoretimeCoreMask;
    } & Struct;
    readonly isAssign: boolean;
    readonly asAssign: {
      readonly regionId: FpCoretimeRegionId;
      readonly task: u32;
      readonly finality: PalletBrokerFinality;
    } & Struct;
    readonly isPool: boolean;
    readonly asPool: {
      readonly regionId: FpCoretimeRegionId;
      readonly payee: AccountId32;
      readonly finality: PalletBrokerFinality;
    } & Struct;
    readonly isClaimRevenue: boolean;
    readonly asClaimRevenue: {
      readonly regionId: FpCoretimeRegionId;
      readonly maxTimeslices: u32;
    } & Struct;
    readonly isPurchaseCredit: boolean;
    readonly asPurchaseCredit: {
      readonly amount: u128;
      readonly beneficiary: AccountId32;
    } & Struct;
    readonly isDropRegion: boolean;
    readonly asDropRegion: {
      readonly regionId: FpCoretimeRegionId;
    } & Struct;
    readonly isDropContribution: boolean;
    readonly asDropContribution: {
      readonly regionId: FpCoretimeRegionId;
    } & Struct;
    readonly isDropHistory: boolean;
    readonly asDropHistory: {
      readonly when: u32;
    } & Struct;
    readonly isDropRenewal: boolean;
    readonly asDropRenewal: {
      readonly core: u16;
      readonly when: u32;
    } & Struct;
    readonly isRequestCoreCount: boolean;
    readonly asRequestCoreCount: {
      readonly coreCount: u16;
    } & Struct;
    readonly isNotifyCoreCount: boolean;
    readonly asNotifyCoreCount: {
      readonly coreCount: u16;
    } & Struct;
    readonly isNotifyRevenue: boolean;
    readonly asNotifyRevenue: {
      readonly revenue: PalletBrokerOnDemandRevenueRecord;
    } & Struct;
    readonly isEnableAutoRenew: boolean;
    readonly asEnableAutoRenew: {
      readonly core: u16;
      readonly task: u32;
      readonly workloadEndHint: Option<u32>;
    } & Struct;
    readonly isDisableAutoRenew: boolean;
    readonly asDisableAutoRenew: {
      readonly core: u16;
      readonly task: u32;
    } & Struct;
    readonly isForceReserve: boolean;
    readonly asForceReserve: {
      readonly workload: Vec<PalletBrokerScheduleItem>;
      readonly core: u16;
    } & Struct;
    readonly isRemoveLease: boolean;
    readonly asRemoveLease: {
      readonly task: u32;
    } & Struct;
    readonly isRemoveAssignment: boolean;
    readonly asRemoveAssignment: {
      readonly regionId: FpCoretimeRegionId;
    } & Struct;
    readonly isRemovePotentialRenewal: boolean;
    readonly asRemovePotentialRenewal: {
      readonly core: u16;
      readonly when: u32;
    } & Struct;
    readonly isForceTransfer: boolean;
    readonly asForceTransfer: {
      readonly regionId: FpCoretimeRegionId;
      readonly newOwner: AccountId32;
    } & Struct;
    readonly isSwapLeases: boolean;
    readonly asSwapLeases: {
      readonly id: u32;
      readonly other: u32;
    } & Struct;
    readonly type: 'Configure' | 'Reserve' | 'Unreserve' | 'SetLease' | 'StartSales' | 'Purchase' | 'Renew' | 'Transfer' | 'Partition' | 'Interlace' | 'Assign' | 'Pool' | 'ClaimRevenue' | 'PurchaseCredit' | 'DropRegion' | 'DropContribution' | 'DropHistory' | 'DropRenewal' | 'RequestCoreCount' | 'NotifyCoreCount' | 'NotifyRevenue' | 'EnableAutoRenew' | 'DisableAutoRenew' | 'ForceReserve' | 'RemoveLease' | 'RemoveAssignment' | 'RemovePotentialRenewal' | 'ForceTransfer' | 'SwapLeases';
  }

  /** @name PalletBrokerConfigRecord (306) */
  interface PalletBrokerConfigRecord extends Struct {
    readonly advanceNotice: u32;
    readonly interludeLength: u32;
    readonly leadinLength: u32;
    readonly regionLength: u32;
    readonly idealBulkProportion: Perbill;
    readonly limitCoresOffered: Option<u16>;
    readonly renewalBump: Perbill;
    readonly contributionTimeout: u32;
  }

  /** @name PalletBrokerScheduleItem (309) */
  interface PalletBrokerScheduleItem extends Struct {
    readonly mask: FpCoretimeCoreMask;
    readonly assignment: PalletBrokerCoretimeInterfaceCoreAssignment;
  }

  /** @name FpCoretimeCoreMask (310) */
  interface FpCoretimeCoreMask extends U8aFixed {}

  /** @name PalletBrokerCoretimeInterfaceCoreAssignment (311) */
  interface PalletBrokerCoretimeInterfaceCoreAssignment extends Enum {
    readonly isIdle: boolean;
    readonly isPool: boolean;
    readonly isTask: boolean;
    readonly asTask: u32;
    readonly type: 'Idle' | 'Pool' | 'Task';
  }

  /** @name FpCoretimeRegionId (313) */
  interface FpCoretimeRegionId extends Struct {
    readonly begin: u32;
    readonly core: u16;
    readonly mask: FpCoretimeCoreMask;
  }

  /** @name PalletBrokerFinality (314) */
  interface PalletBrokerFinality extends Enum {
    readonly isProvisional: boolean;
    readonly isFinal: boolean;
    readonly type: 'Provisional' | 'Final';
  }

  /** @name PalletBrokerOnDemandRevenueRecord (315) */
  interface PalletBrokerOnDemandRevenueRecord extends Struct {
    readonly until: u32;
    readonly amount: u128;
  }

  /** @name PalletMixnetCall (316) */
  interface PalletMixnetCall extends Enum {
    readonly isRegister: boolean;
    readonly asRegister: {
      readonly registration: PalletMixnetRegistration;
      readonly signature: SpMixnetAppSignature;
    } & Struct;
    readonly type: 'Register';
  }

  /** @name PalletMixnetRegistration (317) */
  interface PalletMixnetRegistration extends Struct {
    readonly blockNumber: u32;
    readonly sessionIndex: u32;
    readonly authorityIndex: u32;
    readonly mixnode: PalletMixnetBoundedMixnode;
  }

  /** @name PalletMixnetBoundedMixnode (318) */
  interface PalletMixnetBoundedMixnode extends Struct {
    readonly kxPublic: U8aFixed;
    readonly peerId: U8aFixed;
    readonly externalAddresses: Vec<Bytes>;
  }

  /** @name SpMixnetAppSignature (321) */
  interface SpMixnetAppSignature extends U8aFixed {}

  /** @name PalletParametersCall (322) */
  interface PalletParametersCall extends Enum {
    readonly isSetParameter: boolean;
    readonly asSetParameter: {
      readonly keyValue: PortaldotV3RuntimeRuntimeParameters;
    } & Struct;
    readonly type: 'SetParameter';
  }

  /** @name PortaldotV3RuntimeRuntimeParameters (323) */
  interface PortaldotV3RuntimeRuntimeParameters extends Enum {
    readonly isStorage: boolean;
    readonly asStorage: PortaldotV3RuntimeDynamicParamsStorageParameters;
    readonly isReferenda: boolean;
    readonly asReferenda: PortaldotV3RuntimeDynamicParamsReferendaParameters;
    readonly type: 'Storage' | 'Referenda';
  }

  /** @name PortaldotV3RuntimeDynamicParamsStorageParameters (324) */
  interface PortaldotV3RuntimeDynamicParamsStorageParameters extends Enum {
    readonly isBaseDeposit: boolean;
    readonly asBaseDeposit: ITuple<[PortaldotV3RuntimeDynamicParamsStorageBaseDeposit, Option<u128>]>;
    readonly isByteDeposit: boolean;
    readonly asByteDeposit: ITuple<[PortaldotV3RuntimeDynamicParamsStorageByteDeposit, Option<u128>]>;
    readonly type: 'BaseDeposit' | 'ByteDeposit';
  }

  /** @name PortaldotV3RuntimeDynamicParamsStorageBaseDeposit (325) */
  type PortaldotV3RuntimeDynamicParamsStorageBaseDeposit = Null;

  /** @name PortaldotV3RuntimeDynamicParamsStorageByteDeposit (326) */
  type PortaldotV3RuntimeDynamicParamsStorageByteDeposit = Null;

  /** @name PortaldotV3RuntimeDynamicParamsReferendaParameters (327) */
  interface PortaldotV3RuntimeDynamicParamsReferendaParameters extends Enum {
    readonly isTracks: boolean;
    readonly asTracks: ITuple<[PortaldotV3RuntimeDynamicParamsReferendaTracks, Option<Vec<PalletReferendaTrack>>]>;
    readonly isOrigins: boolean;
    readonly asOrigins: ITuple<[PortaldotV3RuntimeDynamicParamsReferendaOrigins, Option<Vec<ITuple<[PortaldotV3RuntimeOriginCaller, u16]>>>]>;
    readonly type: 'Tracks' | 'Origins';
  }

  /** @name PortaldotV3RuntimeDynamicParamsReferendaTracks (328) */
  type PortaldotV3RuntimeDynamicParamsReferendaTracks = Null;

  /** @name PalletReferendaTrack (331) */
  interface PalletReferendaTrack extends Struct {
    readonly id: u16;
    readonly info: PalletReferendaTrackDetails;
  }

  /** @name PalletReferendaTrackDetails (332) */
  interface PalletReferendaTrackDetails extends Struct {
    readonly name: U8aFixed;
    readonly maxDeciding: u32;
    readonly decisionDeposit: u128;
    readonly preparePeriod: u32;
    readonly decisionPeriod: u32;
    readonly confirmPeriod: u32;
    readonly minEnactmentPeriod: u32;
    readonly minApproval: PalletReferendaCurve;
    readonly minSupport: PalletReferendaCurve;
  }

  /** @name PalletReferendaCurve (333) */
  interface PalletReferendaCurve extends Enum {
    readonly isLinearDecreasing: boolean;
    readonly asLinearDecreasing: {
      readonly length: Perbill;
      readonly floor: Perbill;
      readonly ceil: Perbill;
    } & Struct;
    readonly isSteppedDecreasing: boolean;
    readonly asSteppedDecreasing: {
      readonly begin: Perbill;
      readonly end: Perbill;
      readonly step: Perbill;
      readonly period: Perbill;
    } & Struct;
    readonly isReciprocal: boolean;
    readonly asReciprocal: {
      readonly factor: i64;
      readonly xOffset: i64;
      readonly yOffset: i64;
    } & Struct;
    readonly type: 'LinearDecreasing' | 'SteppedDecreasing' | 'Reciprocal';
  }

  /** @name PortaldotV3RuntimeDynamicParamsReferendaOrigins (337) */
  type PortaldotV3RuntimeDynamicParamsReferendaOrigins = Null;

  /** @name PalletAssetConversionOpsCall (342) */
  interface PalletAssetConversionOpsCall extends Enum {
    readonly isMigrateToNewAccount: boolean;
    readonly asMigrateToNewAccount: {
      readonly asset1: FrameSupportTokensFungibleUnionOfNativeOrWithId;
      readonly asset2: FrameSupportTokensFungibleUnionOfNativeOrWithId;
    } & Struct;
    readonly type: 'MigrateToNewAccount';
  }

  /** @name PalletReviveCall (343) */
  interface PalletReviveCall extends Enum {
    readonly isEthTransact: boolean;
    readonly asEthTransact: {
      readonly payload: Bytes;
    } & Struct;
    readonly isCall: boolean;
    readonly asCall: {
      readonly dest: H160;
      readonly value: Compact<u128>;
      readonly weightLimit: SpWeightsWeightV2Weight;
      readonly storageDepositLimit: Compact<u128>;
      readonly data: Bytes;
    } & Struct;
    readonly isInstantiate: boolean;
    readonly asInstantiate: {
      readonly value: Compact<u128>;
      readonly weightLimit: SpWeightsWeightV2Weight;
      readonly storageDepositLimit: Compact<u128>;
      readonly codeHash: H256;
      readonly data: Bytes;
      readonly salt: Option<U8aFixed>;
    } & Struct;
    readonly isInstantiateWithCode: boolean;
    readonly asInstantiateWithCode: {
      readonly value: Compact<u128>;
      readonly weightLimit: SpWeightsWeightV2Weight;
      readonly storageDepositLimit: Compact<u128>;
      readonly code: Bytes;
      readonly data: Bytes;
      readonly salt: Option<U8aFixed>;
    } & Struct;
    readonly isUploadCode: boolean;
    readonly asUploadCode: {
      readonly code: Bytes;
      readonly storageDepositLimit: Compact<u128>;
    } & Struct;
    readonly isRemoveCode: boolean;
    readonly asRemoveCode: {
      readonly codeHash: H256;
    } & Struct;
    readonly isSetCode: boolean;
    readonly asSetCode: {
      readonly dest: H160;
      readonly codeHash: H256;
    } & Struct;
    readonly isMapAccount: boolean;
    readonly isUnmapAccount: boolean;
    readonly isDispatchAsFallbackAccount: boolean;
    readonly asDispatchAsFallbackAccount: {
      readonly call: Call;
    } & Struct;
    readonly isEthInstantiateWithCode: boolean;
    readonly asEthInstantiateWithCode: {
      readonly value: U256;
      readonly weightLimit: SpWeightsWeightV2Weight;
      readonly ethGasLimit: U256;
      readonly code: Bytes;
      readonly data: Bytes;
      readonly transactionEncoded: Bytes;
      readonly effectiveGasPrice: U256;
      readonly encodedLen: u32;
    } & Struct;
    readonly isEthCall: boolean;
    readonly asEthCall: {
      readonly dest: H160;
      readonly value: U256;
      readonly weightLimit: SpWeightsWeightV2Weight;
      readonly ethGasLimit: U256;
      readonly data: Bytes;
      readonly transactionEncoded: Bytes;
      readonly effectiveGasPrice: U256;
      readonly encodedLen: u32;
    } & Struct;
    readonly isEthSubstrateCall: boolean;
    readonly asEthSubstrateCall: {
      readonly call: Call;
      readonly transactionEncoded: Bytes;
    } & Struct;
    readonly isBatchMapAccounts: boolean;
    readonly asBatchMapAccounts: {
      readonly accounts: Vec<AccountId32>;
    } & Struct;
    readonly type: 'EthTransact' | 'Call' | 'Instantiate' | 'InstantiateWithCode' | 'UploadCode' | 'RemoveCode' | 'SetCode' | 'MapAccount' | 'UnmapAccount' | 'DispatchAsFallbackAccount' | 'EthInstantiateWithCode' | 'EthCall' | 'EthSubstrateCall' | 'BatchMapAccounts';
  }

  /** @name PalletOracleCall (348) */
  interface PalletOracleCall extends Enum {
    readonly isFeedValues: boolean;
    readonly asFeedValues: {
      readonly values: Vec<ITuple<[u32, u128]>>;
    } & Struct;
    readonly type: 'FeedValues';
  }

  /** @name PalletMetaTxCall (352) */
  interface PalletMetaTxCall extends Enum {
    readonly isDispatch: boolean;
    readonly asDispatch: {
      readonly metaTx: PalletMetaTxMetaTx;
      readonly metaTxEncodedLen: u32;
    } & Struct;
    readonly type: 'Dispatch';
  }

  /** @name PalletMetaTxMetaTx (353) */
  interface PalletMetaTxMetaTx extends Struct {
    readonly call: Call;
    readonly extensionVersion: u8;
    readonly extension: ITuple<[PalletVerifySignatureExtensionVerifySignature, PalletMetaTxExtensionMetaTxMarker, FrameSystemExtensionsCheckNonZeroSender, FrameSystemExtensionsCheckSpecVersion, FrameSystemExtensionsCheckTxVersion, FrameSystemExtensionsCheckGenesis, Era, FrameSystemExtensionsCheckNonce, FrameMetadataHashExtensionCheckMetadataHash]>;
  }

  /** @name PalletVerifySignatureExtensionVerifySignature (355) */
  interface PalletVerifySignatureExtensionVerifySignature extends Enum {
    readonly isDisabled: boolean;
    readonly isSigned: boolean;
    readonly asSigned: {
      readonly signature: SpRuntimeMultiSignature;
      readonly account: AccountId32;
    } & Struct;
    readonly type: 'Disabled' | 'Signed';
  }

  /** @name PalletMetaTxExtensionMetaTxMarker (356) */
  type PalletMetaTxExtensionMetaTxMarker = Null;

  /** @name FrameSystemExtensionsCheckNonZeroSender (357) */
  type FrameSystemExtensionsCheckNonZeroSender = Null;

  /** @name FrameSystemExtensionsCheckSpecVersion (358) */
  type FrameSystemExtensionsCheckSpecVersion = Null;

  /** @name FrameSystemExtensionsCheckTxVersion (359) */
  type FrameSystemExtensionsCheckTxVersion = Null;

  /** @name FrameSystemExtensionsCheckGenesis (360) */
  type FrameSystemExtensionsCheckGenesis = Null;

  /** @name FrameSystemExtensionsCheckNonce (363) */
  interface FrameSystemExtensionsCheckNonce extends Compact<u32> {}

  /** @name FrameMetadataHashExtensionCheckMetadataHash (364) */
  interface FrameMetadataHashExtensionCheckMetadataHash extends Struct {
    readonly mode: FrameMetadataHashExtensionMode;
  }

  /** @name FrameMetadataHashExtensionMode (365) */
  interface FrameMetadataHashExtensionMode extends Enum {
    readonly isDisabled: boolean;
    readonly isEnabled: boolean;
    readonly type: 'Disabled' | 'Enabled';
  }

  /** @name PalletMultiAssetBountiesCall (366) */
  interface PalletMultiAssetBountiesCall extends Enum {
    readonly isFundBounty: boolean;
    readonly asFundBounty: {
      readonly assetKind: FrameSupportTokensFungibleUnionOfNativeOrWithId;
      readonly value: Compact<u128>;
      readonly curator: MultiAddress;
      readonly metadata: H256;
    } & Struct;
    readonly isFundChildBounty: boolean;
    readonly asFundChildBounty: {
      readonly parentBountyId: Compact<u32>;
      readonly value: Compact<u128>;
      readonly metadata: H256;
      readonly curator: Option<MultiAddress>;
    } & Struct;
    readonly isProposeCurator: boolean;
    readonly asProposeCurator: {
      readonly parentBountyId: Compact<u32>;
      readonly childBountyId: Option<u32>;
      readonly curator: MultiAddress;
    } & Struct;
    readonly isAcceptCurator: boolean;
    readonly asAcceptCurator: {
      readonly parentBountyId: Compact<u32>;
      readonly childBountyId: Option<u32>;
    } & Struct;
    readonly isUnassignCurator: boolean;
    readonly asUnassignCurator: {
      readonly parentBountyId: Compact<u32>;
      readonly childBountyId: Option<u32>;
    } & Struct;
    readonly isAwardBounty: boolean;
    readonly asAwardBounty: {
      readonly parentBountyId: Compact<u32>;
      readonly childBountyId: Option<u32>;
      readonly beneficiary: MultiAddress;
    } & Struct;
    readonly isCloseBounty: boolean;
    readonly asCloseBounty: {
      readonly parentBountyId: Compact<u32>;
      readonly childBountyId: Option<u32>;
    } & Struct;
    readonly isCheckStatus: boolean;
    readonly asCheckStatus: {
      readonly parentBountyId: Compact<u32>;
      readonly childBountyId: Option<u32>;
    } & Struct;
    readonly isRetryPayment: boolean;
    readonly asRetryPayment: {
      readonly parentBountyId: Compact<u32>;
      readonly childBountyId: Option<u32>;
    } & Struct;
    readonly isIncreaseValue: boolean;
    readonly asIncreaseValue: {
      readonly parentBountyId: Compact<u32>;
      readonly amount: Compact<u128>;
    } & Struct;
    readonly type: 'FundBounty' | 'FundChildBounty' | 'ProposeCurator' | 'AcceptCurator' | 'UnassignCurator' | 'AwardBounty' | 'CloseBounty' | 'CheckStatus' | 'RetryPayment' | 'IncreaseValue';
  }

  /** @name PalletRegistrarParaCall (367) */
  interface PalletRegistrarParaCall extends Enum {
    readonly isReserve: boolean;
    readonly isRegister: boolean;
    readonly asRegister: {
      readonly paraId: u32;
      readonly genesisHead: Bytes;
      readonly codeLen: u32;
      readonly codeHash: H256;
    } & Struct;
    readonly isCancelRegistration: boolean;
    readonly asCancelRegistration: {
      readonly paraId: u32;
    } & Struct;
    readonly isReceive: boolean;
    readonly asReceive: {
      readonly message: RegistrarPrimitivesMessageToPara;
    } & Struct;
    readonly type: 'Reserve' | 'Register' | 'CancelRegistration' | 'Receive';
  }

  /** @name RegistrarPrimitivesMessageToPara (368) */
  interface RegistrarPrimitivesMessageToPara extends Enum {
    readonly isV1: boolean;
    readonly asV1: RegistrarPrimitivesMessageToParaV1;
    readonly type: 'V1';
  }

  /** @name RegistrarPrimitivesMessageToParaV1 (369) */
  interface RegistrarPrimitivesMessageToParaV1 extends Enum {
    readonly isRegisterResponse: boolean;
    readonly asRegisterResponse: {
      readonly paraId: u32;
      readonly messageId: u64;
      readonly outcome: Result<Null, RegistrarPrimitivesFailureReason>;
    } & Struct;
    readonly isCancelResponse: boolean;
    readonly asCancelResponse: {
      readonly paraId: u32;
      readonly messageId: u64;
      readonly outcome: Result<Null, RegistrarPrimitivesFailureReason>;
    } & Struct;
    readonly type: 'RegisterResponse' | 'CancelResponse';
  }

  /** @name RegistrarPrimitivesFailureReason (371) */
  interface RegistrarPrimitivesFailureReason extends Enum {
    readonly isAlreadyRegistered: boolean;
    readonly isInvalidOnboardingData: boolean;
    readonly isTooManyPending: boolean;
    readonly type: 'AlreadyRegistered' | 'InvalidOnboardingData' | 'TooManyPending';
  }

  /** @name PalletRegistrarRelayCall (372) */
  interface PalletRegistrarRelayCall extends Enum {
    readonly isAuthorizeCode: boolean;
    readonly asAuthorizeCode: {
      readonly message: RegistrarPrimitivesMessageToRelay;
    } & Struct;
    readonly isApplyAuthorizedCode: boolean;
    readonly asApplyAuthorizedCode: {
      readonly paraId: u32;
      readonly validationCode: Bytes;
    } & Struct;
    readonly isCancelAuthorization: boolean;
    readonly asCancelAuthorization: {
      readonly message: RegistrarPrimitivesMessageToRelay;
    } & Struct;
    readonly type: 'AuthorizeCode' | 'ApplyAuthorizedCode' | 'CancelAuthorization';
  }

  /** @name RegistrarPrimitivesMessageToRelay (373) */
  interface RegistrarPrimitivesMessageToRelay extends Enum {
    readonly isV1: boolean;
    readonly asV1: RegistrarPrimitivesMessageToRelayV1;
    readonly type: 'V1';
  }

  /** @name RegistrarPrimitivesMessageToRelayV1 (374) */
  interface RegistrarPrimitivesMessageToRelayV1 extends Enum {
    readonly isRegister: boolean;
    readonly asRegister: {
      readonly paraId: u32;
      readonly messageId: u64;
      readonly manager: AccountId32;
      readonly genesisHead: Bytes;
      readonly codeHash: H256;
      readonly codeLen: u32;
    } & Struct;
    readonly isCancelRegistration: boolean;
    readonly asCancelRegistration: {
      readonly paraId: u32;
      readonly messageId: u64;
    } & Struct;
    readonly type: 'Register' | 'CancelRegistration';
  }

  /** @name FrameSystemExtensionsAuthorizeCall (375) */
  type FrameSystemExtensionsAuthorizeCall = Null;

  /** @name FrameSystemExtensionsCheckWeight (376) */
  type FrameSystemExtensionsCheckWeight = Null;

  /** @name PalletAssetConversionTxPaymentChargeAssetTxPayment (377) */
  interface PalletAssetConversionTxPaymentChargeAssetTxPayment extends Struct {
    readonly tip: Compact<u128>;
    readonly assetId: Option<FrameSupportTokensFungibleUnionOfNativeOrWithId>;
  }

  /** @name PalletReviveEvmTxExtensionSetOrigin (379) */
  type PalletReviveEvmTxExtensionSetOrigin = Null;

  /** @name FrameSystemExtensionsWeightReclaim (380) */
  type FrameSystemExtensionsWeightReclaim = Null;

  /** @name FrameSystemAccountInfo (381) */
  interface FrameSystemAccountInfo extends Struct {
    readonly nonce: u32;
    readonly consumers: u32;
    readonly providers: u32;
    readonly sufficients: u32;
    readonly data: PalletBalancesAccountData;
  }

  /** @name PalletBalancesAccountData (382) */
  interface PalletBalancesAccountData extends Struct {
    readonly free: u128;
    readonly reserved: u128;
    readonly frozen: u128;
    readonly flags: u128;
  }

  /** @name FrameSupportDispatchPerDispatchClassWeight (384) */
  interface FrameSupportDispatchPerDispatchClassWeight extends Struct {
    readonly normal: SpWeightsWeightV2Weight;
    readonly operational: SpWeightsWeightV2Weight;
    readonly mandatory: SpWeightsWeightV2Weight;
  }

  /** @name FrameSystemEventRecord (386) */
  interface FrameSystemEventRecord extends Struct {
    readonly phase: FrameSystemPhase;
    readonly event: Event;
    readonly topics: Vec<H256>;
  }

  /** @name FrameSystemEvent (388) */
  interface FrameSystemEvent extends Enum {
    readonly isExtrinsicSuccess: boolean;
    readonly asExtrinsicSuccess: {
      readonly dispatchInfo: FrameSystemDispatchEventInfo;
    } & Struct;
    readonly isExtrinsicFailed: boolean;
    readonly asExtrinsicFailed: {
      readonly dispatchError: SpRuntimeDispatchError;
      readonly dispatchInfo: FrameSystemDispatchEventInfo;
    } & Struct;
    readonly isCodeUpdated: boolean;
    readonly asCodeUpdated: {
      readonly hash_: H256;
    } & Struct;
    readonly isNewAccount: boolean;
    readonly asNewAccount: {
      readonly account: AccountId32;
    } & Struct;
    readonly isKilledAccount: boolean;
    readonly asKilledAccount: {
      readonly account: AccountId32;
    } & Struct;
    readonly isRemarked: boolean;
    readonly asRemarked: {
      readonly sender: AccountId32;
      readonly hash_: H256;
    } & Struct;
    readonly isUpgradeAuthorized: boolean;
    readonly asUpgradeAuthorized: {
      readonly codeHash: H256;
      readonly checkVersion: bool;
    } & Struct;
    readonly isRejectedInvalidAuthorizedUpgrade: boolean;
    readonly asRejectedInvalidAuthorizedUpgrade: {
      readonly codeHash: H256;
      readonly error: SpRuntimeDispatchError;
    } & Struct;
    readonly type: 'ExtrinsicSuccess' | 'ExtrinsicFailed' | 'CodeUpdated' | 'NewAccount' | 'KilledAccount' | 'Remarked' | 'UpgradeAuthorized' | 'RejectedInvalidAuthorizedUpgrade';
  }

  /** @name FrameSystemDispatchEventInfo (389) */
  interface FrameSystemDispatchEventInfo extends Struct {
    readonly weight: SpWeightsWeightV2Weight;
    readonly class: FrameSupportDispatchDispatchClass;
    readonly paysFee: FrameSupportDispatchPays;
  }

  /** @name FrameSupportDispatchDispatchClass (390) */
  interface FrameSupportDispatchDispatchClass extends Enum {
    readonly isNormal: boolean;
    readonly isOperational: boolean;
    readonly isMandatory: boolean;
    readonly type: 'Normal' | 'Operational' | 'Mandatory';
  }

  /** @name FrameSupportDispatchPays (391) */
  interface FrameSupportDispatchPays extends Enum {
    readonly isYes: boolean;
    readonly isNo: boolean;
    readonly type: 'Yes' | 'No';
  }

  /** @name SpRuntimeDispatchError (392) */
  interface SpRuntimeDispatchError extends Enum {
    readonly isOther: boolean;
    readonly isCannotLookup: boolean;
    readonly isBadOrigin: boolean;
    readonly isModule: boolean;
    readonly asModule: SpRuntimeModuleError;
    readonly isConsumerRemaining: boolean;
    readonly isNoProviders: boolean;
    readonly isTooManyConsumers: boolean;
    readonly isToken: boolean;
    readonly asToken: SpRuntimeTokenError;
    readonly isArithmetic: boolean;
    readonly asArithmetic: SpArithmeticArithmeticError;
    readonly isTransactional: boolean;
    readonly asTransactional: SpRuntimeTransactionalError;
    readonly isExhausted: boolean;
    readonly isCorruption: boolean;
    readonly isUnavailable: boolean;
    readonly isRootNotAllowed: boolean;
    readonly isTrie: boolean;
    readonly asTrie: SpRuntimeProvingTrieTrieError;
    readonly type: 'Other' | 'CannotLookup' | 'BadOrigin' | 'Module' | 'ConsumerRemaining' | 'NoProviders' | 'TooManyConsumers' | 'Token' | 'Arithmetic' | 'Transactional' | 'Exhausted' | 'Corruption' | 'Unavailable' | 'RootNotAllowed' | 'Trie';
  }

  /** @name SpRuntimeModuleError (393) */
  interface SpRuntimeModuleError extends Struct {
    readonly index: u8;
    readonly error: U8aFixed;
  }

  /** @name SpRuntimeTokenError (394) */
  interface SpRuntimeTokenError extends Enum {
    readonly isFundsUnavailable: boolean;
    readonly isOnlyProvider: boolean;
    readonly isBelowMinimum: boolean;
    readonly isCannotCreate: boolean;
    readonly isUnknownAsset: boolean;
    readonly isFrozen: boolean;
    readonly isUnsupported: boolean;
    readonly isCannotCreateHold: boolean;
    readonly isNotExpendable: boolean;
    readonly isBlocked: boolean;
    readonly type: 'FundsUnavailable' | 'OnlyProvider' | 'BelowMinimum' | 'CannotCreate' | 'UnknownAsset' | 'Frozen' | 'Unsupported' | 'CannotCreateHold' | 'NotExpendable' | 'Blocked';
  }

  /** @name SpArithmeticArithmeticError (395) */
  interface SpArithmeticArithmeticError extends Enum {
    readonly isUnderflow: boolean;
    readonly isOverflow: boolean;
    readonly isDivisionByZero: boolean;
    readonly type: 'Underflow' | 'Overflow' | 'DivisionByZero';
  }

  /** @name SpRuntimeTransactionalError (396) */
  interface SpRuntimeTransactionalError extends Enum {
    readonly isLimitReached: boolean;
    readonly isNoLayer: boolean;
    readonly type: 'LimitReached' | 'NoLayer';
  }

  /** @name SpRuntimeProvingTrieTrieError (397) */
  interface SpRuntimeProvingTrieTrieError extends Enum {
    readonly isInvalidStateRoot: boolean;
    readonly isIncompleteDatabase: boolean;
    readonly isValueAtIncompleteKey: boolean;
    readonly isDecoderError: boolean;
    readonly isInvalidHash: boolean;
    readonly isDuplicateKey: boolean;
    readonly isExtraneousNode: boolean;
    readonly isExtraneousValue: boolean;
    readonly isExtraneousHashReference: boolean;
    readonly isInvalidChildReference: boolean;
    readonly isValueMismatch: boolean;
    readonly isIncompleteProof: boolean;
    readonly isRootMismatch: boolean;
    readonly isDecodeError: boolean;
    readonly type: 'InvalidStateRoot' | 'IncompleteDatabase' | 'ValueAtIncompleteKey' | 'DecoderError' | 'InvalidHash' | 'DuplicateKey' | 'ExtraneousNode' | 'ExtraneousValue' | 'ExtraneousHashReference' | 'InvalidChildReference' | 'ValueMismatch' | 'IncompleteProof' | 'RootMismatch' | 'DecodeError';
  }

  /** @name PalletUtilityEvent (398) */
  interface PalletUtilityEvent extends Enum {
    readonly isBatchInterrupted: boolean;
    readonly asBatchInterrupted: {
      readonly index: u32;
      readonly error: SpRuntimeDispatchError;
    } & Struct;
    readonly isBatchCompleted: boolean;
    readonly isBatchCompletedWithErrors: boolean;
    readonly isItemCompleted: boolean;
    readonly isItemFailed: boolean;
    readonly asItemFailed: {
      readonly error: SpRuntimeDispatchError;
    } & Struct;
    readonly isDispatchedAs: boolean;
    readonly asDispatchedAs: {
      readonly result: Result<Null, SpRuntimeDispatchError>;
    } & Struct;
    readonly isIfElseMainSuccess: boolean;
    readonly isIfElseFallbackCalled: boolean;
    readonly asIfElseFallbackCalled: {
      readonly mainError: SpRuntimeDispatchError;
    } & Struct;
    readonly type: 'BatchInterrupted' | 'BatchCompleted' | 'BatchCompletedWithErrors' | 'ItemCompleted' | 'ItemFailed' | 'DispatchedAs' | 'IfElseMainSuccess' | 'IfElseFallbackCalled';
  }

  /** @name PalletIndicesEvent (400) */
  interface PalletIndicesEvent extends Enum {
    readonly isIndexAssigned: boolean;
    readonly asIndexAssigned: {
      readonly who: AccountId32;
      readonly index: u32;
    } & Struct;
    readonly isIndexFreed: boolean;
    readonly asIndexFreed: {
      readonly index: u32;
    } & Struct;
    readonly isIndexFrozen: boolean;
    readonly asIndexFrozen: {
      readonly index: u32;
      readonly who: AccountId32;
    } & Struct;
    readonly isDepositPoked: boolean;
    readonly asDepositPoked: {
      readonly who: AccountId32;
      readonly index: u32;
      readonly oldDeposit: u128;
      readonly newDeposit: u128;
    } & Struct;
    readonly type: 'IndexAssigned' | 'IndexFreed' | 'IndexFrozen' | 'DepositPoked';
  }

  /** @name PalletBalancesEvent (401) */
  interface PalletBalancesEvent extends Enum {
    readonly isEndowed: boolean;
    readonly asEndowed: {
      readonly account: AccountId32;
      readonly freeBalance: u128;
    } & Struct;
    readonly isDustLost: boolean;
    readonly asDustLost: {
      readonly account: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isTransfer: boolean;
    readonly asTransfer: {
      readonly from: AccountId32;
      readonly to: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isBalanceSet: boolean;
    readonly asBalanceSet: {
      readonly who: AccountId32;
      readonly free: u128;
    } & Struct;
    readonly isReserved: boolean;
    readonly asReserved: {
      readonly who: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isUnreserved: boolean;
    readonly asUnreserved: {
      readonly who: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isReserveRepatriated: boolean;
    readonly asReserveRepatriated: {
      readonly from: AccountId32;
      readonly to: AccountId32;
      readonly amount: u128;
      readonly destinationStatus: FrameSupportTokensMiscBalanceStatus;
    } & Struct;
    readonly isDeposit: boolean;
    readonly asDeposit: {
      readonly who: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isWithdraw: boolean;
    readonly asWithdraw: {
      readonly who: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isSlashed: boolean;
    readonly asSlashed: {
      readonly who: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isMinted: boolean;
    readonly asMinted: {
      readonly who: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isMintedCredit: boolean;
    readonly asMintedCredit: {
      readonly amount: u128;
    } & Struct;
    readonly isBurned: boolean;
    readonly asBurned: {
      readonly who: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isBurnedDebt: boolean;
    readonly asBurnedDebt: {
      readonly amount: u128;
    } & Struct;
    readonly isSuspended: boolean;
    readonly asSuspended: {
      readonly who: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isRestored: boolean;
    readonly asRestored: {
      readonly who: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isUpgraded: boolean;
    readonly asUpgraded: {
      readonly who: AccountId32;
    } & Struct;
    readonly isIssued: boolean;
    readonly asIssued: {
      readonly amount: u128;
    } & Struct;
    readonly isRescinded: boolean;
    readonly asRescinded: {
      readonly amount: u128;
    } & Struct;
    readonly isLocked: boolean;
    readonly asLocked: {
      readonly who: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isUnlocked: boolean;
    readonly asUnlocked: {
      readonly who: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isFrozen: boolean;
    readonly asFrozen: {
      readonly who: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isThawed: boolean;
    readonly asThawed: {
      readonly who: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isTotalIssuanceForced: boolean;
    readonly asTotalIssuanceForced: {
      readonly old: u128;
      readonly new_: u128;
    } & Struct;
    readonly isHeld: boolean;
    readonly asHeld: {
      readonly reason: PortaldotV3RuntimeRuntimeHoldReason;
      readonly who: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isBurnedHeld: boolean;
    readonly asBurnedHeld: {
      readonly reason: PortaldotV3RuntimeRuntimeHoldReason;
      readonly who: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isTransferOnHold: boolean;
    readonly asTransferOnHold: {
      readonly reason: PortaldotV3RuntimeRuntimeHoldReason;
      readonly source: AccountId32;
      readonly dest: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isTransferAndHold: boolean;
    readonly asTransferAndHold: {
      readonly reason: PortaldotV3RuntimeRuntimeHoldReason;
      readonly source: AccountId32;
      readonly dest: AccountId32;
      readonly transferred: u128;
    } & Struct;
    readonly isReleased: boolean;
    readonly asReleased: {
      readonly reason: PortaldotV3RuntimeRuntimeHoldReason;
      readonly who: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isUnexpected: boolean;
    readonly asUnexpected: PalletBalancesUnexpectedKind;
    readonly type: 'Endowed' | 'DustLost' | 'Transfer' | 'BalanceSet' | 'Reserved' | 'Unreserved' | 'ReserveRepatriated' | 'Deposit' | 'Withdraw' | 'Slashed' | 'Minted' | 'MintedCredit' | 'Burned' | 'BurnedDebt' | 'Suspended' | 'Restored' | 'Upgraded' | 'Issued' | 'Rescinded' | 'Locked' | 'Unlocked' | 'Frozen' | 'Thawed' | 'TotalIssuanceForced' | 'Held' | 'BurnedHeld' | 'TransferOnHold' | 'TransferAndHold' | 'Released' | 'Unexpected';
  }

  /** @name FrameSupportTokensMiscBalanceStatus (402) */
  interface FrameSupportTokensMiscBalanceStatus extends Enum {
    readonly isFree: boolean;
    readonly isReserved: boolean;
    readonly type: 'Free' | 'Reserved';
  }

  /** @name PortaldotV3RuntimeRuntimeHoldReason (403) */
  interface PortaldotV3RuntimeRuntimeHoldReason extends Enum {
    readonly isStaking: boolean;
    readonly asStaking: PalletStakingPalletHoldReason;
    readonly isSession: boolean;
    readonly asSession: PalletSessionHoldReason;
    readonly isTechnicalCommittee: boolean;
    readonly asTechnicalCommittee: PalletCollectiveHoldReason;
    readonly isContracts: boolean;
    readonly asContracts: PalletContractsHoldReason;
    readonly isRecovery: boolean;
    readonly asRecovery: PalletRecoveryHoldReason;
    readonly isPreimage: boolean;
    readonly asPreimage: PalletPreimageHoldReason;
    readonly isNftFractionalization: boolean;
    readonly asNftFractionalization: PalletNftFractionalizationHoldReason;
    readonly isTransactionStorage: boolean;
    readonly asTransactionStorage: PalletTransactionStorageHoldReason;
    readonly isSafeMode: boolean;
    readonly asSafeMode: PalletSafeModeHoldReason;
    readonly isRevive: boolean;
    readonly asRevive: PalletReviveHoldReason;
    readonly isDelegatedStaking: boolean;
    readonly asDelegatedStaking: PalletDelegatedStakingHoldReason;
    readonly isMultiAssetBounties: boolean;
    readonly asMultiAssetBounties: PalletMultiAssetBountiesHoldReason;
    readonly isRegistrarPara: boolean;
    readonly asRegistrarPara: PalletRegistrarParaHoldReason;
    readonly type: 'Staking' | 'Session' | 'TechnicalCommittee' | 'Contracts' | 'Recovery' | 'Preimage' | 'NftFractionalization' | 'TransactionStorage' | 'SafeMode' | 'Revive' | 'DelegatedStaking' | 'MultiAssetBounties' | 'RegistrarPara';
  }

  /** @name PalletStakingPalletHoldReason (404) */
  interface PalletStakingPalletHoldReason extends Enum {
    readonly isStaking: boolean;
    readonly type: 'Staking';
  }

  /** @name PalletSessionHoldReason (405) */
  interface PalletSessionHoldReason extends Enum {
    readonly isKeys: boolean;
    readonly type: 'Keys';
  }

  /** @name PalletCollectiveHoldReason (406) */
  interface PalletCollectiveHoldReason extends Enum {
    readonly isProposalSubmission: boolean;
    readonly type: 'ProposalSubmission';
  }

  /** @name PalletContractsHoldReason (407) */
  interface PalletContractsHoldReason extends Enum {
    readonly isCodeUploadDepositReserve: boolean;
    readonly isStorageDepositReserve: boolean;
    readonly type: 'CodeUploadDepositReserve' | 'StorageDepositReserve';
  }

  /** @name PalletRecoveryHoldReason (408) */
  interface PalletRecoveryHoldReason extends Enum {
    readonly isFriendGroupsStorage: boolean;
    readonly isAttemptStorage: boolean;
    readonly isInheritorStorage: boolean;
    readonly isSecurityDeposit: boolean;
    readonly type: 'FriendGroupsStorage' | 'AttemptStorage' | 'InheritorStorage' | 'SecurityDeposit';
  }

  /** @name PalletPreimageHoldReason (409) */
  interface PalletPreimageHoldReason extends Enum {
    readonly isPreimage: boolean;
    readonly type: 'Preimage';
  }

  /** @name PalletNftFractionalizationHoldReason (410) */
  interface PalletNftFractionalizationHoldReason extends Enum {
    readonly isFractionalized: boolean;
    readonly type: 'Fractionalized';
  }

  /** @name PalletTransactionStorageHoldReason (411) */
  interface PalletTransactionStorageHoldReason extends Enum {
    readonly isStorageFeeHold: boolean;
    readonly type: 'StorageFeeHold';
  }

  /** @name PalletSafeModeHoldReason (412) */
  interface PalletSafeModeHoldReason extends Enum {
    readonly isEnterOrExtend: boolean;
    readonly type: 'EnterOrExtend';
  }

  /** @name PalletReviveHoldReason (413) */
  interface PalletReviveHoldReason extends Enum {
    readonly isCodeUploadDepositReserve: boolean;
    readonly isStorageDepositReserve: boolean;
    readonly isAddressMapping: boolean;
    readonly type: 'CodeUploadDepositReserve' | 'StorageDepositReserve' | 'AddressMapping';
  }

  /** @name PalletDelegatedStakingHoldReason (414) */
  interface PalletDelegatedStakingHoldReason extends Enum {
    readonly isStakingDelegation: boolean;
    readonly type: 'StakingDelegation';
  }

  /** @name PalletMultiAssetBountiesHoldReason (415) */
  interface PalletMultiAssetBountiesHoldReason extends Enum {
    readonly isCuratorDeposit: boolean;
    readonly type: 'CuratorDeposit';
  }

  /** @name PalletRegistrarParaHoldReason (416) */
  interface PalletRegistrarParaHoldReason extends Enum {
    readonly isParaIdReservation: boolean;
    readonly isRegistration: boolean;
    readonly type: 'ParaIdReservation' | 'Registration';
  }

  /** @name PalletBalancesUnexpectedKind (417) */
  interface PalletBalancesUnexpectedKind extends Enum {
    readonly isBalanceUpdated: boolean;
    readonly isFailedToMutateAccount: boolean;
    readonly type: 'BalanceUpdated' | 'FailedToMutateAccount';
  }

  /** @name PalletTransactionPaymentEvent (418) */
  interface PalletTransactionPaymentEvent extends Enum {
    readonly isTransactionFeePaid: boolean;
    readonly asTransactionFeePaid: {
      readonly who: AccountId32;
      readonly actualFee: u128;
      readonly tip: u128;
    } & Struct;
    readonly type: 'TransactionFeePaid';
  }

  /** @name PalletAssetConversionTxPaymentEvent (419) */
  interface PalletAssetConversionTxPaymentEvent extends Enum {
    readonly isAssetTxFeePaid: boolean;
    readonly asAssetTxFeePaid: {
      readonly who: AccountId32;
      readonly actualFee: u128;
      readonly tip: u128;
      readonly assetId: FrameSupportTokensFungibleUnionOfNativeOrWithId;
    } & Struct;
    readonly isAssetRefundFailed: boolean;
    readonly asAssetRefundFailed: {
      readonly nativeAmountKept: u128;
    } & Struct;
    readonly type: 'AssetTxFeePaid' | 'AssetRefundFailed';
  }

  /** @name PalletElectionProviderMultiPhaseEvent (420) */
  interface PalletElectionProviderMultiPhaseEvent extends Enum {
    readonly isSolutionStored: boolean;
    readonly asSolutionStored: {
      readonly compute: PalletElectionProviderMultiPhaseElectionCompute;
      readonly origin: Option<AccountId32>;
      readonly prevEjected: bool;
    } & Struct;
    readonly isElectionFinalized: boolean;
    readonly asElectionFinalized: {
      readonly compute: PalletElectionProviderMultiPhaseElectionCompute;
      readonly score: SpNposElectionsElectionScore;
    } & Struct;
    readonly isElectionFailed: boolean;
    readonly isRewarded: boolean;
    readonly asRewarded: {
      readonly account: AccountId32;
      readonly value: u128;
    } & Struct;
    readonly isSlashed: boolean;
    readonly asSlashed: {
      readonly account: AccountId32;
      readonly value: u128;
    } & Struct;
    readonly isPhaseTransitioned: boolean;
    readonly asPhaseTransitioned: {
      readonly from: PalletElectionProviderMultiPhasePhase;
      readonly to: PalletElectionProviderMultiPhasePhase;
      readonly round: u32;
    } & Struct;
    readonly type: 'SolutionStored' | 'ElectionFinalized' | 'ElectionFailed' | 'Rewarded' | 'Slashed' | 'PhaseTransitioned';
  }

  /** @name PalletElectionProviderMultiPhaseElectionCompute (421) */
  interface PalletElectionProviderMultiPhaseElectionCompute extends Enum {
    readonly isOnChain: boolean;
    readonly isSigned: boolean;
    readonly isUnsigned: boolean;
    readonly isFallback: boolean;
    readonly isEmergency: boolean;
    readonly type: 'OnChain' | 'Signed' | 'Unsigned' | 'Fallback' | 'Emergency';
  }

  /** @name PalletElectionProviderMultiPhasePhase (422) */
  interface PalletElectionProviderMultiPhasePhase extends Enum {
    readonly isOff: boolean;
    readonly isSigned: boolean;
    readonly isUnsigned: boolean;
    readonly asUnsigned: ITuple<[bool, u32]>;
    readonly isEmergency: boolean;
    readonly type: 'Off' | 'Signed' | 'Unsigned' | 'Emergency';
  }

  /** @name PalletStakingPalletEvent (424) */
  interface PalletStakingPalletEvent extends Enum {
    readonly isEraPaid: boolean;
    readonly asEraPaid: {
      readonly eraIndex: u32;
      readonly validatorPayout: u128;
      readonly remainder: u128;
    } & Struct;
    readonly isRewarded: boolean;
    readonly asRewarded: {
      readonly stash: AccountId32;
      readonly dest: PalletStakingRewardDestination;
      readonly amount: u128;
    } & Struct;
    readonly isSlashed: boolean;
    readonly asSlashed: {
      readonly staker: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isSlashReported: boolean;
    readonly asSlashReported: {
      readonly validator: AccountId32;
      readonly fraction: Perbill;
      readonly slashEra: u32;
    } & Struct;
    readonly isOldSlashingReportDiscarded: boolean;
    readonly asOldSlashingReportDiscarded: {
      readonly sessionIndex: u32;
    } & Struct;
    readonly isStakersElected: boolean;
    readonly isBonded: boolean;
    readonly asBonded: {
      readonly stash: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isUnbonded: boolean;
    readonly asUnbonded: {
      readonly stash: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isWithdrawn: boolean;
    readonly asWithdrawn: {
      readonly stash: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isKicked: boolean;
    readonly asKicked: {
      readonly nominator: AccountId32;
      readonly stash: AccountId32;
    } & Struct;
    readonly isStakingElectionFailed: boolean;
    readonly isChilled: boolean;
    readonly asChilled: {
      readonly stash: AccountId32;
    } & Struct;
    readonly isPayoutStarted: boolean;
    readonly asPayoutStarted: {
      readonly eraIndex: u32;
      readonly validatorStash: AccountId32;
      readonly page: u32;
      readonly next: Option<u32>;
    } & Struct;
    readonly isValidatorPrefsSet: boolean;
    readonly asValidatorPrefsSet: {
      readonly stash: AccountId32;
      readonly prefs: PalletStakingValidatorPrefs;
    } & Struct;
    readonly isSnapshotVotersSizeExceeded: boolean;
    readonly asSnapshotVotersSizeExceeded: {
      readonly size_: u32;
    } & Struct;
    readonly isSnapshotTargetsSizeExceeded: boolean;
    readonly asSnapshotTargetsSizeExceeded: {
      readonly size_: u32;
    } & Struct;
    readonly isForceEra: boolean;
    readonly asForceEra: {
      readonly mode: PalletStakingForcing;
    } & Struct;
    readonly isControllerBatchDeprecated: boolean;
    readonly asControllerBatchDeprecated: {
      readonly failures: u32;
    } & Struct;
    readonly isCurrencyMigrated: boolean;
    readonly asCurrencyMigrated: {
      readonly stash: AccountId32;
      readonly forceWithdraw: u128;
    } & Struct;
    readonly type: 'EraPaid' | 'Rewarded' | 'Slashed' | 'SlashReported' | 'OldSlashingReportDiscarded' | 'StakersElected' | 'Bonded' | 'Unbonded' | 'Withdrawn' | 'Kicked' | 'StakingElectionFailed' | 'Chilled' | 'PayoutStarted' | 'ValidatorPrefsSet' | 'SnapshotVotersSizeExceeded' | 'SnapshotTargetsSizeExceeded' | 'ForceEra' | 'ControllerBatchDeprecated' | 'CurrencyMigrated';
  }

  /** @name PalletStakingForcing (425) */
  interface PalletStakingForcing extends Enum {
    readonly isNotForcing: boolean;
    readonly isForceNew: boolean;
    readonly isForceNone: boolean;
    readonly isForceAlways: boolean;
    readonly type: 'NotForcing' | 'ForceNew' | 'ForceNone' | 'ForceAlways';
  }

  /** @name PalletSessionEvent (426) */
  interface PalletSessionEvent extends Enum {
    readonly isNewSession: boolean;
    readonly asNewSession: {
      readonly sessionIndex: u32;
    } & Struct;
    readonly isNewQueued: boolean;
    readonly isValidatorDisabled: boolean;
    readonly asValidatorDisabled: {
      readonly validator: AccountId32;
    } & Struct;
    readonly isValidatorReenabled: boolean;
    readonly asValidatorReenabled: {
      readonly validator: AccountId32;
    } & Struct;
    readonly type: 'NewSession' | 'NewQueued' | 'ValidatorDisabled' | 'ValidatorReenabled';
  }

  /** @name PalletCollectiveEvent (427) */
  interface PalletCollectiveEvent extends Enum {
    readonly isProposed: boolean;
    readonly asProposed: {
      readonly account: AccountId32;
      readonly proposalIndex: u32;
      readonly proposalHash: H256;
      readonly threshold: u32;
    } & Struct;
    readonly isVoted: boolean;
    readonly asVoted: {
      readonly account: AccountId32;
      readonly proposalHash: H256;
      readonly voted: bool;
      readonly yes: u32;
      readonly no: u32;
    } & Struct;
    readonly isApproved: boolean;
    readonly asApproved: {
      readonly proposalHash: H256;
    } & Struct;
    readonly isDisapproved: boolean;
    readonly asDisapproved: {
      readonly proposalHash: H256;
    } & Struct;
    readonly isExecuted: boolean;
    readonly asExecuted: {
      readonly proposalHash: H256;
      readonly result: Result<Null, SpRuntimeDispatchError>;
    } & Struct;
    readonly isMemberExecuted: boolean;
    readonly asMemberExecuted: {
      readonly proposalHash: H256;
      readonly result: Result<Null, SpRuntimeDispatchError>;
    } & Struct;
    readonly isClosed: boolean;
    readonly asClosed: {
      readonly proposalHash: H256;
      readonly yes: u32;
      readonly no: u32;
    } & Struct;
    readonly isKilled: boolean;
    readonly asKilled: {
      readonly proposalHash: H256;
    } & Struct;
    readonly isProposalCostBurned: boolean;
    readonly asProposalCostBurned: {
      readonly proposalHash: H256;
      readonly who: AccountId32;
    } & Struct;
    readonly isProposalCostReleased: boolean;
    readonly asProposalCostReleased: {
      readonly proposalHash: H256;
      readonly who: AccountId32;
    } & Struct;
    readonly type: 'Proposed' | 'Voted' | 'Approved' | 'Disapproved' | 'Executed' | 'MemberExecuted' | 'Closed' | 'Killed' | 'ProposalCostBurned' | 'ProposalCostReleased';
  }

  /** @name PalletMembershipEvent (428) */
  interface PalletMembershipEvent extends Enum {
    readonly isMemberAdded: boolean;
    readonly isMemberRemoved: boolean;
    readonly isMembersSwapped: boolean;
    readonly isMembersReset: boolean;
    readonly isKeyChanged: boolean;
    readonly isDummy: boolean;
    readonly type: 'MemberAdded' | 'MemberRemoved' | 'MembersSwapped' | 'MembersReset' | 'KeyChanged' | 'Dummy';
  }

  /** @name PalletGrandpaEvent (429) */
  interface PalletGrandpaEvent extends Enum {
    readonly isNewAuthorities: boolean;
    readonly asNewAuthorities: {
      readonly authoritySet: Vec<ITuple<[SpConsensusGrandpaAppPublic, u64]>>;
    } & Struct;
    readonly isPaused: boolean;
    readonly isResumed: boolean;
    readonly type: 'NewAuthorities' | 'Paused' | 'Resumed';
  }

  /** @name PalletTreasuryEvent (432) */
  interface PalletTreasuryEvent extends Enum {
    readonly isSpending: boolean;
    readonly asSpending: {
      readonly budgetRemaining: u128;
    } & Struct;
    readonly isAwarded: boolean;
    readonly asAwarded: {
      readonly proposalIndex: u32;
      readonly award: u128;
      readonly account: AccountId32;
    } & Struct;
    readonly isBurnt: boolean;
    readonly asBurnt: {
      readonly burntFunds: u128;
    } & Struct;
    readonly isRollover: boolean;
    readonly asRollover: {
      readonly rolloverBalance: u128;
    } & Struct;
    readonly isDeposit: boolean;
    readonly asDeposit: {
      readonly value: u128;
    } & Struct;
    readonly isSpendApproved: boolean;
    readonly asSpendApproved: {
      readonly proposalIndex: u32;
      readonly amount: u128;
      readonly beneficiary: AccountId32;
    } & Struct;
    readonly isUpdatedInactive: boolean;
    readonly asUpdatedInactive: {
      readonly reactivated: u128;
      readonly deactivated: u128;
    } & Struct;
    readonly isAssetSpendApproved: boolean;
    readonly asAssetSpendApproved: {
      readonly index: u32;
      readonly assetKind: FrameSupportTokensFungibleUnionOfNativeOrWithId;
      readonly amount: u128;
      readonly beneficiary: AccountId32;
      readonly validFrom: u32;
      readonly expireAt: u32;
    } & Struct;
    readonly isAssetSpendVoided: boolean;
    readonly asAssetSpendVoided: {
      readonly index: u32;
    } & Struct;
    readonly isPaid: boolean;
    readonly asPaid: {
      readonly index: u32;
      readonly paymentId: Null;
    } & Struct;
    readonly isPaymentFailed: boolean;
    readonly asPaymentFailed: {
      readonly index: u32;
      readonly paymentId: Null;
    } & Struct;
    readonly isSpendProcessed: boolean;
    readonly asSpendProcessed: {
      readonly index: u32;
    } & Struct;
    readonly type: 'Spending' | 'Awarded' | 'Burnt' | 'Rollover' | 'Deposit' | 'SpendApproved' | 'UpdatedInactive' | 'AssetSpendApproved' | 'AssetSpendVoided' | 'Paid' | 'PaymentFailed' | 'SpendProcessed';
  }

  /** @name PalletAssetRateEvent (433) */
  interface PalletAssetRateEvent extends Enum {
    readonly isAssetRateCreated: boolean;
    readonly asAssetRateCreated: {
      readonly assetKind: FrameSupportTokensFungibleUnionOfNativeOrWithId;
      readonly rate: u128;
    } & Struct;
    readonly isAssetRateRemoved: boolean;
    readonly asAssetRateRemoved: {
      readonly assetKind: FrameSupportTokensFungibleUnionOfNativeOrWithId;
    } & Struct;
    readonly isAssetRateUpdated: boolean;
    readonly asAssetRateUpdated: {
      readonly assetKind: FrameSupportTokensFungibleUnionOfNativeOrWithId;
      readonly old: u128;
      readonly new_: u128;
    } & Struct;
    readonly type: 'AssetRateCreated' | 'AssetRateRemoved' | 'AssetRateUpdated';
  }

  /** @name PalletContractsEvent (434) */
  interface PalletContractsEvent extends Enum {
    readonly isInstantiated: boolean;
    readonly asInstantiated: {
      readonly deployer: AccountId32;
      readonly contract: AccountId32;
    } & Struct;
    readonly isTerminated: boolean;
    readonly asTerminated: {
      readonly contract: AccountId32;
      readonly beneficiary: AccountId32;
    } & Struct;
    readonly isCodeStored: boolean;
    readonly asCodeStored: {
      readonly codeHash: H256;
      readonly depositHeld: u128;
      readonly uploader: AccountId32;
    } & Struct;
    readonly isContractEmitted: boolean;
    readonly asContractEmitted: {
      readonly contract: AccountId32;
      readonly data: Bytes;
    } & Struct;
    readonly isCodeRemoved: boolean;
    readonly asCodeRemoved: {
      readonly codeHash: H256;
      readonly depositReleased: u128;
      readonly remover: AccountId32;
    } & Struct;
    readonly isContractCodeUpdated: boolean;
    readonly asContractCodeUpdated: {
      readonly contract: AccountId32;
      readonly newCodeHash: H256;
      readonly oldCodeHash: H256;
    } & Struct;
    readonly isCalled: boolean;
    readonly asCalled: {
      readonly caller: PalletContractsOrigin;
      readonly contract: AccountId32;
    } & Struct;
    readonly isDelegateCalled: boolean;
    readonly asDelegateCalled: {
      readonly contract: AccountId32;
      readonly codeHash: H256;
    } & Struct;
    readonly isStorageDepositTransferredAndHeld: boolean;
    readonly asStorageDepositTransferredAndHeld: {
      readonly from: AccountId32;
      readonly to: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isStorageDepositTransferredAndReleased: boolean;
    readonly asStorageDepositTransferredAndReleased: {
      readonly from: AccountId32;
      readonly to: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly type: 'Instantiated' | 'Terminated' | 'CodeStored' | 'ContractEmitted' | 'CodeRemoved' | 'ContractCodeUpdated' | 'Called' | 'DelegateCalled' | 'StorageDepositTransferredAndHeld' | 'StorageDepositTransferredAndReleased';
  }

  /** @name PalletContractsOrigin (435) */
  interface PalletContractsOrigin extends Enum {
    readonly isRoot: boolean;
    readonly isSigned: boolean;
    readonly asSigned: AccountId32;
    readonly type: 'Root' | 'Signed';
  }

  /** @name PalletSudoEvent (436) */
  interface PalletSudoEvent extends Enum {
    readonly isSudid: boolean;
    readonly asSudid: {
      readonly sudoResult: Result<Null, SpRuntimeDispatchError>;
    } & Struct;
    readonly isKeyChanged: boolean;
    readonly asKeyChanged: {
      readonly old: Option<AccountId32>;
      readonly new_: AccountId32;
    } & Struct;
    readonly isKeyRemoved: boolean;
    readonly isSudoAsDone: boolean;
    readonly asSudoAsDone: {
      readonly sudoResult: Result<Null, SpRuntimeDispatchError>;
    } & Struct;
    readonly type: 'Sudid' | 'KeyChanged' | 'KeyRemoved' | 'SudoAsDone';
  }

  /** @name PalletImOnlineEvent (437) */
  interface PalletImOnlineEvent extends Enum {
    readonly isHeartbeatReceived: boolean;
    readonly asHeartbeatReceived: {
      readonly authorityId: PalletImOnlineSr25519AppSr25519Public;
    } & Struct;
    readonly isAllGood: boolean;
    readonly isSomeOffline: boolean;
    readonly asSomeOffline: {
      readonly offline: Vec<ITuple<[AccountId32, Null]>>;
    } & Struct;
    readonly type: 'HeartbeatReceived' | 'AllGood' | 'SomeOffline';
  }

  /** @name PalletOffencesEvent (440) */
  interface PalletOffencesEvent extends Enum {
    readonly isOffence: boolean;
    readonly asOffence: {
      readonly kind: U8aFixed;
      readonly slot: Bytes;
    } & Struct;
    readonly type: 'Offence';
  }

  /** @name PalletSessionHistoricalPalletEvent (441) */
  interface PalletSessionHistoricalPalletEvent extends Enum {
    readonly isRootStored: boolean;
    readonly asRootStored: {
      readonly index: u32;
    } & Struct;
    readonly isRootsPruned: boolean;
    readonly asRootsPruned: {
      readonly upTo: u32;
    } & Struct;
    readonly type: 'RootStored' | 'RootsPruned';
  }

  /** @name PalletIdentityEvent (442) */
  interface PalletIdentityEvent extends Enum {
    readonly isIdentitySet: boolean;
    readonly asIdentitySet: {
      readonly who: AccountId32;
    } & Struct;
    readonly isIdentityCleared: boolean;
    readonly asIdentityCleared: {
      readonly who: AccountId32;
      readonly deposit: u128;
    } & Struct;
    readonly isIdentityKilled: boolean;
    readonly asIdentityKilled: {
      readonly who: AccountId32;
      readonly deposit: u128;
    } & Struct;
    readonly isJudgementRequested: boolean;
    readonly asJudgementRequested: {
      readonly who: AccountId32;
      readonly registrarIndex: u32;
    } & Struct;
    readonly isJudgementUnrequested: boolean;
    readonly asJudgementUnrequested: {
      readonly who: AccountId32;
      readonly registrarIndex: u32;
    } & Struct;
    readonly isJudgementGiven: boolean;
    readonly asJudgementGiven: {
      readonly target: AccountId32;
      readonly registrarIndex: u32;
    } & Struct;
    readonly isRegistrarAdded: boolean;
    readonly asRegistrarAdded: {
      readonly registrarIndex: u32;
    } & Struct;
    readonly isRegistrarRemoved: boolean;
    readonly asRegistrarRemoved: {
      readonly registrarIndex: u32;
    } & Struct;
    readonly isSubIdentityAdded: boolean;
    readonly asSubIdentityAdded: {
      readonly sub: AccountId32;
      readonly main: AccountId32;
      readonly deposit: u128;
    } & Struct;
    readonly isSubIdentitiesSet: boolean;
    readonly asSubIdentitiesSet: {
      readonly main: AccountId32;
      readonly numberOfSubs: u32;
      readonly newDeposit: u128;
    } & Struct;
    readonly isSubIdentityRenamed: boolean;
    readonly asSubIdentityRenamed: {
      readonly sub: AccountId32;
      readonly main: AccountId32;
    } & Struct;
    readonly isSubIdentityRemoved: boolean;
    readonly asSubIdentityRemoved: {
      readonly sub: AccountId32;
      readonly main: AccountId32;
      readonly deposit: u128;
    } & Struct;
    readonly isSubIdentityRevoked: boolean;
    readonly asSubIdentityRevoked: {
      readonly sub: AccountId32;
      readonly main: AccountId32;
      readonly deposit: u128;
    } & Struct;
    readonly isAuthorityAdded: boolean;
    readonly asAuthorityAdded: {
      readonly authority: AccountId32;
    } & Struct;
    readonly isAuthorityRemoved: boolean;
    readonly asAuthorityRemoved: {
      readonly authority: AccountId32;
    } & Struct;
    readonly isUsernameSet: boolean;
    readonly asUsernameSet: {
      readonly who: AccountId32;
      readonly username: Bytes;
    } & Struct;
    readonly isUsernameQueued: boolean;
    readonly asUsernameQueued: {
      readonly who: AccountId32;
      readonly username: Bytes;
      readonly expiration: u32;
    } & Struct;
    readonly isPreapprovalExpired: boolean;
    readonly asPreapprovalExpired: {
      readonly whose: AccountId32;
    } & Struct;
    readonly isPrimaryUsernameSet: boolean;
    readonly asPrimaryUsernameSet: {
      readonly who: AccountId32;
      readonly username: Bytes;
    } & Struct;
    readonly isDanglingUsernameRemoved: boolean;
    readonly asDanglingUsernameRemoved: {
      readonly who: AccountId32;
      readonly username: Bytes;
    } & Struct;
    readonly isUsernameUnbound: boolean;
    readonly asUsernameUnbound: {
      readonly username: Bytes;
    } & Struct;
    readonly isUsernameRemoved: boolean;
    readonly asUsernameRemoved: {
      readonly username: Bytes;
    } & Struct;
    readonly isUsernameKilled: boolean;
    readonly asUsernameKilled: {
      readonly username: Bytes;
    } & Struct;
    readonly type: 'IdentitySet' | 'IdentityCleared' | 'IdentityKilled' | 'JudgementRequested' | 'JudgementUnrequested' | 'JudgementGiven' | 'RegistrarAdded' | 'RegistrarRemoved' | 'SubIdentityAdded' | 'SubIdentitiesSet' | 'SubIdentityRenamed' | 'SubIdentityRemoved' | 'SubIdentityRevoked' | 'AuthorityAdded' | 'AuthorityRemoved' | 'UsernameSet' | 'UsernameQueued' | 'PreapprovalExpired' | 'PrimaryUsernameSet' | 'DanglingUsernameRemoved' | 'UsernameUnbound' | 'UsernameRemoved' | 'UsernameKilled';
  }

  /** @name PalletRecoveryEvent (443) */
  interface PalletRecoveryEvent extends Enum {
    readonly isAttemptApproved: boolean;
    readonly asAttemptApproved: {
      readonly lost: AccountId32;
      readonly friendGroupIndex: u32;
      readonly friend: AccountId32;
    } & Struct;
    readonly isAttemptCanceled: boolean;
    readonly asAttemptCanceled: {
      readonly lost: AccountId32;
      readonly friendGroupIndex: u32;
      readonly canceler: AccountId32;
    } & Struct;
    readonly isAttemptInitiated: boolean;
    readonly asAttemptInitiated: {
      readonly lost: AccountId32;
      readonly friendGroupIndex: u32;
      readonly initiator: AccountId32;
    } & Struct;
    readonly isAttemptFinished: boolean;
    readonly asAttemptFinished: {
      readonly lost: AccountId32;
      readonly friendGroupIndex: u32;
      readonly inheritor: AccountId32;
      readonly previousInheritor: Option<AccountId32>;
    } & Struct;
    readonly isAttemptDiscarded: boolean;
    readonly asAttemptDiscarded: {
      readonly lost: AccountId32;
      readonly friendGroupIndex: u32;
      readonly existingInheritor: AccountId32;
    } & Struct;
    readonly isAttemptSlashed: boolean;
    readonly asAttemptSlashed: {
      readonly lost: AccountId32;
      readonly friendGroupIndex: u32;
    } & Struct;
    readonly isFriendGroupsChanged: boolean;
    readonly asFriendGroupsChanged: {
      readonly lost: AccountId32;
    } & Struct;
    readonly isInheritorRevoked: boolean;
    readonly asInheritorRevoked: {
      readonly lost: AccountId32;
    } & Struct;
    readonly isRecoveredAccountControlled: boolean;
    readonly asRecoveredAccountControlled: {
      readonly recovered: AccountId32;
      readonly inheritor: AccountId32;
      readonly callHash: H256;
      readonly callResult: Result<Null, SpRuntimeDispatchError>;
    } & Struct;
    readonly type: 'AttemptApproved' | 'AttemptCanceled' | 'AttemptInitiated' | 'AttemptFinished' | 'AttemptDiscarded' | 'AttemptSlashed' | 'FriendGroupsChanged' | 'InheritorRevoked' | 'RecoveredAccountControlled';
  }

  /** @name PalletVestingEvent (444) */
  interface PalletVestingEvent extends Enum {
    readonly isVestingCreated: boolean;
    readonly asVestingCreated: {
      readonly account: AccountId32;
      readonly scheduleIndex: u32;
    } & Struct;
    readonly isVestingUpdated: boolean;
    readonly asVestingUpdated: {
      readonly account: AccountId32;
      readonly unvested: u128;
    } & Struct;
    readonly isVestingCompleted: boolean;
    readonly asVestingCompleted: {
      readonly account: AccountId32;
    } & Struct;
    readonly type: 'VestingCreated' | 'VestingUpdated' | 'VestingCompleted';
  }

  /** @name PalletSchedulerEvent (445) */
  interface PalletSchedulerEvent extends Enum {
    readonly isScheduled: boolean;
    readonly asScheduled: {
      readonly when: u32;
      readonly index: u32;
    } & Struct;
    readonly isCanceled: boolean;
    readonly asCanceled: {
      readonly when: u32;
      readonly index: u32;
    } & Struct;
    readonly isDispatched: boolean;
    readonly asDispatched: {
      readonly task: ITuple<[u32, u32]>;
      readonly id: Option<U8aFixed>;
      readonly result: Result<Null, SpRuntimeDispatchError>;
    } & Struct;
    readonly isRetrySet: boolean;
    readonly asRetrySet: {
      readonly task: ITuple<[u32, u32]>;
      readonly id: Option<U8aFixed>;
      readonly period: u32;
      readonly retries: u8;
    } & Struct;
    readonly isRetryCancelled: boolean;
    readonly asRetryCancelled: {
      readonly task: ITuple<[u32, u32]>;
      readonly id: Option<U8aFixed>;
    } & Struct;
    readonly isCallUnavailable: boolean;
    readonly asCallUnavailable: {
      readonly task: ITuple<[u32, u32]>;
      readonly id: Option<U8aFixed>;
    } & Struct;
    readonly isPeriodicFailed: boolean;
    readonly asPeriodicFailed: {
      readonly task: ITuple<[u32, u32]>;
      readonly id: Option<U8aFixed>;
    } & Struct;
    readonly isRetryFailed: boolean;
    readonly asRetryFailed: {
      readonly task: ITuple<[u32, u32]>;
      readonly id: Option<U8aFixed>;
    } & Struct;
    readonly isPermanentlyOverweight: boolean;
    readonly asPermanentlyOverweight: {
      readonly task: ITuple<[u32, u32]>;
      readonly id: Option<U8aFixed>;
    } & Struct;
    readonly isAgendaIncomplete: boolean;
    readonly asAgendaIncomplete: {
      readonly when: u32;
    } & Struct;
    readonly type: 'Scheduled' | 'Canceled' | 'Dispatched' | 'RetrySet' | 'RetryCancelled' | 'CallUnavailable' | 'PeriodicFailed' | 'RetryFailed' | 'PermanentlyOverweight' | 'AgendaIncomplete';
  }

  /** @name PalletPreimageEvent (446) */
  interface PalletPreimageEvent extends Enum {
    readonly isNoted: boolean;
    readonly asNoted: {
      readonly hash_: H256;
    } & Struct;
    readonly isRequested: boolean;
    readonly asRequested: {
      readonly hash_: H256;
    } & Struct;
    readonly isCleared: boolean;
    readonly asCleared: {
      readonly hash_: H256;
    } & Struct;
    readonly type: 'Noted' | 'Requested' | 'Cleared';
  }

  /** @name PalletProxyEvent (447) */
  interface PalletProxyEvent extends Enum {
    readonly isProxyExecuted: boolean;
    readonly asProxyExecuted: {
      readonly result: Result<Null, SpRuntimeDispatchError>;
    } & Struct;
    readonly isPureCreated: boolean;
    readonly asPureCreated: {
      readonly pure: AccountId32;
      readonly who: AccountId32;
      readonly proxyType: PortaldotV3RuntimeProxyType;
      readonly disambiguationIndex: u16;
      readonly at: u32;
      readonly extrinsicIndex: u32;
    } & Struct;
    readonly isPureKilled: boolean;
    readonly asPureKilled: {
      readonly pure: AccountId32;
      readonly spawner: AccountId32;
      readonly proxyType: PortaldotV3RuntimeProxyType;
      readonly disambiguationIndex: u16;
    } & Struct;
    readonly isAnnounced: boolean;
    readonly asAnnounced: {
      readonly real: AccountId32;
      readonly proxy: AccountId32;
      readonly callHash: H256;
    } & Struct;
    readonly isProxyAdded: boolean;
    readonly asProxyAdded: {
      readonly delegator: AccountId32;
      readonly delegatee: AccountId32;
      readonly proxyType: PortaldotV3RuntimeProxyType;
      readonly delay: u32;
    } & Struct;
    readonly isProxyRemoved: boolean;
    readonly asProxyRemoved: {
      readonly delegator: AccountId32;
      readonly delegatee: AccountId32;
      readonly proxyType: PortaldotV3RuntimeProxyType;
      readonly delay: u32;
    } & Struct;
    readonly isDepositPoked: boolean;
    readonly asDepositPoked: {
      readonly who: AccountId32;
      readonly kind: PalletProxyDepositKind;
      readonly oldDeposit: u128;
      readonly newDeposit: u128;
    } & Struct;
    readonly type: 'ProxyExecuted' | 'PureCreated' | 'PureKilled' | 'Announced' | 'ProxyAdded' | 'ProxyRemoved' | 'DepositPoked';
  }

  /** @name PalletProxyDepositKind (448) */
  interface PalletProxyDepositKind extends Enum {
    readonly isProxies: boolean;
    readonly isAnnouncements: boolean;
    readonly type: 'Proxies' | 'Announcements';
  }

  /** @name PalletMultisigEvent (449) */
  interface PalletMultisigEvent extends Enum {
    readonly isNewMultisig: boolean;
    readonly asNewMultisig: {
      readonly approving: AccountId32;
      readonly multisig: AccountId32;
      readonly callHash: U8aFixed;
    } & Struct;
    readonly isMultisigApproval: boolean;
    readonly asMultisigApproval: {
      readonly approving: AccountId32;
      readonly timepoint: PalletMultisigTimepoint;
      readonly multisig: AccountId32;
      readonly callHash: U8aFixed;
    } & Struct;
    readonly isMultisigExecuted: boolean;
    readonly asMultisigExecuted: {
      readonly approving: AccountId32;
      readonly timepoint: PalletMultisigTimepoint;
      readonly multisig: AccountId32;
      readonly callHash: U8aFixed;
      readonly result: Result<Null, SpRuntimeDispatchError>;
    } & Struct;
    readonly isMultisigCancelled: boolean;
    readonly asMultisigCancelled: {
      readonly cancelling: AccountId32;
      readonly timepoint: PalletMultisigTimepoint;
      readonly multisig: AccountId32;
      readonly callHash: U8aFixed;
    } & Struct;
    readonly isDepositPoked: boolean;
    readonly asDepositPoked: {
      readonly who: AccountId32;
      readonly callHash: U8aFixed;
      readonly oldDeposit: u128;
      readonly newDeposit: u128;
    } & Struct;
    readonly type: 'NewMultisig' | 'MultisigApproval' | 'MultisigExecuted' | 'MultisigCancelled' | 'DepositPoked';
  }

  /** @name PalletBountiesEvent (450) */
  interface PalletBountiesEvent extends Enum {
    readonly isBountyProposed: boolean;
    readonly asBountyProposed: {
      readonly index: u32;
    } & Struct;
    readonly isBountyRejected: boolean;
    readonly asBountyRejected: {
      readonly index: u32;
      readonly bond: u128;
    } & Struct;
    readonly isBountyBecameActive: boolean;
    readonly asBountyBecameActive: {
      readonly index: u32;
    } & Struct;
    readonly isBountyAwarded: boolean;
    readonly asBountyAwarded: {
      readonly index: u32;
      readonly beneficiary: AccountId32;
    } & Struct;
    readonly isBountyClaimed: boolean;
    readonly asBountyClaimed: {
      readonly index: u32;
      readonly payout: u128;
      readonly beneficiary: AccountId32;
    } & Struct;
    readonly isBountyCanceled: boolean;
    readonly asBountyCanceled: {
      readonly index: u32;
    } & Struct;
    readonly isBountyExtended: boolean;
    readonly asBountyExtended: {
      readonly index: u32;
    } & Struct;
    readonly isBountyApproved: boolean;
    readonly asBountyApproved: {
      readonly index: u32;
    } & Struct;
    readonly isCuratorProposed: boolean;
    readonly asCuratorProposed: {
      readonly bountyId: u32;
      readonly curator: AccountId32;
    } & Struct;
    readonly isCuratorUnassigned: boolean;
    readonly asCuratorUnassigned: {
      readonly bountyId: u32;
    } & Struct;
    readonly isCuratorAccepted: boolean;
    readonly asCuratorAccepted: {
      readonly bountyId: u32;
      readonly curator: AccountId32;
    } & Struct;
    readonly isDepositPoked: boolean;
    readonly asDepositPoked: {
      readonly bountyId: u32;
      readonly proposer: AccountId32;
      readonly oldDeposit: u128;
      readonly newDeposit: u128;
    } & Struct;
    readonly isBountyFundsReclaimed: boolean;
    readonly asBountyFundsReclaimed: {
      readonly bountyId: u32;
    } & Struct;
    readonly type: 'BountyProposed' | 'BountyRejected' | 'BountyBecameActive' | 'BountyAwarded' | 'BountyClaimed' | 'BountyCanceled' | 'BountyExtended' | 'BountyApproved' | 'CuratorProposed' | 'CuratorUnassigned' | 'CuratorAccepted' | 'DepositPoked' | 'BountyFundsReclaimed';
  }

  /** @name PalletAssetsEvent (451) */
  interface PalletAssetsEvent extends Enum {
    readonly isCreated: boolean;
    readonly asCreated: {
      readonly assetId: u32;
      readonly creator: AccountId32;
      readonly owner: AccountId32;
    } & Struct;
    readonly isIssued: boolean;
    readonly asIssued: {
      readonly assetId: u32;
      readonly owner: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isTransferred: boolean;
    readonly asTransferred: {
      readonly assetId: u32;
      readonly from: AccountId32;
      readonly to: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isBurned: boolean;
    readonly asBurned: {
      readonly assetId: u32;
      readonly owner: AccountId32;
      readonly balance: u128;
    } & Struct;
    readonly isTeamChanged: boolean;
    readonly asTeamChanged: {
      readonly assetId: u32;
      readonly issuer: AccountId32;
      readonly admin: AccountId32;
      readonly freezer: AccountId32;
    } & Struct;
    readonly isOwnerChanged: boolean;
    readonly asOwnerChanged: {
      readonly assetId: u32;
      readonly owner: AccountId32;
    } & Struct;
    readonly isFrozen: boolean;
    readonly asFrozen: {
      readonly assetId: u32;
      readonly who: AccountId32;
    } & Struct;
    readonly isThawed: boolean;
    readonly asThawed: {
      readonly assetId: u32;
      readonly who: AccountId32;
    } & Struct;
    readonly isAssetFrozen: boolean;
    readonly asAssetFrozen: {
      readonly assetId: u32;
    } & Struct;
    readonly isAssetThawed: boolean;
    readonly asAssetThawed: {
      readonly assetId: u32;
    } & Struct;
    readonly isAccountsDestroyed: boolean;
    readonly asAccountsDestroyed: {
      readonly assetId: u32;
      readonly accountsDestroyed: u32;
      readonly accountsRemaining: u32;
    } & Struct;
    readonly isApprovalsDestroyed: boolean;
    readonly asApprovalsDestroyed: {
      readonly assetId: u32;
      readonly approvalsDestroyed: u32;
      readonly approvalsRemaining: u32;
    } & Struct;
    readonly isDestructionStarted: boolean;
    readonly asDestructionStarted: {
      readonly assetId: u32;
    } & Struct;
    readonly isDestroyed: boolean;
    readonly asDestroyed: {
      readonly assetId: u32;
    } & Struct;
    readonly isForceCreated: boolean;
    readonly asForceCreated: {
      readonly assetId: u32;
      readonly owner: AccountId32;
    } & Struct;
    readonly isMetadataSet: boolean;
    readonly asMetadataSet: {
      readonly assetId: u32;
      readonly name: Bytes;
      readonly symbol: Bytes;
      readonly decimals: u8;
      readonly isFrozen: bool;
    } & Struct;
    readonly isMetadataCleared: boolean;
    readonly asMetadataCleared: {
      readonly assetId: u32;
    } & Struct;
    readonly isApprovedTransfer: boolean;
    readonly asApprovedTransfer: {
      readonly assetId: u32;
      readonly source: AccountId32;
      readonly delegate: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isApprovalCancelled: boolean;
    readonly asApprovalCancelled: {
      readonly assetId: u32;
      readonly owner: AccountId32;
      readonly delegate: AccountId32;
    } & Struct;
    readonly isTransferredApproved: boolean;
    readonly asTransferredApproved: {
      readonly assetId: u32;
      readonly owner: AccountId32;
      readonly delegate: AccountId32;
      readonly destination: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isAssetStatusChanged: boolean;
    readonly asAssetStatusChanged: {
      readonly assetId: u32;
    } & Struct;
    readonly isAssetMinBalanceChanged: boolean;
    readonly asAssetMinBalanceChanged: {
      readonly assetId: u32;
      readonly newMinBalance: u128;
    } & Struct;
    readonly isTouched: boolean;
    readonly asTouched: {
      readonly assetId: u32;
      readonly who: AccountId32;
      readonly depositor: AccountId32;
    } & Struct;
    readonly isBlocked: boolean;
    readonly asBlocked: {
      readonly assetId: u32;
      readonly who: AccountId32;
    } & Struct;
    readonly isDeposited: boolean;
    readonly asDeposited: {
      readonly assetId: u32;
      readonly who: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isWithdrawn: boolean;
    readonly asWithdrawn: {
      readonly assetId: u32;
      readonly who: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isReservesUpdated: boolean;
    readonly asReservesUpdated: {
      readonly assetId: u32;
      readonly reserves: Vec<Null>;
    } & Struct;
    readonly isReservesRemoved: boolean;
    readonly asReservesRemoved: {
      readonly assetId: u32;
    } & Struct;
    readonly isIssuedCredit: boolean;
    readonly asIssuedCredit: {
      readonly assetId: u32;
      readonly amount: u128;
    } & Struct;
    readonly isBurnedCredit: boolean;
    readonly asBurnedCredit: {
      readonly assetId: u32;
      readonly amount: u128;
    } & Struct;
    readonly isIssuedDebt: boolean;
    readonly asIssuedDebt: {
      readonly assetId: u32;
      readonly amount: u128;
    } & Struct;
    readonly isBurnedDebt: boolean;
    readonly asBurnedDebt: {
      readonly assetId: u32;
      readonly amount: u128;
    } & Struct;
    readonly type: 'Created' | 'Issued' | 'Transferred' | 'Burned' | 'TeamChanged' | 'OwnerChanged' | 'Frozen' | 'Thawed' | 'AssetFrozen' | 'AssetThawed' | 'AccountsDestroyed' | 'ApprovalsDestroyed' | 'DestructionStarted' | 'Destroyed' | 'ForceCreated' | 'MetadataSet' | 'MetadataCleared' | 'ApprovedTransfer' | 'ApprovalCancelled' | 'TransferredApproved' | 'AssetStatusChanged' | 'AssetMinBalanceChanged' | 'Touched' | 'Blocked' | 'Deposited' | 'Withdrawn' | 'ReservesUpdated' | 'ReservesRemoved' | 'IssuedCredit' | 'BurnedCredit' | 'IssuedDebt' | 'BurnedDebt';
  }

  /** @name PalletLotteryEvent (453) */
  interface PalletLotteryEvent extends Enum {
    readonly isLotteryStarted: boolean;
    readonly isCallsUpdated: boolean;
    readonly isWinner: boolean;
    readonly asWinner: {
      readonly winner: AccountId32;
      readonly lotteryBalance: u128;
    } & Struct;
    readonly isTicketBought: boolean;
    readonly asTicketBought: {
      readonly who: AccountId32;
      readonly callIndex: ITuple<[u8, u8]>;
    } & Struct;
    readonly type: 'LotteryStarted' | 'CallsUpdated' | 'Winner' | 'TicketBought';
  }

  /** @name PalletUniquesEvent (455) */
  interface PalletUniquesEvent extends Enum {
    readonly isCreated: boolean;
    readonly asCreated: {
      readonly collection: u32;
      readonly creator: AccountId32;
      readonly owner: AccountId32;
    } & Struct;
    readonly isForceCreated: boolean;
    readonly asForceCreated: {
      readonly collection: u32;
      readonly owner: AccountId32;
    } & Struct;
    readonly isDestroyed: boolean;
    readonly asDestroyed: {
      readonly collection: u32;
    } & Struct;
    readonly isIssued: boolean;
    readonly asIssued: {
      readonly collection: u32;
      readonly item: u32;
      readonly owner: AccountId32;
    } & Struct;
    readonly isTransferred: boolean;
    readonly asTransferred: {
      readonly collection: u32;
      readonly item: u32;
      readonly from: AccountId32;
      readonly to: AccountId32;
    } & Struct;
    readonly isBurned: boolean;
    readonly asBurned: {
      readonly collection: u32;
      readonly item: u32;
      readonly owner: AccountId32;
    } & Struct;
    readonly isFrozen: boolean;
    readonly asFrozen: {
      readonly collection: u32;
      readonly item: u32;
    } & Struct;
    readonly isThawed: boolean;
    readonly asThawed: {
      readonly collection: u32;
      readonly item: u32;
    } & Struct;
    readonly isCollectionFrozen: boolean;
    readonly asCollectionFrozen: {
      readonly collection: u32;
    } & Struct;
    readonly isCollectionThawed: boolean;
    readonly asCollectionThawed: {
      readonly collection: u32;
    } & Struct;
    readonly isOwnerChanged: boolean;
    readonly asOwnerChanged: {
      readonly collection: u32;
      readonly newOwner: AccountId32;
    } & Struct;
    readonly isTeamChanged: boolean;
    readonly asTeamChanged: {
      readonly collection: u32;
      readonly issuer: AccountId32;
      readonly admin: AccountId32;
      readonly freezer: AccountId32;
    } & Struct;
    readonly isApprovedTransfer: boolean;
    readonly asApprovedTransfer: {
      readonly collection: u32;
      readonly item: u32;
      readonly owner: AccountId32;
      readonly delegate: AccountId32;
    } & Struct;
    readonly isApprovalCancelled: boolean;
    readonly asApprovalCancelled: {
      readonly collection: u32;
      readonly item: u32;
      readonly owner: AccountId32;
      readonly delegate: AccountId32;
    } & Struct;
    readonly isItemStatusChanged: boolean;
    readonly asItemStatusChanged: {
      readonly collection: u32;
    } & Struct;
    readonly isCollectionMetadataSet: boolean;
    readonly asCollectionMetadataSet: {
      readonly collection: u32;
      readonly data: Bytes;
      readonly isFrozen: bool;
    } & Struct;
    readonly isCollectionMetadataCleared: boolean;
    readonly asCollectionMetadataCleared: {
      readonly collection: u32;
    } & Struct;
    readonly isMetadataSet: boolean;
    readonly asMetadataSet: {
      readonly collection: u32;
      readonly item: u32;
      readonly data: Bytes;
      readonly isFrozen: bool;
    } & Struct;
    readonly isMetadataCleared: boolean;
    readonly asMetadataCleared: {
      readonly collection: u32;
      readonly item: u32;
    } & Struct;
    readonly isRedeposited: boolean;
    readonly asRedeposited: {
      readonly collection: u32;
      readonly successfulItems: Vec<u32>;
    } & Struct;
    readonly isAttributeSet: boolean;
    readonly asAttributeSet: {
      readonly collection: u32;
      readonly maybeItem: Option<u32>;
      readonly key: Bytes;
      readonly value: Bytes;
    } & Struct;
    readonly isAttributeCleared: boolean;
    readonly asAttributeCleared: {
      readonly collection: u32;
      readonly maybeItem: Option<u32>;
      readonly key: Bytes;
    } & Struct;
    readonly isOwnershipAcceptanceChanged: boolean;
    readonly asOwnershipAcceptanceChanged: {
      readonly who: AccountId32;
      readonly maybeCollection: Option<u32>;
    } & Struct;
    readonly isCollectionMaxSupplySet: boolean;
    readonly asCollectionMaxSupplySet: {
      readonly collection: u32;
      readonly maxSupply: u32;
    } & Struct;
    readonly isItemPriceSet: boolean;
    readonly asItemPriceSet: {
      readonly collection: u32;
      readonly item: u32;
      readonly price: u128;
      readonly whitelistedBuyer: Option<AccountId32>;
    } & Struct;
    readonly isItemPriceRemoved: boolean;
    readonly asItemPriceRemoved: {
      readonly collection: u32;
      readonly item: u32;
    } & Struct;
    readonly isItemBought: boolean;
    readonly asItemBought: {
      readonly collection: u32;
      readonly item: u32;
      readonly price: u128;
      readonly seller: AccountId32;
      readonly buyer: AccountId32;
    } & Struct;
    readonly type: 'Created' | 'ForceCreated' | 'Destroyed' | 'Issued' | 'Transferred' | 'Burned' | 'Frozen' | 'Thawed' | 'CollectionFrozen' | 'CollectionThawed' | 'OwnerChanged' | 'TeamChanged' | 'ApprovedTransfer' | 'ApprovalCancelled' | 'ItemStatusChanged' | 'CollectionMetadataSet' | 'CollectionMetadataCleared' | 'MetadataSet' | 'MetadataCleared' | 'Redeposited' | 'AttributeSet' | 'AttributeCleared' | 'OwnershipAcceptanceChanged' | 'CollectionMaxSupplySet' | 'ItemPriceSet' | 'ItemPriceRemoved' | 'ItemBought';
  }

  /** @name PalletNftsEvent (456) */
  interface PalletNftsEvent extends Enum {
    readonly isCreated: boolean;
    readonly asCreated: {
      readonly collection: u32;
      readonly creator: AccountId32;
      readonly owner: AccountId32;
    } & Struct;
    readonly isForceCreated: boolean;
    readonly asForceCreated: {
      readonly collection: u32;
      readonly owner: AccountId32;
    } & Struct;
    readonly isDestroyed: boolean;
    readonly asDestroyed: {
      readonly collection: u32;
    } & Struct;
    readonly isIssued: boolean;
    readonly asIssued: {
      readonly collection: u32;
      readonly item: u32;
      readonly owner: AccountId32;
    } & Struct;
    readonly isTransferred: boolean;
    readonly asTransferred: {
      readonly collection: u32;
      readonly item: u32;
      readonly from: AccountId32;
      readonly to: AccountId32;
    } & Struct;
    readonly isBurned: boolean;
    readonly asBurned: {
      readonly collection: u32;
      readonly item: u32;
      readonly owner: AccountId32;
    } & Struct;
    readonly isItemTransferLocked: boolean;
    readonly asItemTransferLocked: {
      readonly collection: u32;
      readonly item: u32;
    } & Struct;
    readonly isItemTransferUnlocked: boolean;
    readonly asItemTransferUnlocked: {
      readonly collection: u32;
      readonly item: u32;
    } & Struct;
    readonly isItemPropertiesLocked: boolean;
    readonly asItemPropertiesLocked: {
      readonly collection: u32;
      readonly item: u32;
      readonly lockMetadata: bool;
      readonly lockAttributes: bool;
    } & Struct;
    readonly isCollectionLocked: boolean;
    readonly asCollectionLocked: {
      readonly collection: u32;
    } & Struct;
    readonly isOwnerChanged: boolean;
    readonly asOwnerChanged: {
      readonly collection: u32;
      readonly newOwner: AccountId32;
    } & Struct;
    readonly isTeamChanged: boolean;
    readonly asTeamChanged: {
      readonly collection: u32;
      readonly issuer: Option<AccountId32>;
      readonly admin: Option<AccountId32>;
      readonly freezer: Option<AccountId32>;
    } & Struct;
    readonly isTransferApproved: boolean;
    readonly asTransferApproved: {
      readonly collection: u32;
      readonly item: u32;
      readonly owner: AccountId32;
      readonly delegate: AccountId32;
      readonly deadline: Option<u32>;
    } & Struct;
    readonly isApprovalCancelled: boolean;
    readonly asApprovalCancelled: {
      readonly collection: u32;
      readonly item: u32;
      readonly owner: AccountId32;
      readonly delegate: AccountId32;
    } & Struct;
    readonly isAllApprovalsCancelled: boolean;
    readonly asAllApprovalsCancelled: {
      readonly collection: u32;
      readonly item: u32;
      readonly owner: AccountId32;
    } & Struct;
    readonly isCollectionConfigChanged: boolean;
    readonly asCollectionConfigChanged: {
      readonly collection: u32;
    } & Struct;
    readonly isCollectionMetadataSet: boolean;
    readonly asCollectionMetadataSet: {
      readonly collection: u32;
      readonly data: Bytes;
    } & Struct;
    readonly isCollectionMetadataCleared: boolean;
    readonly asCollectionMetadataCleared: {
      readonly collection: u32;
    } & Struct;
    readonly isItemMetadataSet: boolean;
    readonly asItemMetadataSet: {
      readonly collection: u32;
      readonly item: u32;
      readonly data: Bytes;
    } & Struct;
    readonly isItemMetadataCleared: boolean;
    readonly asItemMetadataCleared: {
      readonly collection: u32;
      readonly item: u32;
    } & Struct;
    readonly isRedeposited: boolean;
    readonly asRedeposited: {
      readonly collection: u32;
      readonly successfulItems: Vec<u32>;
    } & Struct;
    readonly isAttributeSet: boolean;
    readonly asAttributeSet: {
      readonly collection: u32;
      readonly maybeItem: Option<u32>;
      readonly key: Bytes;
      readonly value: Bytes;
      readonly namespace: PalletNftsAttributeNamespace;
    } & Struct;
    readonly isAttributeCleared: boolean;
    readonly asAttributeCleared: {
      readonly collection: u32;
      readonly maybeItem: Option<u32>;
      readonly key: Bytes;
      readonly namespace: PalletNftsAttributeNamespace;
    } & Struct;
    readonly isItemAttributesApprovalAdded: boolean;
    readonly asItemAttributesApprovalAdded: {
      readonly collection: u32;
      readonly item: u32;
      readonly delegate: AccountId32;
    } & Struct;
    readonly isItemAttributesApprovalRemoved: boolean;
    readonly asItemAttributesApprovalRemoved: {
      readonly collection: u32;
      readonly item: u32;
      readonly delegate: AccountId32;
    } & Struct;
    readonly isOwnershipAcceptanceChanged: boolean;
    readonly asOwnershipAcceptanceChanged: {
      readonly who: AccountId32;
      readonly maybeCollection: Option<u32>;
    } & Struct;
    readonly isCollectionMaxSupplySet: boolean;
    readonly asCollectionMaxSupplySet: {
      readonly collection: u32;
      readonly maxSupply: u32;
    } & Struct;
    readonly isCollectionMintSettingsUpdated: boolean;
    readonly asCollectionMintSettingsUpdated: {
      readonly collection: u32;
    } & Struct;
    readonly isNextCollectionIdIncremented: boolean;
    readonly asNextCollectionIdIncremented: {
      readonly nextId: Option<u32>;
    } & Struct;
    readonly isItemPriceSet: boolean;
    readonly asItemPriceSet: {
      readonly collection: u32;
      readonly item: u32;
      readonly price: u128;
      readonly whitelistedBuyer: Option<AccountId32>;
    } & Struct;
    readonly isItemPriceRemoved: boolean;
    readonly asItemPriceRemoved: {
      readonly collection: u32;
      readonly item: u32;
    } & Struct;
    readonly isItemBought: boolean;
    readonly asItemBought: {
      readonly collection: u32;
      readonly item: u32;
      readonly price: u128;
      readonly seller: AccountId32;
      readonly buyer: AccountId32;
    } & Struct;
    readonly isTipSent: boolean;
    readonly asTipSent: {
      readonly collection: u32;
      readonly item: u32;
      readonly sender: AccountId32;
      readonly receiver: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isSwapCreated: boolean;
    readonly asSwapCreated: {
      readonly offeredCollection: u32;
      readonly offeredItem: u32;
      readonly desiredCollection: u32;
      readonly desiredItem: Option<u32>;
      readonly price: Option<PalletNftsPriceWithDirection>;
      readonly deadline: u32;
    } & Struct;
    readonly isSwapCancelled: boolean;
    readonly asSwapCancelled: {
      readonly offeredCollection: u32;
      readonly offeredItem: u32;
      readonly desiredCollection: u32;
      readonly desiredItem: Option<u32>;
      readonly price: Option<PalletNftsPriceWithDirection>;
      readonly deadline: u32;
    } & Struct;
    readonly isSwapClaimed: boolean;
    readonly asSwapClaimed: {
      readonly sentCollection: u32;
      readonly sentItem: u32;
      readonly sentItemOwner: AccountId32;
      readonly receivedCollection: u32;
      readonly receivedItem: u32;
      readonly receivedItemOwner: AccountId32;
      readonly price: Option<PalletNftsPriceWithDirection>;
      readonly deadline: u32;
    } & Struct;
    readonly isPreSignedAttributesSet: boolean;
    readonly asPreSignedAttributesSet: {
      readonly collection: u32;
      readonly item: u32;
      readonly namespace: PalletNftsAttributeNamespace;
    } & Struct;
    readonly isPalletAttributeSet: boolean;
    readonly asPalletAttributeSet: {
      readonly collection: u32;
      readonly item: Option<u32>;
      readonly attribute: PalletNftsPalletAttributes;
      readonly value: Bytes;
    } & Struct;
    readonly type: 'Created' | 'ForceCreated' | 'Destroyed' | 'Issued' | 'Transferred' | 'Burned' | 'ItemTransferLocked' | 'ItemTransferUnlocked' | 'ItemPropertiesLocked' | 'CollectionLocked' | 'OwnerChanged' | 'TeamChanged' | 'TransferApproved' | 'ApprovalCancelled' | 'AllApprovalsCancelled' | 'CollectionConfigChanged' | 'CollectionMetadataSet' | 'CollectionMetadataCleared' | 'ItemMetadataSet' | 'ItemMetadataCleared' | 'Redeposited' | 'AttributeSet' | 'AttributeCleared' | 'ItemAttributesApprovalAdded' | 'ItemAttributesApprovalRemoved' | 'OwnershipAcceptanceChanged' | 'CollectionMaxSupplySet' | 'CollectionMintSettingsUpdated' | 'NextCollectionIdIncremented' | 'ItemPriceSet' | 'ItemPriceRemoved' | 'ItemBought' | 'TipSent' | 'SwapCreated' | 'SwapCancelled' | 'SwapClaimed' | 'PreSignedAttributesSet' | 'PalletAttributeSet';
  }

  /** @name PalletNftsPalletAttributes (457) */
  interface PalletNftsPalletAttributes extends Enum {
    readonly isUsedToClaim: boolean;
    readonly asUsedToClaim: u32;
    readonly isTransferDisabled: boolean;
    readonly type: 'UsedToClaim' | 'TransferDisabled';
  }

  /** @name PalletNftFractionalizationEvent (458) */
  interface PalletNftFractionalizationEvent extends Enum {
    readonly isNftFractionalized: boolean;
    readonly asNftFractionalized: {
      readonly nftCollection: u32;
      readonly nft: u32;
      readonly fractions: u128;
      readonly asset: u32;
      readonly beneficiary: AccountId32;
    } & Struct;
    readonly isNftUnified: boolean;
    readonly asNftUnified: {
      readonly nftCollection: u32;
      readonly nft: u32;
      readonly asset: u32;
      readonly beneficiary: AccountId32;
    } & Struct;
    readonly type: 'NftFractionalized' | 'NftUnified';
  }

  /** @name PalletTransactionStorageEvent (459) */
  interface PalletTransactionStorageEvent extends Enum {
    readonly isStored: boolean;
    readonly asStored: {
      readonly index: u32;
      readonly contentHash: U8aFixed;
    } & Struct;
    readonly isRenewed: boolean;
    readonly asRenewed: {
      readonly index: u32;
      readonly contentHash: U8aFixed;
    } & Struct;
    readonly isProofChecked: boolean;
    readonly isAccountAuthorized: boolean;
    readonly asAccountAuthorized: {
      readonly who: AccountId32;
      readonly transactions: u32;
      readonly bytes: u64;
    } & Struct;
    readonly isAccountAuthorizationRefreshed: boolean;
    readonly asAccountAuthorizationRefreshed: {
      readonly who: AccountId32;
    } & Struct;
    readonly isPreimageAuthorized: boolean;
    readonly asPreimageAuthorized: {
      readonly contentHash: U8aFixed;
      readonly maxSize: u64;
    } & Struct;
    readonly isPreimageAuthorizationRefreshed: boolean;
    readonly asPreimageAuthorizationRefreshed: {
      readonly contentHash: U8aFixed;
    } & Struct;
    readonly isExpiredAccountAuthorizationRemoved: boolean;
    readonly asExpiredAccountAuthorizationRemoved: {
      readonly who: AccountId32;
    } & Struct;
    readonly isExpiredPreimageAuthorizationRemoved: boolean;
    readonly asExpiredPreimageAuthorizationRemoved: {
      readonly contentHash: U8aFixed;
    } & Struct;
    readonly type: 'Stored' | 'Renewed' | 'ProofChecked' | 'AccountAuthorized' | 'AccountAuthorizationRefreshed' | 'PreimageAuthorized' | 'PreimageAuthorizationRefreshed' | 'ExpiredAccountAuthorizationRemoved' | 'ExpiredPreimageAuthorizationRemoved';
  }

  /** @name PalletBagsListEvent (460) */
  interface PalletBagsListEvent extends Enum {
    readonly isRebagged: boolean;
    readonly asRebagged: {
      readonly who: AccountId32;
      readonly from: u64;
      readonly to: u64;
    } & Struct;
    readonly isScoreUpdated: boolean;
    readonly asScoreUpdated: {
      readonly who: AccountId32;
      readonly newScore: u64;
    } & Struct;
    readonly type: 'Rebagged' | 'ScoreUpdated';
  }

  /** @name PalletChildBountiesEvent (461) */
  interface PalletChildBountiesEvent extends Enum {
    readonly isAdded: boolean;
    readonly asAdded: {
      readonly index: u32;
      readonly childIndex: u32;
    } & Struct;
    readonly isAwarded: boolean;
    readonly asAwarded: {
      readonly index: u32;
      readonly childIndex: u32;
      readonly beneficiary: AccountId32;
    } & Struct;
    readonly isClaimed: boolean;
    readonly asClaimed: {
      readonly index: u32;
      readonly childIndex: u32;
      readonly payout: u128;
      readonly beneficiary: AccountId32;
    } & Struct;
    readonly isCanceled: boolean;
    readonly asCanceled: {
      readonly index: u32;
      readonly childIndex: u32;
    } & Struct;
    readonly type: 'Added' | 'Awarded' | 'Claimed' | 'Canceled';
  }

  /** @name PalletRemarkEvent (462) */
  interface PalletRemarkEvent extends Enum {
    readonly isStored: boolean;
    readonly asStored: {
      readonly sender: AccountId32;
      readonly contentHash: H256;
    } & Struct;
    readonly type: 'Stored';
  }

  /** @name PalletNominationPoolsEvent (463) */
  interface PalletNominationPoolsEvent extends Enum {
    readonly isCreated: boolean;
    readonly asCreated: {
      readonly depositor: AccountId32;
      readonly poolId: u32;
    } & Struct;
    readonly isBonded: boolean;
    readonly asBonded: {
      readonly member: AccountId32;
      readonly poolId: u32;
      readonly bonded: u128;
      readonly joined: bool;
    } & Struct;
    readonly isPaidOut: boolean;
    readonly asPaidOut: {
      readonly member: AccountId32;
      readonly poolId: u32;
      readonly payout: u128;
    } & Struct;
    readonly isUnbonded: boolean;
    readonly asUnbonded: {
      readonly member: AccountId32;
      readonly poolId: u32;
      readonly balance: u128;
      readonly points: u128;
      readonly era: u32;
    } & Struct;
    readonly isWithdrawn: boolean;
    readonly asWithdrawn: {
      readonly member: AccountId32;
      readonly poolId: u32;
      readonly balance: u128;
      readonly points: u128;
    } & Struct;
    readonly isDestroyed: boolean;
    readonly asDestroyed: {
      readonly poolId: u32;
    } & Struct;
    readonly isStateChanged: boolean;
    readonly asStateChanged: {
      readonly poolId: u32;
      readonly newState: PalletNominationPoolsPoolState;
    } & Struct;
    readonly isMemberRemoved: boolean;
    readonly asMemberRemoved: {
      readonly poolId: u32;
      readonly member: AccountId32;
      readonly releasedBalance: u128;
    } & Struct;
    readonly isRolesUpdated: boolean;
    readonly asRolesUpdated: {
      readonly root: Option<AccountId32>;
      readonly bouncer: Option<AccountId32>;
      readonly nominator: Option<AccountId32>;
    } & Struct;
    readonly isPoolSlashed: boolean;
    readonly asPoolSlashed: {
      readonly poolId: u32;
      readonly balance: u128;
    } & Struct;
    readonly isUnbondingPoolSlashed: boolean;
    readonly asUnbondingPoolSlashed: {
      readonly poolId: u32;
      readonly era: u32;
      readonly balance: u128;
    } & Struct;
    readonly isPoolCommissionUpdated: boolean;
    readonly asPoolCommissionUpdated: {
      readonly poolId: u32;
      readonly current: Option<ITuple<[Perbill, AccountId32]>>;
    } & Struct;
    readonly isPoolMaxCommissionUpdated: boolean;
    readonly asPoolMaxCommissionUpdated: {
      readonly poolId: u32;
      readonly maxCommission: Perbill;
    } & Struct;
    readonly isPoolCommissionChangeRateUpdated: boolean;
    readonly asPoolCommissionChangeRateUpdated: {
      readonly poolId: u32;
      readonly changeRate: PalletNominationPoolsCommissionChangeRate;
    } & Struct;
    readonly isPoolCommissionClaimPermissionUpdated: boolean;
    readonly asPoolCommissionClaimPermissionUpdated: {
      readonly poolId: u32;
      readonly permission: Option<PalletNominationPoolsCommissionClaimPermission>;
    } & Struct;
    readonly isPoolCommissionClaimed: boolean;
    readonly asPoolCommissionClaimed: {
      readonly poolId: u32;
      readonly commission: u128;
    } & Struct;
    readonly isMinBalanceDeficitAdjusted: boolean;
    readonly asMinBalanceDeficitAdjusted: {
      readonly poolId: u32;
      readonly amount: u128;
    } & Struct;
    readonly isMinBalanceExcessAdjusted: boolean;
    readonly asMinBalanceExcessAdjusted: {
      readonly poolId: u32;
      readonly amount: u128;
    } & Struct;
    readonly isMemberClaimPermissionUpdated: boolean;
    readonly asMemberClaimPermissionUpdated: {
      readonly member: AccountId32;
      readonly permission: PalletNominationPoolsClaimPermission;
    } & Struct;
    readonly isMetadataUpdated: boolean;
    readonly asMetadataUpdated: {
      readonly poolId: u32;
      readonly caller: AccountId32;
    } & Struct;
    readonly isPoolNominationMade: boolean;
    readonly asPoolNominationMade: {
      readonly poolId: u32;
      readonly caller: AccountId32;
    } & Struct;
    readonly isPoolNominatorChilled: boolean;
    readonly asPoolNominatorChilled: {
      readonly poolId: u32;
      readonly caller: AccountId32;
    } & Struct;
    readonly isGlobalParamsUpdated: boolean;
    readonly asGlobalParamsUpdated: {
      readonly minJoinBond: u128;
      readonly minCreateBond: u128;
      readonly maxPools: Option<u32>;
      readonly maxMembers: Option<u32>;
      readonly maxMembersPerPool: Option<u32>;
      readonly globalMaxCommission: Option<Perbill>;
    } & Struct;
    readonly type: 'Created' | 'Bonded' | 'PaidOut' | 'Unbonded' | 'Withdrawn' | 'Destroyed' | 'StateChanged' | 'MemberRemoved' | 'RolesUpdated' | 'PoolSlashed' | 'UnbondingPoolSlashed' | 'PoolCommissionUpdated' | 'PoolMaxCommissionUpdated' | 'PoolCommissionChangeRateUpdated' | 'PoolCommissionClaimPermissionUpdated' | 'PoolCommissionClaimed' | 'MinBalanceDeficitAdjusted' | 'MinBalanceExcessAdjusted' | 'MemberClaimPermissionUpdated' | 'MetadataUpdated' | 'PoolNominationMade' | 'PoolNominatorChilled' | 'GlobalParamsUpdated';
  }

  /** @name PalletAssetConversionEvent (465) */
  interface PalletAssetConversionEvent extends Enum {
    readonly isPoolCreated: boolean;
    readonly asPoolCreated: {
      readonly creator: AccountId32;
      readonly poolId: ITuple<[FrameSupportTokensFungibleUnionOfNativeOrWithId, FrameSupportTokensFungibleUnionOfNativeOrWithId]>;
      readonly poolAccount: AccountId32;
      readonly lpToken: u32;
    } & Struct;
    readonly isPoolFeeSet: boolean;
    readonly asPoolFeeSet: {
      readonly poolId: ITuple<[FrameSupportTokensFungibleUnionOfNativeOrWithId, FrameSupportTokensFungibleUnionOfNativeOrWithId]>;
      readonly fee: Permill;
    } & Struct;
    readonly isLiquidityAdded: boolean;
    readonly asLiquidityAdded: {
      readonly who: AccountId32;
      readonly mintTo: AccountId32;
      readonly poolId: ITuple<[FrameSupportTokensFungibleUnionOfNativeOrWithId, FrameSupportTokensFungibleUnionOfNativeOrWithId]>;
      readonly amount1Provided: u128;
      readonly amount2Provided: u128;
      readonly lpToken: u32;
      readonly lpTokenMinted: u128;
    } & Struct;
    readonly isLiquidityRemoved: boolean;
    readonly asLiquidityRemoved: {
      readonly who: AccountId32;
      readonly withdrawTo: AccountId32;
      readonly poolId: ITuple<[FrameSupportTokensFungibleUnionOfNativeOrWithId, FrameSupportTokensFungibleUnionOfNativeOrWithId]>;
      readonly amount1: u128;
      readonly amount2: u128;
      readonly lpToken: u32;
      readonly lpTokenBurned: u128;
      readonly withdrawalFee: Permill;
    } & Struct;
    readonly isSwapExecuted: boolean;
    readonly asSwapExecuted: {
      readonly who: AccountId32;
      readonly sendTo: AccountId32;
      readonly amountIn: u128;
      readonly amountOut: u128;
      readonly path: Vec<ITuple<[FrameSupportTokensFungibleUnionOfNativeOrWithId, u128]>>;
    } & Struct;
    readonly isSwapCreditExecuted: boolean;
    readonly asSwapCreditExecuted: {
      readonly amountIn: u128;
      readonly amountOut: u128;
      readonly path: Vec<ITuple<[FrameSupportTokensFungibleUnionOfNativeOrWithId, u128]>>;
    } & Struct;
    readonly isTouched: boolean;
    readonly asTouched: {
      readonly poolId: ITuple<[FrameSupportTokensFungibleUnionOfNativeOrWithId, FrameSupportTokensFungibleUnionOfNativeOrWithId]>;
      readonly who: AccountId32;
    } & Struct;
    readonly type: 'PoolCreated' | 'PoolFeeSet' | 'LiquidityAdded' | 'LiquidityRemoved' | 'SwapExecuted' | 'SwapCreditExecuted' | 'Touched';
  }

  /** @name PalletFastUnstakeEvent (468) */
  interface PalletFastUnstakeEvent extends Enum {
    readonly isUnstaked: boolean;
    readonly asUnstaked: {
      readonly stash: AccountId32;
      readonly result: Result<Null, SpRuntimeDispatchError>;
    } & Struct;
    readonly isSlashed: boolean;
    readonly asSlashed: {
      readonly stash: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isBatchChecked: boolean;
    readonly asBatchChecked: {
      readonly eras: Vec<u32>;
    } & Struct;
    readonly isBatchFinished: boolean;
    readonly asBatchFinished: {
      readonly size_: u32;
    } & Struct;
    readonly isInternalError: boolean;
    readonly type: 'Unstaked' | 'Slashed' | 'BatchChecked' | 'BatchFinished' | 'InternalError';
  }

  /** @name PalletMessageQueueEvent (469) */
  interface PalletMessageQueueEvent extends Enum {
    readonly isProcessingFailed: boolean;
    readonly asProcessingFailed: {
      readonly id: H256;
      readonly origin: u32;
      readonly error: FrameSupportMessagesProcessMessageError;
    } & Struct;
    readonly isProcessed: boolean;
    readonly asProcessed: {
      readonly id: H256;
      readonly origin: u32;
      readonly weightUsed: SpWeightsWeightV2Weight;
      readonly success: bool;
    } & Struct;
    readonly isOverweightEnqueued: boolean;
    readonly asOverweightEnqueued: {
      readonly id: U8aFixed;
      readonly origin: u32;
      readonly pageIndex: u32;
      readonly messageIndex: u32;
    } & Struct;
    readonly isPageReaped: boolean;
    readonly asPageReaped: {
      readonly origin: u32;
      readonly index: u32;
    } & Struct;
    readonly type: 'ProcessingFailed' | 'Processed' | 'OverweightEnqueued' | 'PageReaped';
  }

  /** @name FrameSupportMessagesProcessMessageError (470) */
  interface FrameSupportMessagesProcessMessageError extends Enum {
    readonly isBadFormat: boolean;
    readonly isCorrupt: boolean;
    readonly isUnsupported: boolean;
    readonly isOverweight: boolean;
    readonly asOverweight: SpWeightsWeightV2Weight;
    readonly isYield: boolean;
    readonly isStackLimitReached: boolean;
    readonly type: 'BadFormat' | 'Corrupt' | 'Unsupported' | 'Overweight' | 'Yield' | 'StackLimitReached';
  }

  /** @name PalletTxPauseEvent (471) */
  interface PalletTxPauseEvent extends Enum {
    readonly isCallPaused: boolean;
    readonly asCallPaused: {
      readonly fullName: ITuple<[Bytes, Bytes]>;
    } & Struct;
    readonly isCallUnpaused: boolean;
    readonly asCallUnpaused: {
      readonly fullName: ITuple<[Bytes, Bytes]>;
    } & Struct;
    readonly type: 'CallPaused' | 'CallUnpaused';
  }

  /** @name PalletSafeModeEvent (472) */
  interface PalletSafeModeEvent extends Enum {
    readonly isEntered: boolean;
    readonly asEntered: {
      readonly until: u32;
    } & Struct;
    readonly isExtended: boolean;
    readonly asExtended: {
      readonly until: u32;
    } & Struct;
    readonly isExited: boolean;
    readonly asExited: {
      readonly reason: PalletSafeModeExitReason;
    } & Struct;
    readonly isDepositPlaced: boolean;
    readonly asDepositPlaced: {
      readonly account: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isDepositReleased: boolean;
    readonly asDepositReleased: {
      readonly account: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isDepositSlashed: boolean;
    readonly asDepositSlashed: {
      readonly account: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isCannotDeposit: boolean;
    readonly isCannotRelease: boolean;
    readonly type: 'Entered' | 'Extended' | 'Exited' | 'DepositPlaced' | 'DepositReleased' | 'DepositSlashed' | 'CannotDeposit' | 'CannotRelease';
  }

  /** @name PalletSafeModeExitReason (473) */
  interface PalletSafeModeExitReason extends Enum {
    readonly isTimeout: boolean;
    readonly isForce: boolean;
    readonly type: 'Timeout' | 'Force';
  }

  /** @name PalletStatementEvent (474) */
  interface PalletStatementEvent extends Enum {
    readonly isNewStatement: boolean;
    readonly asNewStatement: {
      readonly account: AccountId32;
      readonly statement: SpStatementStoreStatement;
    } & Struct;
    readonly type: 'NewStatement';
  }

  /** @name SpStatementStoreStatement (475) */
  interface SpStatementStoreStatement extends Vec<SpStatementStoreField> {}

  /** @name SpStatementStoreField (477) */
  interface SpStatementStoreField extends Enum {
    readonly isAuthenticityProof: boolean;
    readonly asAuthenticityProof: SpStatementStoreProof;
    readonly isDecryptionKey: boolean;
    readonly asDecryptionKey: U8aFixed;
    readonly isExpiry: boolean;
    readonly asExpiry: u64;
    readonly isChannel: boolean;
    readonly asChannel: U8aFixed;
    readonly isTopic1: boolean;
    readonly asTopic1: SpStatementStoreTopic;
    readonly isTopic2: boolean;
    readonly asTopic2: SpStatementStoreTopic;
    readonly isTopic3: boolean;
    readonly asTopic3: SpStatementStoreTopic;
    readonly isTopic4: boolean;
    readonly asTopic4: SpStatementStoreTopic;
    readonly isData: boolean;
    readonly asData: Bytes;
    readonly type: 'AuthenticityProof' | 'DecryptionKey' | 'Expiry' | 'Channel' | 'Topic1' | 'Topic2' | 'Topic3' | 'Topic4' | 'Data';
  }

  /** @name SpStatementStoreProof (478) */
  interface SpStatementStoreProof extends Enum {
    readonly isSr25519: boolean;
    readonly asSr25519: {
      readonly signature: U8aFixed;
      readonly signer: U8aFixed;
    } & Struct;
    readonly isEd25519: boolean;
    readonly asEd25519: {
      readonly signature: U8aFixed;
      readonly signer: U8aFixed;
    } & Struct;
    readonly isSecp256k1Ecdsa: boolean;
    readonly asSecp256k1Ecdsa: {
      readonly signature: U8aFixed;
      readonly signer: U8aFixed;
    } & Struct;
    readonly type: 'Sr25519' | 'Ed25519' | 'Secp256k1Ecdsa';
  }

  /** @name SpStatementStoreTopic (479) */
  interface SpStatementStoreTopic extends U8aFixed {}

  /** @name PalletMigrationsEvent (480) */
  interface PalletMigrationsEvent extends Enum {
    readonly isUpgradeStarted: boolean;
    readonly asUpgradeStarted: {
      readonly migrations: u32;
    } & Struct;
    readonly isUpgradeCompleted: boolean;
    readonly isUpgradeFailed: boolean;
    readonly isMigrationSkipped: boolean;
    readonly asMigrationSkipped: {
      readonly index: u32;
    } & Struct;
    readonly isMigrationAdvanced: boolean;
    readonly asMigrationAdvanced: {
      readonly index: u32;
      readonly took: u32;
    } & Struct;
    readonly isMigrationCompleted: boolean;
    readonly asMigrationCompleted: {
      readonly index: u32;
      readonly took: u32;
    } & Struct;
    readonly isMigrationFailed: boolean;
    readonly asMigrationFailed: {
      readonly index: u32;
      readonly took: u32;
    } & Struct;
    readonly isHistoricCleared: boolean;
    readonly asHistoricCleared: {
      readonly nextCursor: Option<Bytes>;
    } & Struct;
    readonly type: 'UpgradeStarted' | 'UpgradeCompleted' | 'UpgradeFailed' | 'MigrationSkipped' | 'MigrationAdvanced' | 'MigrationCompleted' | 'MigrationFailed' | 'HistoricCleared';
  }

  /** @name PalletBrokerEvent (481) */
  interface PalletBrokerEvent extends Enum {
    readonly isPurchased: boolean;
    readonly asPurchased: {
      readonly who: AccountId32;
      readonly regionId: FpCoretimeRegionId;
      readonly price: u128;
      readonly duration: u32;
    } & Struct;
    readonly isRenewable: boolean;
    readonly asRenewable: {
      readonly core: u16;
      readonly price: u128;
      readonly begin: u32;
      readonly workload: Vec<PalletBrokerScheduleItem>;
    } & Struct;
    readonly isRenewed: boolean;
    readonly asRenewed: {
      readonly who: AccountId32;
      readonly price: u128;
      readonly oldCore: u16;
      readonly core: u16;
      readonly begin: u32;
      readonly duration: u32;
      readonly workload: Vec<PalletBrokerScheduleItem>;
    } & Struct;
    readonly isTransferred: boolean;
    readonly asTransferred: {
      readonly regionId: FpCoretimeRegionId;
      readonly duration: u32;
      readonly oldOwner: Option<AccountId32>;
      readonly owner: Option<AccountId32>;
    } & Struct;
    readonly isPartitioned: boolean;
    readonly asPartitioned: {
      readonly oldRegionId: FpCoretimeRegionId;
      readonly newRegionIds: ITuple<[FpCoretimeRegionId, FpCoretimeRegionId]>;
    } & Struct;
    readonly isInterlaced: boolean;
    readonly asInterlaced: {
      readonly oldRegionId: FpCoretimeRegionId;
      readonly newRegionIds: ITuple<[FpCoretimeRegionId, FpCoretimeRegionId]>;
    } & Struct;
    readonly isAssigned: boolean;
    readonly asAssigned: {
      readonly regionId: FpCoretimeRegionId;
      readonly duration: u32;
      readonly task: u32;
    } & Struct;
    readonly isAssignmentRemoved: boolean;
    readonly asAssignmentRemoved: {
      readonly regionId: FpCoretimeRegionId;
    } & Struct;
    readonly isPooled: boolean;
    readonly asPooled: {
      readonly regionId: FpCoretimeRegionId;
      readonly duration: u32;
    } & Struct;
    readonly isCoreCountRequested: boolean;
    readonly asCoreCountRequested: {
      readonly coreCount: u16;
    } & Struct;
    readonly isCoreCountChanged: boolean;
    readonly asCoreCountChanged: {
      readonly coreCount: u16;
    } & Struct;
    readonly isReservationMade: boolean;
    readonly asReservationMade: {
      readonly index: u32;
      readonly workload: Vec<PalletBrokerScheduleItem>;
    } & Struct;
    readonly isReservationCancelled: boolean;
    readonly asReservationCancelled: {
      readonly index: u32;
      readonly workload: Vec<PalletBrokerScheduleItem>;
    } & Struct;
    readonly isSaleInitialized: boolean;
    readonly asSaleInitialized: {
      readonly saleStart: u32;
      readonly leadinLength: u32;
      readonly startPrice: u128;
      readonly endPrice: u128;
      readonly regionBegin: u32;
      readonly regionEnd: u32;
      readonly idealCoresSold: u16;
      readonly coresOffered: u16;
      readonly saleIndex: u32;
    } & Struct;
    readonly isLeased: boolean;
    readonly asLeased: {
      readonly task: u32;
      readonly until: u32;
    } & Struct;
    readonly isLeaseRemoved: boolean;
    readonly asLeaseRemoved: {
      readonly task: u32;
    } & Struct;
    readonly isLeaseEnding: boolean;
    readonly asLeaseEnding: {
      readonly task: u32;
      readonly when: u32;
    } & Struct;
    readonly isSalesStarted: boolean;
    readonly asSalesStarted: {
      readonly price: u128;
      readonly coreCount: u16;
    } & Struct;
    readonly isRevenueClaimBegun: boolean;
    readonly asRevenueClaimBegun: {
      readonly region: FpCoretimeRegionId;
      readonly maxTimeslices: u32;
    } & Struct;
    readonly isRevenueClaimItem: boolean;
    readonly asRevenueClaimItem: {
      readonly when: u32;
      readonly amount: u128;
    } & Struct;
    readonly isRevenueClaimPaid: boolean;
    readonly asRevenueClaimPaid: {
      readonly who: AccountId32;
      readonly amount: u128;
      readonly next: Option<FpCoretimeRegionId>;
    } & Struct;
    readonly isCreditPurchased: boolean;
    readonly asCreditPurchased: {
      readonly who: AccountId32;
      readonly beneficiary: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isRegionDropped: boolean;
    readonly asRegionDropped: {
      readonly regionId: FpCoretimeRegionId;
      readonly duration: u32;
    } & Struct;
    readonly isContributionDropped: boolean;
    readonly asContributionDropped: {
      readonly regionId: FpCoretimeRegionId;
    } & Struct;
    readonly isRegionUnpooled: boolean;
    readonly asRegionUnpooled: {
      readonly regionId: FpCoretimeRegionId;
      readonly when: u32;
    } & Struct;
    readonly isHistoryInitialized: boolean;
    readonly asHistoryInitialized: {
      readonly when: u32;
      readonly privatePoolSize: u32;
      readonly systemPoolSize: u32;
    } & Struct;
    readonly isHistoryDropped: boolean;
    readonly asHistoryDropped: {
      readonly when: u32;
      readonly revenue: u128;
    } & Struct;
    readonly isHistoryIgnored: boolean;
    readonly asHistoryIgnored: {
      readonly when: u32;
      readonly revenue: u128;
    } & Struct;
    readonly isClaimsReady: boolean;
    readonly asClaimsReady: {
      readonly when: u32;
      readonly systemPayout: u128;
      readonly privatePayout: u128;
    } & Struct;
    readonly isCoreAssigned: boolean;
    readonly asCoreAssigned: {
      readonly core: u16;
      readonly when: u32;
      readonly assignment: Vec<ITuple<[PalletBrokerCoretimeInterfaceCoreAssignment, u16]>>;
    } & Struct;
    readonly isPotentialRenewalDropped: boolean;
    readonly asPotentialRenewalDropped: {
      readonly when: u32;
      readonly core: u16;
    } & Struct;
    readonly isAutoRenewalEnabled: boolean;
    readonly asAutoRenewalEnabled: {
      readonly core: u16;
      readonly task: u32;
    } & Struct;
    readonly isAutoRenewalDisabled: boolean;
    readonly asAutoRenewalDisabled: {
      readonly core: u16;
      readonly task: u32;
    } & Struct;
    readonly isAutoRenewalFailed: boolean;
    readonly asAutoRenewalFailed: {
      readonly core: u16;
      readonly payer: Option<AccountId32>;
    } & Struct;
    readonly isAutoRenewalLimitReached: boolean;
    readonly isForceReservationFailed: boolean;
    readonly asForceReservationFailed: {
      readonly schedule: Vec<PalletBrokerScheduleItem>;
    } & Struct;
    readonly isPotentialRenewalRemoved: boolean;
    readonly asPotentialRenewalRemoved: {
      readonly core: u16;
      readonly timeslice: u32;
    } & Struct;
    readonly type: 'Purchased' | 'Renewable' | 'Renewed' | 'Transferred' | 'Partitioned' | 'Interlaced' | 'Assigned' | 'AssignmentRemoved' | 'Pooled' | 'CoreCountRequested' | 'CoreCountChanged' | 'ReservationMade' | 'ReservationCancelled' | 'SaleInitialized' | 'Leased' | 'LeaseRemoved' | 'LeaseEnding' | 'SalesStarted' | 'RevenueClaimBegun' | 'RevenueClaimItem' | 'RevenueClaimPaid' | 'CreditPurchased' | 'RegionDropped' | 'ContributionDropped' | 'RegionUnpooled' | 'HistoryInitialized' | 'HistoryDropped' | 'HistoryIgnored' | 'ClaimsReady' | 'CoreAssigned' | 'PotentialRenewalDropped' | 'AutoRenewalEnabled' | 'AutoRenewalDisabled' | 'AutoRenewalFailed' | 'AutoRenewalLimitReached' | 'ForceReservationFailed' | 'PotentialRenewalRemoved';
  }

  /** @name PalletParametersEvent (486) */
  interface PalletParametersEvent extends Enum {
    readonly isUpdated: boolean;
    readonly asUpdated: {
      readonly key: PortaldotV3RuntimeRuntimeParametersKey;
      readonly oldValue: Option<PortaldotV3RuntimeRuntimeParametersValue>;
      readonly newValue: Option<PortaldotV3RuntimeRuntimeParametersValue>;
    } & Struct;
    readonly type: 'Updated';
  }

  /** @name PortaldotV3RuntimeRuntimeParametersKey (487) */
  interface PortaldotV3RuntimeRuntimeParametersKey extends Enum {
    readonly isStorage: boolean;
    readonly asStorage: PortaldotV3RuntimeDynamicParamsStorageParametersKey;
    readonly isReferenda: boolean;
    readonly asReferenda: PortaldotV3RuntimeDynamicParamsReferendaParametersKey;
    readonly type: 'Storage' | 'Referenda';
  }

  /** @name PortaldotV3RuntimeDynamicParamsStorageParametersKey (488) */
  interface PortaldotV3RuntimeDynamicParamsStorageParametersKey extends Enum {
    readonly isBaseDeposit: boolean;
    readonly isByteDeposit: boolean;
    readonly type: 'BaseDeposit' | 'ByteDeposit';
  }

  /** @name PortaldotV3RuntimeDynamicParamsReferendaParametersKey (489) */
  interface PortaldotV3RuntimeDynamicParamsReferendaParametersKey extends Enum {
    readonly isTracks: boolean;
    readonly isOrigins: boolean;
    readonly type: 'Tracks' | 'Origins';
  }

  /** @name PortaldotV3RuntimeRuntimeParametersValue (491) */
  interface PortaldotV3RuntimeRuntimeParametersValue extends Enum {
    readonly isStorage: boolean;
    readonly asStorage: PortaldotV3RuntimeDynamicParamsStorageParametersValue;
    readonly isReferenda: boolean;
    readonly asReferenda: PortaldotV3RuntimeDynamicParamsReferendaParametersValue;
    readonly type: 'Storage' | 'Referenda';
  }

  /** @name PortaldotV3RuntimeDynamicParamsStorageParametersValue (492) */
  interface PortaldotV3RuntimeDynamicParamsStorageParametersValue extends Enum {
    readonly isBaseDeposit: boolean;
    readonly asBaseDeposit: u128;
    readonly isByteDeposit: boolean;
    readonly asByteDeposit: u128;
    readonly type: 'BaseDeposit' | 'ByteDeposit';
  }

  /** @name PortaldotV3RuntimeDynamicParamsReferendaParametersValue (493) */
  interface PortaldotV3RuntimeDynamicParamsReferendaParametersValue extends Enum {
    readonly isTracks: boolean;
    readonly asTracks: Vec<PalletReferendaTrack>;
    readonly isOrigins: boolean;
    readonly asOrigins: Vec<ITuple<[PortaldotV3RuntimeOriginCaller, u16]>>;
    readonly type: 'Tracks' | 'Origins';
  }

  /** @name PalletSkipFeelessPaymentEvent (494) */
  interface PalletSkipFeelessPaymentEvent extends Enum {
    readonly isFeeSkipped: boolean;
    readonly asFeeSkipped: {
      readonly origin: PortaldotV3RuntimeOriginCaller;
    } & Struct;
    readonly type: 'FeeSkipped';
  }

  /** @name PalletAssetConversionOpsEvent (495) */
  interface PalletAssetConversionOpsEvent extends Enum {
    readonly isMigratedToNewAccount: boolean;
    readonly asMigratedToNewAccount: {
      readonly poolId: ITuple<[FrameSupportTokensFungibleUnionOfNativeOrWithId, FrameSupportTokensFungibleUnionOfNativeOrWithId]>;
      readonly priorAccount: AccountId32;
      readonly newAccount: AccountId32;
    } & Struct;
    readonly type: 'MigratedToNewAccount';
  }

  /** @name PalletReviveEvent (496) */
  interface PalletReviveEvent extends Enum {
    readonly isContractEmitted: boolean;
    readonly asContractEmitted: {
      readonly contract: H160;
      readonly data: Bytes;
      readonly topics: Vec<H256>;
    } & Struct;
    readonly isInstantiated: boolean;
    readonly asInstantiated: {
      readonly deployer: H160;
      readonly contract: H160;
    } & Struct;
    readonly isEthExtrinsicRevert: boolean;
    readonly asEthExtrinsicRevert: {
      readonly dispatchError: SpRuntimeDispatchError;
    } & Struct;
    readonly type: 'ContractEmitted' | 'Instantiated' | 'EthExtrinsicRevert';
  }

  /** @name PalletDelegatedStakingEvent (497) */
  interface PalletDelegatedStakingEvent extends Enum {
    readonly isDelegated: boolean;
    readonly asDelegated: {
      readonly agent: AccountId32;
      readonly delegator: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isReleased: boolean;
    readonly asReleased: {
      readonly agent: AccountId32;
      readonly delegator: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isSlashed: boolean;
    readonly asSlashed: {
      readonly agent: AccountId32;
      readonly delegator: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly isMigratedDelegation: boolean;
    readonly asMigratedDelegation: {
      readonly agent: AccountId32;
      readonly delegator: AccountId32;
      readonly amount: u128;
    } & Struct;
    readonly type: 'Delegated' | 'Released' | 'Slashed' | 'MigratedDelegation';
  }

  /** @name PalletAssetsFreezerEvent (498) */
  interface PalletAssetsFreezerEvent extends Enum {
    readonly isFrozen: boolean;
    readonly asFrozen: {
      readonly who: AccountId32;
      readonly assetId: u32;
      readonly amount: u128;
    } & Struct;
    readonly isThawed: boolean;
    readonly asThawed: {
      readonly who: AccountId32;
      readonly assetId: u32;
      readonly amount: u128;
    } & Struct;
    readonly type: 'Frozen' | 'Thawed';
  }

  /** @name PalletOracleEvent (499) */
  interface PalletOracleEvent extends Enum {
    readonly isNewFeedData: boolean;
    readonly asNewFeedData: {
      readonly sender: AccountId32;
      readonly values: Vec<ITuple<[u32, u128]>>;
    } & Struct;
    readonly type: 'NewFeedData';
  }

  /** @name PalletMetaTxEvent (500) */
  interface PalletMetaTxEvent extends Enum {
    readonly isDispatched: boolean;
    readonly asDispatched: {
      readonly result: Result<FrameSupportDispatchPostDispatchInfo, SpRuntimeDispatchErrorWithPostInfo>;
    } & Struct;
    readonly type: 'Dispatched';
  }

  /** @name FrameSupportDispatchPostDispatchInfo (502) */
  interface FrameSupportDispatchPostDispatchInfo extends Struct {
    readonly actualWeight: Option<SpWeightsWeightV2Weight>;
    readonly paysFee: FrameSupportDispatchPays;
  }

  /** @name SpRuntimeDispatchErrorWithPostInfo (504) */
  interface SpRuntimeDispatchErrorWithPostInfo extends Struct {
    readonly postInfo: FrameSupportDispatchPostDispatchInfo;
    readonly error: SpRuntimeDispatchError;
  }

  /** @name PalletMultiAssetBountiesEvent (505) */
  interface PalletMultiAssetBountiesEvent extends Enum {
    readonly isBountyCreated: boolean;
    readonly asBountyCreated: {
      readonly index: u32;
    } & Struct;
    readonly isChildBountyCreated: boolean;
    readonly asChildBountyCreated: {
      readonly index: u32;
      readonly childIndex: u32;
    } & Struct;
    readonly isBountyBecameActive: boolean;
    readonly asBountyBecameActive: {
      readonly index: u32;
      readonly childIndex: Option<u32>;
      readonly curator: AccountId32;
    } & Struct;
    readonly isBountyAwarded: boolean;
    readonly asBountyAwarded: {
      readonly index: u32;
      readonly childIndex: Option<u32>;
      readonly beneficiary: AccountId32;
    } & Struct;
    readonly isBountyPayoutProcessed: boolean;
    readonly asBountyPayoutProcessed: {
      readonly index: u32;
      readonly childIndex: Option<u32>;
      readonly assetKind: FrameSupportTokensFungibleUnionOfNativeOrWithId;
      readonly value: u128;
      readonly beneficiary: AccountId32;
    } & Struct;
    readonly isBountyFundingProcessed: boolean;
    readonly asBountyFundingProcessed: {
      readonly index: u32;
      readonly childIndex: Option<u32>;
    } & Struct;
    readonly isBountyRefundProcessed: boolean;
    readonly asBountyRefundProcessed: {
      readonly index: u32;
      readonly childIndex: Option<u32>;
    } & Struct;
    readonly isBountyCanceled: boolean;
    readonly asBountyCanceled: {
      readonly index: u32;
      readonly childIndex: Option<u32>;
    } & Struct;
    readonly isCuratorUnassigned: boolean;
    readonly asCuratorUnassigned: {
      readonly index: u32;
      readonly childIndex: Option<u32>;
    } & Struct;
    readonly isCuratorProposed: boolean;
    readonly asCuratorProposed: {
      readonly index: u32;
      readonly childIndex: Option<u32>;
      readonly curator: AccountId32;
    } & Struct;
    readonly isPaymentFailed: boolean;
    readonly asPaymentFailed: {
      readonly index: u32;
      readonly childIndex: Option<u32>;
      readonly paymentId: Null;
    } & Struct;
    readonly isPaid: boolean;
    readonly asPaid: {
      readonly index: u32;
      readonly childIndex: Option<u32>;
      readonly paymentId: Null;
    } & Struct;
    readonly isBountyValueIncreased: boolean;
    readonly asBountyValueIncreased: {
      readonly index: u32;
      readonly oldValue: u128;
      readonly newValue: u128;
    } & Struct;
    readonly type: 'BountyCreated' | 'ChildBountyCreated' | 'BountyBecameActive' | 'BountyAwarded' | 'BountyPayoutProcessed' | 'BountyFundingProcessed' | 'BountyRefundProcessed' | 'BountyCanceled' | 'CuratorUnassigned' | 'CuratorProposed' | 'PaymentFailed' | 'Paid' | 'BountyValueIncreased';
  }

  /** @name PalletRegistrarParaEvent (506) */
  interface PalletRegistrarParaEvent extends Enum {
    readonly isReserved: boolean;
    readonly asReserved: {
      readonly paraId: u32;
      readonly who: AccountId32;
    } & Struct;
    readonly isRegisterRequested: boolean;
    readonly asRegisterRequested: {
      readonly paraId: u32;
      readonly messageId: u64;
      readonly manager: AccountId32;
    } & Struct;
    readonly isRegistered: boolean;
    readonly asRegistered: {
      readonly paraId: u32;
      readonly messageId: u64;
      readonly manager: AccountId32;
    } & Struct;
    readonly isRegistrationFailed: boolean;
    readonly asRegistrationFailed: {
      readonly paraId: u32;
      readonly messageId: u64;
      readonly manager: AccountId32;
      readonly reason: RegistrarPrimitivesFailureReason;
    } & Struct;
    readonly isCancelRequested: boolean;
    readonly asCancelRequested: {
      readonly paraId: u32;
      readonly messageId: u64;
      readonly manager: AccountId32;
    } & Struct;
    readonly isRegistrationCancelled: boolean;
    readonly asRegistrationCancelled: {
      readonly paraId: u32;
      readonly messageId: u64;
      readonly manager: AccountId32;
    } & Struct;
    readonly type: 'Reserved' | 'RegisterRequested' | 'Registered' | 'RegistrationFailed' | 'CancelRequested' | 'RegistrationCancelled';
  }

  /** @name PalletRegistrarRelayEvent (507) */
  interface PalletRegistrarRelayEvent extends Enum {
    readonly isRegistrationPending: boolean;
    readonly asRegistrationPending: {
      readonly paraId: u32;
      readonly messageId: u64;
      readonly codeHash: H256;
    } & Struct;
    readonly isRegistrationRejected: boolean;
    readonly asRegistrationRejected: {
      readonly paraId: u32;
      readonly messageId: u64;
      readonly reason: RegistrarPrimitivesFailureReason;
    } & Struct;
    readonly isRegistered: boolean;
    readonly asRegistered: {
      readonly paraId: u32;
      readonly messageId: u64;
      readonly manager: AccountId32;
    } & Struct;
    readonly isAuthorizationCancelled: boolean;
    readonly asAuthorizationCancelled: {
      readonly paraId: u32;
      readonly messageId: u64;
    } & Struct;
    readonly isCancellationRefused: boolean;
    readonly asCancellationRefused: {
      readonly paraId: u32;
      readonly messageId: u64;
    } & Struct;
    readonly isReportFailed: boolean;
    readonly asReportFailed: {
      readonly paraId: u32;
      readonly messageId: u64;
    } & Struct;
    readonly type: 'RegistrationPending' | 'RegistrationRejected' | 'Registered' | 'AuthorizationCancelled' | 'CancellationRefused' | 'ReportFailed';
  }

  /** @name FrameSystemPhase (508) */
  interface FrameSystemPhase extends Enum {
    readonly isApplyExtrinsic: boolean;
    readonly asApplyExtrinsic: u32;
    readonly isFinalization: boolean;
    readonly isInitialization: boolean;
    readonly type: 'ApplyExtrinsic' | 'Finalization' | 'Initialization';
  }

  /** @name FrameSystemLastRuntimeUpgradeInfo (510) */
  interface FrameSystemLastRuntimeUpgradeInfo extends Struct {
    readonly specVersion: Compact<u32>;
    readonly specName: Text;
  }

  /** @name FrameSystemCodeUpgradeAuthorization (513) */
  interface FrameSystemCodeUpgradeAuthorization extends Struct {
    readonly codeHash: H256;
    readonly checkVersion: bool;
  }

  /** @name FrameSystemLimitsBlockWeights (514) */
  interface FrameSystemLimitsBlockWeights extends Struct {
    readonly baseBlock: SpWeightsWeightV2Weight;
    readonly maxBlock: SpWeightsWeightV2Weight;
    readonly perClass: FrameSupportDispatchPerDispatchClassWeightsPerClass;
  }

  /** @name FrameSupportDispatchPerDispatchClassWeightsPerClass (515) */
  interface FrameSupportDispatchPerDispatchClassWeightsPerClass extends Struct {
    readonly normal: FrameSystemLimitsWeightsPerClass;
    readonly operational: FrameSystemLimitsWeightsPerClass;
    readonly mandatory: FrameSystemLimitsWeightsPerClass;
  }

  /** @name FrameSystemLimitsWeightsPerClass (516) */
  interface FrameSystemLimitsWeightsPerClass extends Struct {
    readonly baseExtrinsic: SpWeightsWeightV2Weight;
    readonly maxExtrinsic: Option<SpWeightsWeightV2Weight>;
    readonly maxTotal: Option<SpWeightsWeightV2Weight>;
    readonly reserved: Option<SpWeightsWeightV2Weight>;
  }

  /** @name FrameSystemLimitsBlockLength (517) */
  interface FrameSystemLimitsBlockLength extends Struct {
    readonly max: FrameSupportDispatchPerDispatchClassU32;
    readonly maxHeaderSize: Option<u32>;
  }

  /** @name FrameSupportDispatchPerDispatchClassU32 (518) */
  interface FrameSupportDispatchPerDispatchClassU32 extends Struct {
    readonly normal: u32;
    readonly operational: u32;
    readonly mandatory: u32;
  }

  /** @name SpWeightsRuntimeDbWeight (519) */
  interface SpWeightsRuntimeDbWeight extends Struct {
    readonly read: u64;
    readonly write: u64;
  }

  /** @name SpVersionRuntimeVersion (520) */
  interface SpVersionRuntimeVersion extends Struct {
    readonly specName: Text;
    readonly implName: Text;
    readonly authoringVersion: u32;
    readonly specVersion: u32;
    readonly implVersion: u32;
    readonly apis: Vec<ITuple<[U8aFixed, u32]>>;
    readonly transactionVersion: u32;
    readonly systemVersion: u8;
  }

  /** @name FrameSystemError (524) */
  interface FrameSystemError extends Enum {
    readonly isInvalidSpecName: boolean;
    readonly isSpecVersionNeedsToIncrease: boolean;
    readonly isFailedToExtractRuntimeVersion: boolean;
    readonly isNonDefaultComposite: boolean;
    readonly isNonZeroRefCount: boolean;
    readonly isCallFiltered: boolean;
    readonly isMultiBlockMigrationsOngoing: boolean;
    readonly isNothingAuthorized: boolean;
    readonly isUnauthorized: boolean;
    readonly type: 'InvalidSpecName' | 'SpecVersionNeedsToIncrease' | 'FailedToExtractRuntimeVersion' | 'NonDefaultComposite' | 'NonZeroRefCount' | 'CallFiltered' | 'MultiBlockMigrationsOngoing' | 'NothingAuthorized' | 'Unauthorized';
  }

  /** @name SpRuntimeBlakeTwo256 (525) */
  type SpRuntimeBlakeTwo256 = Null;

  /** @name SpRuntimeBlock (526) */
  interface SpRuntimeBlock extends Struct {
    readonly header: SpRuntimeHeader;
    readonly extrinsics: Vec<Bytes>;
  }

  /** @name PalletUtilityError (530) */
  interface PalletUtilityError extends Enum {
    readonly isTooManyCalls: boolean;
    readonly type: 'TooManyCalls';
  }

  /** @name SpConsensusBabeDigestsPreDigest (537) */
  interface SpConsensusBabeDigestsPreDigest extends Enum {
    readonly isPrimary: boolean;
    readonly asPrimary: SpConsensusBabeDigestsPrimaryPreDigest;
    readonly isSecondaryPlain: boolean;
    readonly asSecondaryPlain: SpConsensusBabeDigestsSecondaryPlainPreDigest;
    readonly isSecondaryVRF: boolean;
    readonly asSecondaryVRF: SpConsensusBabeDigestsSecondaryVRFPreDigest;
    readonly type: 'Primary' | 'SecondaryPlain' | 'SecondaryVRF';
  }

  /** @name SpConsensusBabeDigestsPrimaryPreDigest (538) */
  interface SpConsensusBabeDigestsPrimaryPreDigest extends Struct {
    readonly authorityIndex: u32;
    readonly slot: u64;
    readonly vrfSignature: SpCoreSr25519VrfVrfSignature;
  }

  /** @name SpCoreSr25519VrfVrfSignature (539) */
  interface SpCoreSr25519VrfVrfSignature extends Struct {
    readonly preOutput: U8aFixed;
    readonly proof: U8aFixed;
  }

  /** @name SpConsensusBabeDigestsSecondaryPlainPreDigest (540) */
  interface SpConsensusBabeDigestsSecondaryPlainPreDigest extends Struct {
    readonly authorityIndex: u32;
    readonly slot: u64;
  }

  /** @name SpConsensusBabeDigestsSecondaryVRFPreDigest (541) */
  interface SpConsensusBabeDigestsSecondaryVRFPreDigest extends Struct {
    readonly authorityIndex: u32;
    readonly slot: u64;
    readonly vrfSignature: SpCoreSr25519VrfVrfSignature;
  }

  /** @name SpConsensusBabeBabeEpochConfiguration (542) */
  interface SpConsensusBabeBabeEpochConfiguration extends Struct {
    readonly c: ITuple<[u64, u64]>;
    readonly allowedSlots: SpConsensusBabeAllowedSlots;
  }

  /** @name PalletBabeError (546) */
  interface PalletBabeError extends Enum {
    readonly isInvalidEquivocationProof: boolean;
    readonly isInvalidKeyOwnershipProof: boolean;
    readonly isDuplicateOffenceReport: boolean;
    readonly isInvalidConfiguration: boolean;
    readonly type: 'InvalidEquivocationProof' | 'InvalidKeyOwnershipProof' | 'DuplicateOffenceReport' | 'InvalidConfiguration';
  }

  /** @name PalletIndicesError (548) */
  interface PalletIndicesError extends Enum {
    readonly isNotAssigned: boolean;
    readonly isNotOwner: boolean;
    readonly isInUse: boolean;
    readonly isNotTransfer: boolean;
    readonly isPermanent: boolean;
    readonly type: 'NotAssigned' | 'NotOwner' | 'InUse' | 'NotTransfer' | 'Permanent';
  }

  /** @name PalletBalancesBalanceLock (550) */
  interface PalletBalancesBalanceLock extends Struct {
    readonly id: U8aFixed;
    readonly amount: u128;
    readonly reasons: PalletBalancesReasons;
  }

  /** @name PalletBalancesReasons (551) */
  interface PalletBalancesReasons extends Enum {
    readonly isFee: boolean;
    readonly isMisc: boolean;
    readonly isAll: boolean;
    readonly type: 'Fee' | 'Misc' | 'All';
  }

  /** @name PalletBalancesReserveData (554) */
  interface PalletBalancesReserveData extends Struct {
    readonly id: U8aFixed;
    readonly amount: u128;
  }

  /** @name FrameSupportTokensMiscIdAmountRuntimeHoldReason (557) */
  interface FrameSupportTokensMiscIdAmountRuntimeHoldReason extends Struct {
    readonly id: PortaldotV3RuntimeRuntimeHoldReason;
    readonly amount: u128;
  }

  /** @name FrameSupportTokensMiscIdAmountRuntimeFreezeReason (560) */
  interface FrameSupportTokensMiscIdAmountRuntimeFreezeReason extends Struct {
    readonly id: PortaldotV3RuntimeRuntimeFreezeReason;
    readonly amount: u128;
  }

  /** @name PortaldotV3RuntimeRuntimeFreezeReason (561) */
  interface PortaldotV3RuntimeRuntimeFreezeReason extends Enum {
    readonly isNominationPools: boolean;
    readonly asNominationPools: PalletNominationPoolsFreezeReason;
    readonly isRevive: boolean;
    readonly asRevive: PalletReviveFreezeReason;
    readonly type: 'NominationPools' | 'Revive';
  }

  /** @name PalletNominationPoolsFreezeReason (562) */
  interface PalletNominationPoolsFreezeReason extends Enum {
    readonly isPoolMinBalance: boolean;
    readonly type: 'PoolMinBalance';
  }

  /** @name PalletReviveFreezeReason (563) */
  interface PalletReviveFreezeReason extends Enum {
    readonly isPGasMinBalance: boolean;
    readonly type: 'PGasMinBalance';
  }

  /** @name PalletBalancesError (565) */
  interface PalletBalancesError extends Enum {
    readonly isVestingBalance: boolean;
    readonly isLiquidityRestrictions: boolean;
    readonly isInsufficientBalance: boolean;
    readonly isExistentialDeposit: boolean;
    readonly isExpendability: boolean;
    readonly isExistingVestingSchedule: boolean;
    readonly isDeadAccount: boolean;
    readonly isTooManyReserves: boolean;
    readonly isTooManyHolds: boolean;
    readonly isTooManyFreezes: boolean;
    readonly isIssuanceDeactivated: boolean;
    readonly isDeltaZero: boolean;
    readonly type: 'VestingBalance' | 'LiquidityRestrictions' | 'InsufficientBalance' | 'ExistentialDeposit' | 'Expendability' | 'ExistingVestingSchedule' | 'DeadAccount' | 'TooManyReserves' | 'TooManyHolds' | 'TooManyFreezes' | 'IssuanceDeactivated' | 'DeltaZero';
  }

  /** @name PalletTransactionPaymentReleases (566) */
  interface PalletTransactionPaymentReleases extends Enum {
    readonly isV1Ancient: boolean;
    readonly isV2: boolean;
    readonly type: 'V1Ancient' | 'V2';
  }

  /** @name FrameSupportStorageNoDrop (567) */
  interface FrameSupportStorageNoDrop extends FrameSupportTokensFungibleImbalance {}

  /** @name FrameSupportTokensFungibleImbalance (568) */
  interface FrameSupportTokensFungibleImbalance extends Struct {
    readonly amount: u128;
  }

  /** @name PalletElectionProviderMultiPhaseReadySolution (569) */
  interface PalletElectionProviderMultiPhaseReadySolution extends Struct {
    readonly supports: FrameElectionProviderSupportBoundedSupports;
    readonly score: SpNposElectionsElectionScore;
    readonly compute: PalletElectionProviderMultiPhaseElectionCompute;
  }

  /** @name FrameElectionProviderSupportBoundedSupports (570) */
  interface FrameElectionProviderSupportBoundedSupports extends Vec<ITuple<[AccountId32, FrameElectionProviderSupportBoundedSupport]>> {}

  /** @name FrameElectionProviderSupportBoundedSupport (573) */
  interface FrameElectionProviderSupportBoundedSupport extends Struct {
    readonly total: u128;
    readonly voters: Vec<ITuple<[AccountId32, u128]>>;
  }

  /** @name PalletElectionProviderMultiPhaseRoundSnapshot (576) */
  interface PalletElectionProviderMultiPhaseRoundSnapshot extends Struct {
    readonly voters: Vec<ITuple<[AccountId32, u64, Vec<AccountId32>]>>;
    readonly targets: Vec<AccountId32>;
  }

  /** @name PalletElectionProviderMultiPhaseSignedSignedSubmission (583) */
  interface PalletElectionProviderMultiPhaseSignedSignedSubmission extends Struct {
    readonly who: AccountId32;
    readonly deposit: u128;
    readonly rawSolution: PalletElectionProviderMultiPhaseRawSolution;
    readonly callFee: u128;
  }

  /** @name PalletElectionProviderMultiPhaseError (584) */
  interface PalletElectionProviderMultiPhaseError extends Enum {
    readonly isPreDispatchEarlySubmission: boolean;
    readonly isPreDispatchWrongWinnerCount: boolean;
    readonly isPreDispatchWeakSubmission: boolean;
    readonly isSignedQueueFull: boolean;
    readonly isSignedCannotPayDeposit: boolean;
    readonly isSignedInvalidWitness: boolean;
    readonly isSignedTooMuchWeight: boolean;
    readonly isOcwCallWrongEra: boolean;
    readonly isMissingSnapshotMetadata: boolean;
    readonly isInvalidSubmissionIndex: boolean;
    readonly isCallNotAllowed: boolean;
    readonly isFallbackFailed: boolean;
    readonly isBoundNotMet: boolean;
    readonly isTooManyWinners: boolean;
    readonly isPreDispatchDifferentRound: boolean;
    readonly type: 'PreDispatchEarlySubmission' | 'PreDispatchWrongWinnerCount' | 'PreDispatchWeakSubmission' | 'SignedQueueFull' | 'SignedCannotPayDeposit' | 'SignedInvalidWitness' | 'SignedTooMuchWeight' | 'OcwCallWrongEra' | 'MissingSnapshotMetadata' | 'InvalidSubmissionIndex' | 'CallNotAllowed' | 'FallbackFailed' | 'BoundNotMet' | 'TooManyWinners' | 'PreDispatchDifferentRound';
  }

  /** @name PalletStakingStakingLedger (585) */
  interface PalletStakingStakingLedger extends Struct {
    readonly stash: AccountId32;
    readonly total: Compact<u128>;
    readonly active: Compact<u128>;
    readonly unlocking: Vec<PalletStakingUnlockChunk>;
    readonly legacyClaimedRewards: Vec<u32>;
  }

  /** @name PalletStakingNominations (587) */
  interface PalletStakingNominations extends Struct {
    readonly targets: Vec<AccountId32>;
    readonly submittedIn: u32;
    readonly suppressed: bool;
  }

  /** @name PalletStakingActiveEraInfo (588) */
  interface PalletStakingActiveEraInfo extends Struct {
    readonly index: u32;
    readonly start: Option<u64>;
  }

  /** @name SpStakingExposure (591) */
  interface SpStakingExposure extends Struct {
    readonly total: Compact<u128>;
    readonly own: Compact<u128>;
    readonly others: Vec<SpStakingIndividualExposure>;
  }

  /** @name SpStakingIndividualExposure (593) */
  interface SpStakingIndividualExposure extends Struct {
    readonly who: AccountId32;
    readonly value: Compact<u128>;
  }

  /** @name SpStakingPagedExposureMetadata (594) */
  interface SpStakingPagedExposureMetadata extends Struct {
    readonly total: Compact<u128>;
    readonly own: Compact<u128>;
    readonly nominatorCount: u32;
    readonly pageCount: u32;
  }

  /** @name SpStakingExposurePage (596) */
  interface SpStakingExposurePage extends Struct {
    readonly pageTotal: Compact<u128>;
    readonly others: Vec<SpStakingIndividualExposure>;
  }

  /** @name PalletStakingEraRewardPoints (597) */
  interface PalletStakingEraRewardPoints extends Struct {
    readonly total: u32;
    readonly individual: BTreeMap<AccountId32, u32>;
  }

  /** @name PalletStakingUnappliedSlash (602) */
  interface PalletStakingUnappliedSlash extends Struct {
    readonly validator: AccountId32;
    readonly own: u128;
    readonly others: Vec<ITuple<[AccountId32, u128]>>;
    readonly reporters: Vec<AccountId32>;
    readonly payout: u128;
  }

  /** @name PalletStakingSlashingSlashingSpans (604) */
  interface PalletStakingSlashingSlashingSpans extends Struct {
    readonly spanIndex: u32;
    readonly lastStart: u32;
    readonly lastNonzeroSlash: u32;
    readonly prior: Vec<u32>;
  }

  /** @name PalletStakingSlashingSpanRecord (605) */
  interface PalletStakingSlashingSpanRecord extends Struct {
    readonly slashed: u128;
    readonly paidOut: u128;
  }

  /** @name PalletStakingPalletError (606) */
  interface PalletStakingPalletError extends Enum {
    readonly isNotController: boolean;
    readonly isNotStash: boolean;
    readonly isAlreadyBonded: boolean;
    readonly isAlreadyPaired: boolean;
    readonly isEmptyTargets: boolean;
    readonly isDuplicateIndex: boolean;
    readonly isInvalidSlashIndex: boolean;
    readonly isInsufficientBond: boolean;
    readonly isNoMoreChunks: boolean;
    readonly isNoUnlockChunk: boolean;
    readonly isFundedTarget: boolean;
    readonly isInvalidEraToReward: boolean;
    readonly isInvalidNumberOfNominations: boolean;
    readonly isNotSortedAndUnique: boolean;
    readonly isAlreadyClaimed: boolean;
    readonly isInvalidPage: boolean;
    readonly isIncorrectHistoryDepth: boolean;
    readonly isIncorrectSlashingSpans: boolean;
    readonly isBadState: boolean;
    readonly isTooManyTargets: boolean;
    readonly isBadTarget: boolean;
    readonly isCannotChillOther: boolean;
    readonly isTooManyNominators: boolean;
    readonly isTooManyValidators: boolean;
    readonly isCommissionTooLow: boolean;
    readonly isBoundNotMet: boolean;
    readonly isControllerDeprecated: boolean;
    readonly isCannotRestoreLedger: boolean;
    readonly isRewardDestinationRestricted: boolean;
    readonly isNotEnoughFunds: boolean;
    readonly isVirtualStakerNotAllowed: boolean;
    readonly isCannotReapStash: boolean;
    readonly isAlreadyMigrated: boolean;
    readonly isRestricted: boolean;
    readonly type: 'NotController' | 'NotStash' | 'AlreadyBonded' | 'AlreadyPaired' | 'EmptyTargets' | 'DuplicateIndex' | 'InvalidSlashIndex' | 'InsufficientBond' | 'NoMoreChunks' | 'NoUnlockChunk' | 'FundedTarget' | 'InvalidEraToReward' | 'InvalidNumberOfNominations' | 'NotSortedAndUnique' | 'AlreadyClaimed' | 'InvalidPage' | 'IncorrectHistoryDepth' | 'IncorrectSlashingSpans' | 'BadState' | 'TooManyTargets' | 'BadTarget' | 'CannotChillOther' | 'TooManyNominators' | 'TooManyValidators' | 'CommissionTooLow' | 'BoundNotMet' | 'ControllerDeprecated' | 'CannotRestoreLedger' | 'RewardDestinationRestricted' | 'NotEnoughFunds' | 'VirtualStakerNotAllowed' | 'CannotReapStash' | 'AlreadyMigrated' | 'Restricted';
  }

  /** @name SpCoreCryptoKeyTypeId (613) */
  interface SpCoreCryptoKeyTypeId extends U8aFixed {}

  /** @name PalletSessionError (614) */
  interface PalletSessionError extends Enum {
    readonly isInvalidProof: boolean;
    readonly isNoAssociatedValidatorId: boolean;
    readonly isDuplicatedKey: boolean;
    readonly isNoKeys: boolean;
    readonly isNoAccount: boolean;
    readonly type: 'InvalidProof' | 'NoAssociatedValidatorId' | 'DuplicatedKey' | 'NoKeys' | 'NoAccount';
  }

  /** @name PalletCollectiveVotes (616) */
  interface PalletCollectiveVotes extends Struct {
    readonly index: u32;
    readonly threshold: u32;
    readonly ayes: Vec<AccountId32>;
    readonly nays: Vec<AccountId32>;
    readonly end: u32;
  }

  /** @name PalletCollectiveError (617) */
  interface PalletCollectiveError extends Enum {
    readonly isNotMember: boolean;
    readonly isDuplicateProposal: boolean;
    readonly isProposalMissing: boolean;
    readonly isWrongIndex: boolean;
    readonly isDuplicateVote: boolean;
    readonly isAlreadyInitialized: boolean;
    readonly isTooEarly: boolean;
    readonly isTooManyProposals: boolean;
    readonly isWrongProposalWeight: boolean;
    readonly isWrongProposalLength: boolean;
    readonly isPrimeAccountNotMember: boolean;
    readonly isProposalActive: boolean;
    readonly type: 'NotMember' | 'DuplicateProposal' | 'ProposalMissing' | 'WrongIndex' | 'DuplicateVote' | 'AlreadyInitialized' | 'TooEarly' | 'TooManyProposals' | 'WrongProposalWeight' | 'WrongProposalLength' | 'PrimeAccountNotMember' | 'ProposalActive';
  }

  /** @name PalletMembershipError (619) */
  interface PalletMembershipError extends Enum {
    readonly isAlreadyMember: boolean;
    readonly isNotMember: boolean;
    readonly isTooManyMembers: boolean;
    readonly type: 'AlreadyMember' | 'NotMember' | 'TooManyMembers';
  }

  /** @name PalletGrandpaStoredState (620) */
  interface PalletGrandpaStoredState extends Enum {
    readonly isLive: boolean;
    readonly isPendingPause: boolean;
    readonly asPendingPause: {
      readonly scheduledAt: u32;
      readonly delay: u32;
    } & Struct;
    readonly isPaused: boolean;
    readonly isPendingResume: boolean;
    readonly asPendingResume: {
      readonly scheduledAt: u32;
      readonly delay: u32;
    } & Struct;
    readonly type: 'Live' | 'PendingPause' | 'Paused' | 'PendingResume';
  }

  /** @name PalletGrandpaStoredPendingChange (621) */
  interface PalletGrandpaStoredPendingChange extends Struct {
    readonly scheduledAt: u32;
    readonly delay: u32;
    readonly nextAuthorities: Vec<ITuple<[SpConsensusGrandpaAppPublic, u64]>>;
    readonly forced: Option<u32>;
  }

  /** @name PalletGrandpaError (623) */
  interface PalletGrandpaError extends Enum {
    readonly isPauseFailed: boolean;
    readonly isResumeFailed: boolean;
    readonly isChangePending: boolean;
    readonly isTooSoon: boolean;
    readonly isInvalidKeyOwnershipProof: boolean;
    readonly isInvalidEquivocationProof: boolean;
    readonly isDuplicateOffenceReport: boolean;
    readonly type: 'PauseFailed' | 'ResumeFailed' | 'ChangePending' | 'TooSoon' | 'InvalidKeyOwnershipProof' | 'InvalidEquivocationProof' | 'DuplicateOffenceReport';
  }

  /** @name PalletTreasuryProposal (624) */
  interface PalletTreasuryProposal extends Struct {
    readonly proposer: AccountId32;
    readonly value: u128;
    readonly beneficiary: AccountId32;
    readonly bond: u128;
  }

  /** @name PalletTreasurySpendStatus (626) */
  interface PalletTreasurySpendStatus extends Struct {
    readonly assetKind: FrameSupportTokensFungibleUnionOfNativeOrWithId;
    readonly amount: u128;
    readonly beneficiary: AccountId32;
    readonly validFrom: u32;
    readonly expireAt: u32;
    readonly status: PalletTreasuryPaymentState;
  }

  /** @name PalletTreasuryPaymentState (627) */
  interface PalletTreasuryPaymentState extends Enum {
    readonly isPending: boolean;
    readonly isAttempted: boolean;
    readonly asAttempted: {
      readonly id: Null;
    } & Struct;
    readonly isFailed: boolean;
    readonly type: 'Pending' | 'Attempted' | 'Failed';
  }

  /** @name FrameSupportPalletId (628) */
  interface FrameSupportPalletId extends U8aFixed {}

  /** @name PalletTreasuryError (629) */
  interface PalletTreasuryError extends Enum {
    readonly isInvalidIndex: boolean;
    readonly isTooManyApprovals: boolean;
    readonly isInsufficientPermission: boolean;
    readonly isProposalNotApproved: boolean;
    readonly isFailedToConvertBalance: boolean;
    readonly isSpendExpired: boolean;
    readonly isEarlyPayout: boolean;
    readonly isAlreadyAttempted: boolean;
    readonly isPayoutError: boolean;
    readonly isNotAttempted: boolean;
    readonly isInconclusive: boolean;
    readonly type: 'InvalidIndex' | 'TooManyApprovals' | 'InsufficientPermission' | 'ProposalNotApproved' | 'FailedToConvertBalance' | 'SpendExpired' | 'EarlyPayout' | 'AlreadyAttempted' | 'PayoutError' | 'NotAttempted' | 'Inconclusive';
  }

  /** @name PalletAssetRateError (630) */
  interface PalletAssetRateError extends Enum {
    readonly isUnknownAssetKind: boolean;
    readonly isAlreadyExists: boolean;
    readonly isOverflow: boolean;
    readonly type: 'UnknownAssetKind' | 'AlreadyExists' | 'Overflow';
  }

  /** @name PalletContractsWasmCodeInfo (632) */
  interface PalletContractsWasmCodeInfo extends Struct {
    readonly owner: AccountId32;
    readonly deposit: Compact<u128>;
    readonly refcount: Compact<u64>;
    readonly determinism: PalletContractsWasmDeterminism;
    readonly codeLen: u32;
  }

  /** @name PalletContractsStorageContractInfo (633) */
  interface PalletContractsStorageContractInfo extends Struct {
    readonly trieId: Bytes;
    readonly codeHash: H256;
    readonly storageBytes: u32;
    readonly storageItems: u32;
    readonly storageByteDeposit: u128;
    readonly storageItemDeposit: u128;
    readonly storageBaseDeposit: u128;
    readonly delegateDependencies: BTreeMap<H256, u128>;
  }

  /** @name PalletContractsStorageDeletionQueueManager (638) */
  interface PalletContractsStorageDeletionQueueManager extends Struct {
    readonly insertCounter: u32;
    readonly deleteCounter: u32;
  }

  /** @name PalletContractsSchedule (640) */
  interface PalletContractsSchedule extends Struct {
    readonly limits: PalletContractsScheduleLimits;
    readonly instructionWeights: PalletContractsScheduleInstructionWeights;
  }

  /** @name PalletContractsScheduleLimits (641) */
  interface PalletContractsScheduleLimits extends Struct {
    readonly eventTopics: u32;
    readonly memoryPages: u32;
    readonly subjectLen: u32;
    readonly payloadLen: u32;
    readonly runtimeMemory: u32;
    readonly validatorRuntimeMemory: u32;
    readonly eventRefTime: u64;
  }

  /** @name PalletContractsScheduleInstructionWeights (642) */
  interface PalletContractsScheduleInstructionWeights extends Struct {
    readonly base: u32;
  }

  /** @name PalletContractsEnvironment (643) */
  interface PalletContractsEnvironment extends Struct {
    readonly accountId: PalletContractsEnvironmentTypeAccountId32;
    readonly balance: PalletContractsEnvironmentTypeU128;
    readonly hash_: PalletContractsEnvironmentTypeH256;
    readonly hasher: PalletContractsEnvironmentTypeBlakeTwo256;
    readonly timestamp: PalletContractsEnvironmentTypeU64;
    readonly blockNumber: PalletContractsEnvironmentTypeU32;
  }

  /** @name PalletContractsEnvironmentTypeAccountId32 (644) */
  type PalletContractsEnvironmentTypeAccountId32 = Null;

  /** @name PalletContractsEnvironmentTypeU128 (645) */
  type PalletContractsEnvironmentTypeU128 = Null;

  /** @name PalletContractsEnvironmentTypeH256 (646) */
  type PalletContractsEnvironmentTypeH256 = Null;

  /** @name PalletContractsEnvironmentTypeBlakeTwo256 (647) */
  type PalletContractsEnvironmentTypeBlakeTwo256 = Null;

  /** @name PalletContractsEnvironmentTypeU64 (648) */
  type PalletContractsEnvironmentTypeU64 = Null;

  /** @name PalletContractsEnvironmentTypeU32 (649) */
  type PalletContractsEnvironmentTypeU32 = Null;

  /** @name PalletContractsError (651) */
  interface PalletContractsError extends Enum {
    readonly isInvalidSchedule: boolean;
    readonly isInvalidCallFlags: boolean;
    readonly isOutOfGas: boolean;
    readonly isOutputBufferTooSmall: boolean;
    readonly isTransferFailed: boolean;
    readonly isMaxCallDepthReached: boolean;
    readonly isContractNotFound: boolean;
    readonly isCodeTooLarge: boolean;
    readonly isCodeNotFound: boolean;
    readonly isCodeInfoNotFound: boolean;
    readonly isOutOfBounds: boolean;
    readonly isDecodingFailed: boolean;
    readonly isContractTrapped: boolean;
    readonly isValueTooLarge: boolean;
    readonly isTerminatedWhileReentrant: boolean;
    readonly isInputForwarded: boolean;
    readonly isRandomSubjectTooLong: boolean;
    readonly isTooManyTopics: boolean;
    readonly isNoChainExtension: boolean;
    readonly isXcmDecodeFailed: boolean;
    readonly isDuplicateContract: boolean;
    readonly isTerminatedInConstructor: boolean;
    readonly isReentranceDenied: boolean;
    readonly isStateChangeDenied: boolean;
    readonly isStorageDepositNotEnoughFunds: boolean;
    readonly isStorageDepositLimitExhausted: boolean;
    readonly isCodeInUse: boolean;
    readonly isContractReverted: boolean;
    readonly isCodeRejected: boolean;
    readonly isIndeterministic: boolean;
    readonly isMigrationInProgress: boolean;
    readonly isNoMigrationPerformed: boolean;
    readonly isMaxDelegateDependenciesReached: boolean;
    readonly isDelegateDependencyNotFound: boolean;
    readonly isDelegateDependencyAlreadyExists: boolean;
    readonly isCannotAddSelfAsDelegateDependency: boolean;
    readonly isOutOfTransientStorage: boolean;
    readonly type: 'InvalidSchedule' | 'InvalidCallFlags' | 'OutOfGas' | 'OutputBufferTooSmall' | 'TransferFailed' | 'MaxCallDepthReached' | 'ContractNotFound' | 'CodeTooLarge' | 'CodeNotFound' | 'CodeInfoNotFound' | 'OutOfBounds' | 'DecodingFailed' | 'ContractTrapped' | 'ValueTooLarge' | 'TerminatedWhileReentrant' | 'InputForwarded' | 'RandomSubjectTooLong' | 'TooManyTopics' | 'NoChainExtension' | 'XcmDecodeFailed' | 'DuplicateContract' | 'TerminatedInConstructor' | 'ReentranceDenied' | 'StateChangeDenied' | 'StorageDepositNotEnoughFunds' | 'StorageDepositLimitExhausted' | 'CodeInUse' | 'ContractReverted' | 'CodeRejected' | 'Indeterministic' | 'MigrationInProgress' | 'NoMigrationPerformed' | 'MaxDelegateDependenciesReached' | 'DelegateDependencyNotFound' | 'DelegateDependencyAlreadyExists' | 'CannotAddSelfAsDelegateDependency' | 'OutOfTransientStorage';
  }

  /** @name PalletSudoError (652) */
  interface PalletSudoError extends Enum {
    readonly isRequireSudo: boolean;
    readonly type: 'RequireSudo';
  }

  /** @name PalletImOnlineError (655) */
  interface PalletImOnlineError extends Enum {
    readonly isInvalidKey: boolean;
    readonly isDuplicatedHeartbeat: boolean;
    readonly type: 'InvalidKey' | 'DuplicatedHeartbeat';
  }

  /** @name SpStakingOffenceOffenceDetails (658) */
  interface SpStakingOffenceOffenceDetails extends Struct {
    readonly offender: ITuple<[AccountId32, Null]>;
    readonly reporters: Vec<AccountId32>;
  }

  /** @name PalletIdentityRegistration (661) */
  interface PalletIdentityRegistration extends Struct {
    readonly judgements: Vec<ITuple<[u32, PalletIdentityJudgement]>>;
    readonly deposit: u128;
    readonly info: PalletIdentityLegacyIdentityInfo;
  }

  /** @name PalletIdentityRegistrarInfo (669) */
  interface PalletIdentityRegistrarInfo extends Struct {
    readonly account: AccountId32;
    readonly fee: u128;
    readonly fields: u64;
  }

  /** @name PalletIdentityAuthorityProperties (672) */
  interface PalletIdentityAuthorityProperties extends Struct {
    readonly accountId: AccountId32;
    readonly allocation: u32;
  }

  /** @name PalletIdentityUsernameInformation (673) */
  interface PalletIdentityUsernameInformation extends Struct {
    readonly owner: AccountId32;
    readonly provider: PalletIdentityProvider;
  }

  /** @name PalletIdentityProvider (674) */
  interface PalletIdentityProvider extends Enum {
    readonly isAllocation: boolean;
    readonly isAuthorityDeposit: boolean;
    readonly asAuthorityDeposit: u128;
    readonly isSystem: boolean;
    readonly type: 'Allocation' | 'AuthorityDeposit' | 'System';
  }

  /** @name PalletIdentityError (676) */
  interface PalletIdentityError extends Enum {
    readonly isTooManySubAccounts: boolean;
    readonly isNotFound: boolean;
    readonly isNotNamed: boolean;
    readonly isEmptyIndex: boolean;
    readonly isFeeChanged: boolean;
    readonly isNoIdentity: boolean;
    readonly isStickyJudgement: boolean;
    readonly isJudgementGiven: boolean;
    readonly isInvalidJudgement: boolean;
    readonly isInvalidIndex: boolean;
    readonly isInvalidTarget: boolean;
    readonly isTooManyRegistrars: boolean;
    readonly isAlreadyClaimed: boolean;
    readonly isNotSub: boolean;
    readonly isNotOwned: boolean;
    readonly isJudgementForDifferentIdentity: boolean;
    readonly isJudgementPaymentFailed: boolean;
    readonly isInvalidSuffix: boolean;
    readonly isNotUsernameAuthority: boolean;
    readonly isNoAllocation: boolean;
    readonly isInvalidSignature: boolean;
    readonly isRequiresSignature: boolean;
    readonly isInvalidUsername: boolean;
    readonly isUsernameTaken: boolean;
    readonly isNoUsername: boolean;
    readonly isNotExpired: boolean;
    readonly isTooEarly: boolean;
    readonly isNotUnbinding: boolean;
    readonly isAlreadyUnbinding: boolean;
    readonly isInsufficientPrivileges: boolean;
    readonly type: 'TooManySubAccounts' | 'NotFound' | 'NotNamed' | 'EmptyIndex' | 'FeeChanged' | 'NoIdentity' | 'StickyJudgement' | 'JudgementGiven' | 'InvalidJudgement' | 'InvalidIndex' | 'InvalidTarget' | 'TooManyRegistrars' | 'AlreadyClaimed' | 'NotSub' | 'NotOwned' | 'JudgementForDifferentIdentity' | 'JudgementPaymentFailed' | 'InvalidSuffix' | 'NotUsernameAuthority' | 'NoAllocation' | 'InvalidSignature' | 'RequiresSignature' | 'InvalidUsername' | 'UsernameTaken' | 'NoUsername' | 'NotExpired' | 'TooEarly' | 'NotUnbinding' | 'AlreadyUnbinding' | 'InsufficientPrivileges';
  }

  /** @name PalletRecoveryAttempt (680) */
  interface PalletRecoveryAttempt extends Struct {
    readonly friendGroupIndex: u32;
    readonly initiator: AccountId32;
    readonly initBlock: u32;
    readonly lastApprovalBlock: u32;
    readonly approvals: PalletRecoveryBitfield;
  }

  /** @name PalletRecoveryBitfield (681) */
  interface PalletRecoveryBitfield extends Vec<u16> {}

  /** @name PalletRecoveryIdentifiedConsideration (684) */
  interface PalletRecoveryIdentifiedConsideration extends Struct {
    readonly depositor: AccountId32;
    readonly ticket: Option<Null>;
  }

  /** @name FrameSupportStorageFootprint (685) */
  interface FrameSupportStorageFootprint extends Struct {
    readonly count: u64;
    readonly size_: u64;
  }

  /** @name PalletRecoveryError (688) */
  interface PalletRecoveryError extends Enum {
    readonly isAlreadyApproved: boolean;
    readonly isAlreadyInitiated: boolean;
    readonly isAlreadyVoted: boolean;
    readonly isHasOngoingAttempts: boolean;
    readonly isLostAccountInFriendGroup: boolean;
    readonly isHigherPriorityRecovered: boolean;
    readonly isNoCancelDelay: boolean;
    readonly isNoFriendGroups: boolean;
    readonly isNoFriends: boolean;
    readonly isNoInheritor: boolean;
    readonly isNotApproved: boolean;
    readonly isNotAttempt: boolean;
    readonly isNotCanceller: boolean;
    readonly isNotFriend: boolean;
    readonly isNotFriendGroup: boolean;
    readonly isNotInheritor: boolean;
    readonly isNotYetCancelable: boolean;
    readonly isNotYetInheritable: boolean;
    readonly isTooManyFriendGroups: boolean;
    readonly isTooManyFriendsNeeded: boolean;
    readonly isNoFriendsNeeded: boolean;
    readonly isFriendsNotSortedOrUnique: boolean;
    readonly isDuplicateFriendGroups: boolean;
    readonly type: 'AlreadyApproved' | 'AlreadyInitiated' | 'AlreadyVoted' | 'HasOngoingAttempts' | 'LostAccountInFriendGroup' | 'HigherPriorityRecovered' | 'NoCancelDelay' | 'NoFriendGroups' | 'NoFriends' | 'NoInheritor' | 'NotApproved' | 'NotAttempt' | 'NotCanceller' | 'NotFriend' | 'NotFriendGroup' | 'NotInheritor' | 'NotYetCancelable' | 'NotYetInheritable' | 'TooManyFriendGroups' | 'TooManyFriendsNeeded' | 'NoFriendsNeeded' | 'FriendsNotSortedOrUnique' | 'DuplicateFriendGroups';
  }

  /** @name PalletVestingReleases (693) */
  interface PalletVestingReleases extends Enum {
    readonly isV0: boolean;
    readonly isV1: boolean;
    readonly type: 'V0' | 'V1';
  }

  /** @name PalletVestingError (694) */
  interface PalletVestingError extends Enum {
    readonly isNotVesting: boolean;
    readonly isAtMaxVestingSchedules: boolean;
    readonly isAmountLow: boolean;
    readonly isScheduleIndexOutOfBounds: boolean;
    readonly isInvalidScheduleParams: boolean;
    readonly type: 'NotVesting' | 'AtMaxVestingSchedules' | 'AmountLow' | 'ScheduleIndexOutOfBounds' | 'InvalidScheduleParams';
  }

  /** @name PalletSchedulerScheduled (697) */
  interface PalletSchedulerScheduled extends Struct {
    readonly maybeId: Option<U8aFixed>;
    readonly priority: u8;
    readonly call: FrameSupportPreimagesBounded;
    readonly maybePeriodic: Option<ITuple<[u32, u32]>>;
    readonly origin: PortaldotV3RuntimeOriginCaller;
  }

  /** @name FrameSupportPreimagesBounded (698) */
  interface FrameSupportPreimagesBounded extends Enum {
    readonly isLegacy: boolean;
    readonly asLegacy: {
      readonly hash_: H256;
    } & Struct;
    readonly isInline: boolean;
    readonly asInline: Bytes;
    readonly isLookup: boolean;
    readonly asLookup: {
      readonly hash_: H256;
      readonly len: u32;
    } & Struct;
    readonly type: 'Legacy' | 'Inline' | 'Lookup';
  }

  /** @name PalletSchedulerRetryConfig (700) */
  interface PalletSchedulerRetryConfig extends Struct {
    readonly totalRetries: u8;
    readonly remaining: u8;
    readonly period: u32;
  }

  /** @name PalletSchedulerError (701) */
  interface PalletSchedulerError extends Enum {
    readonly isFailedToSchedule: boolean;
    readonly isNotFound: boolean;
    readonly isTargetBlockNumberInPast: boolean;
    readonly isRescheduleNoChange: boolean;
    readonly isNamed: boolean;
    readonly type: 'FailedToSchedule' | 'NotFound' | 'TargetBlockNumberInPast' | 'RescheduleNoChange' | 'Named';
  }

  /** @name PalletPreimageOldRequestStatus (702) */
  interface PalletPreimageOldRequestStatus extends Enum {
    readonly isUnrequested: boolean;
    readonly asUnrequested: {
      readonly deposit: ITuple<[AccountId32, u128]>;
      readonly len: u32;
    } & Struct;
    readonly isRequested: boolean;
    readonly asRequested: {
      readonly deposit: Option<ITuple<[AccountId32, u128]>>;
      readonly count: u32;
      readonly len: Option<u32>;
    } & Struct;
    readonly type: 'Unrequested' | 'Requested';
  }

  /** @name PalletPreimageRequestStatus (704) */
  interface PalletPreimageRequestStatus extends Enum {
    readonly isUnrequested: boolean;
    readonly asUnrequested: {
      readonly ticket: ITuple<[AccountId32, u128]>;
      readonly len: u32;
    } & Struct;
    readonly isRequested: boolean;
    readonly asRequested: {
      readonly maybeTicket: Option<ITuple<[AccountId32, u128]>>;
      readonly count: u32;
      readonly maybeLen: Option<u32>;
    } & Struct;
    readonly type: 'Unrequested' | 'Requested';
  }

  /** @name PalletPreimageError (709) */
  interface PalletPreimageError extends Enum {
    readonly isTooBig: boolean;
    readonly isAlreadyNoted: boolean;
    readonly isNotAuthorized: boolean;
    readonly isNotNoted: boolean;
    readonly isRequested: boolean;
    readonly isNotRequested: boolean;
    readonly isTooMany: boolean;
    readonly isTooFew: boolean;
    readonly type: 'TooBig' | 'AlreadyNoted' | 'NotAuthorized' | 'NotNoted' | 'Requested' | 'NotRequested' | 'TooMany' | 'TooFew';
  }

  /** @name PalletProxyProxyDefinition (712) */
  interface PalletProxyProxyDefinition extends Struct {
    readonly delegate: AccountId32;
    readonly proxyType: PortaldotV3RuntimeProxyType;
    readonly delay: u32;
  }

  /** @name PalletProxyAnnouncement (716) */
  interface PalletProxyAnnouncement extends Struct {
    readonly real: AccountId32;
    readonly callHash: H256;
    readonly height: u32;
  }

  /** @name PalletProxyError (718) */
  interface PalletProxyError extends Enum {
    readonly isTooMany: boolean;
    readonly isNotFound: boolean;
    readonly isNotProxy: boolean;
    readonly isUnproxyable: boolean;
    readonly isDuplicate: boolean;
    readonly isNoPermission: boolean;
    readonly isUnannounced: boolean;
    readonly isNoSelfProxy: boolean;
    readonly type: 'TooMany' | 'NotFound' | 'NotProxy' | 'Unproxyable' | 'Duplicate' | 'NoPermission' | 'Unannounced' | 'NoSelfProxy';
  }

  /** @name PalletMultisigMultisig (720) */
  interface PalletMultisigMultisig extends Struct {
    readonly when: PalletMultisigTimepoint;
    readonly deposit: u128;
    readonly depositor: AccountId32;
    readonly approvals: Vec<AccountId32>;
  }

  /** @name PalletMultisigError (721) */
  interface PalletMultisigError extends Enum {
    readonly isMinimumThreshold: boolean;
    readonly isAlreadyApproved: boolean;
    readonly isNoApprovalsNeeded: boolean;
    readonly isTooFewSignatories: boolean;
    readonly isTooManySignatories: boolean;
    readonly isSignatoriesOutOfOrder: boolean;
    readonly isSenderInSignatories: boolean;
    readonly isNotFound: boolean;
    readonly isNotOwner: boolean;
    readonly isNoTimepoint: boolean;
    readonly isWrongTimepoint: boolean;
    readonly isUnexpectedTimepoint: boolean;
    readonly isMaxWeightTooLow: boolean;
    readonly isAlreadyStored: boolean;
    readonly type: 'MinimumThreshold' | 'AlreadyApproved' | 'NoApprovalsNeeded' | 'TooFewSignatories' | 'TooManySignatories' | 'SignatoriesOutOfOrder' | 'SenderInSignatories' | 'NotFound' | 'NotOwner' | 'NoTimepoint' | 'WrongTimepoint' | 'UnexpectedTimepoint' | 'MaxWeightTooLow' | 'AlreadyStored';
  }

  /** @name PalletBountiesBounty (722) */
  interface PalletBountiesBounty extends Struct {
    readonly proposer: AccountId32;
    readonly value: u128;
    readonly fee: u128;
    readonly curatorDeposit: u128;
    readonly bond: u128;
    readonly status: PalletBountiesBountyStatus;
  }

  /** @name PalletBountiesBountyStatus (723) */
  interface PalletBountiesBountyStatus extends Enum {
    readonly isProposed: boolean;
    readonly isApproved: boolean;
    readonly isFunded: boolean;
    readonly isCuratorProposed: boolean;
    readonly asCuratorProposed: {
      readonly curator: AccountId32;
    } & Struct;
    readonly isActive: boolean;
    readonly asActive: {
      readonly curator: AccountId32;
      readonly updateDue: u32;
    } & Struct;
    readonly isPendingPayout: boolean;
    readonly asPendingPayout: {
      readonly curator: AccountId32;
      readonly beneficiary: AccountId32;
      readonly unlockAt: u32;
    } & Struct;
    readonly isApprovedWithCurator: boolean;
    readonly asApprovedWithCurator: {
      readonly curator: AccountId32;
    } & Struct;
    readonly type: 'Proposed' | 'Approved' | 'Funded' | 'CuratorProposed' | 'Active' | 'PendingPayout' | 'ApprovedWithCurator';
  }

  /** @name PalletBountiesError (725) */
  interface PalletBountiesError extends Enum {
    readonly isInsufficientProposersBalance: boolean;
    readonly isInvalidIndex: boolean;
    readonly isReasonTooBig: boolean;
    readonly isUnexpectedStatus: boolean;
    readonly isRequireCurator: boolean;
    readonly isInvalidValue: boolean;
    readonly isInvalidFee: boolean;
    readonly isPendingPayout: boolean;
    readonly isPremature: boolean;
    readonly isHasActiveChildBounty: boolean;
    readonly isTooManyQueued: boolean;
    readonly isNotProposer: boolean;
    readonly isBountyStillActive: boolean;
    readonly type: 'InsufficientProposersBalance' | 'InvalidIndex' | 'ReasonTooBig' | 'UnexpectedStatus' | 'RequireCurator' | 'InvalidValue' | 'InvalidFee' | 'PendingPayout' | 'Premature' | 'HasActiveChildBounty' | 'TooManyQueued' | 'NotProposer' | 'BountyStillActive';
  }

  /** @name PalletAssetsAssetDetails (726) */
  interface PalletAssetsAssetDetails extends Struct {
    readonly owner: AccountId32;
    readonly issuer: AccountId32;
    readonly admin: AccountId32;
    readonly freezer: AccountId32;
    readonly supply: u128;
    readonly deposit: u128;
    readonly minBalance: u128;
    readonly isSufficient: bool;
    readonly accounts: u32;
    readonly sufficients: u32;
    readonly approvals: u32;
    readonly status: PalletAssetsAssetStatus;
  }

  /** @name PalletAssetsAssetStatus (727) */
  interface PalletAssetsAssetStatus extends Enum {
    readonly isLive: boolean;
    readonly isFrozen: boolean;
    readonly isDestroying: boolean;
    readonly type: 'Live' | 'Frozen' | 'Destroying';
  }

  /** @name PalletAssetsAssetAccount (728) */
  interface PalletAssetsAssetAccount extends Struct {
    readonly balance: u128;
    readonly status: PalletAssetsAccountStatus;
    readonly reason: PalletAssetsExistenceReason;
    readonly extra: Null;
  }

  /** @name PalletAssetsAccountStatus (729) */
  interface PalletAssetsAccountStatus extends Enum {
    readonly isLiquid: boolean;
    readonly isFrozen: boolean;
    readonly isBlocked: boolean;
    readonly type: 'Liquid' | 'Frozen' | 'Blocked';
  }

  /** @name PalletAssetsExistenceReason (730) */
  interface PalletAssetsExistenceReason extends Enum {
    readonly isConsumer: boolean;
    readonly isSufficient: boolean;
    readonly isDepositHeld: boolean;
    readonly asDepositHeld: u128;
    readonly isDepositRefunded: boolean;
    readonly isDepositFrom: boolean;
    readonly asDepositFrom: ITuple<[AccountId32, u128]>;
    readonly type: 'Consumer' | 'Sufficient' | 'DepositHeld' | 'DepositRefunded' | 'DepositFrom';
  }

  /** @name PalletAssetsApproval (732) */
  interface PalletAssetsApproval extends Struct {
    readonly amount: u128;
    readonly deposit: u128;
  }

  /** @name PalletAssetsAssetMetadata (733) */
  interface PalletAssetsAssetMetadata extends Struct {
    readonly deposit: u128;
    readonly name: Bytes;
    readonly symbol: Bytes;
    readonly decimals: u8;
    readonly isFrozen: bool;
  }

  /** @name PalletAssetsError (735) */
  interface PalletAssetsError extends Enum {
    readonly isBalanceLow: boolean;
    readonly isNoAccount: boolean;
    readonly isNoPermission: boolean;
    readonly isUnknown: boolean;
    readonly isFrozen: boolean;
    readonly isInUse: boolean;
    readonly isBadWitness: boolean;
    readonly isMinBalanceZero: boolean;
    readonly isUnavailableConsumer: boolean;
    readonly isBadMetadata: boolean;
    readonly isUnapproved: boolean;
    readonly isWouldDie: boolean;
    readonly isAlreadyExists: boolean;
    readonly isNoDeposit: boolean;
    readonly isWouldBurn: boolean;
    readonly isLiveAsset: boolean;
    readonly isAssetNotLive: boolean;
    readonly isIncorrectStatus: boolean;
    readonly isNotFrozen: boolean;
    readonly isCallbackFailed: boolean;
    readonly isBadAssetId: boolean;
    readonly isAssetIdAllocationFailed: boolean;
    readonly isContainsFreezes: boolean;
    readonly isContainsHolds: boolean;
    readonly isTooManyReserves: boolean;
    readonly isIncompleteDepositTransfer: boolean;
    readonly type: 'BalanceLow' | 'NoAccount' | 'NoPermission' | 'Unknown' | 'Frozen' | 'InUse' | 'BadWitness' | 'MinBalanceZero' | 'UnavailableConsumer' | 'BadMetadata' | 'Unapproved' | 'WouldDie' | 'AlreadyExists' | 'NoDeposit' | 'WouldBurn' | 'LiveAsset' | 'AssetNotLive' | 'IncorrectStatus' | 'NotFrozen' | 'CallbackFailed' | 'BadAssetId' | 'AssetIdAllocationFailed' | 'ContainsFreezes' | 'ContainsHolds' | 'TooManyReserves' | 'IncompleteDepositTransfer';
  }

  /** @name PalletBeefyError (741) */
  interface PalletBeefyError extends Enum {
    readonly isInvalidKeyOwnershipProof: boolean;
    readonly isInvalidDoubleVotingProof: boolean;
    readonly isInvalidForkVotingProof: boolean;
    readonly isInvalidFutureBlockVotingProof: boolean;
    readonly isInvalidEquivocationProofSession: boolean;
    readonly isInvalidEquivocationProofSessionMember: boolean;
    readonly isDuplicateOffenceReport: boolean;
    readonly isInvalidConfiguration: boolean;
    readonly type: 'InvalidKeyOwnershipProof' | 'InvalidDoubleVotingProof' | 'InvalidForkVotingProof' | 'InvalidFutureBlockVotingProof' | 'InvalidEquivocationProofSession' | 'InvalidEquivocationProofSessionMember' | 'DuplicateOffenceReport' | 'InvalidConfiguration';
  }

  /** @name SpConsensusBeefyMmrBeefyAuthoritySet (742) */
  interface SpConsensusBeefyMmrBeefyAuthoritySet extends Struct {
    readonly id: u64;
    readonly len: u32;
    readonly keysetCommitment: H256;
  }

  /** @name PalletLotteryLotteryConfig (743) */
  interface PalletLotteryLotteryConfig extends Struct {
    readonly price: u128;
    readonly start: u32;
    readonly length: u32;
    readonly delay: u32;
    readonly repeat: bool;
  }

  /** @name PalletLotteryError (747) */
  interface PalletLotteryError extends Enum {
    readonly isNotConfigured: boolean;
    readonly isInProgress: boolean;
    readonly isAlreadyEnded: boolean;
    readonly isInvalidCall: boolean;
    readonly isAlreadyParticipating: boolean;
    readonly isTooManyCalls: boolean;
    readonly isEncodingFailed: boolean;
    readonly type: 'NotConfigured' | 'InProgress' | 'AlreadyEnded' | 'InvalidCall' | 'AlreadyParticipating' | 'TooManyCalls' | 'EncodingFailed';
  }

  /** @name PalletUniquesCollectionDetails (748) */
  interface PalletUniquesCollectionDetails extends Struct {
    readonly owner: AccountId32;
    readonly issuer: AccountId32;
    readonly admin: AccountId32;
    readonly freezer: AccountId32;
    readonly totalDeposit: u128;
    readonly freeHolding: bool;
    readonly items: u32;
    readonly itemMetadatas: u32;
    readonly attributes: u32;
    readonly isFrozen: bool;
  }

  /** @name PalletUniquesItemDetails (750) */
  interface PalletUniquesItemDetails extends Struct {
    readonly owner: AccountId32;
    readonly approved: Option<AccountId32>;
    readonly isFrozen: bool;
    readonly deposit: u128;
  }

  /** @name PalletUniquesCollectionMetadata (751) */
  interface PalletUniquesCollectionMetadata extends Struct {
    readonly deposit: u128;
    readonly data: Bytes;
    readonly isFrozen: bool;
  }

  /** @name PalletUniquesItemMetadata (752) */
  interface PalletUniquesItemMetadata extends Struct {
    readonly deposit: u128;
    readonly data: Bytes;
    readonly isFrozen: bool;
  }

  /** @name PalletUniquesError (756) */
  interface PalletUniquesError extends Enum {
    readonly isNoPermission: boolean;
    readonly isUnknownCollection: boolean;
    readonly isAlreadyExists: boolean;
    readonly isWrongOwner: boolean;
    readonly isBadWitness: boolean;
    readonly isInUse: boolean;
    readonly isFrozen: boolean;
    readonly isWrongDelegate: boolean;
    readonly isNoDelegate: boolean;
    readonly isUnapproved: boolean;
    readonly isUnaccepted: boolean;
    readonly isLocked: boolean;
    readonly isMaxSupplyReached: boolean;
    readonly isMaxSupplyAlreadySet: boolean;
    readonly isMaxSupplyTooSmall: boolean;
    readonly isUnknownItem: boolean;
    readonly isNotForSale: boolean;
    readonly isBidTooLow: boolean;
    readonly isNoMetadata: boolean;
    readonly isWrongMetadata: boolean;
    readonly isAttributeNotFound: boolean;
    readonly isWrongAttribute: boolean;
    readonly type: 'NoPermission' | 'UnknownCollection' | 'AlreadyExists' | 'WrongOwner' | 'BadWitness' | 'InUse' | 'Frozen' | 'WrongDelegate' | 'NoDelegate' | 'Unapproved' | 'Unaccepted' | 'Locked' | 'MaxSupplyReached' | 'MaxSupplyAlreadySet' | 'MaxSupplyTooSmall' | 'UnknownItem' | 'NotForSale' | 'BidTooLow' | 'NoMetadata' | 'WrongMetadata' | 'AttributeNotFound' | 'WrongAttribute';
  }

  /** @name PalletNftsCollectionDetails (757) */
  interface PalletNftsCollectionDetails extends Struct {
    readonly owner: AccountId32;
    readonly ownerDeposit: u128;
    readonly items: u32;
    readonly itemMetadatas: u32;
    readonly itemConfigs: u32;
    readonly attributes: u32;
  }

  /** @name PalletNftsCollectionRole (759) */
  interface PalletNftsCollectionRole extends Enum {
    readonly isIssuer: boolean;
    readonly isFreezer: boolean;
    readonly isAdmin: boolean;
    readonly type: 'Issuer' | 'Freezer' | 'Admin';
  }

  /** @name PalletNftsItemDetails (760) */
  interface PalletNftsItemDetails extends Struct {
    readonly owner: AccountId32;
    readonly approvals: BTreeMap<AccountId32, Option<u32>>;
    readonly deposit: PalletNftsItemDeposit;
  }

  /** @name PalletNftsItemDeposit (761) */
  interface PalletNftsItemDeposit extends Struct {
    readonly account: AccountId32;
    readonly amount: u128;
  }

  /** @name PalletNftsCollectionMetadata (766) */
  interface PalletNftsCollectionMetadata extends Struct {
    readonly deposit: u128;
    readonly data: Bytes;
  }

  /** @name PalletNftsItemMetadata (767) */
  interface PalletNftsItemMetadata extends Struct {
    readonly deposit: PalletNftsItemMetadataDeposit;
    readonly data: Bytes;
  }

  /** @name PalletNftsItemMetadataDeposit (768) */
  interface PalletNftsItemMetadataDeposit extends Struct {
    readonly account: Option<AccountId32>;
    readonly amount: u128;
  }

  /** @name PalletNftsAttributeDeposit (771) */
  interface PalletNftsAttributeDeposit extends Struct {
    readonly account: Option<AccountId32>;
    readonly amount: u128;
  }

  /** @name PalletNftsPendingSwap (774) */
  interface PalletNftsPendingSwap extends Struct {
    readonly desiredCollection: u32;
    readonly desiredItem: Option<u32>;
    readonly price: Option<PalletNftsPriceWithDirection>;
    readonly deadline: u32;
  }

  /** @name PalletNftsPalletFeature (776) */
  interface PalletNftsPalletFeature extends Enum {
    readonly isTrading: boolean;
    readonly isAttributes: boolean;
    readonly isApprovals: boolean;
    readonly isSwaps: boolean;
    readonly type: 'Trading' | 'Attributes' | 'Approvals' | 'Swaps';
  }

  /** @name PalletNftsError (777) */
  interface PalletNftsError extends Enum {
    readonly isNoPermission: boolean;
    readonly isUnknownCollection: boolean;
    readonly isAlreadyExists: boolean;
    readonly isApprovalExpired: boolean;
    readonly isWrongOwner: boolean;
    readonly isBadWitness: boolean;
    readonly isCollectionIdInUse: boolean;
    readonly isItemsNonTransferable: boolean;
    readonly isNotDelegate: boolean;
    readonly isWrongDelegate: boolean;
    readonly isUnapproved: boolean;
    readonly isUnaccepted: boolean;
    readonly isItemLocked: boolean;
    readonly isLockedItemAttributes: boolean;
    readonly isLockedCollectionAttributes: boolean;
    readonly isLockedItemMetadata: boolean;
    readonly isLockedCollectionMetadata: boolean;
    readonly isMaxSupplyReached: boolean;
    readonly isMaxSupplyLocked: boolean;
    readonly isMaxSupplyTooSmall: boolean;
    readonly isUnknownItem: boolean;
    readonly isUnknownSwap: boolean;
    readonly isMetadataNotFound: boolean;
    readonly isAttributeNotFound: boolean;
    readonly isNotForSale: boolean;
    readonly isBidTooLow: boolean;
    readonly isReachedApprovalLimit: boolean;
    readonly isDeadlineExpired: boolean;
    readonly isWrongDuration: boolean;
    readonly isMethodDisabled: boolean;
    readonly isWrongSetting: boolean;
    readonly isInconsistentItemConfig: boolean;
    readonly isNoConfig: boolean;
    readonly isRolesNotCleared: boolean;
    readonly isMintNotStarted: boolean;
    readonly isMintEnded: boolean;
    readonly isAlreadyClaimed: boolean;
    readonly isIncorrectData: boolean;
    readonly isWrongOrigin: boolean;
    readonly isWrongSignature: boolean;
    readonly isIncorrectMetadata: boolean;
    readonly isMaxAttributesLimitReached: boolean;
    readonly isWrongNamespace: boolean;
    readonly isCollectionNotEmpty: boolean;
    readonly isWitnessRequired: boolean;
    readonly type: 'NoPermission' | 'UnknownCollection' | 'AlreadyExists' | 'ApprovalExpired' | 'WrongOwner' | 'BadWitness' | 'CollectionIdInUse' | 'ItemsNonTransferable' | 'NotDelegate' | 'WrongDelegate' | 'Unapproved' | 'Unaccepted' | 'ItemLocked' | 'LockedItemAttributes' | 'LockedCollectionAttributes' | 'LockedItemMetadata' | 'LockedCollectionMetadata' | 'MaxSupplyReached' | 'MaxSupplyLocked' | 'MaxSupplyTooSmall' | 'UnknownItem' | 'UnknownSwap' | 'MetadataNotFound' | 'AttributeNotFound' | 'NotForSale' | 'BidTooLow' | 'ReachedApprovalLimit' | 'DeadlineExpired' | 'WrongDuration' | 'MethodDisabled' | 'WrongSetting' | 'InconsistentItemConfig' | 'NoConfig' | 'RolesNotCleared' | 'MintNotStarted' | 'MintEnded' | 'AlreadyClaimed' | 'IncorrectData' | 'WrongOrigin' | 'WrongSignature' | 'IncorrectMetadata' | 'MaxAttributesLimitReached' | 'WrongNamespace' | 'CollectionNotEmpty' | 'WitnessRequired';
  }

  /** @name PalletNftFractionalizationDetails (778) */
  interface PalletNftFractionalizationDetails extends Struct {
    readonly asset: u32;
    readonly fractions: u128;
    readonly deposit: u128;
    readonly assetCreator: AccountId32;
  }

  /** @name PalletNftFractionalizationError (779) */
  interface PalletNftFractionalizationError extends Enum {
    readonly isIncorrectAssetId: boolean;
    readonly isNoPermission: boolean;
    readonly isNftNotFound: boolean;
    readonly isNftNotFractionalized: boolean;
    readonly type: 'IncorrectAssetId' | 'NoPermission' | 'NftNotFound' | 'NftNotFractionalized';
  }

  /** @name PalletTransactionStorageAuthorizationScope (780) */
  interface PalletTransactionStorageAuthorizationScope extends Enum {
    readonly isAccount: boolean;
    readonly asAccount: AccountId32;
    readonly isPreimage: boolean;
    readonly asPreimage: U8aFixed;
    readonly type: 'Account' | 'Preimage';
  }

  /** @name PalletTransactionStorageAuthorization (781) */
  interface PalletTransactionStorageAuthorization extends Struct {
    readonly extent: PalletTransactionStorageAuthorizationExtent;
    readonly expiration: u32;
  }

  /** @name PalletTransactionStorageAuthorizationExtent (782) */
  interface PalletTransactionStorageAuthorizationExtent extends Struct {
    readonly transactions: u32;
    readonly bytes: u64;
  }

  /** @name PalletTransactionStorageTransactionInfo (784) */
  interface PalletTransactionStorageTransactionInfo extends Struct {
    readonly chunkRoot: H256;
    readonly contentHash: H256;
    readonly size_: u32;
    readonly blockChunks: u32;
  }

  /** @name PalletTransactionStorageError (786) */
  interface PalletTransactionStorageError extends Enum {
    readonly isBadContext: boolean;
    readonly isBadDataSize: boolean;
    readonly isTooManyTransactions: boolean;
    readonly isNotConfigured: boolean;
    readonly isRenewedNotFound: boolean;
    readonly isUnexpectedProof: boolean;
    readonly isInvalidProof: boolean;
    readonly isMissingProof: boolean;
    readonly isMissingStateData: boolean;
    readonly isDoubleCheck: boolean;
    readonly isProofNotChecked: boolean;
    readonly isAuthorizationNotFound: boolean;
    readonly isAuthorizationNotExpired: boolean;
    readonly type: 'BadContext' | 'BadDataSize' | 'TooManyTransactions' | 'NotConfigured' | 'RenewedNotFound' | 'UnexpectedProof' | 'InvalidProof' | 'MissingProof' | 'MissingStateData' | 'DoubleCheck' | 'ProofNotChecked' | 'AuthorizationNotFound' | 'AuthorizationNotExpired';
  }

  /** @name PalletBagsListListNode (787) */
  interface PalletBagsListListNode extends Struct {
    readonly id: AccountId32;
    readonly prev: Option<AccountId32>;
    readonly next: Option<AccountId32>;
    readonly bagUpper: u64;
    readonly score: u64;
  }

  /** @name PalletBagsListListBag (788) */
  interface PalletBagsListListBag extends Struct {
    readonly head: Option<AccountId32>;
    readonly tail: Option<AccountId32>;
  }

  /** @name PalletBagsListError (790) */
  interface PalletBagsListError extends Enum {
    readonly isList: boolean;
    readonly asList: PalletBagsListListListError;
    readonly isLocked: boolean;
    readonly type: 'List' | 'Locked';
  }

  /** @name PalletBagsListListListError (791) */
  interface PalletBagsListListListError extends Enum {
    readonly isDuplicate: boolean;
    readonly isNotHeavier: boolean;
    readonly isNotInSameBag: boolean;
    readonly isNodeNotFound: boolean;
    readonly isLocked: boolean;
    readonly type: 'Duplicate' | 'NotHeavier' | 'NotInSameBag' | 'NodeNotFound' | 'Locked';
  }

  /** @name PalletChildBountiesChildBounty (793) */
  interface PalletChildBountiesChildBounty extends Struct {
    readonly parentBounty: u32;
    readonly value: u128;
    readonly fee: u128;
    readonly curatorDeposit: u128;
    readonly status: PalletChildBountiesChildBountyStatus;
  }

  /** @name PalletChildBountiesChildBountyStatus (794) */
  interface PalletChildBountiesChildBountyStatus extends Enum {
    readonly isAdded: boolean;
    readonly isCuratorProposed: boolean;
    readonly asCuratorProposed: {
      readonly curator: AccountId32;
    } & Struct;
    readonly isActive: boolean;
    readonly asActive: {
      readonly curator: AccountId32;
    } & Struct;
    readonly isPendingPayout: boolean;
    readonly asPendingPayout: {
      readonly curator: AccountId32;
      readonly beneficiary: AccountId32;
      readonly unlockAt: u32;
    } & Struct;
    readonly type: 'Added' | 'CuratorProposed' | 'Active' | 'PendingPayout';
  }

  /** @name PalletChildBountiesError (795) */
  interface PalletChildBountiesError extends Enum {
    readonly isParentBountyNotActive: boolean;
    readonly isInsufficientBountyBalance: boolean;
    readonly isTooManyChildBounties: boolean;
    readonly type: 'ParentBountyNotActive' | 'InsufficientBountyBalance' | 'TooManyChildBounties';
  }

  /** @name PalletRemarkError (796) */
  interface PalletRemarkError extends Enum {
    readonly isEmpty: boolean;
    readonly isBadContext: boolean;
    readonly type: 'Empty' | 'BadContext';
  }

  /** @name PalletNominationPoolsPoolMember (797) */
  interface PalletNominationPoolsPoolMember extends Struct {
    readonly poolId: u32;
    readonly points: u128;
    readonly lastRecordedRewardCounter: u128;
    readonly unbondingEras: BTreeMap<u32, u128>;
  }

  /** @name PalletNominationPoolsBondedPoolInner (800) */
  interface PalletNominationPoolsBondedPoolInner extends Struct {
    readonly commission: PalletNominationPoolsCommission;
    readonly memberCounter: u32;
    readonly points: u128;
    readonly roles: PalletNominationPoolsPoolRoles;
    readonly state: PalletNominationPoolsPoolState;
  }

  /** @name PalletNominationPoolsCommission (801) */
  interface PalletNominationPoolsCommission extends Struct {
    readonly current: Option<ITuple<[Perbill, AccountId32]>>;
    readonly max: Option<Perbill>;
    readonly changeRate: Option<PalletNominationPoolsCommissionChangeRate>;
    readonly throttleFrom: Option<u32>;
    readonly claimPermission: Option<PalletNominationPoolsCommissionClaimPermission>;
  }

  /** @name PalletNominationPoolsPoolRoles (803) */
  interface PalletNominationPoolsPoolRoles extends Struct {
    readonly depositor: AccountId32;
    readonly root: Option<AccountId32>;
    readonly nominator: Option<AccountId32>;
    readonly bouncer: Option<AccountId32>;
  }

  /** @name PalletNominationPoolsRewardPool (804) */
  interface PalletNominationPoolsRewardPool extends Struct {
    readonly lastRecordedRewardCounter: u128;
    readonly lastRecordedTotalPayouts: u128;
    readonly totalRewardsClaimed: u128;
    readonly totalCommissionPending: u128;
    readonly totalCommissionClaimed: u128;
  }

  /** @name PalletNominationPoolsSubPools (805) */
  interface PalletNominationPoolsSubPools extends Struct {
    readonly noEra: PalletNominationPoolsUnbondPool;
    readonly withEra: BTreeMap<u32, PalletNominationPoolsUnbondPool>;
  }

  /** @name PalletNominationPoolsUnbondPool (806) */
  interface PalletNominationPoolsUnbondPool extends Struct {
    readonly points: u128;
    readonly balance: u128;
  }

  /** @name PalletNominationPoolsError (811) */
  interface PalletNominationPoolsError extends Enum {
    readonly isPoolNotFound: boolean;
    readonly isPoolMemberNotFound: boolean;
    readonly isRewardPoolNotFound: boolean;
    readonly isSubPoolsNotFound: boolean;
    readonly isAccountBelongsToOtherPool: boolean;
    readonly isFullyUnbonding: boolean;
    readonly isMaxUnbondingLimit: boolean;
    readonly isCannotWithdrawAny: boolean;
    readonly isMinimumBondNotMet: boolean;
    readonly isOverflowRisk: boolean;
    readonly isNotDestroying: boolean;
    readonly isNotNominator: boolean;
    readonly isNotKickerOrDestroying: boolean;
    readonly isNotOpen: boolean;
    readonly isMaxPools: boolean;
    readonly isMaxPoolMembers: boolean;
    readonly isCanNotChangeState: boolean;
    readonly isDoesNotHavePermission: boolean;
    readonly isMetadataExceedsMaxLen: boolean;
    readonly isDefensive: boolean;
    readonly asDefensive: PalletNominationPoolsDefensiveError;
    readonly isPartialUnbondNotAllowedPermissionlessly: boolean;
    readonly isMaxCommissionRestricted: boolean;
    readonly isCommissionExceedsMaximum: boolean;
    readonly isCommissionExceedsGlobalMaximum: boolean;
    readonly isCommissionChangeThrottled: boolean;
    readonly isCommissionChangeRateNotAllowed: boolean;
    readonly isNoPendingCommission: boolean;
    readonly isNoCommissionCurrentSet: boolean;
    readonly isPoolIdInUse: boolean;
    readonly isInvalidPoolId: boolean;
    readonly isBondExtraRestricted: boolean;
    readonly isNothingToAdjust: boolean;
    readonly isNothingToSlash: boolean;
    readonly isSlashTooLow: boolean;
    readonly isAlreadyMigrated: boolean;
    readonly isNotMigrated: boolean;
    readonly isNotSupported: boolean;
    readonly isRestricted: boolean;
    readonly type: 'PoolNotFound' | 'PoolMemberNotFound' | 'RewardPoolNotFound' | 'SubPoolsNotFound' | 'AccountBelongsToOtherPool' | 'FullyUnbonding' | 'MaxUnbondingLimit' | 'CannotWithdrawAny' | 'MinimumBondNotMet' | 'OverflowRisk' | 'NotDestroying' | 'NotNominator' | 'NotKickerOrDestroying' | 'NotOpen' | 'MaxPools' | 'MaxPoolMembers' | 'CanNotChangeState' | 'DoesNotHavePermission' | 'MetadataExceedsMaxLen' | 'Defensive' | 'PartialUnbondNotAllowedPermissionlessly' | 'MaxCommissionRestricted' | 'CommissionExceedsMaximum' | 'CommissionExceedsGlobalMaximum' | 'CommissionChangeThrottled' | 'CommissionChangeRateNotAllowed' | 'NoPendingCommission' | 'NoCommissionCurrentSet' | 'PoolIdInUse' | 'InvalidPoolId' | 'BondExtraRestricted' | 'NothingToAdjust' | 'NothingToSlash' | 'SlashTooLow' | 'AlreadyMigrated' | 'NotMigrated' | 'NotSupported' | 'Restricted';
  }

  /** @name PalletNominationPoolsDefensiveError (812) */
  interface PalletNominationPoolsDefensiveError extends Enum {
    readonly isNotEnoughSpaceInUnbondPool: boolean;
    readonly isPoolNotFound: boolean;
    readonly isRewardPoolNotFound: boolean;
    readonly isSubPoolsNotFound: boolean;
    readonly isBondedStashKilledPrematurely: boolean;
    readonly isDelegationUnsupported: boolean;
    readonly isSlashNotApplied: boolean;
    readonly type: 'NotEnoughSpaceInUnbondPool' | 'PoolNotFound' | 'RewardPoolNotFound' | 'SubPoolsNotFound' | 'BondedStashKilledPrematurely' | 'DelegationUnsupported' | 'SlashNotApplied';
  }

  /** @name PalletAssetConversionPoolInfo (813) */
  interface PalletAssetConversionPoolInfo extends Struct {
    readonly lpToken: u32;
  }

  /** @name PalletAssetConversionError (814) */
  interface PalletAssetConversionError extends Enum {
    readonly isInvalidAssetPair: boolean;
    readonly isPoolExists: boolean;
    readonly isWrongDesiredAmount: boolean;
    readonly isAmountOneLessThanMinimal: boolean;
    readonly isAmountTwoLessThanMinimal: boolean;
    readonly isReserveLeftLessThanMinimal: boolean;
    readonly isAmountOutTooHigh: boolean;
    readonly isPoolNotFound: boolean;
    readonly isOverflow: boolean;
    readonly isAssetOneDepositDidNotMeetMinimum: boolean;
    readonly isAssetTwoDepositDidNotMeetMinimum: boolean;
    readonly isAssetOneWithdrawalDidNotMeetMinimum: boolean;
    readonly isAssetTwoWithdrawalDidNotMeetMinimum: boolean;
    readonly isOptimalAmountLessThanDesired: boolean;
    readonly isInsufficientLiquidityMinted: boolean;
    readonly isZeroLiquidity: boolean;
    readonly isZeroAmount: boolean;
    readonly isProvidedMinimumNotSufficientForSwap: boolean;
    readonly isProvidedMaximumNotSufficientForSwap: boolean;
    readonly isInvalidPath: boolean;
    readonly isNonUniquePath: boolean;
    readonly isIncorrectPoolAssetId: boolean;
    readonly isBelowMinimum: boolean;
    readonly isPoolEmpty: boolean;
    readonly isFeeTooHigh: boolean;
    readonly type: 'InvalidAssetPair' | 'PoolExists' | 'WrongDesiredAmount' | 'AmountOneLessThanMinimal' | 'AmountTwoLessThanMinimal' | 'ReserveLeftLessThanMinimal' | 'AmountOutTooHigh' | 'PoolNotFound' | 'Overflow' | 'AssetOneDepositDidNotMeetMinimum' | 'AssetTwoDepositDidNotMeetMinimum' | 'AssetOneWithdrawalDidNotMeetMinimum' | 'AssetTwoWithdrawalDidNotMeetMinimum' | 'OptimalAmountLessThanDesired' | 'InsufficientLiquidityMinted' | 'ZeroLiquidity' | 'ZeroAmount' | 'ProvidedMinimumNotSufficientForSwap' | 'ProvidedMaximumNotSufficientForSwap' | 'InvalidPath' | 'NonUniquePath' | 'IncorrectPoolAssetId' | 'BelowMinimum' | 'PoolEmpty' | 'FeeTooHigh';
  }

  /** @name PalletFastUnstakeUnstakeRequest (817) */
  interface PalletFastUnstakeUnstakeRequest extends Struct {
    readonly stashes: Vec<ITuple<[AccountId32, u128]>>;
    readonly checked: Vec<u32>;
  }

  /** @name PalletFastUnstakeError (820) */
  interface PalletFastUnstakeError extends Enum {
    readonly isNotController: boolean;
    readonly isAlreadyQueued: boolean;
    readonly isNotFullyBonded: boolean;
    readonly isNotQueued: boolean;
    readonly isAlreadyHead: boolean;
    readonly isCallNotAllowed: boolean;
    readonly type: 'NotController' | 'AlreadyQueued' | 'NotFullyBonded' | 'NotQueued' | 'AlreadyHead' | 'CallNotAllowed';
  }

  /** @name PalletMessageQueueBookState (821) */
  interface PalletMessageQueueBookState extends Struct {
    readonly begin: u32;
    readonly end: u32;
    readonly count: u32;
    readonly readyNeighbours: Option<PalletMessageQueueNeighbours>;
    readonly messageCount: u64;
    readonly size_: u64;
  }

  /** @name PalletMessageQueueNeighbours (823) */
  interface PalletMessageQueueNeighbours extends Struct {
    readonly prev: u32;
    readonly next: u32;
  }

  /** @name PalletMessageQueuePage (824) */
  interface PalletMessageQueuePage extends Struct {
    readonly remaining: u32;
    readonly remainingSize: u32;
    readonly firstIndex: u32;
    readonly first: u32;
    readonly last: u32;
    readonly heap: Bytes;
  }

  /** @name PalletMessageQueueError (826) */
  interface PalletMessageQueueError extends Enum {
    readonly isNotReapable: boolean;
    readonly isNoPage: boolean;
    readonly isNoMessage: boolean;
    readonly isAlreadyProcessed: boolean;
    readonly isQueued: boolean;
    readonly isInsufficientWeight: boolean;
    readonly isTemporarilyUnprocessable: boolean;
    readonly isQueuePaused: boolean;
    readonly isRecursiveDisallowed: boolean;
    readonly type: 'NotReapable' | 'NoPage' | 'NoMessage' | 'AlreadyProcessed' | 'Queued' | 'InsufficientWeight' | 'TemporarilyUnprocessable' | 'QueuePaused' | 'RecursiveDisallowed';
  }

  /** @name PalletTxPauseError (827) */
  interface PalletTxPauseError extends Enum {
    readonly isIsPaused: boolean;
    readonly isIsUnpaused: boolean;
    readonly isUnpausable: boolean;
    readonly isNotFound: boolean;
    readonly type: 'IsPaused' | 'IsUnpaused' | 'Unpausable' | 'NotFound';
  }

  /** @name PalletSafeModeError (828) */
  interface PalletSafeModeError extends Enum {
    readonly isEntered: boolean;
    readonly isExited: boolean;
    readonly isNotConfigured: boolean;
    readonly isNoDeposit: boolean;
    readonly isAlreadyDeposited: boolean;
    readonly isCannotReleaseYet: boolean;
    readonly isCurrencyError: boolean;
    readonly type: 'Entered' | 'Exited' | 'NotConfigured' | 'NoDeposit' | 'AlreadyDeposited' | 'CannotReleaseYet' | 'CurrencyError';
  }

  /** @name PalletMigrationsError (829) */
  interface PalletMigrationsError extends Enum {
    readonly isOngoing: boolean;
    readonly type: 'Ongoing';
  }

  /** @name PalletMigrationsMbmIsOngoing (830) */
  interface PalletMigrationsMbmIsOngoing extends Enum {
    readonly isYes: boolean;
    readonly isNo: boolean;
    readonly isStuck: boolean;
    readonly type: 'Yes' | 'No' | 'Stuck';
  }

  /** @name PalletMigrationsMbmProgress (832) */
  interface PalletMigrationsMbmProgress extends Struct {
    readonly currentMigration: u32;
    readonly totalMigrations: u32;
    readonly currentMigrationSteps: u32;
    readonly currentMigrationMaxSteps: Option<u32>;
  }

  /** @name PalletMigrationsMbmStatus (833) */
  interface PalletMigrationsMbmStatus extends Struct {
    readonly ongoing: PalletMigrationsMbmIsOngoing;
    readonly progress: Option<PalletMigrationsMbmProgress>;
    readonly prefixes: Vec<Bytes>;
  }

  /** @name PalletBrokerLeaseRecordItem (837) */
  interface PalletBrokerLeaseRecordItem extends Struct {
    readonly until: u32;
    readonly task: u32;
  }

  /** @name PalletBrokerStatusRecord (839) */
  interface PalletBrokerStatusRecord extends Struct {
    readonly coreCount: u16;
    readonly privatePoolSize: u32;
    readonly systemPoolSize: u32;
    readonly lastCommittedTimeslice: u32;
    readonly lastTimeslice: u32;
  }

  /** @name PalletBrokerSaleInfoRecord (840) */
  interface PalletBrokerSaleInfoRecord extends Struct {
    readonly saleStart: u32;
    readonly leadinLength: u32;
    readonly endPrice: u128;
    readonly regionBegin: u32;
    readonly regionEnd: u32;
    readonly idealCoresSold: u16;
    readonly coresOffered: u16;
    readonly firstCore: u16;
    readonly selloutPrice: Option<u128>;
    readonly coresSold: u16;
    readonly saleIndex: u32;
  }

  /** @name FpCoretimePotentialRenewalId (841) */
  interface FpCoretimePotentialRenewalId extends Struct {
    readonly core: u16;
    readonly when: u32;
  }

  /** @name PalletBrokerPotentialRenewalRecord (842) */
  interface PalletBrokerPotentialRenewalRecord extends Struct {
    readonly price: u128;
    readonly completion: PalletBrokerCompletionStatus;
  }

  /** @name PalletBrokerCompletionStatus (843) */
  interface PalletBrokerCompletionStatus extends Enum {
    readonly isPartial: boolean;
    readonly asPartial: FpCoretimeCoreMask;
    readonly isComplete: boolean;
    readonly asComplete: Vec<PalletBrokerScheduleItem>;
    readonly type: 'Partial' | 'Complete';
  }

  /** @name PalletBrokerRegionRecord (844) */
  interface PalletBrokerRegionRecord extends Struct {
    readonly end: u32;
    readonly owner: Option<AccountId32>;
    readonly paid: Option<u128>;
  }

  /** @name PalletBrokerContributionRecord (846) */
  interface PalletBrokerContributionRecord extends Struct {
    readonly length: u32;
    readonly payee: AccountId32;
  }

  /** @name PalletBrokerPoolIoRecord (847) */
  interface PalletBrokerPoolIoRecord extends Struct {
    readonly private: i32;
    readonly system: i32;
  }

  /** @name PalletBrokerInstaPoolHistoryRecord (849) */
  interface PalletBrokerInstaPoolHistoryRecord extends Struct {
    readonly privateContributions: u32;
    readonly systemContributions: u32;
    readonly maybePayout: Option<u128>;
  }

  /** @name PalletBrokerAutoRenewalRecord (851) */
  interface PalletBrokerAutoRenewalRecord extends Struct {
    readonly core: u16;
    readonly task: u32;
    readonly nextRenewal: u32;
  }

  /** @name PalletBrokerError (853) */
  interface PalletBrokerError extends Enum {
    readonly isUnknownRegion: boolean;
    readonly isNotOwner: boolean;
    readonly isPivotTooLate: boolean;
    readonly isPivotTooEarly: boolean;
    readonly isExteriorPivot: boolean;
    readonly isVoidPivot: boolean;
    readonly isCompletePivot: boolean;
    readonly isCorruptWorkplan: boolean;
    readonly isNoSales: boolean;
    readonly isOverpriced: boolean;
    readonly isUnavailable: boolean;
    readonly isSoldOut: boolean;
    readonly isWrongTime: boolean;
    readonly isNotAllowed: boolean;
    readonly isUninitialized: boolean;
    readonly isTooEarly: boolean;
    readonly isNothingToDo: boolean;
    readonly isTooManyReservations: boolean;
    readonly isTooManyLeases: boolean;
    readonly isLeaseNotFound: boolean;
    readonly isUnknownRevenue: boolean;
    readonly isUnknownContribution: boolean;
    readonly isIncompleteAssignment: boolean;
    readonly isStillValid: boolean;
    readonly isNoHistory: boolean;
    readonly isUnknownReservation: boolean;
    readonly isUnknownRenewal: boolean;
    readonly isAlreadyExpired: boolean;
    readonly isInvalidConfig: boolean;
    readonly isNoClaimTimeslices: boolean;
    readonly isNoPermission: boolean;
    readonly isTooManyAutoRenewals: boolean;
    readonly isNonTaskAutoRenewal: boolean;
    readonly isSovereignAccountNotFound: boolean;
    readonly isAutoRenewalNotEnabled: boolean;
    readonly isAssignmentNotFound: boolean;
    readonly isCreditPurchaseTooSmall: boolean;
    readonly type: 'UnknownRegion' | 'NotOwner' | 'PivotTooLate' | 'PivotTooEarly' | 'ExteriorPivot' | 'VoidPivot' | 'CompletePivot' | 'CorruptWorkplan' | 'NoSales' | 'Overpriced' | 'Unavailable' | 'SoldOut' | 'WrongTime' | 'NotAllowed' | 'Uninitialized' | 'TooEarly' | 'NothingToDo' | 'TooManyReservations' | 'TooManyLeases' | 'LeaseNotFound' | 'UnknownRevenue' | 'UnknownContribution' | 'IncompleteAssignment' | 'StillValid' | 'NoHistory' | 'UnknownReservation' | 'UnknownRenewal' | 'AlreadyExpired' | 'InvalidConfig' | 'NoClaimTimeslices' | 'NoPermission' | 'TooManyAutoRenewals' | 'NonTaskAutoRenewal' | 'SovereignAccountNotFound' | 'AutoRenewalNotEnabled' | 'AssignmentNotFound' | 'CreditPurchaseTooSmall';
  }

  /** @name PalletAssetConversionOpsError (854) */
  interface PalletAssetConversionOpsError extends Enum {
    readonly isInvalidAssetPair: boolean;
    readonly isPoolNotFound: boolean;
    readonly isZeroBalance: boolean;
    readonly isPartialTransfer: boolean;
    readonly type: 'InvalidAssetPair' | 'PoolNotFound' | 'ZeroBalance' | 'PartialTransfer';
  }

  /** @name PalletReviveVmCodeInfo (855) */
  interface PalletReviveVmCodeInfo extends Struct {
    readonly owner: AccountId32;
    readonly deposit: Compact<u128>;
    readonly refcount: Compact<u64>;
    readonly codeLen: u32;
    readonly codeType: PalletReviveVmBytecodeType;
    readonly behaviourVersion: u32;
  }

  /** @name PalletReviveVmBytecodeType (856) */
  interface PalletReviveVmBytecodeType extends Enum {
    readonly isPvm: boolean;
    readonly isEvm: boolean;
    readonly type: 'Pvm' | 'Evm';
  }

  /** @name PalletReviveStorageAccountInfo (857) */
  interface PalletReviveStorageAccountInfo extends Struct {
    readonly accountType: PalletReviveStorageAccountType;
    readonly dust: u32;
  }

  /** @name PalletReviveStorageAccountType (858) */
  interface PalletReviveStorageAccountType extends Enum {
    readonly isContract: boolean;
    readonly asContract: PalletReviveStorageContractInfo;
    readonly isEoa: boolean;
    readonly type: 'Contract' | 'Eoa';
  }

  /** @name PalletReviveStorageContractInfo (859) */
  interface PalletReviveStorageContractInfo extends Struct {
    readonly trieId: Bytes;
    readonly codeHash: H256;
    readonly storageBytes: u32;
    readonly storageItems: u32;
    readonly storageByteDeposit: u128;
    readonly storageItemDeposit: u128;
    readonly storageBaseDeposit: u128;
    readonly immutableDataLen: u32;
  }

  /** @name PalletReviveStorageDeletionQueueItem (862) */
  interface PalletReviveStorageDeletionQueueItem extends Struct {
    readonly trieId: Bytes;
    readonly accountId: AccountId32;
  }

  /** @name PalletReviveStorageDeletionQueueManager (863) */
  interface PalletReviveStorageDeletionQueueManager extends Struct {
    readonly insertCounter: u32;
    readonly deleteCounter: u32;
  }

  /** @name PalletReviveEvmApiBlock (864) */
  interface PalletReviveEvmApiBlock extends Struct {
    readonly baseFeePerGas: U256;
    readonly blobGasUsed: U256;
    readonly difficulty: U256;
    readonly excessBlobGas: U256;
    readonly extraData: Bytes;
    readonly gasLimit: U256;
    readonly gasUsed: U256;
    readonly hash_: H256;
    readonly logsBloom: PalletReviveTypesCommonByteBytes256;
    readonly miner: H160;
    readonly mixHash: H256;
    readonly nonce: PalletReviveTypesCommonByteBytes8;
    readonly number: U256;
    readonly parentBeaconBlockRoot: Option<H256>;
    readonly parentHash: H256;
    readonly receiptsRoot: H256;
    readonly requestsHash: Option<H256>;
    readonly sha3Uncles: H256;
    readonly size_: U256;
    readonly stateRoot: H256;
    readonly timestamp: U256;
    readonly totalDifficulty: Option<U256>;
    readonly transactions: PalletReviveEvmApiTransactionHashesOrTransactionInfos;
    readonly transactionsRoot: H256;
    readonly uncles: Vec<H256>;
    readonly withdrawals: Vec<PalletReviveEvmApiBlockWithdrawal>;
    readonly withdrawalsRoot: H256;
  }

  /** @name PalletReviveTypesCommonByteBytes256 (866) */
  interface PalletReviveTypesCommonByteBytes256 extends U8aFixed {}

  /** @name PalletReviveTypesCommonByteBytes8 (868) */
  interface PalletReviveTypesCommonByteBytes8 extends U8aFixed {}

  /** @name PalletReviveEvmApiTransactionHashesOrTransactionInfos (871) */
  interface PalletReviveEvmApiTransactionHashesOrTransactionInfos extends Enum {
    readonly isHashes: boolean;
    readonly asHashes: Vec<H256>;
    readonly isTransactionInfos: boolean;
    readonly asTransactionInfos: Vec<PalletReviveEvmApiTransactionTransactionInfo>;
    readonly type: 'Hashes' | 'TransactionInfos';
  }

  /** @name PalletReviveEvmApiTransactionTransactionInfo (873) */
  interface PalletReviveEvmApiTransactionTransactionInfo extends Struct {
    readonly blockHash: H256;
    readonly blockNumber: U256;
    readonly from: H160;
    readonly hash_: H256;
    readonly transactionIndex: U256;
    readonly transactionSigned: PalletReviveEvmApiTransactionTransactionSigned;
  }

  /** @name PalletReviveEvmApiTransactionTransactionSigned (874) */
  interface PalletReviveEvmApiTransactionTransactionSigned extends Enum {
    readonly isTransaction7702Signed: boolean;
    readonly asTransaction7702Signed: PalletReviveEvmApiTransactionTransaction7702Signed;
    readonly isTransaction4844Signed: boolean;
    readonly asTransaction4844Signed: PalletReviveEvmApiTransactionTransaction4844Signed;
    readonly isTransaction1559Signed: boolean;
    readonly asTransaction1559Signed: PalletReviveEvmApiTransactionTransaction1559Signed;
    readonly isTransaction2930Signed: boolean;
    readonly asTransaction2930Signed: PalletReviveEvmApiTransactionTransaction2930Signed;
    readonly isTransactionLegacySigned: boolean;
    readonly asTransactionLegacySigned: PalletReviveEvmApiTransactionTransactionLegacySigned;
    readonly type: 'Transaction7702Signed' | 'Transaction4844Signed' | 'Transaction1559Signed' | 'Transaction2930Signed' | 'TransactionLegacySigned';
  }

  /** @name PalletReviveEvmApiTransactionTransaction7702Signed (875) */
  interface PalletReviveEvmApiTransactionTransaction7702Signed extends Struct {
    readonly transaction7702Unsigned: PalletReviveEvmApiTransactionTransaction7702Unsigned;
    readonly r: U256;
    readonly s: U256;
    readonly v: Option<U256>;
    readonly yParity: U256;
  }

  /** @name PalletReviveEvmApiTransactionTransaction7702Unsigned (876) */
  interface PalletReviveEvmApiTransactionTransaction7702Unsigned extends Struct {
    readonly accessList: Vec<PalletReviveEvmApiTransactionAccessListEntry>;
    readonly authorizationList: Vec<PalletReviveEvmApiTransactionAuthorizationListEntry>;
    readonly chainId: U256;
    readonly gas: U256;
    readonly input: Bytes;
    readonly maxFeePerGas: U256;
    readonly maxPriorityFeePerGas: U256;
    readonly nonce: U256;
    readonly to: H160;
    readonly r_type: u8;
    readonly value: U256;
  }

  /** @name PalletReviveEvmApiTransactionAccessListEntry (878) */
  interface PalletReviveEvmApiTransactionAccessListEntry extends Struct {
    readonly address: H160;
    readonly storageKeys: Vec<H256>;
  }

  /** @name PalletReviveEvmApiTransactionAuthorizationListEntry (880) */
  interface PalletReviveEvmApiTransactionAuthorizationListEntry extends Struct {
    readonly chainId: U256;
    readonly address: H160;
    readonly nonce: U256;
    readonly yParity: U256;
    readonly r: U256;
    readonly s: U256;
  }

  /** @name PalletReviveEvmApiTransactionTransaction4844Signed (881) */
  interface PalletReviveEvmApiTransactionTransaction4844Signed extends Struct {
    readonly transaction4844Unsigned: PalletReviveEvmApiTransactionTransaction4844Unsigned;
    readonly r: U256;
    readonly s: U256;
    readonly yParity: U256;
  }

  /** @name PalletReviveEvmApiTransactionTransaction4844Unsigned (882) */
  interface PalletReviveEvmApiTransactionTransaction4844Unsigned extends Struct {
    readonly accessList: Vec<PalletReviveEvmApiTransactionAccessListEntry>;
    readonly blobVersionedHashes: Vec<H256>;
    readonly chainId: U256;
    readonly gas: U256;
    readonly input: Bytes;
    readonly maxFeePerBlobGas: U256;
    readonly maxFeePerGas: U256;
    readonly maxPriorityFeePerGas: U256;
    readonly nonce: U256;
    readonly to: H160;
    readonly r_type: u8;
    readonly value: U256;
  }

  /** @name PalletReviveEvmApiTransactionTransaction1559Signed (883) */
  interface PalletReviveEvmApiTransactionTransaction1559Signed extends Struct {
    readonly transaction1559Unsigned: PalletReviveEvmApiTransactionTransaction1559Unsigned;
    readonly r: U256;
    readonly s: U256;
    readonly v: Option<U256>;
    readonly yParity: U256;
  }

  /** @name PalletReviveEvmApiTransactionTransaction1559Unsigned (884) */
  interface PalletReviveEvmApiTransactionTransaction1559Unsigned extends Struct {
    readonly accessList: Vec<PalletReviveEvmApiTransactionAccessListEntry>;
    readonly chainId: U256;
    readonly gas: U256;
    readonly gasPrice: U256;
    readonly input: Bytes;
    readonly maxFeePerGas: U256;
    readonly maxPriorityFeePerGas: U256;
    readonly nonce: U256;
    readonly to: Option<H160>;
    readonly r_type: u8;
    readonly value: U256;
  }

  /** @name PalletReviveEvmApiTransactionTransaction2930Signed (886) */
  interface PalletReviveEvmApiTransactionTransaction2930Signed extends Struct {
    readonly transaction2930Unsigned: PalletReviveEvmApiTransactionTransaction2930Unsigned;
    readonly r: U256;
    readonly s: U256;
    readonly v: Option<U256>;
    readonly yParity: U256;
  }

  /** @name PalletReviveEvmApiTransactionTransaction2930Unsigned (887) */
  interface PalletReviveEvmApiTransactionTransaction2930Unsigned extends Struct {
    readonly accessList: Vec<PalletReviveEvmApiTransactionAccessListEntry>;
    readonly chainId: U256;
    readonly gas: U256;
    readonly gasPrice: U256;
    readonly input: Bytes;
    readonly nonce: U256;
    readonly to: Option<H160>;
    readonly r_type: u8;
    readonly value: U256;
  }

  /** @name PalletReviveEvmApiTransactionTransactionLegacySigned (888) */
  interface PalletReviveEvmApiTransactionTransactionLegacySigned extends Struct {
    readonly transactionLegacyUnsigned: PalletReviveEvmApiTransactionTransactionLegacyUnsigned;
    readonly r: U256;
    readonly s: U256;
    readonly v: U256;
  }

  /** @name PalletReviveEvmApiTransactionTransactionLegacyUnsigned (889) */
  interface PalletReviveEvmApiTransactionTransactionLegacyUnsigned extends Struct {
    readonly chainId: Option<U256>;
    readonly gas: U256;
    readonly gasPrice: U256;
    readonly input: Bytes;
    readonly nonce: U256;
    readonly to: Option<H160>;
    readonly r_type: u8;
    readonly value: U256;
  }

  /** @name PalletReviveEvmApiBlockWithdrawal (891) */
  interface PalletReviveEvmApiBlockWithdrawal extends Struct {
    readonly address: H160;
    readonly amount: U256;
    readonly index: U256;
    readonly validatorIndex: U256;
  }

  /** @name PalletReviveEvmBlockHashReceiptGasInfo (893) */
  interface PalletReviveEvmBlockHashReceiptGasInfo extends Struct {
    readonly gasUsed: U256;
    readonly effectiveGasPrice: U256;
  }

  /** @name PalletReviveEvmBlockHashBlockBuilderEthereumBlockBuilderIR (894) */
  interface PalletReviveEvmBlockHashBlockBuilderEthereumBlockBuilderIR extends Struct {
    readonly transactionRootBuilder: PalletReviveEvmBlockHashHashBuilderIncrementalHashBuilderIR;
    readonly receiptsRootBuilder: PalletReviveEvmBlockHashHashBuilderIncrementalHashBuilderIR;
    readonly baseFeePerGas: U256;
    readonly blockGasLimit: U256;
    readonly gasUsed: U256;
    readonly logsBloom: U8aFixed;
    readonly txHashes: Vec<H256>;
    readonly gasInfo: Vec<PalletReviveEvmBlockHashReceiptGasInfo>;
  }

  /** @name PalletReviveEvmBlockHashHashBuilderIncrementalHashBuilderIR (895) */
  interface PalletReviveEvmBlockHashHashBuilderIncrementalHashBuilderIR extends Struct {
    readonly key: Bytes;
    readonly valueType: u8;
    readonly builderValue: Bytes;
    readonly stack: Vec<Bytes>;
    readonly stateMasks: Vec<u16>;
    readonly treeMasks: Vec<u16>;
    readonly hashMasks: Vec<u16>;
    readonly storedInDatabase: bool;
    readonly rlpBuf: Bytes;
    readonly index: u64;
  }

  /** @name PalletReviveDebugDebugSettings (897) */
  interface PalletReviveDebugDebugSettings extends Struct {
    readonly allowUnlimitedContractSize: bool;
    readonly bypassEip3607: bool;
    readonly pvmLogs: bool;
    readonly disableExecutionTracing: bool;
  }

  /** @name PalletReviveError (898) */
  interface PalletReviveError extends Enum {
    readonly isInvalidSchedule: boolean;
    readonly isInvalidCallFlags: boolean;
    readonly isOutOfGas: boolean;
    readonly isTransferFailed: boolean;
    readonly isMaxCallDepthReached: boolean;
    readonly isContractNotFound: boolean;
    readonly isCodeNotFound: boolean;
    readonly isCodeInfoNotFound: boolean;
    readonly isOutOfBounds: boolean;
    readonly isDecodingFailed: boolean;
    readonly isContractTrapped: boolean;
    readonly isValueTooLarge: boolean;
    readonly isTerminatedWhileReentrant: boolean;
    readonly isInputForwarded: boolean;
    readonly isTooManyTopics: boolean;
    readonly isDuplicateContract: boolean;
    readonly isTerminatedInConstructor: boolean;
    readonly isReentranceDenied: boolean;
    readonly isReenteredPallet: boolean;
    readonly isStateChangeDenied: boolean;
    readonly isStorageDepositNotEnoughFunds: boolean;
    readonly isStorageDepositLimitExhausted: boolean;
    readonly isCodeInUse: boolean;
    readonly isContractReverted: boolean;
    readonly isCodeRejected: boolean;
    readonly isBlobTooLarge: boolean;
    readonly isStaticMemoryTooLarge: boolean;
    readonly isBasicBlockTooLarge: boolean;
    readonly isInvalidInstruction: boolean;
    readonly isMaxDelegateDependenciesReached: boolean;
    readonly isDelegateDependencyNotFound: boolean;
    readonly isDelegateDependencyAlreadyExists: boolean;
    readonly isCannotAddSelfAsDelegateDependency: boolean;
    readonly isOutOfTransientStorage: boolean;
    readonly isInvalidSyscall: boolean;
    readonly isInvalidStorageFlags: boolean;
    readonly isExecutionFailed: boolean;
    readonly isBalanceConversionFailed: boolean;
    readonly isInvalidImmutableAccess: boolean;
    readonly isAccountUnmapped: boolean;
    readonly isAccountAlreadyMapped: boolean;
    readonly isInvalidGenericTransaction: boolean;
    readonly isRefcountOverOrUnderflow: boolean;
    readonly isUnsupportedPrecompileAddress: boolean;
    readonly isCallDataTooLarge: boolean;
    readonly isReturnDataTooLarge: boolean;
    readonly isInvalidJump: boolean;
    readonly isStackUnderflow: boolean;
    readonly isStackOverflow: boolean;
    readonly isTxFeeOverdraw: boolean;
    readonly isEvmConstructorNonEmptyData: boolean;
    readonly isEvmConstructedFromHash: boolean;
    readonly isStorageRefundNotEnoughFunds: boolean;
    readonly isStorageRefundLocked: boolean;
    readonly isPrecompileDelegateDenied: boolean;
    readonly isEcdsaRecoveryFailed: boolean;
    readonly isAutoMappingEnabled: boolean;
    readonly isPendingDepositCleanup: boolean;
    readonly type: 'InvalidSchedule' | 'InvalidCallFlags' | 'OutOfGas' | 'TransferFailed' | 'MaxCallDepthReached' | 'ContractNotFound' | 'CodeNotFound' | 'CodeInfoNotFound' | 'OutOfBounds' | 'DecodingFailed' | 'ContractTrapped' | 'ValueTooLarge' | 'TerminatedWhileReentrant' | 'InputForwarded' | 'TooManyTopics' | 'DuplicateContract' | 'TerminatedInConstructor' | 'ReentranceDenied' | 'ReenteredPallet' | 'StateChangeDenied' | 'StorageDepositNotEnoughFunds' | 'StorageDepositLimitExhausted' | 'CodeInUse' | 'ContractReverted' | 'CodeRejected' | 'BlobTooLarge' | 'StaticMemoryTooLarge' | 'BasicBlockTooLarge' | 'InvalidInstruction' | 'MaxDelegateDependenciesReached' | 'DelegateDependencyNotFound' | 'DelegateDependencyAlreadyExists' | 'CannotAddSelfAsDelegateDependency' | 'OutOfTransientStorage' | 'InvalidSyscall' | 'InvalidStorageFlags' | 'ExecutionFailed' | 'BalanceConversionFailed' | 'InvalidImmutableAccess' | 'AccountUnmapped' | 'AccountAlreadyMapped' | 'InvalidGenericTransaction' | 'RefcountOverOrUnderflow' | 'UnsupportedPrecompileAddress' | 'CallDataTooLarge' | 'ReturnDataTooLarge' | 'InvalidJump' | 'StackUnderflow' | 'StackOverflow' | 'TxFeeOverdraw' | 'EvmConstructorNonEmptyData' | 'EvmConstructedFromHash' | 'StorageRefundNotEnoughFunds' | 'StorageRefundLocked' | 'PrecompileDelegateDenied' | 'EcdsaRecoveryFailed' | 'AutoMappingEnabled' | 'PendingDepositCleanup';
  }

  /** @name PalletDelegatedStakingDelegation (899) */
  interface PalletDelegatedStakingDelegation extends Struct {
    readonly agent: AccountId32;
    readonly amount: u128;
  }

  /** @name PalletDelegatedStakingAgentLedger (900) */
  interface PalletDelegatedStakingAgentLedger extends Struct {
    readonly payee: AccountId32;
    readonly totalDelegated: Compact<u128>;
    readonly unclaimedWithdrawals: Compact<u128>;
    readonly pendingSlash: Compact<u128>;
  }

  /** @name PalletDelegatedStakingError (901) */
  interface PalletDelegatedStakingError extends Enum {
    readonly isNotAllowed: boolean;
    readonly isAlreadyStaking: boolean;
    readonly isInvalidRewardDestination: boolean;
    readonly isInvalidDelegation: boolean;
    readonly isNotEnoughFunds: boolean;
    readonly isNotAgent: boolean;
    readonly isNotDelegator: boolean;
    readonly isBadState: boolean;
    readonly isUnappliedSlash: boolean;
    readonly isNothingToSlash: boolean;
    readonly isWithdrawFailed: boolean;
    readonly isNotSupported: boolean;
    readonly type: 'NotAllowed' | 'AlreadyStaking' | 'InvalidRewardDestination' | 'InvalidDelegation' | 'NotEnoughFunds' | 'NotAgent' | 'NotDelegator' | 'BadState' | 'UnappliedSlash' | 'NothingToSlash' | 'WithdrawFailed' | 'NotSupported';
  }

  /** @name PalletAssetsFreezerError (902) */
  interface PalletAssetsFreezerError extends Enum {
    readonly isTooManyFreezes: boolean;
    readonly type: 'TooManyFreezes';
  }

  /** @name PalletOracleTimestampedValue (903) */
  interface PalletOracleTimestampedValue extends Struct {
    readonly value: u128;
    readonly timestamp: u64;
  }

  /** @name PalletOracleError (905) */
  interface PalletOracleError extends Enum {
    readonly isNoPermission: boolean;
    readonly isAlreadyFeeded: boolean;
    readonly isExceedsMaxHasDispatchedSize: boolean;
    readonly type: 'NoPermission' | 'AlreadyFeeded' | 'ExceedsMaxHasDispatchedSize';
  }

  /** @name PalletMetaTxError (909) */
  interface PalletMetaTxError extends Enum {
    readonly isBadProof: boolean;
    readonly isFuture: boolean;
    readonly isStale: boolean;
    readonly isAncientBirthBlock: boolean;
    readonly isUnknownOrigin: boolean;
    readonly isInvalid: boolean;
    readonly isInvalidLength: boolean;
    readonly type: 'BadProof' | 'Future' | 'Stale' | 'AncientBirthBlock' | 'UnknownOrigin' | 'Invalid' | 'InvalidLength';
  }

  /** @name PalletMultiAssetBountiesBounty (910) */
  interface PalletMultiAssetBountiesBounty extends Struct {
    readonly assetKind: FrameSupportTokensFungibleUnionOfNativeOrWithId;
    readonly value: u128;
    readonly metadata: H256;
    readonly status: PalletMultiAssetBountiesBountyStatus;
  }

  /** @name PalletMultiAssetBountiesBountyStatus (911) */
  interface PalletMultiAssetBountiesBountyStatus extends Enum {
    readonly isFundingAttempted: boolean;
    readonly asFundingAttempted: {
      readonly curator: AccountId32;
      readonly paymentStatus: PalletMultiAssetBountiesPaymentState;
    } & Struct;
    readonly isFunded: boolean;
    readonly asFunded: {
      readonly curator: AccountId32;
    } & Struct;
    readonly isCuratorUnassigned: boolean;
    readonly isActive: boolean;
    readonly asActive: {
      readonly curator: AccountId32;
    } & Struct;
    readonly isRefundAttempted: boolean;
    readonly asRefundAttempted: {
      readonly curator: Option<AccountId32>;
      readonly paymentStatus: PalletMultiAssetBountiesPaymentState;
    } & Struct;
    readonly isPayoutAttempted: boolean;
    readonly asPayoutAttempted: {
      readonly curator: AccountId32;
      readonly beneficiary: AccountId32;
      readonly paymentStatus: PalletMultiAssetBountiesPaymentState;
    } & Struct;
    readonly type: 'FundingAttempted' | 'Funded' | 'CuratorUnassigned' | 'Active' | 'RefundAttempted' | 'PayoutAttempted';
  }

  /** @name PalletMultiAssetBountiesPaymentState (912) */
  interface PalletMultiAssetBountiesPaymentState extends Enum {
    readonly isPending: boolean;
    readonly isAttempted: boolean;
    readonly asAttempted: {
      readonly id: Null;
    } & Struct;
    readonly isFailed: boolean;
    readonly isSucceeded: boolean;
    readonly type: 'Pending' | 'Attempted' | 'Failed' | 'Succeeded';
  }

  /** @name PalletMultiAssetBountiesChildBounty (913) */
  interface PalletMultiAssetBountiesChildBounty extends Struct {
    readonly parentBounty: u32;
    readonly value: u128;
    readonly metadata: H256;
    readonly status: PalletMultiAssetBountiesBountyStatus;
  }

  /** @name PalletMultiAssetBountiesError (916) */
  interface PalletMultiAssetBountiesError extends Enum {
    readonly isInvalidIndex: boolean;
    readonly isReasonTooBig: boolean;
    readonly isInvalidValue: boolean;
    readonly isFailedToConvertBalance: boolean;
    readonly isUnexpectedStatus: boolean;
    readonly isRequireCurator: boolean;
    readonly isInsufficientPermission: boolean;
    readonly isFundingError: boolean;
    readonly isRefundError: boolean;
    readonly isPayoutError: boolean;
    readonly isFundingInconclusive: boolean;
    readonly isRefundInconclusive: boolean;
    readonly isPayoutInconclusive: boolean;
    readonly isFailedToConvertSource: boolean;
    readonly isHasActiveChildBounty: boolean;
    readonly isTooManyChildBounties: boolean;
    readonly isInsufficientBountyValue: boolean;
    readonly isPreimageNotExist: boolean;
    readonly type: 'InvalidIndex' | 'ReasonTooBig' | 'InvalidValue' | 'FailedToConvertBalance' | 'UnexpectedStatus' | 'RequireCurator' | 'InsufficientPermission' | 'FundingError' | 'RefundError' | 'PayoutError' | 'FundingInconclusive' | 'RefundInconclusive' | 'PayoutInconclusive' | 'FailedToConvertSource' | 'HasActiveChildBounty' | 'TooManyChildBounties' | 'InsufficientBountyValue' | 'PreimageNotExist';
  }

  /** @name PalletAssetsPrecompilesPermitPalletError (918) */
  interface PalletAssetsPrecompilesPermitPalletError extends Enum {
    readonly isInvalidSignature: boolean;
    readonly isSignerMismatch: boolean;
    readonly isPermitExpired: boolean;
    readonly isSignatureSValueTooHigh: boolean;
    readonly isInvalidVValue: boolean;
    readonly isNonceOverflow: boolean;
    readonly isInvalidOwner: boolean;
    readonly isInvalidSpender: boolean;
    readonly type: 'InvalidSignature' | 'SignerMismatch' | 'PermitExpired' | 'SignatureSValueTooHigh' | 'InvalidVValue' | 'NonceOverflow' | 'InvalidOwner' | 'InvalidSpender';
  }

  /** @name PalletRegistrarParaParaInfo (919) */
  interface PalletRegistrarParaParaInfo extends Struct {
    readonly manager: AccountId32;
    readonly reservation: u128;
    readonly state: PalletRegistrarParaRegistrationState;
  }

  /** @name PalletRegistrarParaRegistrationState (922) */
  interface PalletRegistrarParaRegistrationState extends Enum {
    readonly isReserved: boolean;
    readonly isPending: boolean;
    readonly asPending: {
      readonly ticket: u128;
      readonly cancellableAt: u32;
    } & Struct;
    readonly isRegistered: boolean;
    readonly asRegistered: {
      readonly ticket: u128;
    } & Struct;
    readonly type: 'Reserved' | 'Pending' | 'Registered';
  }

  /** @name PalletRegistrarParaError (923) */
  interface PalletRegistrarParaError extends Enum {
    readonly isNotReserved: boolean;
    readonly isNotOwner: boolean;
    readonly isAlreadyRegistered: boolean;
    readonly isNotPending: boolean;
    readonly isCannotCancelYet: boolean;
    readonly isHeadDataTooLarge: boolean;
    readonly isCodeTooLarge: boolean;
    readonly isCodeTooSmall: boolean;
    readonly isSendFailed: boolean;
    readonly isNoFreeParaId: boolean;
    readonly type: 'NotReserved' | 'NotOwner' | 'AlreadyRegistered' | 'NotPending' | 'CannotCancelYet' | 'HeadDataTooLarge' | 'CodeTooLarge' | 'CodeTooSmall' | 'SendFailed' | 'NoFreeParaId';
  }

  /** @name PalletRegistrarRelayPendingRegistration (924) */
  interface PalletRegistrarRelayPendingRegistration extends Struct {
    readonly messageId: u64;
    readonly manager: AccountId32;
    readonly genesisHead: Bytes;
    readonly codeHash: H256;
    readonly codeLen: u32;
  }

  /** @name PalletRegistrarRelayError (926) */
  interface PalletRegistrarRelayError extends Enum {
    readonly isNothingPending: boolean;
    readonly isCodeHashMismatch: boolean;
    readonly isCodeLenMismatch: boolean;
    readonly isCodeTooLarge: boolean;
    readonly isUnexpectedMessage: boolean;
    readonly type: 'NothingPending' | 'CodeHashMismatch' | 'CodeLenMismatch' | 'CodeTooLarge' | 'UnexpectedMessage';
  }

  /** @name SpRuntimeBlockLazyBlock (927) */
  interface SpRuntimeBlockLazyBlock extends Struct {
    readonly header: SpRuntimeHeader;
    readonly extrinsics: Vec<Bytes>;
  }

  /** @name SpRuntimeExtrinsicInclusionMode (930) */
  interface SpRuntimeExtrinsicInclusionMode extends Enum {
    readonly isAllExtrinsics: boolean;
    readonly isOnlyInherents: boolean;
    readonly type: 'AllExtrinsics' | 'OnlyInherents';
  }

  /** @name FrameSupportViewFunctionsViewFunctionId (933) */
  interface FrameSupportViewFunctionsViewFunctionId extends Struct {
    readonly prefix: U8aFixed;
    readonly suffix: U8aFixed;
  }

  /** @name FrameSupportViewFunctionsViewFunctionDispatchError (935) */
  interface FrameSupportViewFunctionsViewFunctionDispatchError extends Enum {
    readonly isNotImplemented: boolean;
    readonly isNotFound: boolean;
    readonly asNotFound: FrameSupportViewFunctionsViewFunctionId;
    readonly isCodec: boolean;
    readonly type: 'NotImplemented' | 'NotFound' | 'Codec';
  }

  /** @name SpRuntimeTransactionValidityTransactionValidityError (937) */
  interface SpRuntimeTransactionValidityTransactionValidityError extends Enum {
    readonly isInvalid: boolean;
    readonly asInvalid: SpRuntimeTransactionValidityInvalidTransaction;
    readonly isUnknown: boolean;
    readonly asUnknown: SpRuntimeTransactionValidityUnknownTransaction;
    readonly type: 'Invalid' | 'Unknown';
  }

  /** @name SpRuntimeTransactionValidityInvalidTransaction (938) */
  interface SpRuntimeTransactionValidityInvalidTransaction extends Enum {
    readonly isCall: boolean;
    readonly isPayment: boolean;
    readonly isFuture: boolean;
    readonly isStale: boolean;
    readonly isBadProof: boolean;
    readonly isAncientBirthBlock: boolean;
    readonly isExhaustsResources: boolean;
    readonly isCustom: boolean;
    readonly asCustom: u8;
    readonly isBadMandatory: boolean;
    readonly isMandatoryValidation: boolean;
    readonly isBadSigner: boolean;
    readonly isIndeterminateImplicit: boolean;
    readonly isUnknownOrigin: boolean;
    readonly type: 'Call' | 'Payment' | 'Future' | 'Stale' | 'BadProof' | 'AncientBirthBlock' | 'ExhaustsResources' | 'Custom' | 'BadMandatory' | 'MandatoryValidation' | 'BadSigner' | 'IndeterminateImplicit' | 'UnknownOrigin';
  }

  /** @name SpRuntimeTransactionValidityUnknownTransaction (939) */
  interface SpRuntimeTransactionValidityUnknownTransaction extends Enum {
    readonly isCannotLookup: boolean;
    readonly isNoUnsignedValidator: boolean;
    readonly isCustom: boolean;
    readonly asCustom: u8;
    readonly type: 'CannotLookup' | 'NoUnsignedValidator' | 'Custom';
  }

  /** @name SpInherentsInherentData (940) */
  interface SpInherentsInherentData extends Struct {
    readonly data: BTreeMap<U8aFixed, Bytes>;
  }

  /** @name SpInherentsCheckInherentsResult (944) */
  interface SpInherentsCheckInherentsResult extends Struct {
    readonly okay: bool;
    readonly fatalError: bool;
    readonly errors: SpInherentsInherentData;
  }

  /** @name SpRuntimeTransactionValidityTransactionSource (945) */
  interface SpRuntimeTransactionValidityTransactionSource extends Enum {
    readonly isInBlock: boolean;
    readonly isLocal: boolean;
    readonly isExternal: boolean;
    readonly type: 'InBlock' | 'Local' | 'External';
  }

  /** @name SpRuntimeTransactionValidityValidTransaction (947) */
  interface SpRuntimeTransactionValidityValidTransaction extends Struct {
    readonly priority: u64;
    readonly requires: Vec<Bytes>;
    readonly provides: Vec<Bytes>;
    readonly longevity: u64;
    readonly propagate: bool;
  }

  /** @name SpConsensusBabeBabeConfiguration (950) */
  interface SpConsensusBabeBabeConfiguration extends Struct {
    readonly slotDuration: u64;
    readonly epochLength: u64;
    readonly c: ITuple<[u64, u64]>;
    readonly authorities: Vec<ITuple<[SpConsensusBabeAppPublic, u64]>>;
    readonly randomness: U8aFixed;
    readonly allowedSlots: SpConsensusBabeAllowedSlots;
  }

  /** @name SpConsensusBabeEpoch (951) */
  interface SpConsensusBabeEpoch extends Struct {
    readonly epochIndex: u64;
    readonly startSlot: u64;
    readonly duration: u64;
    readonly authorities: Vec<ITuple<[SpConsensusBabeAppPublic, u64]>>;
    readonly randomness: U8aFixed;
    readonly config: SpConsensusBabeBabeEpochConfiguration;
  }

  /** @name PalletContractsPrimitivesExecReturnValue (958) */
  interface PalletContractsPrimitivesExecReturnValue extends Struct {
    readonly flags: PalletContractsUapiFlagsReturnFlags;
    readonly data: Bytes;
  }

  /** @name PalletContractsUapiFlagsReturnFlags (959) */
  interface PalletContractsUapiFlagsReturnFlags extends Struct {
    readonly bits: u32;
  }

  /** @name PalletContractsPrimitivesStorageDeposit (960) */
  interface PalletContractsPrimitivesStorageDeposit extends Enum {
    readonly isRefund: boolean;
    readonly asRefund: u128;
    readonly isCharge: boolean;
    readonly asCharge: u128;
    readonly type: 'Refund' | 'Charge';
  }

  /** @name PalletContractsPrimitivesCode (963) */
  interface PalletContractsPrimitivesCode extends Enum {
    readonly isUpload: boolean;
    readonly asUpload: Bytes;
    readonly isExisting: boolean;
    readonly asExisting: H256;
    readonly type: 'Upload' | 'Existing';
  }

  /** @name PalletContractsPrimitivesContractResult (964) */
  interface PalletContractsPrimitivesContractResult extends Struct {
    readonly gasConsumed: SpWeightsWeightV2Weight;
    readonly gasRequired: SpWeightsWeightV2Weight;
    readonly storageDeposit: PalletContractsPrimitivesStorageDeposit;
    readonly debugMessage: Bytes;
    readonly result: Result<PalletContractsPrimitivesInstantiateReturnValue, SpRuntimeDispatchError>;
    readonly events: Option<Vec<FrameSystemEventRecord>>;
  }

  /** @name PalletContractsPrimitivesInstantiateReturnValue (966) */
  interface PalletContractsPrimitivesInstantiateReturnValue extends Struct {
    readonly result: PalletContractsPrimitivesExecReturnValue;
    readonly accountId: AccountId32;
  }

  /** @name PalletContractsPrimitivesCodeUploadReturnValue (968) */
  interface PalletContractsPrimitivesCodeUploadReturnValue extends Struct {
    readonly codeHash: H256;
    readonly deposit: u128;
  }

  /** @name PalletContractsPrimitivesContractAccessError (970) */
  interface PalletContractsPrimitivesContractAccessError extends Enum {
    readonly isDoesntExist: boolean;
    readonly isKeyDecodingFailed: boolean;
    readonly isMigrationInProgress: boolean;
    readonly type: 'DoesntExist' | 'KeyDecodingFailed' | 'MigrationInProgress';
  }

  /** @name PalletTransactionPaymentRuntimeDispatchInfo (971) */
  interface PalletTransactionPaymentRuntimeDispatchInfo extends Struct {
    readonly weight: SpWeightsWeightV2Weight;
    readonly class: FrameSupportDispatchDispatchClass;
    readonly partialFee: u128;
  }

  /** @name PalletTransactionPaymentFeeDetails (972) */
  interface PalletTransactionPaymentFeeDetails extends Struct {
    readonly inclusionFee: Option<PalletTransactionPaymentInclusionFee>;
    readonly tip: u128;
  }

  /** @name PalletTransactionPaymentInclusionFee (974) */
  interface PalletTransactionPaymentInclusionFee extends Struct {
    readonly baseFee: u128;
    readonly lenFee: u128;
    readonly adjustedWeightFee: u128;
  }

  /** @name SpConsensusBeefyValidatorSet (977) */
  interface SpConsensusBeefyValidatorSet extends Struct {
    readonly validators: Vec<SpConsensusBeefyEcdsaCryptoPublic>;
    readonly id: u64;
  }

  /** @name SpConsensusBeefyForkVotingProofOpaqueValue (978) */
  interface SpConsensusBeefyForkVotingProofOpaqueValue extends Struct {
    readonly vote: SpConsensusBeefyVoteMessage;
    readonly ancestryProof: Bytes;
    readonly header: SpRuntimeHeader;
  }

  /** @name SpMmrPrimitivesError (980) */
  interface SpMmrPrimitivesError extends Enum {
    readonly isInvalidNumericOp: boolean;
    readonly isPush: boolean;
    readonly isGetRoot: boolean;
    readonly isCommit: boolean;
    readonly isGenerateProof: boolean;
    readonly isVerify: boolean;
    readonly isLeafNotFound: boolean;
    readonly isPalletNotIncluded: boolean;
    readonly isInvalidLeafIndex: boolean;
    readonly isInvalidBestKnownBlock: boolean;
    readonly type: 'InvalidNumericOp' | 'Push' | 'GetRoot' | 'Commit' | 'GenerateProof' | 'Verify' | 'LeafNotFound' | 'PalletNotIncluded' | 'InvalidLeafIndex' | 'InvalidBestKnownBlock';
  }

  /** @name SpMmrPrimitivesLeafProof (986) */
  interface SpMmrPrimitivesLeafProof extends Struct {
    readonly leafIndices: Vec<u64>;
    readonly leafCount: u64;
    readonly items: Vec<H256>;
  }

  /** @name SpMixnetSessionStatus (989) */
  interface SpMixnetSessionStatus extends Struct {
    readonly currentIndex: u32;
    readonly phase: SpMixnetSessionPhase;
  }

  /** @name SpMixnetSessionPhase (990) */
  interface SpMixnetSessionPhase extends Enum {
    readonly isCoverToCurrent: boolean;
    readonly isRequestsToCurrent: boolean;
    readonly isCoverToPrev: boolean;
    readonly isDisconnectFromPrev: boolean;
    readonly type: 'CoverToCurrent' | 'RequestsToCurrent' | 'CoverToPrev' | 'DisconnectFromPrev';
  }

  /** @name SpMixnetMixnode (993) */
  interface SpMixnetMixnode extends Struct {
    readonly kxPublic: U8aFixed;
    readonly peerId: U8aFixed;
    readonly externalAddresses: Vec<Bytes>;
  }

  /** @name SpMixnetMixnodesErr (994) */
  interface SpMixnetMixnodesErr extends Enum {
    readonly isInsufficientRegistrations: boolean;
    readonly asInsufficientRegistrations: {
      readonly num: u32;
      readonly min: u32;
    } & Struct;
    readonly type: 'InsufficientRegistrations';
  }

  /** @name SpSessionRuntimeApiOpaqueGeneratedSessionKeys (995) */
  interface SpSessionRuntimeApiOpaqueGeneratedSessionKeys extends Struct {
    readonly keys_: Bytes;
    readonly proof: Bytes;
  }

  /** @name SpTransactionStorageProofIndexedTransactionInfo (1000) */
  interface SpTransactionStorageProofIndexedTransactionInfo extends Struct {
    readonly contentHash: U8aFixed;
    readonly size_: u32;
    readonly hashing: SpTransactionStorageProofHashingAlgorithm;
    readonly cidCodec: u64;
    readonly extrinsicIndex: u32;
  }

  /** @name SpTransactionStorageProofHashingAlgorithm (1001) */
  interface SpTransactionStorageProofHashingAlgorithm extends Enum {
    readonly isBlake2b256: boolean;
    readonly isSha2256: boolean;
    readonly isKeccak256: boolean;
    readonly type: 'Blake2b256' | 'Sha2256' | 'Keccak256';
  }

  /** @name PalletReviveTypesRuntimeApiTypesBlockBlockV1 (1005) */
  interface PalletReviveTypesRuntimeApiTypesBlockBlockV1 extends Struct {
    readonly baseFeePerGas: U256;
    readonly blobGasUsed: U256;
    readonly difficulty: U256;
    readonly excessBlobGas: U256;
    readonly extraData: Bytes;
    readonly gasLimit: U256;
    readonly gasUsed: U256;
    readonly hash_: H256;
    readonly logsBloom: PalletReviveTypesCommonByteBytes256;
    readonly miner: H160;
    readonly mixHash: H256;
    readonly nonce: PalletReviveTypesCommonByteBytes8;
    readonly number: U256;
    readonly parentBeaconBlockRoot: Option<H256>;
    readonly parentHash: H256;
    readonly receiptsRoot: H256;
    readonly requestsHash: Option<H256>;
    readonly sha3Uncles: H256;
    readonly size_: U256;
    readonly stateRoot: H256;
    readonly timestamp: U256;
    readonly totalDifficulty: Option<U256>;
    readonly transactions: PalletReviveTypesRuntimeApiTypesTransactionHashesOrTransactionInfosV1;
    readonly transactionsRoot: H256;
    readonly uncles: Vec<H256>;
    readonly withdrawals: Vec<PalletReviveTypesRuntimeApiTypesBlockWithdrawalV1>;
    readonly withdrawalsRoot: H256;
  }

  /** @name PalletReviveTypesRuntimeApiTypesTransactionHashesOrTransactionInfosV1 (1006) */
  interface PalletReviveTypesRuntimeApiTypesTransactionHashesOrTransactionInfosV1 extends Enum {
    readonly isHashes: boolean;
    readonly asHashes: Vec<H256>;
    readonly isTransactionInfos: boolean;
    readonly asTransactionInfos: Vec<PalletReviveTypesRuntimeApiTypesTransactionTransactionInfoV1>;
    readonly type: 'Hashes' | 'TransactionInfos';
  }

  /** @name PalletReviveTypesRuntimeApiTypesTransactionTransactionInfoV1 (1008) */
  interface PalletReviveTypesRuntimeApiTypesTransactionTransactionInfoV1 extends Struct {
    readonly blockHash: H256;
    readonly blockNumber: U256;
    readonly from: H160;
    readonly hash_: H256;
    readonly transactionIndex: U256;
    readonly transactionSigned: PalletReviveTypesRuntimeApiTypesTransactionTransactionSignedV1;
  }

  /** @name PalletReviveTypesRuntimeApiTypesTransactionTransactionSignedV1 (1009) */
  interface PalletReviveTypesRuntimeApiTypesTransactionTransactionSignedV1 extends Enum {
    readonly isTransaction7702Signed: boolean;
    readonly asTransaction7702Signed: PalletReviveTypesRuntimeApiTypesTransactionTransaction7702SignedV1;
    readonly isTransaction4844Signed: boolean;
    readonly asTransaction4844Signed: PalletReviveTypesRuntimeApiTypesTransactionTransaction4844SignedV1;
    readonly isTransaction1559Signed: boolean;
    readonly asTransaction1559Signed: PalletReviveTypesRuntimeApiTypesTransactionTransaction1559SignedV1;
    readonly isTransaction2930Signed: boolean;
    readonly asTransaction2930Signed: PalletReviveTypesRuntimeApiTypesTransactionTransaction2930SignedV1;
    readonly isTransactionLegacySigned: boolean;
    readonly asTransactionLegacySigned: PalletReviveTypesRuntimeApiTypesTransactionTransactionLegacySignedV1;
    readonly type: 'Transaction7702Signed' | 'Transaction4844Signed' | 'Transaction1559Signed' | 'Transaction2930Signed' | 'TransactionLegacySigned';
  }

  /** @name PalletReviveTypesRuntimeApiTypesTransactionTransaction7702SignedV1 (1010) */
  interface PalletReviveTypesRuntimeApiTypesTransactionTransaction7702SignedV1 extends Struct {
    readonly transaction7702Unsigned: PalletReviveTypesRuntimeApiTypesTransactionTransaction7702UnsignedV1;
    readonly r: U256;
    readonly s: U256;
    readonly v: Option<U256>;
    readonly yParity: U256;
  }

  /** @name PalletReviveTypesRuntimeApiTypesTransactionTransaction7702UnsignedV1 (1011) */
  interface PalletReviveTypesRuntimeApiTypesTransactionTransaction7702UnsignedV1 extends Struct {
    readonly accessList: Vec<PalletReviveTypesRuntimeApiTypesTransactionAccessListEntryV1>;
    readonly authorizationList: Vec<PalletReviveTypesRuntimeApiTypesTransactionAuthorizationListEntryV1>;
    readonly chainId: U256;
    readonly gas: U256;
    readonly input: Bytes;
    readonly maxFeePerGas: U256;
    readonly maxPriorityFeePerGas: U256;
    readonly nonce: U256;
    readonly to: H160;
    readonly r_type: u8;
    readonly value: U256;
  }

  /** @name PalletReviveTypesRuntimeApiTypesTransactionAccessListEntryV1 (1013) */
  interface PalletReviveTypesRuntimeApiTypesTransactionAccessListEntryV1 extends Struct {
    readonly address: H160;
    readonly storageKeys: Vec<H256>;
  }

  /** @name PalletReviveTypesRuntimeApiTypesTransactionAuthorizationListEntryV1 (1015) */
  interface PalletReviveTypesRuntimeApiTypesTransactionAuthorizationListEntryV1 extends Struct {
    readonly chainId: U256;
    readonly address: H160;
    readonly nonce: U256;
    readonly yParity: U256;
    readonly r: U256;
    readonly s: U256;
  }

  /** @name PalletReviveTypesRuntimeApiTypesTransactionTransaction4844SignedV1 (1016) */
  interface PalletReviveTypesRuntimeApiTypesTransactionTransaction4844SignedV1 extends Struct {
    readonly transaction4844Unsigned: PalletReviveTypesRuntimeApiTypesTransactionTransaction4844UnsignedV1;
    readonly r: U256;
    readonly s: U256;
    readonly yParity: U256;
  }

  /** @name PalletReviveTypesRuntimeApiTypesTransactionTransaction4844UnsignedV1 (1017) */
  interface PalletReviveTypesRuntimeApiTypesTransactionTransaction4844UnsignedV1 extends Struct {
    readonly accessList: Vec<PalletReviveTypesRuntimeApiTypesTransactionAccessListEntryV1>;
    readonly blobVersionedHashes: Vec<H256>;
    readonly chainId: U256;
    readonly gas: U256;
    readonly input: Bytes;
    readonly maxFeePerBlobGas: U256;
    readonly maxFeePerGas: U256;
    readonly maxPriorityFeePerGas: U256;
    readonly nonce: U256;
    readonly to: H160;
    readonly r_type: u8;
    readonly value: U256;
  }

  /** @name PalletReviveTypesRuntimeApiTypesTransactionTransaction1559SignedV1 (1018) */
  interface PalletReviveTypesRuntimeApiTypesTransactionTransaction1559SignedV1 extends Struct {
    readonly transaction1559Unsigned: PalletReviveTypesRuntimeApiTypesTransactionTransaction1559UnsignedV1;
    readonly r: U256;
    readonly s: U256;
    readonly v: Option<U256>;
    readonly yParity: U256;
  }

  /** @name PalletReviveTypesRuntimeApiTypesTransactionTransaction1559UnsignedV1 (1019) */
  interface PalletReviveTypesRuntimeApiTypesTransactionTransaction1559UnsignedV1 extends Struct {
    readonly accessList: Vec<PalletReviveTypesRuntimeApiTypesTransactionAccessListEntryV1>;
    readonly chainId: U256;
    readonly gas: U256;
    readonly gasPrice: U256;
    readonly input: Bytes;
    readonly maxFeePerGas: U256;
    readonly maxPriorityFeePerGas: U256;
    readonly nonce: U256;
    readonly to: Option<H160>;
    readonly r_type: u8;
    readonly value: U256;
  }

  /** @name PalletReviveTypesRuntimeApiTypesTransactionTransaction2930SignedV1 (1020) */
  interface PalletReviveTypesRuntimeApiTypesTransactionTransaction2930SignedV1 extends Struct {
    readonly transaction2930Unsigned: PalletReviveTypesRuntimeApiTypesTransactionTransaction2930UnsignedV1;
    readonly r: U256;
    readonly s: U256;
    readonly v: Option<U256>;
    readonly yParity: U256;
  }

  /** @name PalletReviveTypesRuntimeApiTypesTransactionTransaction2930UnsignedV1 (1021) */
  interface PalletReviveTypesRuntimeApiTypesTransactionTransaction2930UnsignedV1 extends Struct {
    readonly accessList: Vec<PalletReviveTypesRuntimeApiTypesTransactionAccessListEntryV1>;
    readonly chainId: U256;
    readonly gas: U256;
    readonly gasPrice: U256;
    readonly input: Bytes;
    readonly nonce: U256;
    readonly to: Option<H160>;
    readonly r_type: u8;
    readonly value: U256;
  }

  /** @name PalletReviveTypesRuntimeApiTypesTransactionTransactionLegacySignedV1 (1022) */
  interface PalletReviveTypesRuntimeApiTypesTransactionTransactionLegacySignedV1 extends Struct {
    readonly transactionLegacyUnsigned: PalletReviveTypesRuntimeApiTypesTransactionTransactionLegacyUnsignedV1;
    readonly r: U256;
    readonly s: U256;
    readonly v: U256;
  }

  /** @name PalletReviveTypesRuntimeApiTypesTransactionTransactionLegacyUnsignedV1 (1023) */
  interface PalletReviveTypesRuntimeApiTypesTransactionTransactionLegacyUnsignedV1 extends Struct {
    readonly chainId: Option<U256>;
    readonly gas: U256;
    readonly gasPrice: U256;
    readonly input: Bytes;
    readonly nonce: U256;
    readonly to: Option<H160>;
    readonly r_type: u8;
    readonly value: U256;
  }

  /** @name PalletReviveTypesRuntimeApiTypesBlockWithdrawalV1 (1025) */
  interface PalletReviveTypesRuntimeApiTypesBlockWithdrawalV1 extends Struct {
    readonly address: H160;
    readonly amount: U256;
    readonly index: U256;
    readonly validatorIndex: U256;
  }

  /** @name PalletReviveTypesRuntimeApiTypesReceiptReceiptGasInfoV1 (1027) */
  interface PalletReviveTypesRuntimeApiTypesReceiptReceiptGasInfoV1 extends Struct {
    readonly gasUsed: U256;
    readonly effectiveGasPrice: U256;
  }

  /** @name PalletReviveTypesRuntimeApiTypesContractContractResultV1ExecReturnValueV1 (1028) */
  interface PalletReviveTypesRuntimeApiTypesContractContractResultV1ExecReturnValueV1 extends Struct {
    readonly weightConsumed: SpWeightsWeightV2Weight;
    readonly weightRequired: SpWeightsWeightV2Weight;
    readonly storageDeposit: PalletReviveTypesRuntimeApiTypesContractStorageDepositV1;
    readonly maxStorageDeposit: PalletReviveTypesRuntimeApiTypesContractStorageDepositV1;
    readonly gasConsumed: u128;
    readonly result: Result<PalletReviveTypesRuntimeApiTypesContractExecReturnValueV1, SpRuntimeDispatchError>;
  }

  /** @name PalletReviveTypesRuntimeApiTypesContractExecReturnValueV1 (1029) */
  interface PalletReviveTypesRuntimeApiTypesContractExecReturnValueV1 extends Struct {
    readonly flags: PalletReviveUapiFlagsReturnFlags;
    readonly data: Bytes;
  }

  /** @name PalletReviveUapiFlagsReturnFlags (1030) */
  interface PalletReviveUapiFlagsReturnFlags extends Struct {
    readonly bits: u32;
  }

  /** @name PalletReviveTypesRuntimeApiTypesContractStorageDepositV1 (1031) */
  interface PalletReviveTypesRuntimeApiTypesContractStorageDepositV1 extends Enum {
    readonly isRefund: boolean;
    readonly asRefund: u128;
    readonly isCharge: boolean;
    readonly asCharge: u128;
    readonly type: 'Refund' | 'Charge';
  }

  /** @name PalletReviveTypesRuntimeApiTypesContractCodeV1 (1033) */
  interface PalletReviveTypesRuntimeApiTypesContractCodeV1 extends Enum {
    readonly isUpload: boolean;
    readonly asUpload: Bytes;
    readonly isExisting: boolean;
    readonly asExisting: H256;
    readonly type: 'Upload' | 'Existing';
  }

  /** @name PalletReviveTypesRuntimeApiTypesContractContractResultV1InstantiateReturnValueV1 (1034) */
  interface PalletReviveTypesRuntimeApiTypesContractContractResultV1InstantiateReturnValueV1 extends Struct {
    readonly weightConsumed: SpWeightsWeightV2Weight;
    readonly weightRequired: SpWeightsWeightV2Weight;
    readonly storageDeposit: PalletReviveTypesRuntimeApiTypesContractStorageDepositV1;
    readonly maxStorageDeposit: PalletReviveTypesRuntimeApiTypesContractStorageDepositV1;
    readonly gasConsumed: u128;
    readonly result: Result<PalletReviveTypesRuntimeApiTypesContractInstantiateReturnValueV1, SpRuntimeDispatchError>;
  }

  /** @name PalletReviveTypesRuntimeApiTypesContractInstantiateReturnValueV1 (1035) */
  interface PalletReviveTypesRuntimeApiTypesContractInstantiateReturnValueV1 extends Struct {
    readonly result: PalletReviveTypesRuntimeApiTypesContractExecReturnValueV1;
    readonly addr: H160;
  }

  /** @name PalletReviveTypesRuntimeApiTypesTransactionGenericTransactionV1 (1037) */
  interface PalletReviveTypesRuntimeApiTypesTransactionGenericTransactionV1 extends Struct {
    readonly accessList: Option<Vec<PalletReviveTypesRuntimeApiTypesTransactionAccessListEntryV1>>;
    readonly authorizationList: Vec<PalletReviveTypesRuntimeApiTypesTransactionAuthorizationListEntryV1>;
    readonly blobVersionedHashes: Vec<H256>;
    readonly blobs: Vec<Bytes>;
    readonly chainId: Option<U256>;
    readonly from: Option<H160>;
    readonly gas: Option<U256>;
    readonly gasPrice: Option<U256>;
    readonly input: PalletReviveTypesRuntimeApiTypesTransactionInputOrDataV1;
    readonly maxFeePerBlobGas: Option<U256>;
    readonly maxFeePerGas: Option<U256>;
    readonly maxPriorityFeePerGas: Option<U256>;
    readonly nonce: Option<U256>;
    readonly to: Option<H160>;
    readonly r_type: Option<u8>;
    readonly value: Option<U256>;
  }

  /** @name PalletReviveTypesRuntimeApiTypesTransactionInputOrDataV1 (1040) */
  interface PalletReviveTypesRuntimeApiTypesTransactionInputOrDataV1 extends Struct {
    readonly input: Option<Bytes>;
    readonly data: Option<Bytes>;
  }

  /** @name PalletReviveTypesRuntimeApiTypesDryRunEthTransactInfoV1 (1045) */
  interface PalletReviveTypesRuntimeApiTypesDryRunEthTransactInfoV1 extends Struct {
    readonly weightRequired: SpWeightsWeightV2Weight;
    readonly storageDeposit: u128;
    readonly maxStorageDeposit: u128;
    readonly ethGas: U256;
    readonly data: Bytes;
  }

  /** @name PalletRevivePrimitivesEthTransactError (1046) */
  interface PalletRevivePrimitivesEthTransactError extends Enum {
    readonly isData: boolean;
    readonly asData: Bytes;
    readonly isMessage: boolean;
    readonly asMessage: Text;
    readonly type: 'Data' | 'Message';
  }

  /** @name PalletReviveTypesRuntimeApiTypesDryRunDryRunConfigV1 (1047) */
  interface PalletReviveTypesRuntimeApiTypesDryRunDryRunConfigV1 extends Struct {
    readonly timestampOverride: Option<u64>;
    readonly performBalanceChecks: Option<bool>;
    readonly stateOverrides: Option<PalletReviveTypesRuntimeApiTypesStateOverridesStateOverrideSetV1>;
  }

  /** @name PalletReviveTypesRuntimeApiTypesStateOverridesStateOverrideSetV1 (1050) */
  interface PalletReviveTypesRuntimeApiTypesStateOverridesStateOverrideSetV1 extends BTreeMap<H160, PalletReviveTypesRuntimeApiTypesStateOverridesStateOverrideV1> {}

  /** @name PalletReviveTypesRuntimeApiTypesStateOverridesStateOverrideV1 (1052) */
  interface PalletReviveTypesRuntimeApiTypesStateOverridesStateOverrideV1 extends Struct {
    readonly balance: Option<U256>;
    readonly nonce: Option<U256>;
    readonly code: Option<Bytes>;
    readonly storage: Option<PalletReviveTypesRuntimeApiTypesStateOverridesStorageOverrideV1>;
    readonly movePrecompileToAddress: Option<H160>;
  }

  /** @name PalletReviveTypesRuntimeApiTypesStateOverridesStorageOverrideV1 (1054) */
  interface PalletReviveTypesRuntimeApiTypesStateOverridesStorageOverrideV1 extends Enum {
    readonly isState: boolean;
    readonly asState: BTreeMap<H256, H256>;
    readonly isStateDiff: boolean;
    readonly asStateDiff: BTreeMap<H256, H256>;
    readonly type: 'State' | 'StateDiff';
  }

  /** @name PalletReviveTypesRuntimeApiTypesUploadCodeUploadReturnValueV1 (1063) */
  interface PalletReviveTypesRuntimeApiTypesUploadCodeUploadReturnValueV1 extends Struct {
    readonly codeHash: H256;
    readonly deposit: u128;
  }

  /** @name PalletRevivePrimitivesContractAccessError (1065) */
  interface PalletRevivePrimitivesContractAccessError extends Enum {
    readonly isDoesntExist: boolean;
    readonly isKeyDecodingFailed: boolean;
    readonly isStorageWriteFailed: boolean;
    readonly asStorageWriteFailed: SpRuntimeDispatchError;
    readonly type: 'DoesntExist' | 'KeyDecodingFailed' | 'StorageWriteFailed';
  }

  /** @name PalletReviveTypesRuntimeApiTypesTracerTracerTypeV1 (1066) */
  interface PalletReviveTypesRuntimeApiTypesTracerTracerTypeV1 extends Enum {
    readonly isCallTracer: boolean;
    readonly asCallTracer: Option<PalletReviveTypesRuntimeApiTypesTracerCallTracerConfigV1>;
    readonly isPrestateTracer: boolean;
    readonly asPrestateTracer: Option<PalletReviveTypesRuntimeApiTypesTracerPrestateTracerConfigV1>;
    readonly isExecutionTracer: boolean;
    readonly asExecutionTracer: Option<PalletReviveTypesRuntimeApiTypesTracerExecutionTracerConfigV1>;
    readonly type: 'CallTracer' | 'PrestateTracer' | 'ExecutionTracer';
  }

  /** @name PalletReviveTypesRuntimeApiTypesTracerCallTracerConfigV1 (1068) */
  interface PalletReviveTypesRuntimeApiTypesTracerCallTracerConfigV1 extends Struct {
    readonly withLogs: bool;
    readonly onlyTopCall: bool;
  }

  /** @name PalletReviveTypesRuntimeApiTypesTracerPrestateTracerConfigV1 (1070) */
  interface PalletReviveTypesRuntimeApiTypesTracerPrestateTracerConfigV1 extends Struct {
    readonly diffMode: bool;
    readonly disableStorage: bool;
    readonly disableCode: bool;
  }

  /** @name PalletReviveTypesRuntimeApiTypesTracerExecutionTracerConfigV1 (1072) */
  interface PalletReviveTypesRuntimeApiTypesTracerExecutionTracerConfigV1 extends Struct {
    readonly enableMemory: bool;
    readonly disableStack: bool;
    readonly disableStorage: bool;
    readonly enableReturnData: bool;
    readonly disableSyscallDetails: bool;
    readonly limit: Option<u64>;
    readonly memoryWordLimit: u32;
  }

  /** @name PalletReviveTypesRuntimeApiTypesTracesTraceV1 (1075) */
  interface PalletReviveTypesRuntimeApiTypesTracesTraceV1 extends Enum {
    readonly isCall: boolean;
    readonly asCall: PalletReviveTypesRuntimeApiTypesTracesCallTraceV1;
    readonly isPrestate: boolean;
    readonly asPrestate: PalletReviveTypesRuntimeApiTypesTracesPrestateTraceV1;
    readonly isExecution: boolean;
    readonly asExecution: PalletReviveTypesRuntimeApiTypesTracesExecutionTraceV1;
    readonly type: 'Call' | 'Prestate' | 'Execution';
  }

  /** @name PalletReviveTypesRuntimeApiTypesTracesCallTraceV1 (1076) */
  interface PalletReviveTypesRuntimeApiTypesTracesCallTraceV1 extends Struct {
    readonly from: H160;
    readonly gas: u64;
    readonly gasUsed: u64;
    readonly to: H160;
    readonly input: Bytes;
    readonly output: Bytes;
    readonly error: Option<Text>;
    readonly revertReason: Option<Text>;
    readonly calls: Vec<PalletReviveTypesRuntimeApiTypesTracesCallTraceV1>;
    readonly logs: Vec<PalletReviveTypesRuntimeApiTypesTracesCallLogV1>;
    readonly value: Option<U256>;
    readonly callType: PalletReviveTypesRuntimeApiTypesTracesCallTypeV1;
    readonly childCallCount: u32;
  }

  /** @name PalletReviveTypesRuntimeApiTypesTracesCallLogV1 (1079) */
  interface PalletReviveTypesRuntimeApiTypesTracesCallLogV1 extends Struct {
    readonly address: H160;
    readonly topics: Vec<H256>;
    readonly data: Bytes;
    readonly position: u32;
  }

  /** @name PalletReviveTypesRuntimeApiTypesTracesCallTypeV1 (1080) */
  interface PalletReviveTypesRuntimeApiTypesTracesCallTypeV1 extends Enum {
    readonly isCall: boolean;
    readonly isStaticCall: boolean;
    readonly isDelegateCall: boolean;
    readonly isCreate: boolean;
    readonly isCreate2: boolean;
    readonly isSelfdestruct: boolean;
    readonly type: 'Call' | 'StaticCall' | 'DelegateCall' | 'Create' | 'Create2' | 'Selfdestruct';
  }

  /** @name PalletReviveTypesRuntimeApiTypesTracesPrestateTraceV1 (1081) */
  interface PalletReviveTypesRuntimeApiTypesTracesPrestateTraceV1 extends Enum {
    readonly isPrestate: boolean;
    readonly asPrestate: BTreeMap<H160, PalletReviveTypesRuntimeApiTypesTracesPrestateTraceInfoV1>;
    readonly isDiffMode: boolean;
    readonly asDiffMode: {
      readonly pre: BTreeMap<H160, PalletReviveTypesRuntimeApiTypesTracesPrestateTraceInfoV1>;
      readonly post: BTreeMap<H160, PalletReviveTypesRuntimeApiTypesTracesPrestateTraceInfoV1>;
    } & Struct;
    readonly type: 'Prestate' | 'DiffMode';
  }

  /** @name PalletReviveTypesRuntimeApiTypesTracesPrestateTraceInfoV1 (1083) */
  interface PalletReviveTypesRuntimeApiTypesTracesPrestateTraceInfoV1 extends Struct {
    readonly balance: Option<U256>;
    readonly nonce: Option<u32>;
    readonly code: Option<Bytes>;
    readonly storage: BTreeMap<Bytes, Option<Bytes>>;
  }

  /** @name PalletReviveTypesRuntimeApiTypesTracesExecutionTraceV1 (1089) */
  interface PalletReviveTypesRuntimeApiTypesTracesExecutionTraceV1 extends Struct {
    readonly gas: u64;
    readonly weightConsumed: SpWeightsWeightV2Weight;
    readonly baseCallWeight: SpWeightsWeightV2Weight;
    readonly failed: bool;
    readonly returnValue: Bytes;
    readonly structLogs: Vec<PalletReviveTypesRuntimeApiTypesTracesExecutionStepV1>;
  }

  /** @name PalletReviveTypesRuntimeApiTypesTracesExecutionStepV1 (1091) */
  interface PalletReviveTypesRuntimeApiTypesTracesExecutionStepV1 extends Struct {
    readonly gas: Compact<u64>;
    readonly gasCost: Compact<u64>;
    readonly weightCost: SpWeightsWeightV2Weight;
    readonly depth: u16;
    readonly returnData: Bytes;
    readonly error: Option<Text>;
    readonly kind: PalletReviveTypesRuntimeApiTypesTracesExecutionStepKindV1;
  }

  /** @name PalletReviveTypesRuntimeApiTypesTracesExecutionStepKindV1 (1092) */
  interface PalletReviveTypesRuntimeApiTypesTracesExecutionStepKindV1 extends Enum {
    readonly isEvmOpcode: boolean;
    readonly asEvmOpcode: {
      readonly pc: Compact<u32>;
      readonly op: u8;
      readonly stack: Vec<Bytes>;
      readonly memory: Vec<Bytes>;
      readonly storage: Option<BTreeMap<Bytes, Bytes>>;
    } & Struct;
    readonly isPvmSyscall: boolean;
    readonly asPvmSyscall: {
      readonly op: PalletReviveTypesRuntimeApiTypesTracesPolkavmSyscallV1;
      readonly args: Vec<u64>;
      readonly returned: Option<u64>;
    } & Struct;
    readonly type: 'EvmOpcode' | 'PvmSyscall';
  }

  /** @name PalletReviveTypesRuntimeApiTypesTracesPolkavmSyscallV1 (1098) */
  interface PalletReviveTypesRuntimeApiTypesTracesPolkavmSyscallV1 extends Enum {
    readonly isNoop: boolean;
    readonly isSetStorage: boolean;
    readonly isSetStorageOrClear: boolean;
    readonly isGetStorage: boolean;
    readonly isGetStorageOrZero: boolean;
    readonly isCall: boolean;
    readonly isCallEvm: boolean;
    readonly isDelegateCall: boolean;
    readonly isDelegateCallEvm: boolean;
    readonly isInstantiate: boolean;
    readonly isCallDataSize: boolean;
    readonly isCallDataCopy: boolean;
    readonly isCallDataLoad: boolean;
    readonly isSealReturn: boolean;
    readonly isCaller: boolean;
    readonly isOrigin: boolean;
    readonly isCodeHash: boolean;
    readonly isCodeSize: boolean;
    readonly isAddress: boolean;
    readonly isGetImmutableData: boolean;
    readonly isSetImmutableData: boolean;
    readonly isBalance: boolean;
    readonly isBalanceOf: boolean;
    readonly isChainId: boolean;
    readonly isGasLimit: boolean;
    readonly isValueTransferred: boolean;
    readonly isGasPrice: boolean;
    readonly isBaseFee: boolean;
    readonly isNow: boolean;
    readonly isDepositEvent: boolean;
    readonly isBlockNumber: boolean;
    readonly isBlockHash: boolean;
    readonly isBlockAuthor: boolean;
    readonly isHashKeccak256: boolean;
    readonly isReturnDataSize: boolean;
    readonly isReturnDataCopy: boolean;
    readonly isRefTimeLeft: boolean;
    readonly isConsumeAllGas: boolean;
    readonly isEcdsaToEthAddress: boolean;
    readonly isSr25519Verify: boolean;
    readonly isTerminate: boolean;
    readonly isPvmFuel: boolean;
    readonly type: 'Noop' | 'SetStorage' | 'SetStorageOrClear' | 'GetStorage' | 'GetStorageOrZero' | 'Call' | 'CallEvm' | 'DelegateCall' | 'DelegateCallEvm' | 'Instantiate' | 'CallDataSize' | 'CallDataCopy' | 'CallDataLoad' | 'SealReturn' | 'Caller' | 'Origin' | 'CodeHash' | 'CodeSize' | 'Address' | 'GetImmutableData' | 'SetImmutableData' | 'Balance' | 'BalanceOf' | 'ChainId' | 'GasLimit' | 'ValueTransferred' | 'GasPrice' | 'BaseFee' | 'Now' | 'DepositEvent' | 'BlockNumber' | 'BlockHash' | 'BlockAuthor' | 'HashKeccak256' | 'ReturnDataSize' | 'ReturnDataCopy' | 'RefTimeLeft' | 'ConsumeAllGas' | 'EcdsaToEthAddress' | 'Sr25519Verify' | 'Terminate' | 'PvmFuel';
  }

  /** @name PalletReviveTypesRuntimeApiTypesStateOverridesTracingConfigV1 (1101) */
  interface PalletReviveTypesRuntimeApiTypesStateOverridesTracingConfigV1 extends Struct {
    readonly stateOverrides: Option<PalletReviveTypesRuntimeApiTypesStateOverridesStateOverrideSetV1>;
  }

  /** @name PalletRevivePrimitivesBalanceConversionError (1104) */
  interface PalletRevivePrimitivesBalanceConversionError extends Enum {
    readonly isValue: boolean;
    readonly isDust: boolean;
    readonly type: 'Value' | 'Dust';
  }

  /** @name PalletReviveTypesRuntimeApiDeclarationReviveRuntimeApiVersionDeclarations (1105) */
  interface PalletReviveTypesRuntimeApiDeclarationReviveRuntimeApiVersionDeclarations extends BTreeMap<Text, u8> {}

  /** @name PalletReviveTypesRuntimeApiPayloadsEthBlockBlockVersionedInputPayload (1109) */
  interface PalletReviveTypesRuntimeApiPayloadsEthBlockBlockVersionedInputPayload extends Enum {
    readonly isV1: boolean;
    readonly type: 'V1';
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsEthBlockBlockInputPayloadV1 (1110) */
  type PalletReviveTypesRuntimeApiPayloadsEthBlockBlockInputPayloadV1 = Null;

  /** @name PalletReviveTypesRuntimeApiPayloadsEthBlockBlockVersionedOutputPayload (1111) */
  interface PalletReviveTypesRuntimeApiPayloadsEthBlockBlockVersionedOutputPayload extends Enum {
    readonly isV1: boolean;
    readonly asV1: PalletReviveTypesRuntimeApiPayloadsEthBlockBlockOutputPayloadV1;
    readonly type: 'V1';
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsEthBlockBlockOutputPayloadV1 (1112) */
  interface PalletReviveTypesRuntimeApiPayloadsEthBlockBlockOutputPayloadV1 extends Struct {
    readonly block: PalletReviveTypesRuntimeApiTypesBlockBlockV1;
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsBlockHashBlockHashVersionedInputPayload (1113) */
  interface PalletReviveTypesRuntimeApiPayloadsBlockHashBlockHashVersionedInputPayload extends Enum {
    readonly isV1: boolean;
    readonly asV1: PalletReviveTypesRuntimeApiPayloadsBlockHashBlockHashInputPayloadV1;
    readonly type: 'V1';
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsBlockHashBlockHashInputPayloadV1 (1114) */
  interface PalletReviveTypesRuntimeApiPayloadsBlockHashBlockHashInputPayloadV1 extends Struct {
    readonly blockNumber: U256;
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsBlockHashBlockHashVersionedOutputPayload (1115) */
  interface PalletReviveTypesRuntimeApiPayloadsBlockHashBlockHashVersionedOutputPayload extends Enum {
    readonly isV1: boolean;
    readonly asV1: PalletReviveTypesRuntimeApiPayloadsBlockHashBlockHashOutputPayloadV1;
    readonly type: 'V1';
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsBlockHashBlockHashOutputPayloadV1 (1116) */
  interface PalletReviveTypesRuntimeApiPayloadsBlockHashBlockHashOutputPayloadV1 extends Struct {
    readonly blockHash: Option<H256>;
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsReceiptDataReceiptDataVersionedInputPayload (1117) */
  interface PalletReviveTypesRuntimeApiPayloadsReceiptDataReceiptDataVersionedInputPayload extends Enum {
    readonly isV1: boolean;
    readonly type: 'V1';
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsReceiptDataReceiptDataInputPayloadV1 (1118) */
  type PalletReviveTypesRuntimeApiPayloadsReceiptDataReceiptDataInputPayloadV1 = Null;

  /** @name PalletReviveTypesRuntimeApiPayloadsReceiptDataReceiptDataVersionedOutputPayload (1119) */
  interface PalletReviveTypesRuntimeApiPayloadsReceiptDataReceiptDataVersionedOutputPayload extends Enum {
    readonly isV1: boolean;
    readonly asV1: PalletReviveTypesRuntimeApiPayloadsReceiptDataReceiptDataOutputPayloadV1;
    readonly type: 'V1';
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsReceiptDataReceiptDataOutputPayloadV1 (1120) */
  interface PalletReviveTypesRuntimeApiPayloadsReceiptDataReceiptDataOutputPayloadV1 extends Struct {
    readonly receiptData: Vec<PalletReviveTypesRuntimeApiTypesReceiptReceiptGasInfoV1>;
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsBlockGasLimitBlockGasLimitVersionedInputPayload (1121) */
  interface PalletReviveTypesRuntimeApiPayloadsBlockGasLimitBlockGasLimitVersionedInputPayload extends Enum {
    readonly isV1: boolean;
    readonly type: 'V1';
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsBlockGasLimitBlockGasLimitInputPayloadV1 (1122) */
  type PalletReviveTypesRuntimeApiPayloadsBlockGasLimitBlockGasLimitInputPayloadV1 = Null;

  /** @name PalletReviveTypesRuntimeApiPayloadsBlockGasLimitBlockGasLimitVersionedOutputPayload (1123) */
  interface PalletReviveTypesRuntimeApiPayloadsBlockGasLimitBlockGasLimitVersionedOutputPayload extends Enum {
    readonly isV1: boolean;
    readonly asV1: PalletReviveTypesRuntimeApiPayloadsBlockGasLimitBlockGasLimitOutputPayloadV1;
    readonly type: 'V1';
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsBlockGasLimitBlockGasLimitOutputPayloadV1 (1124) */
  interface PalletReviveTypesRuntimeApiPayloadsBlockGasLimitBlockGasLimitOutputPayloadV1 extends Struct {
    readonly blockGasLimit: U256;
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsMaxExtrinsicWeightInGasMaxExtrinsicWeightInGasVersionedInputPayload (1125) */
  interface PalletReviveTypesRuntimeApiPayloadsMaxExtrinsicWeightInGasMaxExtrinsicWeightInGasVersionedInputPayload extends Enum {
    readonly isV1: boolean;
    readonly type: 'V1';
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsMaxExtrinsicWeightInGasMaxExtrinsicWeightInGasInputPayloadV1 (1126) */
  type PalletReviveTypesRuntimeApiPayloadsMaxExtrinsicWeightInGasMaxExtrinsicWeightInGasInputPayloadV1 = Null;

  /** @name PalletReviveTypesRuntimeApiPayloadsMaxExtrinsicWeightInGasMaxExtrinsicWeightInGasVersionedOutputPayload (1127) */
  interface PalletReviveTypesRuntimeApiPayloadsMaxExtrinsicWeightInGasMaxExtrinsicWeightInGasVersionedOutputPayload extends Enum {
    readonly isV1: boolean;
    readonly asV1: PalletReviveTypesRuntimeApiPayloadsMaxExtrinsicWeightInGasMaxExtrinsicWeightInGasOutputPayloadV1;
    readonly type: 'V1';
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsMaxExtrinsicWeightInGasMaxExtrinsicWeightInGasOutputPayloadV1 (1128) */
  interface PalletReviveTypesRuntimeApiPayloadsMaxExtrinsicWeightInGasMaxExtrinsicWeightInGasOutputPayloadV1 extends Struct {
    readonly maxExtrinsicWeightInGas: U256;
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsBalanceBalanceVersionedInputPayload (1129) */
  interface PalletReviveTypesRuntimeApiPayloadsBalanceBalanceVersionedInputPayload extends Enum {
    readonly isV1: boolean;
    readonly asV1: PalletReviveTypesRuntimeApiPayloadsBalanceBalanceInputPayloadV1;
    readonly type: 'V1';
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsBalanceBalanceInputPayloadV1 (1130) */
  interface PalletReviveTypesRuntimeApiPayloadsBalanceBalanceInputPayloadV1 extends Struct {
    readonly address: H160;
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsBalanceBalanceVersionedOutputPayload (1131) */
  interface PalletReviveTypesRuntimeApiPayloadsBalanceBalanceVersionedOutputPayload extends Enum {
    readonly isV1: boolean;
    readonly asV1: PalletReviveTypesRuntimeApiPayloadsBalanceBalanceOutputPayloadV1;
    readonly type: 'V1';
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsBalanceBalanceOutputPayloadV1 (1132) */
  interface PalletReviveTypesRuntimeApiPayloadsBalanceBalanceOutputPayloadV1 extends Struct {
    readonly balance: U256;
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsGasPriceGasPriceVersionedInputPayload (1133) */
  interface PalletReviveTypesRuntimeApiPayloadsGasPriceGasPriceVersionedInputPayload extends Enum {
    readonly isV1: boolean;
    readonly type: 'V1';
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsGasPriceGasPriceInputPayloadV1 (1134) */
  type PalletReviveTypesRuntimeApiPayloadsGasPriceGasPriceInputPayloadV1 = Null;

  /** @name PalletReviveTypesRuntimeApiPayloadsGasPriceGasPriceVersionedOutputPayload (1135) */
  interface PalletReviveTypesRuntimeApiPayloadsGasPriceGasPriceVersionedOutputPayload extends Enum {
    readonly isV1: boolean;
    readonly asV1: PalletReviveTypesRuntimeApiPayloadsGasPriceGasPriceOutputPayloadV1;
    readonly type: 'V1';
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsGasPriceGasPriceOutputPayloadV1 (1136) */
  interface PalletReviveTypesRuntimeApiPayloadsGasPriceGasPriceOutputPayloadV1 extends Struct {
    readonly gasPrice: U256;
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsNonceNonceVersionedInputPayload (1137) */
  interface PalletReviveTypesRuntimeApiPayloadsNonceNonceVersionedInputPayload extends Enum {
    readonly isV1: boolean;
    readonly asV1: PalletReviveTypesRuntimeApiPayloadsNonceNonceInputPayloadV1;
    readonly type: 'V1';
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsNonceNonceInputPayloadV1 (1138) */
  interface PalletReviveTypesRuntimeApiPayloadsNonceNonceInputPayloadV1 extends Struct {
    readonly address: H160;
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsNonceNonceVersionedOutputPayload (1139) */
  interface PalletReviveTypesRuntimeApiPayloadsNonceNonceVersionedOutputPayload extends Enum {
    readonly isV1: boolean;
    readonly asV1: PalletReviveTypesRuntimeApiPayloadsNonceNonceOutputPayloadV1;
    readonly type: 'V1';
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsNonceNonceOutputPayloadV1 (1140) */
  interface PalletReviveTypesRuntimeApiPayloadsNonceNonceOutputPayloadV1 extends Struct {
    readonly nonce: u32;
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsCallCallVersionedInputPayload (1141) */
  interface PalletReviveTypesRuntimeApiPayloadsCallCallVersionedInputPayload extends Enum {
    readonly isV1: boolean;
    readonly asV1: PalletReviveTypesRuntimeApiPayloadsCallCallInputPayloadV1;
    readonly type: 'V1';
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsCallCallInputPayloadV1 (1142) */
  interface PalletReviveTypesRuntimeApiPayloadsCallCallInputPayloadV1 extends Struct {
    readonly origin: AccountId32;
    readonly dest: H160;
    readonly value: u128;
    readonly gasLimit: Option<SpWeightsWeightV2Weight>;
    readonly storageDepositLimit: Option<u128>;
    readonly inputData: Bytes;
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsCallCallVersionedOutputPayload (1143) */
  interface PalletReviveTypesRuntimeApiPayloadsCallCallVersionedOutputPayload extends Enum {
    readonly isV1: boolean;
    readonly asV1: PalletReviveTypesRuntimeApiPayloadsCallCallOutputPayloadV1;
    readonly type: 'V1';
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsCallCallOutputPayloadV1 (1144) */
  interface PalletReviveTypesRuntimeApiPayloadsCallCallOutputPayloadV1 extends Struct {
    readonly contractResult: PalletReviveTypesRuntimeApiTypesContractContractResultV1ExecReturnValueV1;
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsInstantiateInstantiateVersionedInputPayload (1145) */
  interface PalletReviveTypesRuntimeApiPayloadsInstantiateInstantiateVersionedInputPayload extends Enum {
    readonly isV1: boolean;
    readonly asV1: PalletReviveTypesRuntimeApiPayloadsInstantiateInstantiateInputPayloadV1;
    readonly type: 'V1';
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsInstantiateInstantiateInputPayloadV1 (1146) */
  interface PalletReviveTypesRuntimeApiPayloadsInstantiateInstantiateInputPayloadV1 extends Struct {
    readonly origin: AccountId32;
    readonly value: u128;
    readonly gasLimit: Option<SpWeightsWeightV2Weight>;
    readonly storageDepositLimit: Option<u128>;
    readonly code: PalletReviveTypesRuntimeApiTypesContractCodeV1;
    readonly data: Bytes;
    readonly salt: Option<U8aFixed>;
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsInstantiateInstantiateVersionedOutputPayload (1147) */
  interface PalletReviveTypesRuntimeApiPayloadsInstantiateInstantiateVersionedOutputPayload extends Enum {
    readonly isV1: boolean;
    readonly asV1: PalletReviveTypesRuntimeApiPayloadsInstantiateInstantiateOutputPayloadV1;
    readonly type: 'V1';
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsInstantiateInstantiateOutputPayloadV1 (1148) */
  interface PalletReviveTypesRuntimeApiPayloadsInstantiateInstantiateOutputPayloadV1 extends Struct {
    readonly contractResult: PalletReviveTypesRuntimeApiTypesContractContractResultV1InstantiateReturnValueV1;
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsEthTransactTransactVersionedInputPayload (1149) */
  interface PalletReviveTypesRuntimeApiPayloadsEthTransactTransactVersionedInputPayload extends Enum {
    readonly isV1: boolean;
    readonly asV1: PalletReviveTypesRuntimeApiPayloadsEthTransactTransactInputPayloadV1;
    readonly type: 'V1';
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsEthTransactTransactInputPayloadV1 (1150) */
  interface PalletReviveTypesRuntimeApiPayloadsEthTransactTransactInputPayloadV1 extends Struct {
    readonly tx: PalletReviveTypesRuntimeApiTypesTransactionGenericTransactionV1;
    readonly timestampOverride: Option<u64>;
    readonly performBalanceChecks: bool;
    readonly stateOverrides: Option<PalletReviveTypesRuntimeApiTypesStateOverridesStateOverrideSetV1>;
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsEthTransactTransactVersionedOutputPayload (1152) */
  interface PalletReviveTypesRuntimeApiPayloadsEthTransactTransactVersionedOutputPayload extends Enum {
    readonly isV1: boolean;
    readonly asV1: PalletReviveTypesRuntimeApiPayloadsEthTransactTransactOutputPayloadV1;
    readonly type: 'V1';
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsEthTransactTransactOutputPayloadV1 (1153) */
  interface PalletReviveTypesRuntimeApiPayloadsEthTransactTransactOutputPayloadV1 extends Struct {
    readonly transactInfo: PalletReviveTypesRuntimeApiTypesDryRunEthTransactInfoV1;
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsEthEstimateGasEstimateGasVersionedInputPayload (1154) */
  interface PalletReviveTypesRuntimeApiPayloadsEthEstimateGasEstimateGasVersionedInputPayload extends Enum {
    readonly isV1: boolean;
    readonly asV1: PalletReviveTypesRuntimeApiPayloadsEthEstimateGasEstimateGasInputPayloadV1;
    readonly type: 'V1';
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsEthEstimateGasEstimateGasInputPayloadV1 (1155) */
  interface PalletReviveTypesRuntimeApiPayloadsEthEstimateGasEstimateGasInputPayloadV1 extends Struct {
    readonly tx: PalletReviveTypesRuntimeApiTypesTransactionGenericTransactionV1;
    readonly timestampOverride: Option<u64>;
    readonly stateOverrides: Option<PalletReviveTypesRuntimeApiTypesStateOverridesStateOverrideSetV1>;
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsEthEstimateGasEstimateGasVersionedOutputPayload (1157) */
  interface PalletReviveTypesRuntimeApiPayloadsEthEstimateGasEstimateGasVersionedOutputPayload extends Enum {
    readonly isV1: boolean;
    readonly asV1: PalletReviveTypesRuntimeApiPayloadsEthEstimateGasEstimateGasOutputPayloadV1;
    readonly type: 'V1';
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsEthEstimateGasEstimateGasOutputPayloadV1 (1158) */
  interface PalletReviveTypesRuntimeApiPayloadsEthEstimateGasEstimateGasOutputPayloadV1 extends Struct {
    readonly gasEstimate: U256;
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsEthPreDispatchWeightPreDispatchWeightVersionedInputPayload (1159) */
  interface PalletReviveTypesRuntimeApiPayloadsEthPreDispatchWeightPreDispatchWeightVersionedInputPayload extends Enum {
    readonly isV1: boolean;
    readonly asV1: PalletReviveTypesRuntimeApiPayloadsEthPreDispatchWeightPreDispatchWeightInputPayloadV1;
    readonly type: 'V1';
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsEthPreDispatchWeightPreDispatchWeightInputPayloadV1 (1160) */
  interface PalletReviveTypesRuntimeApiPayloadsEthPreDispatchWeightPreDispatchWeightInputPayloadV1 extends Struct {
    readonly tx: Bytes;
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsEthPreDispatchWeightPreDispatchWeightVersionedOutputPayload (1162) */
  interface PalletReviveTypesRuntimeApiPayloadsEthPreDispatchWeightPreDispatchWeightVersionedOutputPayload extends Enum {
    readonly isV1: boolean;
    readonly asV1: PalletReviveTypesRuntimeApiPayloadsEthPreDispatchWeightPreDispatchWeightOutputPayloadV1;
    readonly type: 'V1';
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsEthPreDispatchWeightPreDispatchWeightOutputPayloadV1 (1163) */
  interface PalletReviveTypesRuntimeApiPayloadsEthPreDispatchWeightPreDispatchWeightOutputPayloadV1 extends Struct {
    readonly weight: SpWeightsWeightV2Weight;
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsUploadCodeUploadCodeVersionedInputPayload (1164) */
  interface PalletReviveTypesRuntimeApiPayloadsUploadCodeUploadCodeVersionedInputPayload extends Enum {
    readonly isV1: boolean;
    readonly asV1: PalletReviveTypesRuntimeApiPayloadsUploadCodeUploadCodeInputPayloadV1;
    readonly type: 'V1';
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsUploadCodeUploadCodeInputPayloadV1 (1165) */
  interface PalletReviveTypesRuntimeApiPayloadsUploadCodeUploadCodeInputPayloadV1 extends Struct {
    readonly origin: AccountId32;
    readonly code: Bytes;
    readonly storageDepositLimit: Option<u128>;
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsUploadCodeUploadCodeVersionedOutputPayload (1167) */
  interface PalletReviveTypesRuntimeApiPayloadsUploadCodeUploadCodeVersionedOutputPayload extends Enum {
    readonly isV1: boolean;
    readonly asV1: PalletReviveTypesRuntimeApiPayloadsUploadCodeUploadCodeOutputPayloadV1;
    readonly type: 'V1';
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsUploadCodeUploadCodeOutputPayloadV1 (1168) */
  interface PalletReviveTypesRuntimeApiPayloadsUploadCodeUploadCodeOutputPayloadV1 extends Struct {
    readonly codeUploadReturnValue: PalletReviveTypesRuntimeApiTypesUploadCodeUploadReturnValueV1;
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsGetStorageGetStorageVersionedInputPayload (1169) */
  interface PalletReviveTypesRuntimeApiPayloadsGetStorageGetStorageVersionedInputPayload extends Enum {
    readonly isV1: boolean;
    readonly asV1: PalletReviveTypesRuntimeApiPayloadsGetStorageGetStorageInputPayloadV1;
    readonly type: 'V1';
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsGetStorageGetStorageInputPayloadV1 (1170) */
  interface PalletReviveTypesRuntimeApiPayloadsGetStorageGetStorageInputPayloadV1 extends Struct {
    readonly address: H160;
    readonly key: PalletReviveTypesRuntimeApiTypesStorageStorageKeyV1;
  }

  /** @name PalletReviveTypesRuntimeApiTypesStorageStorageKeyV1 (1171) */
  interface PalletReviveTypesRuntimeApiTypesStorageStorageKeyV1 extends Enum {
    readonly isFixed: boolean;
    readonly asFixed: U8aFixed;
    readonly isVariable: boolean;
    readonly asVariable: Bytes;
    readonly type: 'Fixed' | 'Variable';
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsGetStorageGetStorageVersionedOutputPayload (1173) */
  interface PalletReviveTypesRuntimeApiPayloadsGetStorageGetStorageVersionedOutputPayload extends Enum {
    readonly isV1: boolean;
    readonly asV1: PalletReviveTypesRuntimeApiPayloadsGetStorageGetStorageOutputPayloadV1;
    readonly type: 'V1';
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsGetStorageGetStorageOutputPayloadV1 (1174) */
  interface PalletReviveTypesRuntimeApiPayloadsGetStorageGetStorageOutputPayloadV1 extends Struct {
    readonly storage: Option<Bytes>;
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsRuntimePalletsAddressRuntimePalletsAddressVersionedInputPayload (1175) */
  interface PalletReviveTypesRuntimeApiPayloadsRuntimePalletsAddressRuntimePalletsAddressVersionedInputPayload extends Enum {
    readonly isV1: boolean;
    readonly type: 'V1';
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsRuntimePalletsAddressRuntimePalletsAddressInputPayloadV1 (1176) */
  type PalletReviveTypesRuntimeApiPayloadsRuntimePalletsAddressRuntimePalletsAddressInputPayloadV1 = Null;

  /** @name PalletReviveTypesRuntimeApiPayloadsRuntimePalletsAddressRuntimePalletsAddressVersionedOutputPayload (1177) */
  interface PalletReviveTypesRuntimeApiPayloadsRuntimePalletsAddressRuntimePalletsAddressVersionedOutputPayload extends Enum {
    readonly isV1: boolean;
    readonly asV1: PalletReviveTypesRuntimeApiPayloadsRuntimePalletsAddressRuntimePalletsAddressOutputPayloadV1;
    readonly type: 'V1';
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsRuntimePalletsAddressRuntimePalletsAddressOutputPayloadV1 (1178) */
  interface PalletReviveTypesRuntimeApiPayloadsRuntimePalletsAddressRuntimePalletsAddressOutputPayloadV1 extends Struct {
    readonly runtimePalletsAddress: H160;
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsCodeCodeVersionedInputPayload (1179) */
  interface PalletReviveTypesRuntimeApiPayloadsCodeCodeVersionedInputPayload extends Enum {
    readonly isV1: boolean;
    readonly asV1: PalletReviveTypesRuntimeApiPayloadsCodeCodeInputPayloadV1;
    readonly type: 'V1';
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsCodeCodeInputPayloadV1 (1180) */
  interface PalletReviveTypesRuntimeApiPayloadsCodeCodeInputPayloadV1 extends Struct {
    readonly address: H160;
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsCodeCodeVersionedOutputPayload (1181) */
  interface PalletReviveTypesRuntimeApiPayloadsCodeCodeVersionedOutputPayload extends Enum {
    readonly isV1: boolean;
    readonly asV1: PalletReviveTypesRuntimeApiPayloadsCodeCodeOutputPayloadV1;
    readonly type: 'V1';
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsCodeCodeOutputPayloadV1 (1182) */
  interface PalletReviveTypesRuntimeApiPayloadsCodeCodeOutputPayloadV1 extends Struct {
    readonly code: Bytes;
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsAccountIdAccountIdVersionedInputPayload (1183) */
  interface PalletReviveTypesRuntimeApiPayloadsAccountIdAccountIdVersionedInputPayload extends Enum {
    readonly isV1: boolean;
    readonly asV1: PalletReviveTypesRuntimeApiPayloadsAccountIdAccountIdInputPayloadV1;
    readonly type: 'V1';
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsAccountIdAccountIdInputPayloadV1 (1184) */
  interface PalletReviveTypesRuntimeApiPayloadsAccountIdAccountIdInputPayloadV1 extends Struct {
    readonly address: H160;
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsAccountIdAccountIdVersionedOutputPayload (1185) */
  interface PalletReviveTypesRuntimeApiPayloadsAccountIdAccountIdVersionedOutputPayload extends Enum {
    readonly isV1: boolean;
    readonly asV1: PalletReviveTypesRuntimeApiPayloadsAccountIdAccountIdOutputPayloadV1;
    readonly type: 'V1';
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsAccountIdAccountIdOutputPayloadV1 (1186) */
  interface PalletReviveTypesRuntimeApiPayloadsAccountIdAccountIdOutputPayloadV1 extends Struct {
    readonly accountId: AccountId32;
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsNewBalanceWithDustNewBalanceWithDustVersionedInputPayload (1187) */
  interface PalletReviveTypesRuntimeApiPayloadsNewBalanceWithDustNewBalanceWithDustVersionedInputPayload extends Enum {
    readonly isV1: boolean;
    readonly asV1: PalletReviveTypesRuntimeApiPayloadsNewBalanceWithDustNewBalanceWithDustInputPayloadV1;
    readonly type: 'V1';
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsNewBalanceWithDustNewBalanceWithDustInputPayloadV1 (1188) */
  interface PalletReviveTypesRuntimeApiPayloadsNewBalanceWithDustNewBalanceWithDustInputPayloadV1 extends Struct {
    readonly balance: U256;
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsNewBalanceWithDustNewBalanceWithDustVersionedOutputPayload (1190) */
  interface PalletReviveTypesRuntimeApiPayloadsNewBalanceWithDustNewBalanceWithDustVersionedOutputPayload extends Enum {
    readonly isV1: boolean;
    readonly asV1: PalletReviveTypesRuntimeApiPayloadsNewBalanceWithDustNewBalanceWithDustOutputPayloadV1;
    readonly type: 'V1';
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsNewBalanceWithDustNewBalanceWithDustOutputPayloadV1 (1191) */
  interface PalletReviveTypesRuntimeApiPayloadsNewBalanceWithDustNewBalanceWithDustOutputPayloadV1 extends Struct {
    readonly newBalance: u128;
    readonly dust: u32;
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsBlockAuthorBlockAuthorVersionedInputPayload (1192) */
  interface PalletReviveTypesRuntimeApiPayloadsBlockAuthorBlockAuthorVersionedInputPayload extends Enum {
    readonly isV1: boolean;
    readonly type: 'V1';
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsBlockAuthorBlockAuthorInputPayloadV1 (1193) */
  type PalletReviveTypesRuntimeApiPayloadsBlockAuthorBlockAuthorInputPayloadV1 = Null;

  /** @name PalletReviveTypesRuntimeApiPayloadsBlockAuthorBlockAuthorVersionedOutputPayload (1194) */
  interface PalletReviveTypesRuntimeApiPayloadsBlockAuthorBlockAuthorVersionedOutputPayload extends Enum {
    readonly isV1: boolean;
    readonly asV1: PalletReviveTypesRuntimeApiPayloadsBlockAuthorBlockAuthorOutputPayloadV1;
    readonly type: 'V1';
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsBlockAuthorBlockAuthorOutputPayloadV1 (1195) */
  interface PalletReviveTypesRuntimeApiPayloadsBlockAuthorBlockAuthorOutputPayloadV1 extends Struct {
    readonly blockAuthor: H160;
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsAddressAddressVersionedInputPayload (1196) */
  interface PalletReviveTypesRuntimeApiPayloadsAddressAddressVersionedInputPayload extends Enum {
    readonly isV1: boolean;
    readonly asV1: PalletReviveTypesRuntimeApiPayloadsAddressAddressInputPayloadV1;
    readonly type: 'V1';
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsAddressAddressInputPayloadV1 (1197) */
  interface PalletReviveTypesRuntimeApiPayloadsAddressAddressInputPayloadV1 extends Struct {
    readonly accountId: AccountId32;
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsAddressAddressVersionedOutputPayload (1198) */
  interface PalletReviveTypesRuntimeApiPayloadsAddressAddressVersionedOutputPayload extends Enum {
    readonly isV1: boolean;
    readonly asV1: PalletReviveTypesRuntimeApiPayloadsAddressAddressOutputPayloadV1;
    readonly type: 'V1';
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsAddressAddressOutputPayloadV1 (1199) */
  interface PalletReviveTypesRuntimeApiPayloadsAddressAddressOutputPayloadV1 extends Struct {
    readonly address: H160;
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsTraceBlockTraceBlockVersionedInputPayload (1200) */
  interface PalletReviveTypesRuntimeApiPayloadsTraceBlockTraceBlockVersionedInputPayload extends Enum {
    readonly isV1: boolean;
    readonly asV1: PalletReviveTypesRuntimeApiPayloadsTraceBlockTraceBlockInputPayloadV1;
    readonly isV2: boolean;
    readonly asV2: PalletReviveTypesRuntimeApiPayloadsTraceBlockTraceBlockInputPayloadV2;
    readonly type: 'V1' | 'V2';
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsTraceBlockTraceBlockInputPayloadV1 (1201) */
  interface PalletReviveTypesRuntimeApiPayloadsTraceBlockTraceBlockInputPayloadV1 extends Struct {
    readonly block: SpRuntimeBlock;
    readonly config: PalletReviveTypesRuntimeApiTypesTracerTracerTypeV1;
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsTraceBlockTraceBlockInputPayloadV2 (1202) */
  interface PalletReviveTypesRuntimeApiPayloadsTraceBlockTraceBlockInputPayloadV2 extends Struct {
    readonly block: SpRuntimeBlock;
    readonly config: PalletReviveTypesRuntimeApiTypesTracerTracerTypeV1;
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsTraceBlockTraceBlockVersionedOutputPayload (1203) */
  interface PalletReviveTypesRuntimeApiPayloadsTraceBlockTraceBlockVersionedOutputPayload extends Enum {
    readonly isV1: boolean;
    readonly asV1: PalletReviveTypesRuntimeApiPayloadsTraceBlockTraceBlockOutputPayloadV1;
    readonly isV2: boolean;
    readonly asV2: PalletReviveTypesRuntimeApiPayloadsTraceBlockTraceBlockOutputPayloadV2;
    readonly type: 'V1' | 'V2';
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsTraceBlockTraceBlockOutputPayloadV1 (1204) */
  interface PalletReviveTypesRuntimeApiPayloadsTraceBlockTraceBlockOutputPayloadV1 extends Struct {
    readonly traces: Vec<ITuple<[u32, PalletReviveTypesRuntimeApiTypesTracesTraceV1]>>;
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsTraceBlockTraceBlockOutputPayloadV2 (1205) */
  interface PalletReviveTypesRuntimeApiPayloadsTraceBlockTraceBlockOutputPayloadV2 extends Struct {
    readonly entries_: Vec<ITuple<[u32, PalletReviveTypesRuntimeApiTypesTracesTraceEntryV1]>>;
  }

  /** @name PalletReviveTypesRuntimeApiTypesTracesTraceEntryV1 (1208) */
  interface PalletReviveTypesRuntimeApiTypesTracesTraceEntryV1 extends Enum {
    readonly isTraced: boolean;
    readonly asTraced: PalletReviveTypesRuntimeApiTypesTracesTraceV2;
    readonly isNotTraced: boolean;
    readonly type: 'Traced' | 'NotTraced';
  }

  /** @name PalletReviveTypesRuntimeApiTypesTracesTraceV2 (1209) */
  interface PalletReviveTypesRuntimeApiTypesTracesTraceV2 extends Enum {
    readonly isCall: boolean;
    readonly asCall: PalletReviveTypesRuntimeApiTypesTracesCallTraceV2;
    readonly isPrestate: boolean;
    readonly asPrestate: PalletReviveTypesRuntimeApiTypesTracesPrestateTraceV1;
    readonly isExecution: boolean;
    readonly asExecution: PalletReviveTypesRuntimeApiTypesTracesExecutionTraceV1;
    readonly type: 'Call' | 'Prestate' | 'Execution';
  }

  /** @name PalletReviveTypesRuntimeApiTypesTracesCallTraceV2 (1210) */
  interface PalletReviveTypesRuntimeApiTypesTracesCallTraceV2 extends Struct {
    readonly from: H160;
    readonly gas: u64;
    readonly gasUsed: u64;
    readonly to: H160;
    readonly input: Bytes;
    readonly output: Bytes;
    readonly error: Option<Text>;
    readonly revertReason: Option<Text>;
    readonly calls: Vec<PalletReviveTypesRuntimeApiTypesTracesCallTraceV2>;
    readonly logs: Vec<PalletReviveTypesRuntimeApiTypesTracesCallLogV2>;
    readonly value: Option<U256>;
    readonly callType: PalletReviveTypesRuntimeApiTypesTracesCallTypeV1;
  }

  /** @name PalletReviveTypesRuntimeApiTypesTracesCallLogV2 (1213) */
  interface PalletReviveTypesRuntimeApiTypesTracesCallLogV2 extends Struct {
    readonly address: H160;
    readonly topics: Vec<H256>;
    readonly data: Bytes;
    readonly position: u32;
    readonly index: u32;
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsTraceTxTraceTxVersionedInputPayload (1214) */
  interface PalletReviveTypesRuntimeApiPayloadsTraceTxTraceTxVersionedInputPayload extends Enum {
    readonly isV1: boolean;
    readonly asV1: PalletReviveTypesRuntimeApiPayloadsTraceTxTraceTxInputPayloadV1;
    readonly isV2: boolean;
    readonly asV2: PalletReviveTypesRuntimeApiPayloadsTraceTxTraceTxInputPayloadV2;
    readonly type: 'V1' | 'V2';
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsTraceTxTraceTxInputPayloadV1 (1215) */
  interface PalletReviveTypesRuntimeApiPayloadsTraceTxTraceTxInputPayloadV1 extends Struct {
    readonly block: SpRuntimeBlock;
    readonly txIndex: u32;
    readonly config: PalletReviveTypesRuntimeApiTypesTracerTracerTypeV1;
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsTraceTxTraceTxInputPayloadV2 (1216) */
  interface PalletReviveTypesRuntimeApiPayloadsTraceTxTraceTxInputPayloadV2 extends Struct {
    readonly block: SpRuntimeBlock;
    readonly txIndex: u32;
    readonly config: PalletReviveTypesRuntimeApiTypesTracerTracerTypeV1;
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsTraceTxTraceTxVersionedOutputPayload (1217) */
  interface PalletReviveTypesRuntimeApiPayloadsTraceTxTraceTxVersionedOutputPayload extends Enum {
    readonly isV1: boolean;
    readonly asV1: PalletReviveTypesRuntimeApiPayloadsTraceTxTraceTxOutputPayloadV1;
    readonly isV2: boolean;
    readonly asV2: PalletReviveTypesRuntimeApiPayloadsTraceTxTraceTxOutputPayloadV2;
    readonly type: 'V1' | 'V2';
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsTraceTxTraceTxOutputPayloadV1 (1218) */
  interface PalletReviveTypesRuntimeApiPayloadsTraceTxTraceTxOutputPayloadV1 extends Struct {
    readonly trace: Option<PalletReviveTypesRuntimeApiTypesTracesTraceV1>;
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsTraceTxTraceTxOutputPayloadV2 (1219) */
  interface PalletReviveTypesRuntimeApiPayloadsTraceTxTraceTxOutputPayloadV2 extends Struct {
    readonly entry: Option<PalletReviveTypesRuntimeApiTypesTracesTraceEntryV1>;
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsTraceCallTraceCallVersionedInputPayload (1221) */
  interface PalletReviveTypesRuntimeApiPayloadsTraceCallTraceCallVersionedInputPayload extends Enum {
    readonly isV1: boolean;
    readonly asV1: PalletReviveTypesRuntimeApiPayloadsTraceCallTraceCallInputPayloadV1;
    readonly isV2: boolean;
    readonly asV2: PalletReviveTypesRuntimeApiPayloadsTraceCallTraceCallInputPayloadV2;
    readonly type: 'V1' | 'V2';
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsTraceCallTraceCallInputPayloadV1 (1222) */
  interface PalletReviveTypesRuntimeApiPayloadsTraceCallTraceCallInputPayloadV1 extends Struct {
    readonly tx: PalletReviveTypesRuntimeApiTypesTransactionGenericTransactionV1;
    readonly config: PalletReviveTypesRuntimeApiTypesTracerTracerTypeV1;
    readonly stateOverrides: Option<PalletReviveTypesRuntimeApiTypesStateOverridesStateOverrideSetV1>;
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsTraceCallTraceCallInputPayloadV2 (1223) */
  interface PalletReviveTypesRuntimeApiPayloadsTraceCallTraceCallInputPayloadV2 extends Struct {
    readonly tx: PalletReviveTypesRuntimeApiTypesTransactionGenericTransactionV1;
    readonly config: PalletReviveTypesRuntimeApiTypesTracerTracerTypeV1;
    readonly stateOverrides: Option<PalletReviveTypesRuntimeApiTypesStateOverridesStateOverrideSetV1>;
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsTraceCallTraceCallVersionedOutputPayload (1225) */
  interface PalletReviveTypesRuntimeApiPayloadsTraceCallTraceCallVersionedOutputPayload extends Enum {
    readonly isV1: boolean;
    readonly asV1: PalletReviveTypesRuntimeApiPayloadsTraceCallTraceCallOutputPayloadV1;
    readonly isV2: boolean;
    readonly asV2: PalletReviveTypesRuntimeApiPayloadsTraceCallTraceCallOutputPayloadV2;
    readonly type: 'V1' | 'V2';
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsTraceCallTraceCallOutputPayloadV1 (1226) */
  interface PalletReviveTypesRuntimeApiPayloadsTraceCallTraceCallOutputPayloadV1 extends Struct {
    readonly trace: PalletReviveTypesRuntimeApiTypesTracesTraceV1;
  }

  /** @name PalletReviveTypesRuntimeApiPayloadsTraceCallTraceCallOutputPayloadV2 (1227) */
  interface PalletReviveTypesRuntimeApiPayloadsTraceCallTraceCallOutputPayloadV2 extends Struct {
    readonly trace: PalletReviveTypesRuntimeApiTypesTracesTraceV2;
  }

  /** @name PortaldotV3RuntimeRuntimeError (1228) */
  interface PortaldotV3RuntimeRuntimeError extends Enum {
    readonly isSystem: boolean;
    readonly asSystem: FrameSystemError;
    readonly isUtility: boolean;
    readonly asUtility: PalletUtilityError;
    readonly isBabe: boolean;
    readonly asBabe: PalletBabeError;
    readonly isIndices: boolean;
    readonly asIndices: PalletIndicesError;
    readonly isBalances: boolean;
    readonly asBalances: PalletBalancesError;
    readonly isElectionProviderMultiPhase: boolean;
    readonly asElectionProviderMultiPhase: PalletElectionProviderMultiPhaseError;
    readonly isStaking: boolean;
    readonly asStaking: PalletStakingPalletError;
    readonly isSession: boolean;
    readonly asSession: PalletSessionError;
    readonly isTechnicalCommittee: boolean;
    readonly asTechnicalCommittee: PalletCollectiveError;
    readonly isTechnicalMembership: boolean;
    readonly asTechnicalMembership: PalletMembershipError;
    readonly isGrandpa: boolean;
    readonly asGrandpa: PalletGrandpaError;
    readonly isTreasury: boolean;
    readonly asTreasury: PalletTreasuryError;
    readonly isAssetRate: boolean;
    readonly asAssetRate: PalletAssetRateError;
    readonly isContracts: boolean;
    readonly asContracts: PalletContractsError;
    readonly isSudo: boolean;
    readonly asSudo: PalletSudoError;
    readonly isImOnline: boolean;
    readonly asImOnline: PalletImOnlineError;
    readonly isIdentity: boolean;
    readonly asIdentity: PalletIdentityError;
    readonly isRecovery: boolean;
    readonly asRecovery: PalletRecoveryError;
    readonly isVesting: boolean;
    readonly asVesting: PalletVestingError;
    readonly isScheduler: boolean;
    readonly asScheduler: PalletSchedulerError;
    readonly isPreimage: boolean;
    readonly asPreimage: PalletPreimageError;
    readonly isProxy: boolean;
    readonly asProxy: PalletProxyError;
    readonly isMultisig: boolean;
    readonly asMultisig: PalletMultisigError;
    readonly isBounties: boolean;
    readonly asBounties: PalletBountiesError;
    readonly isAssets: boolean;
    readonly asAssets: PalletAssetsError;
    readonly isPoolAssets: boolean;
    readonly asPoolAssets: PalletAssetsError;
    readonly isBeefy: boolean;
    readonly asBeefy: PalletBeefyError;
    readonly isLottery: boolean;
    readonly asLottery: PalletLotteryError;
    readonly isUniques: boolean;
    readonly asUniques: PalletUniquesError;
    readonly isNfts: boolean;
    readonly asNfts: PalletNftsError;
    readonly isNftFractionalization: boolean;
    readonly asNftFractionalization: PalletNftFractionalizationError;
    readonly isTransactionStorage: boolean;
    readonly asTransactionStorage: PalletTransactionStorageError;
    readonly isVoterList: boolean;
    readonly asVoterList: PalletBagsListError;
    readonly isChildBounties: boolean;
    readonly asChildBounties: PalletChildBountiesError;
    readonly isRemark: boolean;
    readonly asRemark: PalletRemarkError;
    readonly isNominationPools: boolean;
    readonly asNominationPools: PalletNominationPoolsError;
    readonly isAssetConversion: boolean;
    readonly asAssetConversion: PalletAssetConversionError;
    readonly isFastUnstake: boolean;
    readonly asFastUnstake: PalletFastUnstakeError;
    readonly isMessageQueue: boolean;
    readonly asMessageQueue: PalletMessageQueueError;
    readonly isTxPause: boolean;
    readonly asTxPause: PalletTxPauseError;
    readonly isSafeMode: boolean;
    readonly asSafeMode: PalletSafeModeError;
    readonly isMultiBlockMigrations: boolean;
    readonly asMultiBlockMigrations: PalletMigrationsError;
    readonly isBroker: boolean;
    readonly asBroker: PalletBrokerError;
    readonly isAssetConversionMigration: boolean;
    readonly asAssetConversionMigration: PalletAssetConversionOpsError;
    readonly isRevive: boolean;
    readonly asRevive: PalletReviveError;
    readonly isDelegatedStaking: boolean;
    readonly asDelegatedStaking: PalletDelegatedStakingError;
    readonly isAssetsFreezer: boolean;
    readonly asAssetsFreezer: PalletAssetsFreezerError;
    readonly isOracle: boolean;
    readonly asOracle: PalletOracleError;
    readonly isMetaTx: boolean;
    readonly asMetaTx: PalletMetaTxError;
    readonly isMultiAssetBounties: boolean;
    readonly asMultiAssetBounties: PalletMultiAssetBountiesError;
    readonly isAssetsPrecompilesPermit: boolean;
    readonly asAssetsPrecompilesPermit: PalletAssetsPrecompilesPermitPalletError;
    readonly isRegistrarPara: boolean;
    readonly asRegistrarPara: PalletRegistrarParaError;
    readonly isRegistrarRelay: boolean;
    readonly asRegistrarRelay: PalletRegistrarRelayError;
    readonly type: 'System' | 'Utility' | 'Babe' | 'Indices' | 'Balances' | 'ElectionProviderMultiPhase' | 'Staking' | 'Session' | 'TechnicalCommittee' | 'TechnicalMembership' | 'Grandpa' | 'Treasury' | 'AssetRate' | 'Contracts' | 'Sudo' | 'ImOnline' | 'Identity' | 'Recovery' | 'Vesting' | 'Scheduler' | 'Preimage' | 'Proxy' | 'Multisig' | 'Bounties' | 'Assets' | 'PoolAssets' | 'Beefy' | 'Lottery' | 'Uniques' | 'Nfts' | 'NftFractionalization' | 'TransactionStorage' | 'VoterList' | 'ChildBounties' | 'Remark' | 'NominationPools' | 'AssetConversion' | 'FastUnstake' | 'MessageQueue' | 'TxPause' | 'SafeMode' | 'MultiBlockMigrations' | 'Broker' | 'AssetConversionMigration' | 'Revive' | 'DelegatedStaking' | 'AssetsFreezer' | 'Oracle' | 'MetaTx' | 'MultiAssetBounties' | 'AssetsPrecompilesPermit' | 'RegistrarPara' | 'RegistrarRelay';
  }

} // declare module
