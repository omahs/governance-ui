import {
  Bank,
  MANGO_V4_ID,
  MangoClient,
  OracleProvider,
  USDC_MINT,
  toUiDecimals,
} from '@blockworks-foundation/mango-v4'
import AdvancedOptionsDropdown from '@components/NewRealmWizard/components/AdvancedOptionsDropdown'
import { AnchorProvider, BN, BorshInstructionCoder } from '@coral-xyz/anchor'
import { AccountMetaData } from '@solana/spl-governance'
import { Connection, Keypair, PublicKey } from '@solana/web3.js'
import EmptyWallet, {
  getSuggestedCoinTier,
  compareObjectsAndGetDifferentKeys,
  FlatListingArgs,
  ListingArgsFormatted,
  getOracle,
  getBestMarket,
  EditTokenArgsFormatted,
  FlatEditArgs,
  getFormattedListingPresets,
  decodePriceFromOracleAi,
  getFormattedBankValues,
} from '@utils/Mango/listingTools'
import { secondsToHours } from 'date-fns'
import WarningFilledIcon from '@carbon/icons-react/lib/WarningFilled'
import { CheckCircleIcon } from '@heroicons/react/solid'
import { Market } from '@project-serum/serum'
import tokenPriceService, {
  TokenInfoWithoutDecimals,
} from '@utils/services/tokenPrice'
import {
  LISTING_PRESETS,
  LISTING_PRESETS_KEYS,
  LISTING_PRESETS_PYTH,
  MidPriceImpact,
  coinTiersToNames,
  getMidPriceImpacts,
  getProposedTier,
} from '@blockworks-foundation/mango-v4-settings/lib/helpers/listingTools'
import { tryParseKey } from '@tools/validators/pubkey'
import Loading from '@components/Loading'
import queryClient from '@hooks/queries/queryClient'
// import { snakeCase } from 'snake-case'
// import { sha256 } from 'js-sha256'

//in case of mango discriminator is string sum of two first numbers in data array e.g `${data[0]}${data[1]}`
const instructions = () => ({
  12451: {
    name: 'Alt Extend',
    accounts: [
      { name: 'Group' },
      { name: 'Admin' },
      { name: 'Payer' },
      { name: 'Address Lookup Table' },
    ],
    getDataUI: async (
      connection: Connection,
      data: Uint8Array
      //accounts: AccountMetaData[]
    ) => {
      const info = await displayArgs(connection, data)
      try {
        return <div>{info}</div>
      } catch (e) {
        console.log(e)
        return <div>{JSON.stringify(data)}</div>
      }
    },
  },
  23568: {
    name: 'Alt Set',
    accounts: [
      { name: 'Group' },
      { name: 'Admin' },
      { name: 'Address Lookup Table' },
    ],
    getDataUI: async (
      connection: Connection,
      data: Uint8Array
      //accounts: AccountMetaData[]
    ) => {
      const info = await displayArgs(connection, data)
      try {
        return <div>{info}</div>
      } catch (e) {
        console.log(e)
        return <div>{JSON.stringify(data)}</div>
      }
    },
  },
  201177: {
    name: 'Ix Gate Set',
    accounts: [{ name: 'Group' }, { name: 'Admin' }],
    getDataUI: async (
      connection: Connection,
      data: Uint8Array
      //accounts: AccountMetaData[]
    ) => {
      const info = await displayArgs(connection, data)
      try {
        return <div>{info}</div>
      } catch (e) {
        console.log(e)
        return <div>{JSON.stringify(data)}</div>
      }
    },
  },
  124114: {
    name: 'Perp edit',
    accounts: [
      { name: 'Group' },
      { name: 'Admin' },
      { name: 'Perp Market' },
      { name: 'Oracle' },
    ],
    getDataUI: async (
      connection: Connection,
      data: Uint8Array
      //accounts: AccountMetaData[]
    ) => {
      const info = await displayArgs(connection, data)
      try {
        return <div>{info}</div>
      } catch (e) {
        console.log(e)
        return <div>{JSON.stringify(data)}</div>
      }
    },
  },
  109198: {
    name: 'Stub oracle set',
    accounts: [{ name: 'Group' }, { name: 'Admin' }, { name: 'Oracle' }],
    getDataUI: async (
      connection: Connection,
      data: Uint8Array
      //accounts: AccountMetaData[]
    ) => {
      const info = await displayArgs(connection, data)
      try {
        return <div>{info}</div>
      } catch (e) {
        console.log(e)
        return <div>{JSON.stringify(data)}</div>
      }
    },
  },
  16388: {
    name: 'Token add bank',
    accounts: [
      { name: 'Group' },
      { name: 'Admin' },
      { name: 'Mint' },
      { name: 'Existing Bank' },
      { name: 'Bank' },
      { name: 'Vault' },
      { name: 'Mint Info' },
      { name: 'Payer' },
    ],
    getDataUI: async (
      connection: Connection,
      data: Uint8Array
      //accounts: AccountMetaData[]
    ) => {
      const info = await displayArgs(connection, data)
      try {
        return <div>{info}</div>
      } catch (e) {
        console.log(e)
        return <div>{JSON.stringify(data)}</div>
      }
    },
  },
  888: {
    name: 'Edit Group',
    accounts: [{ name: 'Group' }, { name: 'Admin' }],
    getDataUI: async (
      connection: Connection,
      data: Uint8Array
      //accounts: AccountMetaData[]
    ) => {
      const info = await displayArgs(connection, data)
      try {
        return <div>{info}</div>
      } catch (e) {
        console.log(e)
        return <div>{JSON.stringify(data)}</div>
      }
    },
  },
  17263: {
    name: 'Create Stub Oracle',
    accounts: [
      { name: 'Group' },
      { name: 'Oracle' },
      { name: 'Admin' },
      { name: 'Mint' },
      { name: 'Payer' },
    ],
    getDataUI: async (
      connection: Connection,
      data: Uint8Array
      //accounts: AccountMetaData[]
    ) => {
      const info = await displayArgs(connection, data)
      try {
        return <div>{info}</div>
      } catch (e) {
        console.log(e)
        return <div>{JSON.stringify(data)}</div>
      }
    },
  },
  10928: {
    name: 'Register Token',
    accounts: [
      { name: 'Group' },
      { name: 'Admin' },
      { name: 'Mint' },
      { name: 'Bank' },
      { name: 'Vault' },
      { name: 'Mint Info' },
      { name: 'Oracle' },
      { name: 'Payer' },
    ],
    getDataUI: async (
      connection: Connection,
      data: Uint8Array,
      accounts: AccountMetaData[]
    ) => {
      const proposedMint = accounts[2].pubkey
      const oracle = accounts[6].pubkey
      const isMintOnCurve = PublicKey.isOnCurve(proposedMint)

      const [info, proposedOracle, args, oracleAi] = await Promise.all([
        displayArgs(connection, data),
        getOracle(connection, oracle),
        getDataObjectFlattened<FlatListingArgs>(connection, data),
        connection.getAccountInfo(oracle),
      ])

      const oracleData = await decodePriceFromOracleAi(
        oracleAi!,
        connection,
        proposedOracle.type
      )

      const liqudityTier = await getSuggestedCoinTier(
        proposedMint.toBase58(),
        proposedOracle.type === 'Pyth'
      )

      const formattedProposedArgs = getFormattedListingValues(args)
      const suggestedPreset = getFormattedListingPresets(
        proposedOracle.type === 'Pyth'
      )[liqudityTier.tier]
      const suggestedUntrusted = liqudityTier.tier === 'UNTRUSTED'

      const suggestedFormattedPreset: ListingArgsFormatted =
        Object.keys(suggestedPreset).length && !suggestedUntrusted
          ? getFormattedListingValues({
              tokenIndex: args.tokenIndex,
              name: args.name,
              oracle: args.oracle,
              ...suggestedPreset,
            })
          : ({} as ListingArgsFormatted)

      const invalidKeys: (keyof ListingArgsFormatted)[] = Object.keys(
        suggestedPreset
      ).length
        ? compareObjectsAndGetDifferentKeys<ListingArgsFormatted>(
            formattedProposedArgs,
            suggestedFormattedPreset
          )
        : []
      const invalidFields: Partial<ListingArgsFormatted> = invalidKeys.reduce(
        (obj, key) => {
          return {
            ...obj,
            [key]: suggestedFormattedPreset[key],
          }
        },
        {}
      )
      const DisplayListingPropertyWrapped = ({
        label,
        suggestedUntrusted,
        valKey,
        suffix,
        prefix: perfix,
      }: {
        label: string
        suggestedUntrusted: boolean
        valKey: string
        suffix?: string
        prefix?: string
      }) => {
        return (
          <DisplayListingProperty
            label={label}
            suggestedUntrusted={suggestedUntrusted}
            val={formattedProposedArgs[valKey]}
            suggestedVal={invalidFields[valKey]}
            suffix={suffix}
            prefix={perfix}
          />
        )
      }

      try {
        return (
          <div>
            <div className="pb-4 space-y-3">
              {suggestedUntrusted && (
                <>
                  <h3 className="text-orange flex items-center">
                    <WarningFilledIcon className="h-4 w-4 fill-current mr-2 flex-shrink-0" />
                    Suggested token tier: UNTRUSTED.
                  </h3>
                  <h3 className="text-orange flex">
                    Very low liquidity Price impact of{' '}
                    {liqudityTier.priceImpact}% on $1000 swap. This token should
                    probably be listed using the Register Trustless Token
                    instruction check params carefully
                  </h3>
                </>
              )}
              {!suggestedUntrusted && !invalidKeys.length && (
                <h3 className="text-green flex items-center">
                  <CheckCircleIcon className="h-4 w-4 fill-current mr-2 flex-shrink-0" />
                  Proposal params match suggested token tier -{' '}
                  {coinTiersToNames[liqudityTier.tier]}.
                </h3>
              )}
              {!suggestedUntrusted && invalidKeys.length > 0 && (
                <h3 className="text-orange flex items-center">
                  <WarningFilledIcon className="h-4 w-4 fill-current mr-2 flex-shrink-0" />
                  Proposal params do not match suggested token tier -{' '}
                  {coinTiersToNames[liqudityTier.tier]} check params carefully
                </h3>
              )}
              {isMintOnCurve && (
                <div className="text-orange pt-4">
                  Proposed token has open mint
                </div>
              )}
              <div
                className={`py-2 ${
                  proposedOracle.type === 'Unknown' ? 'text-red' : ''
                }`}
              >
                Oracle provider: {proposedOracle.type}{' '}
                {proposedOracle.url && (
                  <>
                    {' '}
                    -{' '}
                    <a
                      className="underline mr-2"
                      target="_blank"
                      href={proposedOracle.url}
                      rel="noreferrer"
                    >
                      Link
                    </a>
                  </>
                )}
              </div>
              {oracleData.uiPrice ? (
                <div className="py-4 space-y-2">
                  <div>Oracle Price: ${oracleData.uiPrice}</div>
                  <div>
                    Oracle Last known confidence: {oracleData.deviation}%
                  </div>
                </div>
              ) : (
                <div className="py-4">No Oracle Data</div>
              )}
              <div className="py-4">
                <div className="flex mb-2">
                  <div className="w-3 h-3 bg-orange mr-2"></div> - Proposed
                  values
                </div>
                <div className="flex">
                  <div className="w-3 h-3 bg-green mr-2"></div> - Suggested by
                  liqudity
                </div>
              </div>
              <DisplayListingPropertyWrapped
                label="Token index"
                suggestedUntrusted={false}
                valKey={`tokenIndex`}
              />
              <DisplayListingPropertyWrapped
                label="Token name"
                suggestedUntrusted={false}
                valKey={`tokenName`}
              />
              <DisplayListingPropertyWrapped
                label="Oracle Confidence Filter"
                suggestedUntrusted={suggestedUntrusted}
                valKey={'oracleConfidenceFilter'}
                suffix="%"
              />
              <DisplayListingPropertyWrapped
                label="Oracle Max Staleness Slots"
                suggestedUntrusted={suggestedUntrusted}
                valKey={'oracleMaxStalenessSlots'}
              />
              <DisplayListingPropertyWrapped
                label="Interest rate adjustment factor"
                suggestedUntrusted={suggestedUntrusted}
                valKey={'adjustmentFactor'}
                suffix="%"
              />
              <DisplayListingPropertyWrapped
                label="Interest rate utilization point 0"
                suggestedUntrusted={suggestedUntrusted}
                valKey={'interestRateUtilizationPoint0'}
                suffix="%"
              />
              <DisplayListingPropertyWrapped
                label="Interest rate point 0"
                suggestedUntrusted={suggestedUntrusted}
                valKey={'interestRatePoint0'}
                suffix="%"
              />
              <DisplayListingPropertyWrapped
                label="Interest rate utilization point 1"
                suggestedUntrusted={suggestedUntrusted}
                valKey={'interestRateUtilizationPoint1'}
                suffix="%"
              />
              <DisplayListingPropertyWrapped
                label="Interest rate point 1"
                suggestedUntrusted={suggestedUntrusted}
                valKey={'interestRatePoint1'}
                suffix="%"
              />
              <DisplayListingPropertyWrapped
                label="Interest rate max rate"
                suggestedUntrusted={suggestedUntrusted}
                valKey={'maxRate'}
                suffix="%"
              />
              <DisplayListingPropertyWrapped
                label="Loan Fee Rate"
                suggestedUntrusted={suggestedUntrusted}
                valKey={'loanFeeRate'}
                suffix=" bps"
              />
              <DisplayListingPropertyWrapped
                label="Loan Origination Fee Rate"
                suggestedUntrusted={suggestedUntrusted}
                valKey={'loanOriginationFeeRate'}
                suffix=" bps"
              />
              <DisplayListingPropertyWrapped
                label="Maintenance Asset Weight"
                suggestedUntrusted={suggestedUntrusted}
                valKey={'maintAssetWeight'}
              />
              <DisplayListingPropertyWrapped
                label="Init Asset Weight"
                suggestedUntrusted={suggestedUntrusted}
                valKey={'initAssetWeight'}
              />
              <DisplayListingPropertyWrapped
                label="Maintenance Liab Weight"
                suggestedUntrusted={suggestedUntrusted}
                valKey={'maintLiabWeight'}
              />
              <DisplayListingPropertyWrapped
                label="Init Liab Weight"
                suggestedUntrusted={suggestedUntrusted}
                valKey={'initLiabWeight'}
              />
              <DisplayListingPropertyWrapped
                label="Liquidation Fee"
                suggestedUntrusted={suggestedUntrusted}
                valKey="liquidationFee"
                suffix="%"
              />
              <DisplayListingPropertyWrapped
                label="Min Vault To Deposits Ratio"
                suggestedUntrusted={suggestedUntrusted}
                valKey="minVaultToDepositsRatio"
                suffix="%"
              />
              <DisplayListingPropertyWrapped
                label="Net Borrow Limit Window Size"
                suggestedUntrusted={suggestedUntrusted}
                valKey="netBorrowLimitWindowSizeTs"
                suffix="H"
              />
              <DisplayListingPropertyWrapped
                label="Net Borrow Limit Per Window Quote"
                suggestedUntrusted={suggestedUntrusted}
                valKey="netBorrowLimitPerWindowQuote"
                prefix="$"
              />
              <DisplayListingPropertyWrapped
                label="Borrow Weight Scale Start Quote"
                suggestedUntrusted={suggestedUntrusted}
                valKey="borrowWeightScaleStartQuote"
                prefix="$"
              />
              <DisplayListingPropertyWrapped
                label="Deposit Weight Scale Start Quote"
                suggestedUntrusted={suggestedUntrusted}
                valKey="depositWeightScaleStartQuote"
                prefix="$"
              />
              <DisplayListingPropertyWrapped
                label="Stable Price Delay Interval"
                suggestedUntrusted={suggestedUntrusted}
                valKey="stablePriceDelayIntervalSeconds"
                suffix="H"
              />
              <DisplayListingPropertyWrapped
                label="Stable Price Delay Growth Limit"
                suggestedUntrusted={suggestedUntrusted}
                valKey="stablePriceDelayGrowthLimit"
                suffix="%"
              />
              <DisplayListingPropertyWrapped
                label="Stable Price Growth Limit"
                suggestedUntrusted={suggestedUntrusted}
                valKey="stablePriceGrowthLimit"
                suffix="%"
              />
              <DisplayListingPropertyWrapped
                label="reduceOnly"
                suggestedUntrusted={suggestedUntrusted}
                valKey="reduceOnly"
              />
              <DisplayListingPropertyWrapped
                label="Token Conditional Swap Taker Fee Rate"
                suggestedUntrusted={suggestedUntrusted}
                valKey="tokenConditionalSwapTakerFeeRate"
              />
              <DisplayListingPropertyWrapped
                label="Token Conditional Swap Maker Fee Rate"
                suggestedUntrusted={suggestedUntrusted}
                valKey="tokenConditionalSwapMakerFeeRate"
              />
              <DisplayListingPropertyWrapped
                label="Flash Loan Deposit Fee Rate"
                suggestedUntrusted={suggestedUntrusted}
                valKey="flashLoanSwapFeeRate"
              />
            </div>
            <AdvancedOptionsDropdown className="mt-4" title="Raw values">
              <div>{info}</div>
            </AdvancedOptionsDropdown>
          </div>
        )
      } catch (e) {
        console.log(e)
        return <div>{JSON.stringify(data)}</div>
      }
    },
  },
  4014: {
    name: 'Register Openbook Market',
    accounts: [
      { name: 'Group' },
      { name: 'Admin' },
      { name: 'Openbook Program' },
      { name: 'Openbook External Market' },
      { name: 'Openbook Market' },
      { name: 'Index Reservation' },
      { name: 'Quote Bank' },
      { name: 'Base Bank' },
      { name: 'Payer' },
    ],
    getDataUI: async (
      connection: Connection,
      data: Uint8Array,
      accounts: AccountMetaData[]
    ) => {
      const group = accounts[0].pubkey
      const baseBank = accounts[7].pubkey
      const quoteBank = accounts[6].pubkey
      const openbookMarketPk = accounts[3].pubkey
      const openBookProgram = accounts[2].pubkey

      const info = await displayArgs(connection, data)
      const client = await getClient(connection)
      const mangoGroup = await client.getGroup(group)
      const banks = [...mangoGroup.banksMapByMint.values()].map((x) => x[0])
      let baseMint = banks.find((x) => x.publicKey.equals(baseBank))?.mint
      let quoteMint = banks.find((x) => x.publicKey.equals(quoteBank))?.mint
      if (!baseMint || !quoteMint) {
        const currentMarket = await Market.load(
          connection,
          openbookMarketPk,
          undefined,
          openBookProgram
        )
        baseMint = currentMarket.baseMintAddress
        quoteMint = currentMarket.quoteMintAddress
      }

      const bestMarket = await getBestMarket({
        baseMint: baseMint!.toBase58(),
        quoteMint: quoteMint!.toBase58(),
        cluster: 'mainnet-beta',
        connection,
      })

      try {
        return (
          <div>
            {bestMarket && openbookMarketPk.equals(bestMarket) && (
              <div className="text-green flex items-center">
                <CheckCircleIcon className="w-5 mr-2"></CheckCircleIcon>
                Proposed market match the best market according to listing
                presets
              </div>
            )}
            {!bestMarket && (
              <div className="text-orange flex items-center">
                <WarningFilledIcon className="w-5 mr-2"></WarningFilledIcon>
                Best market not found check market carefully
              </div>
            )}
            {bestMarket && !openbookMarketPk.equals(bestMarket) && (
              <div className="flex flex-row text-orange ">
                <div className="flex items-center">
                  <WarningFilledIcon className="w-5 mr-2"></WarningFilledIcon>
                  <div>
                    proposed market not matching the one with most liquidity,
                    check market carefully. Suggested market -{' '}
                    <a
                      className="underline"
                      target="_blank"
                      href={`https://openserum.io/${bestMarket.toBase58()}`}
                      rel="noreferrer"
                    >
                      Suggested Openbook market link
                    </a>
                  </div>
                </div>
              </div>
            )}
            <div className="py-3 flex">
              <div className="mr-2">Proposed market: </div>
              <a
                className="underline"
                target="_blank"
                href={`https://openserum.io/${openbookMarketPk.toBase58()}`}
                rel="noreferrer"
              >
                Proposed Openbook market link
              </a>
            </div>
            {info}
          </div>
        )
      } catch (e) {
        console.log(e)
        return <div>{JSON.stringify(data)}</div>
      }
    },
  },
  5645: {
    name: 'Register Trustless Token',
    accounts: [
      { name: 'Group' },
      { name: 'Fast Listing Admin' },
      { name: 'Mint' },
      { name: 'Bank' },
      { name: 'Vault' },
      { name: 'Mint Info' },
      { name: 'Oracle' },
      { name: 'Payer' },
    ],
    getDataUI: async (
      connection: Connection,
      data: Uint8Array,
      accounts: AccountMetaData[]
    ) => {
      const oracle = accounts[6].pubkey

      const [info, proposedOracle, oracleAi] = await Promise.all([
        displayArgs(connection, data),
        getOracle(connection, oracle),
        connection.getAccountInfo(oracle),
      ])

      const oracleData = await decodePriceFromOracleAi(
        oracleAi!,
        connection,
        proposedOracle.type
      )
      try {
        return (
          <div>
            {oracleData.uiPrice ? (
              <div className="py-4 space-y-2">
                <div>Oracle Price: ${oracleData.uiPrice}</div>
                <div>Oracle Last known confidence: {oracleData.deviation}%</div>
              </div>
            ) : (
              <div className="py-4">No Oracle Data</div>
            )}
            <div>{info}</div>
          </div>
        )
      } catch (e) {
        console.log(e)
        return <div>{JSON.stringify(data)}</div>
      }
    },
  },
  49115: {
    name: 'Edit Market',
    accounts: [{ name: 'Group' }, { name: 'Admin' }, { name: 'Market' }],
    getDataUI: async (
      connection: Connection,
      data: Uint8Array
      //accounts: AccountMetaData[]
    ) => {
      const info = await displayArgs(connection, data)

      try {
        return <div>{info}</div>
      } catch (e) {
        console.log(e)
        return <div>{JSON.stringify(data)}</div>
      }
    },
  },
  145204: {
    name: 'Edit Token',
    accounts: [
      { name: 'Group' },
      { name: 'Admin' },
      { name: 'Mint Info' },
      { name: 'Oracle' },
    ],
    getDataUI: async (
      connection: Connection,
      data: Uint8Array,
      accounts: AccountMetaData[]
    ) => {
      try {
        let mintData: null | TokenInfoWithoutDecimals | undefined = null
        const mintInfo = accounts[2].pubkey
        const group = accounts[0].pubkey
        const client = await getClient(connection)
        const [mangoGroup, info, args] = await Promise.all([
          getGroupForClient(client, group),
          displayArgs(connection, data),
          getDataObjectFlattened<FlatEditArgs>(connection, data),
        ])
        const mint = [...mangoGroup.mintInfosMapByMint.values()].find((x) =>
          x.publicKey.equals(mintInfo)
        )?.mint

        let liqudityTier: Partial<{
          tier: LISTING_PRESETS_KEYS
          priceImpact: string
        }> = {}
        let suggestedUntrusted = false
        let invalidKeys: (keyof EditTokenArgsFormatted)[] = []
        let invalidFields: Partial<EditTokenArgsFormatted> = {}
        let bank: null | Bank = null
        let bankFormattedValues: null | ReturnType<
          typeof getFormattedBankValues
        > = null

        const parsedArgs: Partial<EditTokenArgsFormatted> = {
          tokenIndex: args.tokenIndex,
          tokenName: args.nameOpt,
          oracleConfidenceFilter:
            args['oracleConfigOpt.confFilter'] !== undefined
              ? (args['oracleConfigOpt.confFilter'] * 100)?.toFixed(2)
              : undefined,
          oracleMaxStalenessSlots: args['oracleConfigOpt.maxStalenessSlots'],
          interestRateUtilizationPoint0:
            args['interestRateParamsOpt.util0'] !== undefined
              ? (args['interestRateParamsOpt.util0'] * 100)?.toFixed(2)
              : undefined,
          interestRatePoint0:
            args['interestRateParamsOpt.rate0'] !== undefined
              ? (args['interestRateParamsOpt.rate0'] * 100)?.toFixed(2)
              : undefined,
          interestRateUtilizationPoint1:
            args['interestRateParamsOpt.util1'] !== undefined
              ? (args['interestRateParamsOpt.util1'] * 100)?.toFixed(2)
              : undefined,
          interestRatePoint1:
            args['interestRateParamsOpt.rate1'] !== undefined
              ? (args['interestRateParamsOpt.rate1'] * 100)?.toFixed(2)
              : undefined,
          maxRate:
            args['interestRateParamsOpt.maxRate'] !== undefined
              ? (args['interestRateParamsOpt.maxRate'] * 100)?.toFixed(2)
              : undefined,
          adjustmentFactor:
            args['interestRateParamsOpt.adjustmentFactor'] !== undefined
              ? (args['interestRateParamsOpt.adjustmentFactor'] * 100).toFixed(
                  2
                )
              : undefined,
          loanFeeRate:
            args.loanFeeRateOpt !== undefined
              ? (args.loanFeeRateOpt * 10000)?.toFixed(2)
              : undefined,
          loanOriginationFeeRate:
            args.loanOriginationFeeRateOpt !== undefined
              ? (args.loanOriginationFeeRateOpt * 10000)?.toFixed(2)
              : undefined,
          maintAssetWeight: args.maintAssetWeightOpt?.toFixed(2),
          initAssetWeight: args.initAssetWeightOpt?.toFixed(2),
          maintLiabWeight: args.maintLiabWeightOpt?.toFixed(2),
          initLiabWeight: args.initLiabWeightOpt?.toFixed(2),
          liquidationFee:
            args['liquidationFeeOpt'] !== undefined
              ? (args['liquidationFeeOpt'] * 100)?.toFixed(2)
              : undefined,
          minVaultToDepositsRatio:
            args['minVaultToDepositsRatioOpt'] !== undefined
              ? (args['minVaultToDepositsRatioOpt'] * 100)?.toFixed(2)
              : undefined,
          netBorrowLimitPerWindowQuote:
            args['netBorrowLimitPerWindowQuoteOpt'] !== undefined
              ? toUiDecimals(args['netBorrowLimitPerWindowQuoteOpt'], 6)
              : undefined,
          netBorrowLimitWindowSizeTs:
            args.netBorrowLimitWindowSizeTsOpt !== undefined
              ? secondsToHours(args.netBorrowLimitWindowSizeTsOpt)
              : undefined,
          borrowWeightScaleStartQuote:
            args.borrowWeightScaleStartQuoteOpt !== undefined
              ? toUiDecimals(args.borrowWeightScaleStartQuoteOpt, 6)
              : undefined,
          depositWeightScaleStartQuote:
            args.depositWeightScaleStartQuoteOpt !== undefined
              ? toUiDecimals(args.depositWeightScaleStartQuoteOpt, 6)
              : undefined,
          groupInsuranceFund:
            args.groupInsuranceFundOpt !== null
              ? args.groupInsuranceFundOpt
              : undefined,
          tokenConditionalSwapMakerFeeRate:
            args.tokenConditionalSwapMakerFeeRateOpt,
          tokenConditionalSwapTakerFeeRate:
            args.tokenConditionalSwapTakerFeeRateOpt,
          flashLoanSwapFeeRate: args.flashLoanSwapFeeRateOpt,
          reduceOnly:
            args.reduceOnlyOpt !== undefined
              ? REDUCE_ONLY_OPTIONS[args.reduceOnlyOpt].name
              : undefined,
        }

        if (mint) {
          bank = mangoGroup.getFirstBankByMint(mint)
          bankFormattedValues = getFormattedBankValues(mangoGroup, bank)
          mintData = tokenPriceService.getTokenInfo(mint.toBase58())
          const isPyth = bank?.oracleProvider === OracleProvider.Pyth
          const midPriceImpacts = getMidPriceImpacts(mangoGroup.pis)

          const PRESETS = isPyth ? LISTING_PRESETS_PYTH : LISTING_PRESETS

          const tokenToPriceImpact = midPriceImpacts
            .filter((x) => x.avg_price_impact_percent < 1)
            .reduce(
              (acc: { [key: string]: MidPriceImpact }, val: MidPriceImpact) => {
                if (
                  !acc[val.symbol] ||
                  val.target_amount > acc[val.symbol].target_amount
                ) {
                  acc[val.symbol] = val
                }
                return acc
              },
              {}
            )

          const priceImpact = tokenToPriceImpact[getApiTokenName(bank.name)]

          const suggestedTier = getProposedTier(
            PRESETS,
            priceImpact?.target_amount,
            bank.oracleProvider === OracleProvider.Pyth
          )

          liqudityTier = !mint.equals(USDC_MINT)
            ? {
                tier: suggestedTier,
                priceImpact: priceImpact
                  ? priceImpact.avg_price_impact_percent.toString()
                  : '',
              }
            : {
                tier: 'ULTRA_PREMIUM',
                priceImpact: '0',
              }

          const suggestedPreset = getFormattedListingPresets(
            !!isPyth,
            bank.nativeDeposits().mul(bank.price).toNumber()
          )[liqudityTier.tier!]
          suggestedUntrusted = liqudityTier.tier === 'UNTRUSTED'

          const suggestedFormattedPreset:
            | EditTokenArgsFormatted
            | Record<string, never> = Object.keys(suggestedPreset).length
            ? {
                ...getFormattedListingValues({
                  tokenIndex: args.tokenIndex,
                  name: args.nameOpt,
                  oracle: args.oracleOpt,
                  ...suggestedPreset,
                }),
                groupInsuranceFund: suggestedPreset.insuranceFound,
              }
            : {}

          invalidKeys = (Object.keys(suggestedPreset).length
            ? compareObjectsAndGetDifferentKeys<
                Partial<EditTokenArgsFormatted>
              >(parsedArgs, suggestedFormattedPreset)
            : []
          ).filter((x) => parsedArgs[x] !== undefined)

          invalidFields = invalidKeys.reduce((obj, key) => {
            return {
              ...obj,
              [key]: suggestedFormattedPreset[key],
            }
          }, {})
        }

        return (
          <div>
            <h3>{mintData && <div>Token: {mintData.symbol}</div>}</h3>
            {suggestedUntrusted && (
              <>
                <h3 className="text-orange flex items-center">
                  <WarningFilledIcon className="h-4 w-4 fill-current mr-2 flex-shrink-0" />
                  Suggested token tier: UNTRUSTED.
                </h3>
                <h3 className="text-orange flex">
                  Very low liquidity Price impact of {liqudityTier?.priceImpact}
                  % on $1000 swap. Check params carefully token should be listed
                  with untrusted instruction
                </h3>
              </>
            )}
            {!suggestedUntrusted && !invalidKeys.length && liqudityTier.tier && (
              <h3 className="text-green flex items-center">
                <CheckCircleIcon className="h-4 w-4 fill-current mr-2 flex-shrink-0" />
                Proposal params match suggested token tier -{' '}
                {coinTiersToNames[liqudityTier.tier]}.
              </h3>
            )}
            {!suggestedUntrusted &&
              invalidKeys &&
              invalidKeys!.length > 0 &&
              liqudityTier.tier && (
                <h3 className="text-orange flex items-center">
                  <WarningFilledIcon className="h-4 w-4 fill-current mr-2 flex-shrink-0" />
                  Proposal params do not match suggested token tier -{' '}
                  {coinTiersToNames[liqudityTier.tier]} check params carefully
                </h3>
              )}
            <div className="py-4">
              <div className="flex mb-2">
                <div className="w-3 h-3 bg-white mr-2"></div> - Current values
              </div>
              <div className="flex mb-2">
                <div className="w-3 h-3 bg-orange mr-2"></div> - Proposed values
              </div>
              <div className="flex">
                <div className="w-3 h-3 bg-green mr-2"></div> - Suggested by
                liqudity
              </div>
            </div>
            <div className="border-b mb-4 pb-4 space-y-3">
              <DisplayNullishProperty
                label="Token index"
                value={parsedArgs.tokenIndex}
              />
              <DisplayNullishProperty
                label="Token name"
                value={parsedArgs.tokenName}
              />
              <DisplayNullishProperty
                label="Oracle Confidence Filter"
                currentValue={
                  bankFormattedValues?.oracleConfFilter &&
                  `${bankFormattedValues.oracleConfFilter}%`
                }
                value={
                  parsedArgs.oracleConfidenceFilter &&
                  `${parsedArgs.oracleConfidenceFilter}%`
                }
                suggestedVal={
                  invalidFields.oracleConfidenceFilter &&
                  `${invalidFields.oracleConfidenceFilter}%`
                }
              />
              <DisplayNullishProperty
                label="Oracle Max Staleness Slots"
                currentValue={bankFormattedValues?.maxStalenessSlots}
                value={parsedArgs.oracleMaxStalenessSlots}
                suggestedVal={invalidFields.oracleMaxStalenessSlots}
              />
              <DisplayNullishProperty
                label="Interest rate adjustment factor"
                currentValue={
                  bankFormattedValues?.adjustmentFactor &&
                  `${bankFormattedValues.adjustmentFactor}%`
                }
                value={
                  parsedArgs.adjustmentFactor &&
                  `${parsedArgs.adjustmentFactor}%`
                }
                suggestedVal={
                  invalidFields.adjustmentFactor &&
                  `${invalidFields.adjustmentFactor}%`
                }
              />
              <DisplayNullishProperty
                label="Interest rate utilization point 0"
                value={
                  parsedArgs.interestRateUtilizationPoint0 &&
                  `${parsedArgs.interestRateUtilizationPoint0}%`
                }
                currentValue={
                  bankFormattedValues?.util0 && `${bankFormattedValues.util0}%`
                }
                suggestedVal={
                  invalidFields.interestRateUtilizationPoint0 &&
                  `${invalidFields.interestRateUtilizationPoint0}%`
                }
              />
              <DisplayNullishProperty
                label="Interest rate point 0"
                value={
                  parsedArgs.interestRatePoint0 &&
                  `${parsedArgs.interestRatePoint0}%`
                }
                currentValue={
                  bankFormattedValues?.rate0 && `${bankFormattedValues.rate0}%`
                }
                suggestedVal={
                  invalidFields.interestRatePoint0 &&
                  `${invalidFields.interestRatePoint0}%`
                }
              />
              <DisplayNullishProperty
                label="Interest rate utilization point 1"
                value={
                  parsedArgs.interestRateUtilizationPoint1 &&
                  `${parsedArgs.interestRateUtilizationPoint1}%`
                }
                currentValue={
                  bankFormattedValues?.util1 && `${bankFormattedValues?.util1}%`
                }
                suggestedVal={
                  invalidFields.interestRateUtilizationPoint1 &&
                  `${invalidFields.interestRateUtilizationPoint1}%`
                }
              />
              <DisplayNullishProperty
                label="Interest rate point 1"
                value={
                  parsedArgs.interestRatePoint1 &&
                  `${parsedArgs.interestRatePoint1}%`
                }
                currentValue={
                  bankFormattedValues?.rate1 && `${bankFormattedValues.rate1}%`
                }
                suggestedVal={
                  invalidFields.interestRatePoint1 &&
                  `${invalidFields.interestRatePoint1}%`
                }
              />
              <DisplayNullishProperty
                label="Interest rate max rate"
                value={parsedArgs.maxRate && `${parsedArgs.maxRate}%`}
                currentValue={
                  bankFormattedValues?.maxRate &&
                  `${bankFormattedValues.maxRate}%`
                }
                suggestedVal={
                  invalidFields.maxRate && `${invalidFields.maxRate}%`
                }
              />
              <DisplayNullishProperty
                label="Loan Fee Rate"
                value={
                  parsedArgs.loanFeeRate && `${parsedArgs.loanFeeRate} bps`
                }
                currentValue={
                  bankFormattedValues?.loanFeeRate &&
                  `${bankFormattedValues.loanFeeRate} bps`
                }
                suggestedVal={
                  invalidFields.loanFeeRate &&
                  `${invalidFields.loanFeeRate} bps`
                }
              />
              <DisplayNullishProperty
                label="Loan Origination Fee Rate"
                value={
                  parsedArgs.loanOriginationFeeRate &&
                  `${parsedArgs.loanOriginationFeeRate} bps`
                }
                currentValue={
                  bankFormattedValues?.loanOriginationFeeRate &&
                  `${bankFormattedValues.loanOriginationFeeRate} bps`
                }
                suggestedVal={
                  invalidFields.loanOriginationFeeRate &&
                  `${invalidFields.loanOriginationFeeRate} bps`
                }
              />
              <DisplayNullishProperty
                label="Maintenance Asset Weight"
                value={parsedArgs.maintAssetWeight}
                currentValue={bankFormattedValues?.maintAssetWeight}
                suggestedVal={invalidFields.maintAssetWeight}
              />
              <DisplayNullishProperty
                label="Init Asset Weight"
                value={parsedArgs.initAssetWeight}
                currentValue={bankFormattedValues?.initAssetWeight}
                suggestedVal={invalidFields.initAssetWeight}
              />
              <DisplayNullishProperty
                label="Maintenance Liab Weight"
                value={parsedArgs.maintLiabWeight}
                currentValue={bankFormattedValues?.maintLiabWeight}
                suggestedVal={invalidFields.maintLiabWeight}
              />
              <DisplayNullishProperty
                label="Init Liab Weight"
                value={parsedArgs.initLiabWeight}
                currentValue={bankFormattedValues?.initLiabWeight}
                suggestedVal={invalidFields.initLiabWeight}
              />
              <DisplayNullishProperty
                label="Liquidation Fee"
                value={
                  parsedArgs.liquidationFee && `${parsedArgs.liquidationFee}%`
                }
                currentValue={
                  bankFormattedValues?.liquidationFee &&
                  `${bankFormattedValues.liquidationFee}%`
                }
                suggestedVal={
                  invalidFields.liquidationFee &&
                  `${invalidFields.liquidationFee}%`
                }
              />
              <DisplayNullishProperty
                label="Min Vault To Deposits Ratio"
                value={
                  parsedArgs.minVaultToDepositsRatio &&
                  `${parsedArgs.minVaultToDepositsRatio}%`
                }
                currentValue={
                  bankFormattedValues?.minVaultToDepositsRatio &&
                  `${bankFormattedValues.minVaultToDepositsRatio}%`
                }
                suggestedVal={
                  invalidFields.minVaultToDepositsRatio &&
                  `${invalidFields.minVaultToDepositsRatio}%`
                }
              />
              <DisplayNullishProperty
                label="Net Borrow Limit Window Size"
                value={
                  parsedArgs.netBorrowLimitWindowSizeTs &&
                  `${parsedArgs.netBorrowLimitWindowSizeTs}H`
                }
                currentValue={
                  bankFormattedValues?.netBorrowLimitWindowSizeTs &&
                  `${bankFormattedValues.netBorrowLimitWindowSizeTs}H`
                }
                suggestedVal={
                  invalidFields.netBorrowLimitWindowSizeTs &&
                  `${invalidFields.netBorrowLimitWindowSizeTs}H`
                }
              />
              <DisplayNullishProperty
                label="Net Borrow Limit Per Window Quote"
                value={
                  parsedArgs.netBorrowLimitPerWindowQuote &&
                  `$${parsedArgs.netBorrowLimitPerWindowQuote}`
                }
                currentValue={
                  bankFormattedValues?.netBorrowLimitPerWindowQuote &&
                  `$${bankFormattedValues.netBorrowLimitPerWindowQuote}`
                }
                suggestedVal={
                  invalidFields.netBorrowLimitPerWindowQuote &&
                  `$${invalidFields.netBorrowLimitPerWindowQuote}`
                }
              />
              <DisplayNullishProperty
                label="Borrow Weight Scale Start Quote"
                value={
                  parsedArgs.borrowWeightScaleStartQuote &&
                  `$${parsedArgs.borrowWeightScaleStartQuote}`
                }
                currentValue={
                  bankFormattedValues?.borrowWeightScaleStartQuote &&
                  `$${bankFormattedValues.borrowWeightScaleStartQuote}`
                }
                suggestedVal={
                  invalidFields.borrowWeightScaleStartQuote &&
                  `$${invalidFields.borrowWeightScaleStartQuote}`
                }
              />
              <DisplayNullishProperty
                label="Deposit Weight Scale Start Quote"
                value={
                  parsedArgs.depositWeightScaleStartQuote &&
                  `$${parsedArgs.depositWeightScaleStartQuote}`
                }
                currentValue={
                  bankFormattedValues?.depositWeightScaleStartQuote &&
                  `$${bankFormattedValues.depositWeightScaleStartQuote}`
                }
                suggestedVal={
                  invalidFields.depositWeightScaleStartQuote &&
                  `$${invalidFields.depositWeightScaleStartQuote}`
                }
              />
              <DisplayNullishProperty
                label="Group Insurance Fund"
                value={parsedArgs.groupInsuranceFund?.toString()}
                currentValue={
                  mint
                    ? mangoGroup.mintInfosMapByMint
                        .get(mint.toBase58())
                        ?.groupInsuranceFund.toString()
                    : undefined
                }
                suggestedVal={invalidFields.groupInsuranceFund?.toString()}
              />
              <DisplayNullishProperty
                label="Oracle"
                value={args.oracleOpt?.toBase58()}
                currentValue={bankFormattedValues?.oracle}
              />
              <DisplayNullishProperty
                label="Token Conditional Swap Maker Fee Rate"
                value={parsedArgs.tokenConditionalSwapMakerFeeRate}
                currentValue={
                  bankFormattedValues?.tokenConditionalSwapMakerFeeRate
                }
                suggestedVal={invalidFields.tokenConditionalSwapMakerFeeRate}
              />
              <DisplayNullishProperty
                label="Token Conditional Swap Taker Fee Rate"
                value={parsedArgs.tokenConditionalSwapTakerFeeRate}
                currentValue={
                  bankFormattedValues?.tokenConditionalSwapTakerFeeRate
                }
                suggestedVal={invalidFields.tokenConditionalSwapTakerFeeRate}
              />
              <DisplayNullishProperty
                label="Flash Loan Swap Fee Rate"
                value={parsedArgs.flashLoanSwapFeeRate}
                currentValue={bankFormattedValues?.flashLoanSwapFeeRate}
                suggestedVal={invalidFields.flashLoanSwapFeeRate}
              />
              <DisplayNullishProperty
                label="Reduce only"
                value={parsedArgs.reduceOnly}
                currentValue={bankFormattedValues?.reduceOnly}
              />
            </div>
            <h3>Raw values</h3>
            <div>{info}</div>
          </div>
        )
      } catch (e) {
        console.log(e)
        const info = await displayArgs(connection, data)

        try {
          return <div>{info}</div>
        } catch (e) {
          console.log(e)
          return <div>{JSON.stringify(data)}</div>
        }
      }
    },
  },
  9347: {
    name: 'Create Perp Market',
    accounts: [
      { name: 'Group' },
      { name: 'Admin' },
      { name: 'Oracle' },
      { name: 'Perp Market' },
    ],
    getDataUI: async (
      connection: Connection,
      data: Uint8Array
      //accounts: AccountMetaData[]
    ) => {
      const info = await displayArgs(connection, data)
      try {
        return <div>{info}</div>
      } catch (e) {
        console.log(e)
        return <div>{JSON.stringify(data)}</div>
      }
    },
  },
  73195: {
    name: 'Withdraw all token fees',
    accounts: [
      { name: 'Group' },
      { name: 'Bank' },
      { name: 'Vault' },
      { name: 'Destination' },
    ],
    getDataUI: async (
      connection: Connection,
      data: Uint8Array,
      accounts: AccountMetaData[]
    ) => {
      const group = accounts[0].pubkey
      const bank = accounts[1].pubkey
      const client = await getClient(connection)
      const mangoGroup = await getGroupForClient(client, group)
      const mint = [...mangoGroup.banksMapByMint.values()].find(
        (x) => x[0]!.publicKey.equals(bank)!
      )![0]!.mint!
      const tokenSymbol = tokenPriceService.getTokenInfo(mint.toBase58())
        ?.symbol
      try {
        return (
          <div>
            {tokenSymbol ? tokenSymbol : <Loading className="w-5"></Loading>}
          </div>
        )
      } catch (e) {
        console.log(e)
        return <div>{JSON.stringify(data)}</div>
      }
    },
  },
  15219: {
    name: 'Withdraw all perp fees',
    accounts: [
      { name: 'Group' },
      { name: 'Perp market' },
      { name: 'Bank' },
      { name: 'Vault' },
      { name: 'Destination' },
    ],
    getDataUI: async (
      connection: Connection,
      data: Uint8Array,
      accounts: AccountMetaData[]
    ) => {
      const group = accounts[0].pubkey
      const perpMarket = accounts[1].pubkey
      const client = await getClient(connection)
      const mangoGroup = await getGroupForClient(client, group)
      const marketName = [
        ...mangoGroup.perpMarketsMapByName.values(),
      ].find((x) => x.publicKey.equals(perpMarket))?.name
      try {
        return (
          <div>
            {marketName ? marketName : <Loading className="w-5"></Loading>}
          </div>
        )
      } catch (e) {
        console.log(e)
        return <div>{JSON.stringify(data)}</div>
      }
    },
  },
  19895: {
    name: 'Create Mango Account',
    accounts: [
      { name: 'Group' },
      { name: 'Account' },
      { name: 'Owner' },
      { name: 'Payer' },
    ],
    getDataUI: async (
      connection: Connection,
      data: Uint8Array
      //accounts: AccountMetaData[]
    ) => {
      const info = await displayArgs(connection, data)
      try {
        return <div>{info}</div>
      } catch (e) {
        console.log(e)
        return <div>{JSON.stringify(data)}</div>
      }
    },
  },
  117255: {
    name: 'Token Deposit',
    accounts: [
      { name: 'Group' },
      { name: 'Account' },
      { name: 'Owner' },
      { name: 'Payer' },
    ],
    getDataUI: async (
      connection: Connection,
      data: Uint8Array
      //accounts: AccountMetaData[]
    ) => {
      const info = await displayArgs(connection, data)
      try {
        return <div>{info}</div>
      } catch (e) {
        console.log(e)
        return <div>{JSON.stringify(data)}</div>
      }
    },
  },
  186211: {
    name: 'Edit Mango Account',
    accounts: [
      { name: 'Group' },
      { name: 'Account' },
      { name: 'Owner' },
      { name: 'Payer' },
    ],
    getDataUI: async (
      connection: Connection,
      data: Uint8Array
      //accounts: AccountMetaData[]
    ) => {
      const info = await displayArgs(connection, data)
      try {
        return <div>{info}</div>
      } catch (e) {
        console.log(e)
        return <div>{JSON.stringify(data)}</div>
      }
    },
  },
})

export const MANGO_V4_INSTRUCTIONS = {
  '4MangoMjqJ2firMokCjjGgoK8d4MXcrgL7XJaL3w6fVg': instructions(),
}

const getClient = async (connection: Connection) => {
  const client = await queryClient.fetchQuery({
    queryKey: ['mangoClient', connection.rpcEndpoint],
    queryFn: async () => {
      const options = AnchorProvider.defaultOptions()
      const adminProvider = new AnchorProvider(
        connection,
        new EmptyWallet(Keypair.generate()),
        options
      )
      const client = await MangoClient.connect(
        adminProvider,
        'mainnet-beta',
        MANGO_V4_ID['mainnet-beta']
      )

      return client
    },
  })
  return client
}
const getGroupForClient = async (client: MangoClient, groupPk: PublicKey) => {
  const group = await queryClient.fetchQuery({
    queryKey: ['mangoGroup', groupPk.toBase58(), client.connection.rpcEndpoint],
    queryFn: async () => {
      const response = await client.getGroup(groupPk)
      return response
    },
  })
  return group
}

async function getDataObjectFlattened<T>(
  connection: Connection,
  data: Uint8Array
) {
  const client = await getClient(connection)
  const decodedInstructionData = new BorshInstructionCoder(
    client.program.idl
  ).decode(Buffer.from(data))?.data as any

  //   console.log(
  //     client.program.idl.instructions.map((ix) => {
  //       const sh = sighash('global', ix.name)
  //       return {
  //         name: ix.name,
  //         sh: `${sh[0]}${sh[1]}`,
  //       }
  //     })
  //   )

  const args = {}
  for (const key of Object.keys(decodedInstructionData)) {
    const val = decodedInstructionData[key]
    if (val !== null) {
      if (
        typeof val === 'object' &&
        !Array.isArray(val) &&
        !(val instanceof BN) &&
        !(val instanceof PublicKey)
      ) {
        for (const innerKey of Object.keys(val)) {
          const innerVal = val[innerKey]
          args[`${key}.${innerKey}`] = innerVal
        }
      } else {
        args[key] = val
      }
    }
  }
  return args as T
}

const displayArgs = async (connection: Connection, data: Uint8Array) => {
  const args = await getDataObjectFlattened<any>(connection, data)
  return (
    <div className="space-y-3">
      {Object.keys(args)
        .filter((key) => {
          if (key === 'resetStablePrice' && args[key] === false) {
            return false
          }
          if (key === 'resetNetBorrowLimit' && args[key] === false) {
            return false
          }

          return true
        })
        .map((key) => {
          const isPublicKey = tryParseKey(args[key])
          return (
            <div key={key} className="flex">
              <div className="mr-3">{key}:</div>
              <div>{`${isPublicKey ? args[key] : commify(args[key])}`}</div>
            </div>
          )
        })}
    </div>
  )
}

function commify(n) {
  if (n?.toString) {
    const parts = n.toString().split('.')
    const numberPart = parts[0]
    const decimalPart = parts[1]
    const thousands = /\B(?=(\d{3})+(?!\d))/g
    return (
      numberPart.replace(thousands, ',') +
      (decimalPart ? '.' + decimalPart : '')
    )
  }
  return n
}

const DisplayNullishProperty = ({
  label,
  value,
  suggestedVal,
  currentValue,
}: {
  label: string
  currentValue?: string | null | undefined | number
  value: string | null | undefined | number
  suggestedVal?: string | null | undefined | number
}) =>
  value ? (
    <div className="flex space-x-3">
      <div>{label}:</div>
      <div className="flex">
        <div className={`${currentValue ? 'text-grey' : ''}`}>
          {currentValue}
        </div>
      </div>
      {currentValue && <div className="mx-1">/</div>}
      <div className="flex">
        <div className="text-orange">{value}</div>
      </div>
      {suggestedVal && <div className="mx-1">/</div>}
      {suggestedVal && <div className="text-green">{suggestedVal}</div>}
    </div>
  ) : null

const DisplayListingProperty = ({
  label,
  suggestedUntrusted,
  val,
  suggestedVal,
  suffix,
  prefix,
}: {
  label: string
  suggestedUntrusted: boolean
  val: any
  suggestedVal?: any
  suffix?: string
  prefix?: string
}) => (
  <div className="flex space-x-3">
    <div>{label}:</div>
    <div className="flex">
      <div
        className={`${suggestedUntrusted || suggestedVal ? 'text-orange' : ''}`}
      >
        {prefix}
        {val}
        {suffix}
      </div>
      {suggestedVal && <div className="mx-1">/</div>}
      {suggestedVal && (
        <div className="text-green">
          {' '}
          {prefix}
          {suggestedVal}
          {suffix}
        </div>
      )}
    </div>
  </div>
)

const getFormattedListingValues = (args: FlatListingArgs) => {
  const formattedArgs: ListingArgsFormatted = {
    tokenIndex: args.tokenIndex,
    tokenName: args.name,
    oracle: args.oracle?.toBase58(),
    oracleConfidenceFilter: (args['oracleConfig.confFilter'] * 100).toFixed(2),
    oracleMaxStalenessSlots: args['oracleConfig.maxStalenessSlots'],
    interestRateUtilizationPoint0: (
      args['interestRateParams.util0'] * 100
    ).toFixed(2),
    interestRatePoint0: (args['interestRateParams.rate0'] * 100).toFixed(2),
    interestRateUtilizationPoint1: (
      args['interestRateParams.util1'] * 100
    ).toFixed(2),
    interestRatePoint1: (args['interestRateParams.rate1'] * 100).toFixed(2),
    maxRate: (args['interestRateParams.maxRate'] * 100).toFixed(2),
    adjustmentFactor: (
      args['interestRateParams.adjustmentFactor'] * 100
    ).toFixed(2),
    loanFeeRate: (args.loanFeeRate * 10000).toFixed(2),
    loanOriginationFeeRate: (args.loanOriginationFeeRate * 10000).toFixed(2),
    maintAssetWeight: args.maintAssetWeight.toFixed(2),
    initAssetWeight: args.initAssetWeight.toFixed(2),
    maintLiabWeight: args.maintLiabWeight.toFixed(2),
    initLiabWeight: args.initLiabWeight.toFixed(2),
    liquidationFee: (args['liquidationFee'] * 100).toFixed(2),
    minVaultToDepositsRatio: (args['minVaultToDepositsRatio'] * 100).toFixed(2),
    netBorrowLimitPerWindowQuote: toUiDecimals(
      args['netBorrowLimitPerWindowQuote'],
      6
    ),
    netBorrowLimitWindowSizeTs: secondsToHours(args.netBorrowLimitWindowSizeTs),
    borrowWeightScaleStartQuote: toUiDecimals(
      args.borrowWeightScaleStartQuote,
      6
    ),
    depositWeightScaleStartQuote: toUiDecimals(
      args.depositWeightScaleStartQuote,
      6
    ),
    stablePriceDelayGrowthLimit: (
      args.stablePriceDelayGrowthLimit * 100
    ).toFixed(2),
    stablePriceDelayIntervalSeconds: secondsToHours(
      args.stablePriceDelayIntervalSeconds
    ),
    stablePriceGrowthLimit: (args.stablePriceGrowthLimit * 100).toFixed(2),
    tokenConditionalSwapMakerFeeRate: args.tokenConditionalSwapMakerFeeRate,
    tokenConditionalSwapTakerFeeRate: args.tokenConditionalSwapTakerFeeRate,
    flashLoanSwapFeeRate: args.flashLoanSwapFeeRate,
    reduceOnly: REDUCE_ONLY_OPTIONS[args.reduceOnly].name,
  }
  return formattedArgs
}

const REDUCE_ONLY_OPTIONS = [
  { value: 0, name: 'Disabled' },
  { value: 1, name: 'No borrows and no deposits' },
  { value: 2, name: 'No borrows' },
]

//need yarn add js-sha256 snakeCase
// function sighash(nameSpace: string, ixName: string): Buffer {
//   const name = snakeCase(ixName)
//   const preimage = `${nameSpace}:${name}`
//   return Buffer.from(sha256.digest(preimage)).slice(0, 8)
// }

const getApiTokenName = (bankName: string) => {
  if (bankName === 'ETH (Portal)') {
    return 'ETH'
  }
  return bankName
}
